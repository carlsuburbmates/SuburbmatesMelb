'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { FilterInputs } from './FilterInputs';
import { MobileFilterDrawer } from './MobileFilterDrawer';

interface DirectoryFiltersProps {
  selectedCategory?: string;
  selectedRegion?: string;
}

export function DirectoryFilters({ selectedCategory = '', selectedRegion = '' }: DirectoryFiltersProps) {
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
    
    router.push(`/regions?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('region');
    params.delete('page');
    router.push(`/regions?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedRegion;

  return (
    <>
      <div className="bg-ink-surface-1 border border-white/5 rounded-sm overflow-hidden mb-8">
        {/* Header Bar */}
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-ink-primary hidden md:block" />
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-primary hidden md:block">
              Filter Selection
            </h3>
            
            {/* Mobile Title */}
            <span className="md:hidden font-mono text-[10px] font-bold uppercase tracking-widest text-ink-secondary">
              {hasActiveFilters ? 'Filters Active' : 'Filter Directory'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="items-center space-x-1 font-mono text-[10px] uppercase tracking-widest text-ink-secondary hover:text-white transition-colors hidden md:inline-flex"
              >
                <X className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
            
            {/* Mobile Trigger Button */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden flex items-center space-x-2 bg-ink-surface-2 border border-white/10 text-ink-primary rounded-sm px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-lg hover:bg-white/5 transition-all"
            >
              <Filter className="w-3 h-3" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Desktop Inline Filters */}
        <div className="hidden md:block p-6">
          <FilterInputs 
            selectedCategory={selectedCategory} 
            selectedRegion={selectedRegion} 
            onFilterChange={handleFilterChange} 
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        selectedCategory={selectedCategory}
        selectedRegion={selectedRegion}
        onFilterChange={handleFilterChange}
        onClear={clearAllFilters}
      />
    </>
  );
}