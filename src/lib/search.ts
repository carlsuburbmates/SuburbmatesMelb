import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { logger } from "./logger";

export type DirectorySearchPayload = {
  query?: string | null;
  region?: string | null;
  category?: string | null;
  page?: number;
  limit?: number;
};

export type DirectorySearchResult = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  region: { id: number | null; name: string | null };
  category: { id: number | null; name: string | null };
  isFeatured: boolean;
  featuredRegionLabel: string | null;
  featuredMatchesSelection: boolean;
  createdAt: string | null;
};

// Priority ranking: featured first, then daily-shuffled non-featured.
// Shuffle uses a deterministic daily seed derived from each profile's id + current date (YYYY-MM-DD).
// This matches the same pattern used by the get_daily_shuffle_products DB RPC.

function sanitize(term: string) {
  return term.replace(/[^a-zA-Z0-9\s]/g, "").trim();
}

function dailySortKey(id: string): number {
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const str = id + dateStr;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Execute a directory search across regions and categories.
 * SSOT v2.1: Strictly discovery-first. No billing tiers at query level.
 */
export async function executeDirectorySearch(
  client: SupabaseClient<Database>,
  payload: DirectorySearchPayload
) {
  const page = payload.page || 1;
  const limit = payload.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let regionFilter: { regionIds: number[] | null; regionNameById: Map<number, string> } | null = null;
  if (payload.region) {
    const { data: regions } = await client
      .from("regions")
      .select("id, name")
      .ilike("name", `%${payload.region}%`);
    
    if (regions && regions.length > 0) {
      regionFilter = {
        regionIds: regions.map((r) => r.id),
        regionNameById: new Map(regions.map((r) => [r.id, r.name])),
      };
    }
  }

  // 2. Resolve category if provided
  let categoryIds: number[] | null = null;
  let categoryNameById = new Map<number, string>();
  if (payload.category) {
    const { data: categories } = await client
      .from("categories")
      .select("id, name")
      .ilike("name", `%${payload.category}%`);
    if (categories && categories.length > 0) {
      categoryIds = categories.map(c => c.id);
      categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
    }
  }

  // 3. Resolve vendor user IDs for region filtering
  let vendorUserIds: string[] | null = null;
  if (regionFilter?.regionIds) {
    const { data: regionVendors, error: vendorRegionError } = await client
      .from("vendors")
      .select("user_id")
      .in("primary_region_id", regionFilter.regionIds);

    if (vendorRegionError) {
      logger.error("search_vendor_region_filter_failed", vendorRegionError);
      throw vendorRegionError;
    }

    vendorUserIds = (regionVendors ?? [])
      .map((vendor) => vendor.user_id)
      .filter((userId): userId is string => typeof userId === "string" && userId.length > 0);
    if (vendorUserIds.length === 0) {
      return {
        results: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        },
      };
    }
  }

  // 4. Build query
  let queryBuilder = client
    .from("business_profiles")
    .select(
      `
        id,
        business_name,
        profile_description,
        slug,
        vendor_status,
        user_id,
        category_id,
        created_at
      `,
      { count: "exact" }
    )
    .eq("is_public", true)
    .eq("vendor_status", "active");

  if (vendorUserIds?.length) {
    queryBuilder = queryBuilder.in("user_id", vendorUserIds);
  }

  if (categoryIds) {
    queryBuilder = queryBuilder.in("category_id", categoryIds);
  }

  if (payload.query) {
    const sanitized = sanitize(payload.query);
    queryBuilder = queryBuilder.or(
      `business_name.ilike.%${sanitized}%,profile_description.ilike.%${sanitized}%`
    );
  }

  const { data, count, error } = await queryBuilder
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    logger.error("search_query_failed", error);
    throw error;
  }

  const resultsUserIds = Array.from(new Set((data ?? []).map((row) => row.user_id)));
  let resultVendors: { user_id: string | null; primary_region_id: number | null }[] = [];
  if (resultsUserIds.length > 0) {
    const { data: vendors, error: resultVendorsError } = await client
      .from("vendors")
      .select("user_id, primary_region_id")
      .in("user_id", resultsUserIds);

    if (resultVendorsError) {
      logger.error("search_vendor_lookup_failed", resultVendorsError);
      throw resultVendorsError;
    }
    resultVendors = vendors ?? [];
  }

  const vendorRegionByUserId = new Map<string, number | null>();
    resultVendors.forEach((vendor) => {
      if (vendor.user_id) {
        vendorRegionByUserId.set(vendor.user_id, vendor.primary_region_id);
      }
    });

  const resolvedRegionIds = Array.from(
    new Set(
      resultVendors
        .map((vendor) => vendor.primary_region_id)
        .filter((regionId): regionId is number => typeof regionId === "number")
    )
  );

  if (resolvedRegionIds.length > 0) {
    const { data: resolvedRegions, error: regionLookupError } = await client
      .from("regions")
      .select("id, name")
      .in("id", resolvedRegionIds);

    if (regionLookupError) {
      logger.error("search_region_lookup_failed", regionLookupError);
      throw regionLookupError;
    }

    (resolvedRegions ?? []).forEach((region) => {
      regionFilter?.regionNameById.set(region.id, region.name);
    });
  }

  // Lookup featured status for the result set
  const featuredMeta = await resolveFeaturedProfileMetadata(client, {
    regionIds: regionFilter?.regionIds ?? null,
    regionTerm: payload.region ?? null,
  });

  const mapped: DirectorySearchResult[] =
    data?.map((row) => {
      const meta = featuredMeta.get(row.id);
      const regionId = vendorRegionByUserId.get(row.user_id) ?? null;
        return {
          id: row.id,
          name: row.business_name,
          description: row.profile_description,
          slug: row.slug,
          region: {
            id: regionId,
            name:
              regionId != null
                ? regionFilter?.regionNameById.get(regionId) ?? null
                : null,
          },
          category: {
            id: row.category_id,
            name:
              row.category_id != null
                ? categoryNameById.get(row.category_id) ?? null
                : null,
          },
          isFeatured: Boolean(meta),
          featuredRegionLabel: meta?.regionLabel ?? null,
          featuredMatchesSelection: meta?.matchesSelection ?? false,
          createdAt: row.created_at,
        };
    }) ?? [];

  // Sort: featured-in-selection first, then any featured, then daily shuffle for the rest
  const sorted = mapped.sort((a, b) => {
    if (a.featuredMatchesSelection !== b.featuredMatchesSelection) {
      return a.featuredMatchesSelection ? -1 : 1;
    }
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    return dailySortKey(a.id) - dailySortKey(b.id);
  });

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    results: sorted,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

