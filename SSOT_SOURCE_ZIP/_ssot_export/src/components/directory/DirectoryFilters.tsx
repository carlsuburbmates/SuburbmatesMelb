'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

interface DirectoryFiltersProps {
  selectedCategory?: string;
  selectedSuburb?: string;
}

// Melbourne business categories based on documentation
const BUSINESS_CATEGORIES = [
  { id: 'tutoring', name: 'Tutoring & Education' },
  { id: 'consulting', name: 'Business Consulting' },
  { id: 'fitness', name: 'Fitness & Wellness' },
  { id: 'design', name: 'Design & Creative' },
  { id: 'technology', name: 'Technology & Software' },
  { id: 'marketing', name: 'Marketing & Advertising' },
  { id: 'photography', name: 'Photography & Video' },
  { id: 'food', name: 'Food & Catering' },
  { id: 'home', name: 'Home & Garden Services' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'healthcare', name: 'Healthcare & Medical' },
  { id: 'legal', name: 'Legal & Financial' },
];

// Popular Melbourne suburbs from documentation
const POPULAR_SUBURBS = [
  'Carlton', 'Fitzroy', 'Richmond', 'Brunswick', 'South Yarra', 'Prahran',
  'St Kilda', 'Collingwood', 'Northcote', 'South Melbourne', 'Port Melbourne',
  'Thornbury', 'Windsor', 'Toorak', 'Brighton', 'Hawthorn', 'Kew', 'Armadale'
];

export function DirectoryFilters({ selectedCategory = '', selectedSuburb = '' }: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter Results</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {BUSINESS_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Suburb Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Melbourne Suburb
          </label>
          <select
            value={selectedSuburb}
            onChange={(e) => handleFilterChange('suburb', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
          >
            <option value="">All Suburbs</option>
            {POPULAR_SUBURBS.map((suburb) => (
              <option key={suburb} value={suburb}>
                {suburb}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <div className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                <span>{BUSINESS_CATEGORIES.find(cat => cat.id === selectedCategory)?.name}</span>
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {selectedSuburb && (
              <div className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                <span>{selectedSuburb}</span>
                <button
                  onClick={() => handleFilterChange('suburb', '')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}