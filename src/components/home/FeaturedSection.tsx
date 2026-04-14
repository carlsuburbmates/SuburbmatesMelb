"use client";

import { FeaturedModal } from "@/components/modals/FeaturedModal";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { FEATURED_SLOT } from "@/lib/constants";
import { useState } from "react";
import { Star, Zap, Eye } from "lucide-react";

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
      data-testid="featured-section"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--bg-surface-1)" }}
    >
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-0 right-0 w-[50%] h-[80%]"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 80% 30%, var(--accent-atmosphere-soft) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        ref={contentAnimation.elementRef}
        className={`relative container-custom ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-pill"
              style={{
                background: "var(--accent-atmosphere-muted)",
                border: "1px solid rgba(108, 92, 231, 0.15)",
              }}
            >
              <Star className="w-3.5 h-3.5" style={{ color: "var(--accent-atmosphere)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>
                Featured Placement
              </span>
            </div>

            <h2
              className="font-display mb-5"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Get Featured
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--text-secondary)", maxWidth: "44ch" }}>
              Boost your visibility with premium featured placement.
              Stand out and attract more discovery in your category.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: <Eye className="w-4 h-4" />, text: "Prime position in search results" },
                { icon: <Zap className="w-4 h-4" />, text: `${FEATURED_SLOT.DURATION_DAYS} days of featured visibility` },
                { icon: <Star className="w-4 h-4" />, text: `Just A$${FEATURED_SLOT.PRICE_CENTS / 100} per placement` },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3.5">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                    style={{
                      background: "var(--accent-atmosphere-muted)",
                      border: "1px solid rgba(108, 92, 231, 0.12)",
                    }}
                  >
                    <span style={{ color: "var(--accent-atmosphere)" }}>{item.icon}</span>
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={openFeaturedModal}
              className="btn-secondary"
              data-testid="featured-learn-more"
            >
              Learn More
            </button>
          </div>

          {/* Featured preview card */}
          <div
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: "var(--bg-surface-2)",
              border: "1px solid rgba(108, 92, 231, 0.15)",
              boxShadow: "0 0 48px var(--accent-atmosphere-glow), 0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Featured badge */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-pill"
              style={{
                background: "linear-gradient(135deg, var(--accent-atmosphere), var(--accent-indigo))",
              }}
            >
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-xs font-semibold text-white">Featured</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="h-6 w-3/4 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-4 w-1/2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-4 w-2/3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-xl"
                  style={{
                    background: i === 1
                      ? "linear-gradient(135deg, var(--accent-atmosphere-muted), rgba(72, 52, 212, 0.10))"
                      : "linear-gradient(135deg, var(--accent-cta-muted), rgba(249, 115, 22, 0.06))",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>

            {/* Ambient halo */}
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
              style={{ background: "var(--accent-atmosphere-glow)", filter: "blur(60px)" }}
            />
          </div>
        </div>
      </div>

      <FeaturedModal
        isOpen={isFeaturedModalOpen}
        onClose={closeFeaturedModal}
      />
    </section>
  );
}