interface ProfileFeaturedMetadata {
  regionLabel: string | null;
  regionId: number | null;
  matchesSelection: boolean;
}

async function resolveFeaturedProfileMetadata(
  client: SupabaseClient<Database>,
  {
    regionIds,
    regionTerm,
  }: {
    regionIds: number[] | null;
    regionTerm: string | null;
  }
) {
  const now = new Date().toISOString();
  let query = client
    .from("featured_slots")
    .select("business_profile_id, suburb_label, region_id")
    .eq("status", "active")
    .lte("start_date", now)
    .gte("end_date", now);

  if (regionIds && regionIds.length > 0) {
    query = query.in("region_id", regionIds);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("featured_lookup_failed", error);
    return new Map<string, ProfileFeaturedMetadata>();
  }

  const normalizedRegion = regionTerm?.trim().toLowerCase() ?? null;

  const featureMap = new Map<string, ProfileFeaturedMetadata>();
  (data ?? []).forEach((slot) => {
    const matchesRegion = normalizedRegion
      ? slot.suburb_label?.toLowerCase().includes(normalizedRegion) ?? false
      : false;
    const matchesRegionId = regionIds?.length
      ? slot.region_id
        ? regionIds.includes(slot.region_id)
        : false
      : false;

    featureMap.set(slot.business_profile_id, {
      regionLabel: slot.suburb_label ?? null,
      regionId: slot.region_id ?? null,
      matchesSelection: normalizedRegion ? matchesRegion : matchesRegionId,
    });
  });

  return featureMap;
}
