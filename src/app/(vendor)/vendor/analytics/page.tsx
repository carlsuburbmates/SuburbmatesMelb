"use client";

import { useEffect, useMemo, useState } from "react";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { Activity, BarChart3, TrendingUp } from "lucide-react";

interface SearchAnalyticsSummary {
  totalEvents: number;
  zeroResultCount: number;
  zeroResultRate: number;
  topSuburbs: { label: string; count: number }[];
  topCategories: { label: string; count: number }[];
  latestSearches: Array<{
    suburb: string | null;
    category: string | null;
    tier: string | null;
    resultCount: number | null;
    createdAt: string | null;
  }>;
}

export default function VendorAnalyticsPage() {
  const { products, stats, isLoading, error } = useVendorProducts();
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalyticsSummary | null>(null);
  const [searchAnalyticsError, setSearchAnalyticsError] = useState<string | null>(null);

  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      const key = (product.category || "Uncategorised").trim();
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [products]);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/search");
        if (!response.ok) {
          throw new Error("Unable to load search analytics");
        }
        const json = await response.json();
        if (!isMounted) return;
        setSearchAnalytics(json.data);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setSearchAnalyticsError("Search analytics unavailable right now.");
      }
    };

    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-600">
        Loading analytics…
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
        {error ?? "Analytics unavailable. Please try again later."}
      </div>
    );
  }

  const publishedPercentage =
    stats.totalProducts > 0
      ? Math.round((stats.publishedProducts / stats.totalProducts) * 100)
      : 0;

  const draftPercentage = 100 - publishedPercentage;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor analytics</h1>
        <p className="text-gray-600 mt-2 text-sm">
          Lightweight analytics powered by live marketplace data. Stage 3
          focuses on transparency and actionable next steps—no vanity metrics.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <AnalyticsCard
          title="Publication mix"
          description="Balance between live products and drafts."
        >
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Published</span>
                <span>{publishedPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-green-100 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${publishedPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Drafts</span>
                <span>{draftPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-yellow-50 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${draftPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          title="Tier impact"
          description="Remaining product quota before upgrade."
        >
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total products</span>
              <span className="font-semibold text-gray-900">
                {stats.totalProducts}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tier quota</span>
              <span className="font-semibold text-gray-900">
                {stats.productQuota ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Remaining slots</span>
              <span className="font-semibold text-gray-900">
                {stats.remainingQuota ?? "N/A"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Tier downgrades auto-unpublish products FIFO. Keep drafts ready in
              case you need to republish quickly.
            </p>
          </div>
        </AnalyticsCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <AnalyticsCard
          title="Search telemetry"
          description="How customers are discovering vendors near their suburb."
        >
          {searchAnalyticsError ? (
            <p className="text-sm text-gray-600">{searchAnalyticsError}</p>
          ) : !searchAnalytics ? (
            <p className="text-sm text-gray-600">Loading search insights…</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total search events</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {searchAnalytics.totalEvents}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Zero-result searches</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {searchAnalytics.zeroResultCount}
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round(searchAnalytics.zeroResultRate * 100)}%)
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Top suburbs searched
                </p>
                {searchAnalytics.topSuburbs.length === 0 ? (
                  <p className="text-sm text-gray-600">No suburb data yet.</p>
                ) : (
                  <ul className="space-y-1 text-sm text-gray-700">
                    {searchAnalytics.topSuburbs.map((entry) => (
                      <li key={entry.label} className="flex justify-between">
                        <span>{entry.label}</span>
                        <span className="text-gray-500">{entry.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Top categories searched
                </p>
                {searchAnalytics.topCategories.length === 0 ? (
                  <p className="text-sm text-gray-600">No category data yet.</p>
                ) : (
                  <ul className="space-y-1 text-sm text-gray-700">
                    {searchAnalytics.topCategories.map((entry) => (
                      <li key={entry.label} className="flex justify-between">
                        <span>{entry.label}</span>
                        <span className="text-gray-500">{entry.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </AnalyticsCard>

        <AnalyticsCard
          title="Recent search sessions"
          description="Batched view; queries are anonymized per SSOT."
        >
          {searchAnalyticsError ? (
            <p className="text-sm text-gray-600">{searchAnalyticsError}</p>
          ) : !searchAnalytics ? (
            <p className="text-sm text-gray-600">Loading recent searches…</p>
          ) : searchAnalytics.latestSearches.length === 0 ? (
            <p className="text-sm text-gray-600">No telemetry yet.</p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-700">
              {searchAnalytics.latestSearches.map((event, index) => (
                <li
                  key={`${event.createdAt}-${index}`}
                  className="flex flex-col border border-gray-100 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{event.createdAt ? new Date(event.createdAt).toLocaleString() : "Unknown time"}</span>
                    <span>
                      {event.resultCount === 0 ? (
                        <span className="text-red-500">0 matches</span>
                      ) : (
                        <span>{event.resultCount ?? "—"} matches</span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {event.suburb && (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                        {event.suburb}
                      </span>
                    )}
                    {event.category && (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                        {event.category}
                      </span>
                    )}
                    {event.tier && (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                        Tier: {event.tier}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AnalyticsCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-gray-900" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Top categories
              </h2>
              <p className="text-sm text-gray-500">
                Focus on diversity while staying within your niche.
              </p>
            </div>
          </div>
          {categoryStats.length === 0 ? (
            <p className="text-sm text-gray-600">
              Products need categories to appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {categoryStats.map((entry) => (
                <li
                  key={entry.category}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">
                    {entry.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {entry.count} product{entry.count === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-gray-900" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ops checklist
              </h2>
              <p className="text-sm text-gray-500">
                SSOT-compliant actions recommended for this week.
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              • Publish at least one draft to keep marketplace ranking signals
              fresh.
            </li>
            <li>
              • Update thumbnail or media on your best-performing product—new
              art boosts click-through.
            </li>
            <li>
              • Prepare featured assets if you&apos;re planning a premium tier
              upgrade (max 3 slots).
            </li>
          </ul>

          <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-gray-900" />
            <p className="text-sm text-gray-700">
              Search telemetry integration ships in Week 2. Once live, tier
              ranking will factor in last update date—stay ahead by editing
              listings weekly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}
