'use client';

import { useState } from 'react';
import { Search, ArrowRight, Loader2, AlertCircle, Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { ClaimModal } from '@/components/creator/ClaimModal';

interface SearchResult {
  id: string;
  business_name: string;
  slug: string;
  region?: string;
  category?: string;
  is_claimed: boolean;
}

interface SearchFirstOnboardingProps {
  onCreateNew: () => void;
}

export function SearchFirstOnboarding({ onCreateNew }: SearchFirstOnboardingProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [claimTarget, setClaimTarget] = useState<{ id: string; name: string } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setResults([]);
    setSearched(false);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), page: 1, limit: 8 }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSearchError('Search failed. Please try again.');
        return;
      }

      const items: SearchResult[] = (data.data?.results ?? []).map(
        (r: Record<string, unknown>) => ({
          id: String(r.id ?? ''),
          business_name: String(r.business_name ?? r.name ?? ''),
          slug: String(r.slug ?? ''),
          region: typeof r.region === 'string' ? r.region : undefined,
          category: typeof r.category === 'string' ? r.category : undefined,
          is_claimed: Boolean(r.user_id),
        })
      );

      setResults(items);
      setSearched(true);
    } catch {
      setSearchError('Network error. Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center p-6 pt-16">
      <div className="max-w-2xl w-full space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">
            Step 1 of 2
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Search the directory first
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-md">
            Your business may already be listed and waiting to be claimed. Search before creating a
            new listing to avoid duplicates.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by business name…"
              className="w-full h-14 pl-11 pr-4 bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="h-14 px-6 bg-white text-black text-[11px] uppercase tracking-widest font-black hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center gap-2"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Search error */}
        {searchError && (
          <div className="flex items-center gap-2 text-red-400 bg-red-900/10 border border-red-900/20 p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-xs">{searchError}</p>
          </div>
        )}

        {/* Results */}
        {searched && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  {results.length} result{results.length !== 1 ? 's' : ''} found — is your listing here?
                </p>
                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between gap-4 p-5 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-white/30" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {result.business_name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {result.region && (
                              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                                {result.region}
                              </span>
                            )}
                            {result.region && result.category && (
                              <span className="w-1 h-1 rounded-full bg-white/15" />
                            )}
                            {result.category && (
                              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                                {result.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href={`/creator/${result.slug}`}
                          target="_blank"
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() =>
                            setClaimTarget({ id: result.id, name: result.business_name })
                          }
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold bg-white text-black hover:bg-white/90 transition-colors"
                        >
                          Claim
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="border border-white/10 bg-white/[0.02] p-8 text-center space-y-2">
                <p className="text-sm font-bold text-white">No listings found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-white/40">
                  Your business is not yet in the directory.
                </p>
              </div>
            )}

            {/* Create new path */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/40">
                {results.length > 0
                  ? "Don't see your listing above?"
                  : 'Ready to add your business?'}
              </p>
              <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-6 py-3 border border-white/15 text-white/70 text-[11px] uppercase tracking-widest font-bold hover:border-white/40 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Listing
              </button>
            </div>
          </div>
        )}

        {/* Not searched yet — create option */}
        {!searched && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30">Know you&apos;re not listed?</p>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors"
            >
              Skip to create <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Claim modal */}
      {claimTarget && (
        <ClaimModal
          isOpen={true}
          onClose={() => setClaimTarget(null)}
          businessProfileId={claimTarget.id}
          listingName={claimTarget.name}
        />
      )}
    </div>
  );
}
