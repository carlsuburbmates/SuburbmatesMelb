"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Zap, MapPin } from "lucide-react";

interface Business {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  region: string | null;
  category: string | null;
  isFeatured: boolean;
  createdAt: string | null;
}

interface DirectoryListingProps {
  region?: string;
  category?: string;
  search?: string;
  page: number;
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
        
        // Map backend response 
        setBusinesses(json.data.results ?? []);
        setTotalCount(json.data.pagination?.total ?? 0);
      } catch (error) {
        if (!isMounted) return;
        setError("Unable to load directory. Please try again later.");
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
          href="/directory" 
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
      {/* Header Stat */}
      <div className="flex items-end justify-between border-b border-black pb-4">
        <h2 className="text-sm font-black text-black uppercase tracking-[0.3em]">
          Available Studios ({totalCount})
        </h2>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Melbourne, VIC
        </div>
      </div>

      {/* High Density Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
        {businesses.map((business) => (
          <Link
            key={business.id}
            href={`/business/${business.slug}`}
            className="group relative bg-white p-5 hover:bg-slate-50 transition-colors flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-black uppercase tracking-tighter border border-black px-2 py-0.5">
                  {business.category || "STUDIO"}
                </span>
                {business.isFeatured && (
                  <Zap className="w-4 h-4 text-black fill-black" />
                )}
              </div>
              
              <h3 className="text-lg font-black text-black leading-tight uppercase tracking-tighter line-clamp-2 mb-2 group-hover:underline">
                {business.name}
              </h3>
              
              <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                {business.description || "Digital creator & professional services."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {business.region || "Melbourne"}
              </span>
              <ArrowUpRight className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <div className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-px bg-slate-200 border border-slate-200">
            {page > 1 && (
              <Link
                href={`/directory?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page - 1).toString() }).toString()}`}
                className="bg-white px-6 py-2 text-[10px] font-black uppercase hover:bg-slate-50 transition-colors"
              >
                Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/directory?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(window.location.search)), page: (page + 1).toString() }).toString()}`}
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-white p-6 h-[240px] space-y-4">
          <div className="w-full h-32 bg-slate-50 animate-pulse" />
          <div className="w-2/3 h-4 bg-slate-50 animate-pulse" />
          <div className="w-1/2 h-3 bg-slate-50 animate-pulse" />
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
