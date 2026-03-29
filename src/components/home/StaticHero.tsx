"use client";

import { LazyImage } from "@/components/ui/LazyImage";
import {
  generateImageUrl,
  getAccentOverlayClass,
  getImageBySection,
  getImagePriority,
} from "@/lib/images";
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

      {/* Ice Refraction Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/40 to-transparent z-0 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end z-10">
        <div className="container-custom relative pb-20 md:pb-32">
          <div className="max-w-4xl">
            <h1 className="font-sans font-black text-6xl md:text-8xl tracking-tighter text-black leading-[0.85] mb-6 animate-fade-in">
              BUILD YOUR BRAND
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <p className="text-black text-xl md:text-3xl font-bold tracking-tight animate-slide-up uppercase">
                Melbourne&rsquo;s Top Digital Creators
              </p>
              <div className="h-px w-12 bg-black/10 hidden md:block" />
              <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-black/60 flex items-center animate-slide-up">
                <Search className="h-3 w-3 mr-2" />
                DROPS, PRODUCTS, COLLECTIONS — ZERO COMMISSION
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
