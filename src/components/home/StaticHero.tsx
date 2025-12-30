"use client";

import { LazyImage } from "@/components/ui/LazyImage";
import {
  generateImageUrl,
  getAccentOverlayClass,
  getImageBySection,
  getImagePriority,
} from "@/lib/images";
import Link from 'next/link';
import { Search } from "lucide-react";

const heroImages = getImageBySection("hero");
const heroImage = heroImages[0];

export function StaticHero() {
  return (
    <section className="relative min-h-[600px] md:min-h-screen h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className={`${getAccentOverlayClass("orange")} h-full w-full`}>
          {heroImage ? (
            <LazyImage
              src={generateImageUrl(heroImage)}
              alt={heroImage.description}
              fill
              priority={getImagePriority("hero")}
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-cover bg-center bg-gray-400" />
          )}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container-custom pb-20 md:pb-32">
          <div className="max-w-2xl">
            <h1 className="text-white mb-4 animate-fade-in">
              Build Your Brand
            </h1>
            <p className="text-white/90 text-lg md:text-2xl font-light mb-6 md:mb-8 animate-slide-up">
              Melbourne's digital neighbourhood
            </p>
            <p className="text-xs text-white/70 flex items-center mt-3">
              <Search className="h-3 w-3 mr-1" />
              No sign-up required to browse. Discover local talent and
              services in your area.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
