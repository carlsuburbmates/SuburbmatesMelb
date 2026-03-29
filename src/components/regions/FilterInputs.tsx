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
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-slate-100 pr-2 my-2">
          <span className="text-[10px] font-black text-black uppercase tracking-tighter">Cat.</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="block w-full pl-16 pr-10 py-3 text-sm bg-white border border-slate-200 rounded-none appearance-none focus:outline-none focus:ring-1 focus:ring-black transition-colors font-medium text-black"
        >
          <option value="">All Categories</option>
          {BUSINESS_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Region Filter */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-slate-100 pr-2 my-2">
          <span className="text-[10px] font-black text-black uppercase tracking-tighter">Loc.</span>
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => onFilterChange('region', e.target.value)}
          className="block w-full pl-16 pr-10 py-3 text-sm bg-white border border-slate-200 rounded-none appearance-none focus:outline-none focus:ring-1 focus:ring-black transition-colors font-medium text-black"
        >
          <option value="">All Regions</option>
          {METRO_REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
