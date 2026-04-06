import { ChevronDown } from "lucide-react";
import { METRO_REGIONS } from "@/lib/constants";

export interface FilterInputsProps {
  selectedCategory: string;
  selectedRegion: string;
  onFilterChange: (key: string, value: string) => void;
}

// Melbourne business categories (Aussie English)
export const BUSINESS_CATEGORIES = [
  { id: 'design', name: 'Design & Creative' },
  { id: 'technology', name: 'Technology & Software' },
  { id: 'marketing', name: 'Marketing & Advertising' },
  { id: 'photography', name: 'Photography & Video' },
  { id: 'tutoring', name: 'Tutoring & Education' },
  { id: 'consulting', name: 'Business Consulting' },
  { id: 'fitness', name: 'Fitness & Wellness' },
  { id: 'arts', name: 'Arts & Culture' },
];

export function FilterInputs({ selectedCategory, selectedRegion, onFilterChange }: FilterInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Category Filter */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-white/10 pr-2 my-2">
          <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest">Category</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="block w-full pl-[90px] pr-10 py-3 text-sm bg-ink-surface-1 border border-white/10 rounded-sm appearance-none focus:outline-none focus:border-white/30 transition-colors font-medium text-ink-primary hover:border-white/20"
        >
          <option value="" className="bg-ink-surface-1 text-ink-primary">All Categories</option>
          {BUSINESS_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id} className="bg-ink-surface-1 text-ink-primary">
              {category.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-secondary">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Region Filter */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-white/10 pr-2 my-2">
          <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest">Region</span>
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => onFilterChange('region', e.target.value)}
          className="block w-full pl-[90px] pr-10 py-3 text-sm bg-ink-surface-1 border border-white/10 rounded-sm appearance-none focus:outline-none focus:border-white/30 transition-colors font-medium text-ink-primary hover:border-white/20"
        >
          <option value="" className="bg-ink-surface-1 text-ink-primary">All Regions</option>
          {METRO_REGIONS.map((region) => (
            <option key={region} value={region} className="bg-ink-surface-1 text-ink-primary">
              {region}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-secondary">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
