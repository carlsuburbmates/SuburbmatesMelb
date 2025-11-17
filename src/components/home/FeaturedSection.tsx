"use client";

import { FeaturedModal } from "@/components/modals/FeaturedModal";
import { LazyImage } from "@/components/ui/LazyImage";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { generateImageUrl, getImageBySection } from "@/lib/images";
import { useState } from "react";

export function FeaturedSection() {
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const featuredImage = getImageBySection("featured")[0];
  const contentAnimation = useFadeIn<HTMLDivElement>({
    delay: 150,
    duration: 600,
  });

  const openFeaturedModal = () => {
    analytics.featuredModalOpen();
    setIsFeaturedModalOpen(true);
  };
  const closeFeaturedModal = () => setIsFeaturedModalOpen(false);
  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-24 accent-overlay-orange">
      <div className="absolute inset-0">
        {featuredImage ? (
          <LazyImage
            src={generateImageUrl(featuredImage)}
            alt={featuredImage.description}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
      </div>
      <div className="absolute inset-0 bg-black/50" />

      <div
        ref={contentAnimation.elementRef}
        className={`relative container-custom ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="max-w-2xl">
          <h2 className="text-white mb-6">Get Featured</h2>
          <p className="text-white/90 text-lg mb-8">
            Boost your visibility with featured placement in your local area.
            Stand out from the competition and attract more customers.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-white/80">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">Prime position in search results</span>
            </div>
            <div className="flex items-center text-white/80">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">30 days of featured visibility</span>
            </div>
            <div className="flex items-center text-white/80">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">Just A$20 per placement</span>
            </div>
          </div>
          <button
            onClick={openFeaturedModal}
            className="btn-secondary bg-white text-gray-900 hover:bg-gray-100"
          >
            Learn More
          </button>
        </div>
      </div>

      <FeaturedModal
        isOpen={isFeaturedModalOpen}
        onClose={closeFeaturedModal}
      />
    </section>
  );
}
