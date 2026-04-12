"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { FilterInputs } from "./FilterInputs";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

interface DirectoryFiltersProps {
  selectedCategory?: string;
  selectedRegion?: string;
}

export function DirectoryFilters({ selectedCategory = "", selectedRegion = "" }: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/regions?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("region");
    params.delete("page");
    router.push(`/regions?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedRegion;

  return (
    <>
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }} data-testid="directory-filters">
        <div className="p-4 md:p-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 hidden md:block" style={{ color: "var(--accent-atmosphere)" }} />
            <h3 className="text-xs font-semibold hidden md:block" style={{ color: "var(--text-primary)" }}>Filters</h3>
            <span className="md:hidden text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{hasActiveFilters ? "Filters Active" : "Filter Directory"}</span>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium transition-colors" style={{ color: "var(--text-secondary)" }}>
                <X className="h-3 w-3" /><span>Reset</span>
              </button>
            )}
            <button onClick={() => setIsDrawerOpen(true)} className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              <Filter className="w-3 h-3" /><span>Filters</span>
            </button>
          </div>
        </div>
        <div className="hidden md:block p-5">
          <FilterInputs selectedCategory={selectedCategory} selectedRegion={selectedRegion} onFilterChange={handleFilterChange} />
        </div>
      </div>
      <MobileFilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} selectedCategory={selectedCategory} selectedRegion={selectedRegion} onFilterChange={handleFilterChange} onClear={clearAllFilters} />
    </>
  );
}
