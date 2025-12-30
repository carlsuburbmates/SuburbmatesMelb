'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { FilterInputs } from './FilterInputs';
import { MobileFilterDrawer } from './MobileFilterDrawer';

interface DirectoryFiltersProps {
  selectedCategory?: string;
  selectedSuburb?: string;
}

export function DirectoryFilters({ selectedCategory = '', selectedSuburb = '' }: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filtering
    params.delete('page');
    
    router.push(`/directory?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('suburb');
    params.delete('page');
    router.push(`/directory?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedSuburb;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-white border-b md:border-b-0 border-gray-100">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600 hidden md:block" />
            <h3 className="font-semibold text-gray-900 hidden md:block">Filter Results</h3>
            
            {/* Mobile Title */}
            <span className="md:hidden font-medium text-gray-500 text-sm">
              {hasActiveFilters ? 'Filters Active' : 'Filter by category & suburb'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:flex"
              >
                <X className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
            
            {/* Mobile Trigger Button */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Inline Filters */}
        <div className="hidden md:block p-4 md:p-6 md:pt-0">
          <FilterInputs 
            selectedCategory={selectedCategory} 
            selectedSuburb={selectedSuburb} 
            onFilterChange={handleFilterChange} 
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        selectedCategory={selectedCategory}
        selectedSuburb={selectedSuburb}
        onFilterChange={handleFilterChange}
        onClear={clearAllFilters}
      />
    </>
  );
}