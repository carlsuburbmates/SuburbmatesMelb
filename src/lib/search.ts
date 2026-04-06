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

// Priority ranking is based on Featured status first, then randomized by the daily shuffle seed in the DB.
function getPriorityScore(isFeatured: boolean): number {
  return isFeatured ? 100 : 1;
}

function sanitize(term: string) {
  return term.replace(/[^a-zA-Z0-9\s]/g, "").trim();
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

  // 3. Build query
  let queryBuilder = client
    .from("business_profiles")
    .select(
      `
        id,
        business_name,
        profile_description,
        slug,
        vendor_status,
        suburb_id,
        category_id,
        created_at
      `,
      { count: "exact" }
    )
    .eq("is_public", true)
    .eq("vendor_status", "active");

  if (regionFilter?.regionIds) {
    queryBuilder = queryBuilder.in("suburb_id", regionFilter.regionIds);
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
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    logger.error("search_query_failed", error);
    throw error;
  }

  // Lookup featured status for the result set
  const featuredMeta = await resolveFeaturedProfileMetadata(client, {
    regionIds: regionFilter?.regionIds ?? null,
    regionTerm: payload.region ?? null,
  });

  const mapped: DirectorySearchResult[] =
    data?.map((row) => {
      const meta = featuredMeta.get(row.id);
        return {
          id: row.id,
          name: row.business_name,
          description: row.profile_description,
          slug: row.slug,
          region: {
            id: row.suburb_id,
            name:
              row.suburb_id != null
                ? regionFilter?.regionNameById.get(row.suburb_id) ?? null
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

  // Sort by featured first
  const sorted = mapped.sort((a, b) => {
    if (a.featuredMatchesSelection !== b.featuredMatchesSelection) {
      return a.featuredMatchesSelection ? -1 : 1;
    }
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
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
    return new Map<string, any>();
  }

  const normalizedRegion = regionTerm?.trim().toLowerCase() ?? null;

  const featureMap = new Map<string, any>();
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
