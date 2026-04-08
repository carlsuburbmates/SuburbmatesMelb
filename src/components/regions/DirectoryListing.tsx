"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Zap, Info, ArrowRight } from "lucide-react";
import { RegionBottomSheet } from "./RegionBottomSheet";
import { METRO_REGIONS } from "@/lib/constants";

interface Business {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  region: { id: number | null, name: string | null } | null;
  category: { id: number | null, name: string | null } | null;
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

  const itemsPerPage = 24; // High density

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
        
        // Deterministic Daily Shuffle based on YYYYMMDD
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
    return () => { isMounted = false; };
  }, [region, category, search, page]);

  if (loading) return <SkeletonGrid />;
  if (error) return <ErrorMessage message={error} />;

  if (businesses.length === 0) {
    return (
      <div className="py-32 text-center border border-white/10 rounded-sm">
        <h3 className="text-xs font-semibold text-ink-secondary uppercase tracking-widest mb-4">
          No digital drops listed in the {region || "selected"} region yet.
        </h3>
        <p className="text-sm font-medium text-ink-tertiary mb-8">
          Join the waitlist to be the first.
        </p>
        <Link
          href="/regions"
          className="inline-block border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-wider text-ink-primary hover:bg-white/5 transition-all rounded-sm"
        >
          View All Neighbourhoods
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-16">
      {/* Region Discovery Layer - Only show when no specific region is active */}
      {!region && (
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <h2 className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">
              Select Neighbourhood Protocol
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {METRO_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRegionContext(r);
                  setRegionSheetOpen(true);
                }}
                className="group relative bg-ink-surface-1 border border-white/5 p-6 rounded-sm text-left transition-all hover:bg-ink-surface-2 hover:border-white/20 overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-widest mb-2 opacity-50">
                    Region
                  </div>
                  <div className="text-sm font-bold text-ink-primary uppercase tracking-tight group-hover:text-white transition-colors">
                    {r}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-3 h-3 text-ink-primary" />
                </div>
                {/* Background Decor */}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/[0.02] rounded-full blur-xl group-hover:bg-white/[0.05] transition-all"></div>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-12">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="text-sm font-bold text-ink-primary uppercase tracking-widest">
            {region ? `${region} Studios` : "All Global Studios"} ({totalCount})
          </h2>
          <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            {region ? (
              <button 
                onClick={() => {
                  setSelectedRegionContext(region);
                  setRegionSheetOpen(true);
                }}
                className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer focus:outline-none"
                aria-label={`View suburbs in ${region} Region`}
              >
                <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-white/50">{region} Region</span>
                <Info className="w-3.5 h-3.5" />
              </button>
            ) : (
              "Melbourne, VIC"
            )}
          </div>
        </div>

      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">

        {businesses.map((business, index) => {
          const isFeatured = index === 0;
          return (
            <Link
              key={business.id}
              href={`/creator/${business.slug}`}
              className={`group rounded-sm border border-white/5 bg-ink-surface-1 transition-all duration-300 hover:border-white/20 hover:bg-ink-surface-2 flex flex-col justify-between relative overflow-hidden
                ${isFeatured
                  ? "col-span-2 md:col-span-6 lg:col-span-12 p-8 md:p-12 min-h-[400px] border-l-2 border-l-white/40 shadow-2xl"
                  : "col-span-1 md:col-span-2 lg:col-span-3 p-6 min-h-[280px] shadow-lg"
                }`}
            >
              {/* Sharp border illumination effect */}
              <div className="absolute inset-0 border border-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />

              <div className={isFeatured ? "max-w-3xl" : ""}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs tracking-wider font-semibold text-ink-secondary uppercase">
                      {business.category?.name || "STUDIO"}
                    </span>
                    <span className="font-mono text-[10px] tracking-wide text-ink-tertiary uppercase">
                      {business.region?.name || "MELBOURNE"}
                    </span>
                  </div>
                  {(business.isFeatured || isFeatured) && (
                    <Zap className="w-4 h-4 text-ink-primary fill-ink-primary" />
                  )}
                </div>

                <h3 className={`font-sans font-bold text-ink-primary leading-tight tracking-tight group-hover:text-white transition-colors
                  ${isFeatured ? "text-4xl md:text-5xl mb-6" : "text-xl mb-3"}`}>
                  {business.name}
                </h3>

                <p className={`text-ink-secondary font-normal leading-relaxed font-sans
                  ${isFeatured ? "text-lg max-w-xl" : "text-sm line-clamp-3"}`}>
                  {business.description || "Digital creator & professional services focusing on premium regional assets."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse-dim_2s_ease-in-out_infinite]" />
                  <span className="font-mono text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider">
                    Live in {business.region?.name || "Melbourne"}
                  </span>
                </div>
                <div className="flex items-center gap-2 group-hover:translate-x-1 opacity-60 group-hover:opacity-100 transition-all">
                  <span className="font-mono text-[10px] font-bold text-ink-primary uppercase tracking-wider">
                    {isFeatured ? "Explore Asset Portfolio" : "Explore"}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-ink-primary" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-px">
            {page > 1 && (
              <Link
                href={`/regions?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page - 1).toString() }).toString()}`}
                className="bg-ink-surface-1 border border-white/10 px-6 py-2 text-xs font-bold uppercase text-ink-primary hover:bg-ink-surface-2 transition-colors rounded-l-sm"
              >
                Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/regions?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page + 1).toString() }).toString()}`}
                className="bg-ink-surface-1 border border-white/10 px-6 py-2 text-xs font-bold uppercase text-ink-primary hover:bg-ink-surface-2 transition-colors rounded-r-sm"
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
    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className={`bg-ink-surface-1 border border-white/5 rounded-sm p-6 animate-pulse ${i === 0 ? "col-span-2 md:col-span-6 lg:col-span-12 h-[400px]" : "col-span-1 md:col-span-2 lg:col-span-3 h-[280px]"}`}
        >
          <div className="w-1/3 h-3 bg-white/5 mb-4 rounded-sm" />
          <div className="w-2/3 h-8 bg-white/5 mb-2 rounded-sm" />
          <div className="w-full h-20 bg-white/5 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="py-12 px-6 border border-red-900/30 bg-red-900/10 text-red-400 text-sm font-bold uppercase tracking-widest text-center rounded-sm">
      {message}
    </div>
  );
}
