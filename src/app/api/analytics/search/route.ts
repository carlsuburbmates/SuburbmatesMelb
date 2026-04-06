import { NextRequest, NextResponse } from "next/server";
import { requireCreator } from "@/app/api/_utils/auth";

interface SearchLogRow {
  filters: Record<string, unknown> | null;
  result_count: number | null;
  created_at: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const { authContext } = await requireCreator(req);
    const client = authContext.dbClient;

    const { data, error } = await client
      .from("search_logs")
      .select("filters, result_count, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    const logs = (data ?? []) as SearchLogRow[];
    const totalEvents = logs.length;
    const zeroResultCount = logs.filter(
      (entry) => (entry.result_count ?? 0) === 0
    ).length;

    const topRegions = aggregateFilterCounts(logs, "region");
    const topCategories = aggregateFilterCounts(logs, "category");

    const latestSearches = logs.slice(0, 10).map((entry) => {
      const filters = (entry.filters ?? {}) as Record<string, string>;
      return {
        region: filters.region ?? null,
        category: filters.category ?? null,
        tier: filters.tier ?? null,
        resultCount: entry.result_count ?? null,
        createdAt: entry.created_at ?? null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          totalEvents,
          zeroResultCount,
          zeroResultRate:
            totalEvents === 0 ? 0 : zeroResultCount / totalEvents,
          topRegions,
          topCategories,
          latestSearches,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("search_analytics_error", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SEARCH_ANALYTICS_FAILED",
          message: "Unable to load search analytics",
        },
      },
      { status: 500 }
    );
  }
}

function aggregateFilterCounts(
  logs: SearchLogRow[],
  key: string,
  limit = 5
) {
  const map = new Map<string, number>();
  logs.forEach((entry) => {
    const filters = (entry.filters ?? {}) as Record<string, string>;
    const value = filters[key];
    if (!value) return;
    map.set(value, (map.get(value) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}
