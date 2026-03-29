"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Zap, MapPin } from "lucide-react";

interface Business {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  suburb: { id: number | null, name: string | null } | null;
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
      } catch (error) {
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
      <div className="py-32 text-center border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
          No digital drops listed in the {region || "selected"} region yet.
        </h3>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-8">
          Join the waitlist to be the first.
        </p>
        <Link
          href="/regions"
          className="inline-block border border-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
        >
          View All Neighbourhoods
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between border-b border-black pb-4">
        <h2 className="text-sm font-black text-black uppercase tracking-[0.3em]">
          Available Studios ({totalCount})
        </h2>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Melbourne, VIC
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
        {businesses.map((business, index) => {
          const isFeatured = index === 0;
          return (
            <Link
              key={business.id}
              href={`/creator/${business.slug}`}
              className={`group glass-card rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-onyx/5 flex flex-col justify-between 
                ${isFeatured
                  ? "col-span-2 md:col-span-6 lg:col-span-12 p-8 md:p-12 min-h-[400px] border-b-4 border-onyx"
                  : "col-span-1 md:col-span-2 lg:col-span-3 p-5 min-h-[280px]"
                }`}
            >
              <div className={isFeatured ? "max-w-3xl" : ""}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.3em] font-black text-onyx uppercase">
                      {business.category?.name || "STUDIO"}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-onyx/40 uppercase">
                      {business.suburb?.name || "MELBOURNE"}
                    </span>
                  </div>
                  {(business.isFeatured || isFeatured) && (
                    <Zap className="w-4 h-4 text-onyx fill-onyx" />
                  )}
                </div>

                <h3 className={`font-sans font-black text-onyx leading-[1.1] uppercase tracking-tighter group-hover:underline decoration-1 underline-offset-8
                  ${isFeatured ? "text-4xl md:text-6xl mb-6" : "text-xl mb-3"}`}>
                  {business.name}
                </h3>

                <p className={`text-onyx/60 font-medium leading-relaxed font-sans
                  ${isFeatured ? "text-lg md:text-xl max-w-xl" : "text-xs line-clamp-3"}`}>
                  {business.description || "Digital creator & professional services focusing on premium regional assets."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-onyx/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[9px] font-black text-onyx/40 uppercase tracking-widest">
                    Live in {business.suburb?.name || "Melbourne"}
                  </span>
                </div>
                <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="font-mono text-[10px] font-black text-onyx uppercase tracking-widest">
                    {isFeatured ? "Explore Asset Portfolio" : "Explore"}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-onyx" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <div className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-px bg-slate-200 border border-slate-200">
            {page > 1 && (
              <Link
                href={`/regions?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page - 1).toString() }).toString()}`}
                className="bg-white px-6 py-2 text-[10px] font-black uppercase hover:bg-slate-50 transition-colors"
              >
                Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/regions?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page + 1).toString() }).toString()}`}
                className="bg-white px-6 py-2 text-[10px] font-black uppercase hover:bg-slate-50 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className={`glass-card p-6 animate-pulse ${i === 0 ? "col-span-2 md:col-span-6 lg:col-span-12 h-[400px]" : "col-span-1 md:col-span-2 lg:col-span-3 h-[280px]"}`}
        >
          <div className="w-1/3 h-3 bg-onyx/5 mb-4" />
          <div className="w-2/3 h-8 bg-onyx/5 mb-2" />
          <div className="w-full h-20 bg-onyx/5" />
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="py-12 px-6 border border-red-100 bg-red-50 text-red-900 text-sm font-bold uppercase tracking-widest text-center">
      {message}
    </div>
  );
}
