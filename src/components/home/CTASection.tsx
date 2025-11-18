"use client";

import { SignupModal } from "@/components/modals/SignupModal";
import { LazyImage } from "@/components/ui/LazyImage";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { generateImageUrl, getImageBySection } from "@/lib/images";
import { useState } from "react";

export function CTASection() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const ctaImage = getImageBySection("cta")[0];
  const contentAnimation = useFadeIn<HTMLDivElement>({
    delay: 150,
    duration: 600,
  });

  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);
  const handleCreatorCTA = () => {
    analytics.signupModalOpen("cta_creator");
    openSignupModal();
  };
  const handleVendorCTA = () => {
    analytics.signupModalOpen("cta_vendor");
    openSignupModal();
  };
  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-24 accent-overlay-sage">
      <div className="absolute inset-0">
        {ctaImage ? (
          <LazyImage
            src={generateImageUrl(ctaImage)}
            alt={ctaImage.description}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}
      </div>
      <div className="absolute inset-0 bg-white/90" />

      <div
        ref={contentAnimation.elementRef}
        className={`container-custom relative ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="text-center mb-12 md:mb-16">
          <h2 className="mb-4 md:mb-6">Melbourne's Dual Platform</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Start with a free business directory profile, then upgrade to sell
            digital products when you're ready to monetize your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Creator Path */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
            <h3 className="mb-4">Build Your Brand</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Create a free directory profile to establish your local presence.
              Perfect for service businesses and professionals.
            </p>
            <button onClick={handleCreatorCTA} className="btn-primary">
              Start Free
            </button>
          </div>

          {/* Vendor Path */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
            </div>
            <h3 className="mb-4">Start Selling</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Sell digital products, guides, and courses to your local
              community. Keep 92-94% of every sale.
            </p>
            <button onClick={handleVendorCTA} className="btn-cta">
              Become Vendor
            </button>
          </div>
        </div>

        {/* Dual Model Explanation */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Every vendor starts with a directory profile. Upgrade anytime to
            unlock marketplace features and start generating revenue from your
            digital expertise.
          </p>
        </div>
      </div>

      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />
    </section>
  );
}