"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Info, ArrowRight, Star } from "lucide-react";
import { RegionBottomSheet } from "./RegionBottomSheet";
import { METRO_REGIONS } from "@/lib/constants";

interface Business {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  region: { id: number | null; name: string | null } | null;
  category: { id: number | null; name: string | null } | null;
  isFeatured: boolean;
  createdAt: string | null;
}

interface DirectoryListingProps {
  region?: string;
  category?: string;
  search?: string;
  page: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function DirectoryListing({ region, category, search, page }: DirectoryListingProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [regionSheetOpen, setRegionSheetOpen] = useState(false);
  const [selectedRegionContext, setSelectedRegionContext] = useState<string | null>(null);

  const itemsPerPage = 24;

  useEffect(() => {
    let isMounted = true;
    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: search ?? null,
            region: region ?? null,
            category: category ?? null,
            page,
            limit: itemsPerPage,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch directory");

        const json = await response.json();
        if (!isMounted) return;

        let results = json.data.results ?? [];
        const today = new Date();
        const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        results = shuffleArray(results, dateSeed);

        setBusinesses(results);
        setTotalCount(json.data.pagination?.total ?? 0);
      } catch {
        if (!isMounted) return;
        setError("Directory unavailable. Retry connection.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBusinesses();
    return () => {
      isMounted = false;
    };
  }, [region, category, search, page]);

  if (loading) return <SkeletonGrid />;
  if (error) return <ErrorMessage message={error} />;

  if (businesses.length === 0) {
    return (
      <div
        className="py-32 text-center rounded-2xl"
        style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
          No digital drops listed in the {region || "selected"} region yet.
        </h3>
        <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>
          Check back soon or explore all neighbourhoods.
        </p>
        <Link href="/regions" className="btn-secondary" data-testid="empty-directory-cta">
          View All Neighbourhoods
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-16" data-testid="directory-listing">
      {/* Region Discovery Layer */}
      {!region && (
        <section className="space-y-6">
          <h2 className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
            Select Neighbourhood
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {METRO_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRegionContext(r);
                  setRegionSheetOpen(true);
                }}
                className="group relative p-5 rounded-xl text-left transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "var(--bg-surface-1)",
                  border: "1px solid var(--border)",
                }}
                data-testid={`directory-region-${r.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="text-[10px] font-medium mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  Region
                </div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {r}
                </div>
                <ArrowRight
                  className="absolute bottom-3 right-3 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all"
                  style={{ color: "var(--accent-atmosphere)" }}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-8">
        <div className="flex items-end justify-between pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {region ? `${region} Studios` : "All Studios"}{" "}
            <span className="text-sm font-normal" style={{ color: "var(--text-tertiary)" }}>
              ({totalCount})
            </span>
          </h2>
          <div>
            {region ? (
              <button
                onClick={() => {
                  setSelectedRegionContext(region);
                  setRegionSheetOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>{region} Region</span>
                <Info className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Melbourne, VIC
              </span>
            )}
          </div>
        </div>

        {/* Creator cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((business, index) => {
            const isFeatured = business.isFeatured || index === 0;
            return (
              <Link
                key={business.id}
                href={`/creator/${business.slug}`}
                className={`group rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden ${
                  isFeatured && index === 0 ? "md:col-span-2 lg:col-span-3" : ""
                }`}
                style={{
                  background: "var(--bg-surface-1)",
                  border: isFeatured && index === 0
                    ? "1px solid rgba(108, 92, 231, 0.18)"
                    : "1px solid var(--border)",
                  padding: isFeatured && index === 0 ? "2rem 2.5rem" : "1.5rem",
                  minHeight: isFeatured && index === 0 ? "280px" : "220px",
                  boxShadow: isFeatured && index === 0 ? "0 0 32px var(--accent-atmosphere-soft)" : "none",
                }}
                data-testid={`creator-card-${business.slug}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--accent-atmosphere)" }}
                      >
                        {business.category?.name || "Studio"}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {business.region?.name || "Melbourne"}
                      </span>
                    </div>
                    {isFeatured && (
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill"
                        style={{
                          background: "var(--accent-atmosphere-muted)",
                          border: "1px solid rgba(108, 92, 231, 0.15)",
                        }}
                      >
                        <Star className="w-3 h-3" style={{ color: "var(--accent-atmosphere)" }} />
                        <span className="text-[10px] font-medium" style={{ color: "var(--accent-atmosphere)" }}>
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <h3
                    className={`font-display font-bold leading-tight tracking-tight group-hover:text-white transition-colors ${
                      isFeatured && index === 0 ? "text-3xl md:text-4xl mb-4" : "text-xl mb-3"
                    }`}
                    style={{ color: "var(--text-primary)" }}
                  >
                    {business.name}
                  </h3>

                  <p
                    className={`leading-relaxed ${isFeatured && index === 0 ? "text-base max-w-xl" : "text-sm line-clamp-3"}`}
                    style={{ color: "var(--text-secondary)", marginBottom: 0 }}
                  >
                    {business.description || "Digital creator & professional services focusing on premium regional assets."}
                  </p>
                </div>

                <div
                  className="mt-6 pt-4 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dim" />
                    <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      Live in {business.region?.name || "Melbourne"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>
                      {isFeatured && index === 0 ? "Explore Portfolio" : "Explore"}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "var(--accent-atmosphere)" }} />
                  </div>
                </div>

                {/* Hover glow for featured */}
                {isFeatured && index === 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: "var(--accent-atmosphere-glow)", filter: "blur(40px)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/regions?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page - 1).toString() }).toString()}`}
                  className="btn-secondary !py-2 !px-5 !min-h-0 !text-xs"
                >
                  Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/regions?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page + 1).toString() }).toString()}`}
                  className="btn-secondary !py-2 !px-5 !min-h-0 !text-xs"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <RegionBottomSheet
        region={selectedRegionContext}
        isOpen={regionSheetOpen}
        onClose={() => setRegionSheetOpen(false)}
      />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl p-6 animate-pulse ${i === 0 ? "md:col-span-2 lg:col-span-3 h-[280px]" : "h-[220px]"}`}
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}
        >
          <div className="w-1/4 h-3 rounded-lg mb-4" style={{ background: "var(--bg-surface-3)" }} />
          <div className="w-2/3 h-7 rounded-lg mb-3" style={{ background: "var(--bg-surface-3)" }} />
          <div className="w-full h-16 rounded-lg" style={{ background: "var(--bg-surface-2)" }} />
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="py-12 px-6 rounded-2xl text-sm font-medium text-center"
      style={{
        background: "rgba(239, 68, 68, 0.06)",
        border: "1px solid rgba(239, 68, 68, 0.15)",
        color: "#ef4444",
      }}
    >
      {message}
    </div>
  );
}
