"use client";

import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { MapPin, LayoutGrid, ArrowRight } from "lucide-react";
import Link from "next/link";

const REGIONS = [
  { id: 1, name: "Inner Metro", slug: "inner-metro", icon: "🏙️" },
  { id: 2, name: "Inner South-east", slug: "inner-south-east", icon: "🏰" },
  { id: 3, name: "Northern", slug: "northern", icon: "🌳" },
  { id: 4, name: "Western", slug: "western", icon: "🌅" },
  { id: 5, name: "Eastern", slug: "eastern", icon: "⛰️" },
  { id: 6, name: "Southern", slug: "southern", icon: "🏖️" },
];

const CATEGORIES = [
  { name: "Guides & Ebooks", slug: "guides-ebooks", icon: "📚" },
  { name: "Templates & Tools", slug: "templates-tools", icon: "🛠️" },
  { name: "Graphics & Design", slug: "graphics-design", icon: "🎨" },
  { name: "Business Services", slug: "business-services", icon: "💼" },
];

export function BrowseSection() {
  const contentAnimation = useFadeIn<HTMLDivElement>({
    delay: 200,
    duration: 700,
  });

  return (
    <section className="py-16 md:py-24 bg-white">
      <div
        ref={contentAnimation.elementRef}
        className={`container-custom ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Explore Melbourne
            </h2>
            <p className="text-lg text-gray-600">
              Discover local talent, creative studios, and digital tools curated by your neighbors.
            </p>
          </div>
          <Link
            href="/regions"
            className="inline-flex items-center text-gray-900 font-semibold hover:translate-x-1 transition-transform"
          >
            Open Directory
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* Regions Grid */}
        <div className="mb-16">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Browse by Region
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {REGIONS.map((region) => (
              <Link
                key={region.id}
                href={`/regions?region=${region.id}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => analytics.searchSuburb(region.name)}
              >
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  {region.icon}
                </span>
                <span className="text-sm font-bold text-gray-900 text-center">
                  {region.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <LayoutGrid className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Browse by Category
            </h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/regions?category=${cat.slug}`}
                className="group flex items-center p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-900 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl mr-4 group-hover:bg-gray-100 transition-colors" aria-hidden="true">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-gray-500">Explore listings &rarr;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}