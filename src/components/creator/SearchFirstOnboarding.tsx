"use client";

import { useState } from "react";
import { Search, ArrowRight, Loader2, AlertCircle, Building2, Plus } from "lucide-react";
import Link from "next/link";
import { ClaimModal } from "@/components/creator/ClaimModal";

interface SearchResult { id: string; business_name: string; slug: string; region?: string; category?: string; is_claimed: boolean; }
interface SearchFirstOnboardingProps { onCreateNew: () => void; }

export function SearchFirstOnboarding({ onCreateNew }: SearchFirstOnboardingProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [claimTarget, setClaimTarget] = useState<{ id: string; name: string } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true); setSearchError(""); setResults([]); setSearched(false);
    try {
      const res = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: query.trim(), page: 1, limit: 8 }) });
      const data = await res.json();
      if (!res.ok || !data.success) { setSearchError("Search failed."); return; }
      const items: SearchResult[] = (data.data?.results ?? []).map((r: Record<string, unknown>) => ({ id: String(r.id ?? ""), business_name: String(r.business_name ?? r.name ?? ""), slug: String(r.slug ?? ""), region: typeof r.region === "string" ? r.region : undefined, category: typeof r.category === "string" ? r.category : undefined, is_claimed: Boolean(r.user_id) }));
      setResults(items); setSearched(true);
    } catch { setSearchError("Network error."); } finally { setIsSearching(false); }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 pt-20" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-2xl w-full space-y-10">
        <div className="space-y-3">
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Step 1 of 2</p>
          <h1 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Search the directory first</h1>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--text-tertiary)" }}>Your business may already be listed. Search before creating to avoid duplicates.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by business name..." className="w-full h-12 pl-11 pr-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }} autoFocus />
          </div>
          <button type="submit" disabled={isSearching || !query.trim()} className="btn-primary !min-h-0 h-12 !px-6 disabled:opacity-30">{isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}</button>
        </form>

        {searchError && <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444" }}><AlertCircle className="w-4 h-4 flex-shrink-0" />{searchError}</div>}

        {searched && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{results.length} result{results.length !== 1 ? "s" : ""} found</p>
                <div className="space-y-2">
                  {results.map((result) => (
                    <div key={result.id} className="flex items-center justify-between gap-4 p-4 rounded-xl transition-all hover:bg-white/[0.02]" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}><Building2 className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} /></div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{result.business_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {result.region && <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{result.region}</span>}
                            {result.category && <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{result.category}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`/creator/${result.slug}`} target="_blank" className="btn-secondary !py-1.5 !px-3 !min-h-0 !text-[10px]">View</Link>
                        <button onClick={() => setClaimTarget({ id: result.id, name: result.business_name })} className="btn-primary !py-1.5 !px-3 !min-h-0 !text-[10px]">Claim</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 rounded-xl text-center" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Your business isn&apos;t listed yet.</p>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{results.length > 0 ? "Don't see yours?" : "Ready to add your business?"}</p>
              <button onClick={onCreateNew} className="btn-secondary !text-xs"><Plus className="w-3.5 h-3.5" /> Create New Listing</button>
            </div>
          </div>
        )}

        {!searched && (
          <div className="pt-2 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Know you&apos;re not listed?</p>
            <button onClick={onCreateNew} className="flex items-center gap-2 text-xs font-medium transition-colors" style={{ color: "var(--accent-atmosphere)" }}>Skip to create <ArrowRight className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>

      {claimTarget && <ClaimModal isOpen={true} onClose={() => setClaimTarget(null)} businessProfileId={claimTarget.id} listingName={claimTarget.name} />}
    </div>
  );
}
