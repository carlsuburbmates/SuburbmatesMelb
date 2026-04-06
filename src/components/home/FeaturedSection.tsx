"use client";

import { FeaturedModal } from "@/components/modals/FeaturedModal";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { FEATURED_SLOT } from "@/lib/constants";
import { useState } from "react";

export function FeaturedSection() {
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
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
    <section
      className="relative overflow-hidden py-12 md:py-16 lg:py-24"
      style={{ background: 'var(--bg-surface-1)' }}
    >
      {/* Ambient glow — warm amber */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(160, 100, 60, 0.06) 0%, transparent 70%)',
        }}
      />

      <div
        ref={contentAnimation.elementRef}
        className={`relative container-custom ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="max-w-2xl">
          <h2 className="mb-6" style={{ color: 'var(--ink-primary)' }}>
            Get Featured
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--ink-secondary)' }}>
            Boost your visibility with featured placement in your local area.
            Stand out from the competition and attract more customers.
          </p>
          <div className="space-y-4 mb-8">
            {[
              'Prime position in search results',
              `${FEATURED_SLOT.DURATION_DAYS} days of featured visibility`,
              `Just A$${FEATURED_SLOT.PRICE_CENTS / 100} per placement`,
            ].map((text) => (
              <div key={text} className="flex items-center" style={{ color: 'var(--ink-secondary)' }}>
                <div
                  className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                  style={{ background: 'var(--ink-tertiary)' }}
                />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={openFeaturedModal}
            className="px-8 py-3 text-sm font-semibold tracking-wide transition-colors"
            style={{
              background: 'var(--bg-surface-2)',
              color: 'var(--ink-primary)',
              border: '1px solid var(--border)',
            }}
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
