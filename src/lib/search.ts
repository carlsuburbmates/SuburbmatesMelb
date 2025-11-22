import { supabaseAdmin, supabase } from "./supabase";
import { DirectorySearchPayload } from "./validation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { logger } from "./logger";
import { resolveLgaMatch } from "./suburb-resolver";

export type DirectorySearchResult = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  tier: string | null;
  suburb: {
    id: number | null;
    name: string | null;
  };
  category: {
    id: number | null;
    name: string | null;
  };
  isFeatured: boolean;
  featuredSuburbLabel: string | null;
  featuredMatchesSelection: boolean;
  createdAt: string | null;
};

const TIER_PRIORITY: Record<string, number> = {
  premium: 0,
  pro: 1,
  basic: 2,
  directory: 3,
  none: 4,
};

const DEFAULT_PRIORITY = 5;

function tierWeight(tier: string | null): number {
  if (!tier) return DEFAULT_PRIORITY;
  return TIER_PRIORITY[tier as keyof typeof TIER_PRIORITY] ?? DEFAULT_PRIORITY;
}

function sanitize(term: string) {
  return term.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export async function searchBusinessProfiles(payload: DirectorySearchPayload) {
  const client = supabaseAdmin ?? supabase;

  const limit = payload.limit ?? 12;
  const page = payload.page ?? 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let suburbFilter: { lgaIds: number[]; label: string | null } | null = null;
  if (payload.suburb) {
    const resolved = await resolveLgaMatch(client, payload.suburb);
    if (!resolved || !resolved.lgaIds.length) {
      return buildEmptyResult(page, limit);
    }
    suburbFilter = {
      lgaIds: resolved.lgaIds,
      label: resolved.matchedLabel ?? payload.suburb,
    };
  }

  let categoryIds: number[] | null = null;
  if (payload.category) {
    const { data: cats, error } = await client
      .from("categories")
      .select("id, name, slug")
      .or(
        `name.ilike.%${sanitize(payload.category)}%,slug.ilike.%${sanitize(
          payload.category
        )}%`
      );
    if (error) {
      logger.error("search_category_lookup_failed", error);
      throw error;
    }
    categoryIds = cats?.map((row) => row.id) ?? [];
    if (!categoryIds.length) {
      return buildEmptyResult(page, limit);
    }
  }

  let queryBuilder = client
    .from("business_profiles")
    .select(
      `
        id,
        business_name,
        profile_description,
        slug,
        vendor_tier,
        vendor_status,
        suburb_id,
        category_id,
        created_at,
        lgas:lgas!business_profiles_suburb_id_fkey ( id, name ),
        categories:categories!business_profiles_category_id_fkey ( id, name )
      `,
      { count: "exact" }
    )
    .eq("is_public", true);

  if (suburbFilter) {
    queryBuilder = queryBuilder.in("suburb_id", suburbFilter.lgaIds);
  }

  if (categoryIds) {
    queryBuilder = queryBuilder.in("category_id", categoryIds);
  }

  if (payload.tier) {
    queryBuilder = queryBuilder.eq("vendor_tier", payload.tier);
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
    throw error;
  }

  const featuredMeta = await resolveFeaturedProfileMetadata(client, {
    lgaIds: suburbFilter?.lgaIds ?? null,
    suburbTerm: payload.suburb ?? null,
  });

  const mapped: DirectorySearchResult[] =
    data?.map((row) => {
      const meta = featuredMeta.get(row.id);
      return {
        id: row.id,
        name: row.business_name,
        description: row.profile_description,
        slug: row.slug,
        tier: row.vendor_tier,
        suburb: {
          id: row.lgas?.id ?? null,
          name: row.lgas?.name ?? null,
        },
        category: {
          id: row.categories?.id ?? null,
          name: row.categories?.name ?? null,
        },
        isFeatured: Boolean(meta),
        featuredSuburbLabel: meta?.suburbLabel ?? null,
        featuredMatchesSelection: meta?.matchesSelection ?? false,
        createdAt: row.created_at,
      };
    }) ?? [];

  const sorted = mapped.sort((a, b) => {
    if (a.featuredMatchesSelection !== b.featuredMatchesSelection) {
      return a.featuredMatchesSelection ? -1 : 1;
    }
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    const tierDiff = tierWeight(a.tier) - tierWeight(b.tier);
    if (tierDiff !== 0) {
      return tierDiff;
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

function buildEmptyResult(page: number, limit: number) {
  return {
    results: [] as DirectorySearchResult[],
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

type FeaturedMeta = {
  suburbLabel: string | null;
  lgaId: number | null;
  matchesSelection: boolean;
};

async function resolveFeaturedProfileMetadata(
  client: SupabaseClient<Database>,
  {
    lgaIds,
    suburbTerm,
  }: {
    lgaIds: number[] | null;
    suburbTerm: string | null;
  }
) {
  const now = new Date().toISOString();
  let query = client
    .from("featured_slots")
    .select("business_profile_id, suburb_label, lga_id")
    .eq("status", "active")
    .lte("start_date", now)
    .gte("end_date", now);

  if (lgaIds && lgaIds.length > 0) {
    query = query.in("lga_id", lgaIds);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("featured_lookup_failed", error);
    return new Map<string, FeaturedMeta>();
  }

  const normalizedSuburb = suburbTerm?.trim().toLowerCase() ?? null;

  const featureMap = new Map<string, FeaturedMeta>();
  (data ?? []).forEach((slot) => {
    const matchesSuburb = normalizedSuburb
      ? slot.suburb_label?.toLowerCase().includes(normalizedSuburb) ?? false
      : false;
    const matchesLga = lgaIds?.length
      ? slot.lga_id
        ? lgaIds.includes(slot.lga_id)
        : false
      : false;

    featureMap.set(slot.business_profile_id, {
      suburbLabel: slot.suburb_label ?? null,
      lgaId: slot.lga_id ?? null,
      matchesSelection: normalizedSuburb ? matchesSuburb : matchesLga,
    });
  });

  return featureMap;
}
