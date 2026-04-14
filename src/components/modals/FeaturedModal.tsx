"use client";

import { Modal } from "@/components/ui/modal";
import { Star, MapPin, Clock, DollarSign, CheckCircle } from "lucide-react";
import { analytics } from "@/lib/analytics";
import { FEATURED_SLOT } from "@/lib/constants";

interface FeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeaturedModal({ isOpen, onClose }: FeaturedModalProps) {
  const benefits = [
    {
      icon: <Star className="w-5 h-5" style={{ color: "var(--accent-cta)" }} />,
      title: "Prime Search Position",
      description: "Appear at the top of search results in your region",
    },
    {
      icon: <MapPin className="w-5 h-5" style={{ color: "var(--accent-atmosphere)" }} />,
      title: "Enhanced Visibility",
      description: "Stand out with a distinctive badge and prominent placement",
    },
    {
      icon: <Clock className="w-5 h-5" style={{ color: "var(--accent-atmosphere)" }} />,
      title: `${FEATURED_SLOT.DURATION_DAYS} Days Duration`,
      description: "Full period of featured placement for maximum exposure",
    },
    {
      icon: <DollarSign className="w-5 h-5" style={{ color: "var(--accent-cta)" }} />,
      title: "Affordable Investment",
      description: `Just A$${FEATURED_SLOT.PRICE_CENTS / 100} per placement - guaranteed regional priority.`,
    },
  ];

  const handleGetFeatured = () => {
    analytics.featuredClick();
    onClose();
    window.location.href = "/vendor/dashboard";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Get Featured Placement" className="max-w-2xl">
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, var(--accent-cta), var(--accent-cta-hover))",
              boxShadow: "0 0 24px var(--accent-cta-glow)",
            }}
          >
            <Star className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Boost Your Local Visibility
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Get premium placement in your region&rsquo;s creator directory
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex-shrink-0 mt-0.5">{benefit.icon}</div>
              <div>
                <h4 className="font-display font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                  {benefit.title}
                </h4>
                <p className="text-xs" style={{ color: "var(--text-secondary)", marginBottom: 0 }}>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div
          className="rounded-xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, var(--accent-atmosphere-muted), var(--accent-cta-muted))",
            border: "1px solid rgba(108, 92, 231, 0.12)",
          }}
        >
          <div className="mb-3">
            <span className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              A${FEATURED_SLOT.PRICE_CENTS / 100}
            </span>
            <span className="text-sm ml-2" style={{ color: "var(--text-secondary)" }}>per placement</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--accent-atmosphere)" }}>
              {FEATURED_SLOT.DURATION_DAYS} Days Guaranteed
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-tertiary)", marginBottom: 0 }}>
            One-time payment, no recurring fees.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1" data-testid="featured-modal-later">
            Maybe Later
          </button>
          <button onClick={handleGetFeatured} className="btn-primary flex-1" data-testid="featured-modal-cta">
            Get Featured Now
          </button>
        </div>

        <p className="text-xs text-center" style={{ color: "var(--text-tertiary)", marginBottom: 0 }}>
          Featured placement is managed manually by the operator. Subject to availability.
        </p>
      </div>
    </Modal>
  );
}
