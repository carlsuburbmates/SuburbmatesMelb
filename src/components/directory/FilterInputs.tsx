import { ChevronDown } from "lucide-react";

interface FilterInputsProps {
  selectedCategory: string;
  selectedSuburb: string;
  onFilterChange: (key: string, value: string) => void;
}

// Melbourne business categories
export const BUSINESS_CATEGORIES = [
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

// Popular Melbourne suburbs
export const POPULAR_SUBURBS = [
  'Carlton', 'Fitzroy', 'Richmond', 'Brunswick', 'South Yarra', 'Prahran',
  'St Kilda', 'Collingwood', 'Northcote', 'South Melbourne', 'Port Melbourne',
  'Thornbury', 'Windsor', 'Toorak', 'Brighton', 'Hawthorn', 'Kew', 'Armadale'
];

export function FilterInputs({ selectedCategory, selectedSuburb, onFilterChange }: FilterInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Studio Category
        </label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2.5 px-3 text-sm appearance-none bg-white border"
          >
            <option value="">All Categories</option>
            {BUSINESS_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Suburb Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Location
        </label>
        <div className="relative">
          <select
            value={selectedSuburb}
            onChange={(e) => onFilterChange('suburb', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2.5 px-3 text-sm appearance-none bg-white border"
          >
            <option value="">All Suburbs</option>
            {POPULAR_SUBURBS.map((suburb) => (
              <option key={suburb} value={suburb}>
                {suburb}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
