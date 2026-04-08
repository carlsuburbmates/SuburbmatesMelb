"use client";

import { useFadeIn } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { RegionBottomSheet } from "@/components/regions/RegionBottomSheet";
import {
  MapPin,
  LayoutGrid,
  ArrowRight,
  Building2,
  Trees,
  Sunset,
  Mountain,
  Waves,
  Landmark,
  BookOpen,
  Wrench,
  Palette,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

const REGIONS = [
  { id: 13, name: "Inner Metro", slug: "inner-metro", Icon: Building2 },
  { id: 14, name: "Inner South-East", slug: "inner-south-east", Icon: Landmark },
  { id: 15, name: "Northern", slug: "northern", Icon: Trees },
  { id: 16, name: "Western", slug: "western", Icon: Sunset },
  { id: 17, name: "Eastern", slug: "eastern", Icon: Mountain },
  { id: 18, name: "Southern", slug: "southern", Icon: Waves },
];

const CATEGORIES = [
  { name: "Guides & Ebooks", slug: "guides-ebooks", Icon: BookOpen },
  { name: "Templates & Tools", slug: "templates-tools", Icon: Wrench },
  { name: "Graphics & Design", slug: "graphics-design", Icon: Palette },
  { name: "Business Services", slug: "business-services", Icon: Briefcase },
];

export function BrowseSection() {
  const contentAnimation = useFadeIn<HTMLDivElement>({ delay: 200, duration: 700 });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-ink-base border-t border-white/5 font-sans">
      {/* Ambient glow — mauve, bottom-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 80% 70%, rgba(140, 80, 120, 0.05) 0%, transparent 70%)',
        }}
      />

      <div
        ref={contentAnimation.elementRef}
        className={`relative container-custom ${contentAnimation.className}`}
      >
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ink-primary mb-2 tracking-tight">
              Explore Melbourne
            </h2>
            <p className="text-ink-secondary text-base md:text-lg max-w-xl">
              Discover local talent, creative studios, and digital tools across our neighbourhoods.
            </p>
          </div>
          <Link
            href="/regions"
            className="inline-flex items-center gap-1.5 transition-all text-ink-secondary hover:text-ink-primary text-[10px] font-bold uppercase tracking-widest whitespace-nowrap group pb-1 border-b border-white/5 hover:border-white/20"
          >
            Open Directory
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Regions */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 ml-1">
            <MapPin className="w-3.5 h-3.5 text-ink-tertiary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary">
              Browse by Region
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedRegion(region.name);
                }}
                className="group flex flex-col items-center justify-center py-8 px-4 transition-all bg-ink-surface-1 border border-white/5 rounded-sm hover:border-white/20 hover:bg-ink-surface-2"
              >
                <region.Icon
                  className="w-5 h-5 mb-4 text-ink-secondary group-hover:text-ink-primary transition-colors"
                  strokeWidth={1.5}
                />
                <span className="text-center text-[10px] font-bold uppercase tracking-widest text-ink-secondary group-hover:text-ink-primary transition-colors leading-tight">
                  {region.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-6 ml-1">
            <LayoutGrid className="w-3.5 h-3.5 text-ink-tertiary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary">
              Browse by Category
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/regions?category=${category.slug}`}
                className="group flex items-center gap-4 px-5 py-5 transition-all bg-ink-surface-1 border border-white/5 rounded-sm hover:border-white/20 hover:bg-ink-surface-2"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-white/5 border border-white/5 rounded-sm group-hover:bg-white/10 group-hover:border-white/10 transition-colors">
                  <category.Icon
                    className="w-4 h-4 text-ink-secondary group-hover:text-ink-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-primary mb-1 tracking-tight">
                    {category.name}
                  </p>
                  <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider group-hover:text-ink-secondary transition-colors">
                    Explore →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <RegionBottomSheet
        region={selectedRegion}
        isOpen={!!selectedRegion}
        onClose={() => setSelectedRegion(null)}
      />
    </section>
  );
}