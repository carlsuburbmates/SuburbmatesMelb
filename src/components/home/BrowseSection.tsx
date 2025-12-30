"use client";

import { LazyImage } from "@/components/ui/LazyImage";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { generateImageUrl, getImageBySection } from "@/lib/images";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function BrowseSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const browseImage = getImageBySection("browse")[0];
  const contentAnimation = useFadeIn<HTMLDivElement>({
    delay: 200,
    duration: 700,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      analytics.searchSuburb(searchTerm.trim());
      window.location.href = `/directory?search=${encodeURIComponent(
        searchTerm
      )}`;
    } else {
      analytics.directoryBrowse();
      window.location.href = "/directory";
    }
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-24 accent-overlay-teal">
      <div className="absolute inset-0">
        {browseImage ? (
          <LazyImage
            src={generateImageUrl(browseImage)}
            alt={browseImage.description}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
      </div>
      <div className="absolute inset-0 bg-black/40" />

      <div
        ref={contentAnimation.elementRef}
        className={`relative container-custom ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-white mb-6">Browse by Suburb</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover local talent in your neighborhood. Find everything from
            gardeners and pet sitters to digital artists and consultants.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Try: Fitzroy, Collingwood, Brunswick..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 md:px-6 md:py-4 pr-12 rounded-lg bg-white/90 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-600 text-sm md:text-base"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="text-white/70 text-sm mb-8">
            Or browse all studios in directory
          </div>

          <Link
            href="/directory"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Or browse all studios in directory
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}