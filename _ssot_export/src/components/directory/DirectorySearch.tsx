'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

interface DirectorySearchProps {
  initialSearch?: string;
  initialSuburb?: string;
}

export function DirectorySearch({ initialSearch = '', initialSuburb = '' }: DirectorySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [suburb, setSuburb] = useState(initialSuburb);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    
    if (suburb.trim()) {
      params.set('suburb', suburb.trim());
    } else {
      params.delete('suburb');
    }
    
    // Reset to page 1 when searching
    params.delete('page');
    
    router.push(`/directory?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses, services, or products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Suburb Input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Melbourne suburb..."
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="btn-primary flex-1 sm:flex-initial px-8"
          >
            Search Directory
          </button>
          
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSuburb('');
              router.push('/directory');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {['Tutoring', 'Consulting', 'Fitness', 'Design', 'Photography', 'Marketing'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearch(term);
                const params = new URLSearchParams(searchParams);
                params.set('search', term);
                params.delete('page');
                router.push(`/directory?${params.toString()}`);
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}