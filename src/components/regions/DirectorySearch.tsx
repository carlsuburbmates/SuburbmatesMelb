"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export interface DirectorySearchProps {
  initialSearch?: string;
  initialRegion?: string;
}

export function DirectorySearch({ initialSearch = "" }: DirectorySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");
    params.delete("page");
    router.push(`/regions?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl overflow-hidden transition-all" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }} data-testid="directory-search">
      <form onSubmit={handleSearch} className="flex items-stretch h-14">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
          <input type="text" placeholder="Search creators, studios, or services..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-full pl-12 pr-12 text-sm font-medium focus:outline-none" style={{ background: "transparent", color: "var(--text-primary)" }} />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-4 p-1 rounded-lg hover:bg-white/5 transition-colors" aria-label="Clear search">
              <X className="h-4 w-4" style={{ color: "var(--text-secondary)" }} aria-hidden="true" />
            </button>
          )}
        </div>
        <button type="submit" className="px-8 h-full text-sm font-semibold transition-all shrink-0 rounded-r-2xl" style={{ background: "var(--bg-surface-2)", color: "var(--text-primary)", borderLeft: "1px solid var(--border)" }}>
          Search
        </button>
      </form>
      <div className="px-5 py-3 flex items-center gap-4 overflow-x-auto" style={{ background: "var(--bg-surface-2)", borderTop: "1px solid var(--border)" }}>
        <span className="text-xs font-medium shrink-0 pr-3" style={{ color: "var(--text-tertiary)", borderRight: "1px solid var(--border)" }}>Trending</span>
        <div className="flex gap-3">
          {["Design", "Software", "Photography", "Marketing", "Consulting"].map((term) => (
            <button key={term} onClick={() => { const params = new URLSearchParams(searchParams); params.set("search", term); params.delete("page"); router.push(`/regions?${params.toString()}`); }} className="text-xs font-medium whitespace-nowrap transition-colors hover:text-ink-primary" style={{ color: "var(--text-tertiary)" }}>
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
