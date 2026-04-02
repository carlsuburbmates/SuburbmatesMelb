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
    <div className="bg-white border border-slate-200 p-0 overflow-hidden shadow-none">
      <form onSubmit={handleSearch} className="flex items-stretch h-14">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-black" />
          <input
            type="text"
            placeholder="Search keywords, studios, or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full pl-12 pr-12 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-black text-black bg-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 p-1 hover:bg-slate-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-black" aria-hidden="true" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="bg-black text-white px-8 h-full text-sm font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {/* Popular Terms - High Density */}
      <div className="px-4 py-3 bg-slate-50 flex items-center gap-4 overflow-x-auto no-scrollbar border-t border-slate-100">
        <span className="text-[10px] font-black text-black uppercase tracking-tighter shrink-0 border-r border-slate-200 pr-4">Trending</span>
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
              className="text-[11px] font-bold text-slate-500 hover:text-black transition-colors whitespace-nowrap uppercase tracking-wider"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}