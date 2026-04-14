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
  { name: "Guides & Ebooks", slug: "guides-ebooks", Icon: BookOpen, desc: "Digital publications & learning resources" },
  { name: "Templates & Tools", slug: "templates-tools", Icon: Wrench, desc: "Ready-to-use kits & productivity tools" },
  { name: "Graphics & Design", slug: "graphics-design", Icon: Palette, desc: "Visual assets & creative packages" },
  { name: "Business Services", slug: "business-services", Icon: Briefcase, desc: "Professional digital services" },
];

export function BrowseSection() {
  const contentAnimation = useFadeIn<HTMLDivElement>({ delay: 200, duration: 700 });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <section
      data-testid="browse-section"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 80%, var(--accent-atmosphere-soft) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        ref={contentAnimation.elementRef}
        className={`relative container-custom ${contentAnimation.className}`}
      >
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <h2
              className="font-display mb-3"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Explore Melbourne
            </h2>
            <p className="text-base md:text-lg max-w-xl" style={{ color: "var(--text-secondary)", marginBottom: 0 }}>
              Discover local talent, creative studios, and digital tools across our neighbourhoods.
            </p>
          </div>
          <Link
            href="/regions"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all group whitespace-nowrap rounded-pill px-5 py-2.5"
            style={{
              color: "var(--text-primary)",
              background: "var(--bg-surface-2)",
              border: "1px solid var(--border-active)",
            }}
            data-testid="browse-open-directory"
          >
            Open Directory
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories — flagship cards */}
        <div className="mb-16">
          <div className="flex items-center gap-2.5 mb-7 ml-1">
            <LayoutGrid className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />
            <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-tertiary)" }}>
              Browse by Category
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/regions?category=${category.slug}`}
                className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "var(--bg-surface-1)",
                  border: "1px solid var(--border)",
                }}
                data-testid={`category-card-${category.slug}`}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-all duration-300 group-hover:shadow-lg"
                  style={{
                    background: "var(--accent-atmosphere-muted)",
                    border: "1px solid rgba(108, 92, 231, 0.12)",
                  }}
                >
                  <category.Icon
                    className="w-5 h-5 transition-colors"
                    style={{ color: "var(--accent-atmosphere)" }}
                    strokeWidth={1.8}
                  />
                </div>
                <h4
                  className="font-display text-base font-bold mb-1.5"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                >
                  {category.name}
                </h4>
                <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)", marginBottom: 0 }}>
                  {category.desc}
                </p>
                <div className="mt-auto pt-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-all group-hover:gap-2.5"
                    style={{ color: "var(--accent-atmosphere)" }}
                  >
                    Explore
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Hover glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    boxShadow: "0 0 32px var(--accent-atmosphere-glow), inset 0 0 0 1px rgba(108, 92, 231, 0.15)",
                  }}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <div className="flex items-center gap-2.5 mb-7 ml-1">
            <MapPin className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-tertiary)" }}>
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
                className="group flex flex-col items-center justify-center py-8 px-4 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "var(--bg-surface-1)",
                  border: "1px solid var(--border)",
                }}
                data-testid={`region-card-${region.slug}`}
              >
                <region.Icon
                  className="w-5 h-5 mb-4 transition-colors"
                  style={{ color: "var(--text-tertiary)" }}
                  strokeWidth={1.5}
                />
                <span
                  className="text-center text-xs font-semibold transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {region.name}
                </span>
              </button>
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
