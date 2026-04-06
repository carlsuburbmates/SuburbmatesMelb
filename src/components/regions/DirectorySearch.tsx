'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export interface DirectorySearchProps {
  initialSearch?: string;
  initialRegion?: string;
}

export function DirectorySearch({ initialSearch = '' }: DirectorySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    
    // Reset to page 1 when searching
    params.delete('page');
    
    router.push(`/regions?${params.toString()}`);
  };

  return (
    <div className="bg-ink-surface-1 border border-white/5 p-0 overflow-hidden rounded-sm transition-all focus-within:border-white/20">
      <form onSubmit={handleSearch} className="flex items-stretch h-14">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-ink-secondary" />
          <input
            type="text"
            placeholder="Search keywords, studios, or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full pl-12 pr-12 text-base font-medium placeholder:text-ink-tertiary focus:outline-none focus:ring-0 text-ink-primary bg-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 p-1 hover:bg-white/10 rounded-sm transition-colors"
            >
              <X className="h-4 w-4 text-ink-secondary" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="bg-white/5 border-l border-white/5 text-ink-primary px-8 h-full text-sm font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/10 transition-all shrink-0"
        >
          Search
        </button>
      </form>

      {/* Popular Terms - High Density */}
      <div className="px-4 py-3 bg-ink-base flex items-center gap-4 overflow-x-auto no-scrollbar border-t border-white/5">
        <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest shrink-0 border-r border-white/10 pr-4">Trending</span>
        <div className="flex gap-4">
          {['Design', 'Software', 'Photography', 'Marketing', 'Consulting'].map((term) => (
            <button
              key={term}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('search', term);
                params.delete('page');
                router.push(`/regions?${params.toString()}`);
              }}
              className="text-[10px] font-semibold text-ink-tertiary hover:text-ink-primary transition-colors whitespace-nowrap uppercase tracking-wider relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:bg-ink-primary hover:after:w-full after:transition-all hover:after:duration-300"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}