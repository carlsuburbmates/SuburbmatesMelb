"use client";

import { SignupModal } from "@/components/modals/SignupModal";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const FEATURES = [
  "Free creator profile",
  "No transaction fees",
  "Direct outbound routing",
  "Tracked product clicks",
];

export function CTASection() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const contentAnimation = useFadeIn<HTMLDivElement>({ delay: 150, duration: 600 });

  const handleCreatorCTA = () => {
    analytics.signupModalOpen("cta_creator");
    setIsSignupModalOpen(true);
  };

  return (
    <section
      data-testid="cta-section"
      className="relative overflow-hidden py-24 md:py-36"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--accent-atmosphere-soft) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        ref={contentAnimation.elementRef}
        className={`container-custom relative z-10 ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-pill"
              style={{
                background: "var(--accent-cta-muted)",
                border: "1px solid rgba(249, 115, 22, 0.15)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--accent-cta)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--accent-cta)" }}>
                Creator Profiles
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
              Claim Your Profile
            </h2>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                maxWidth: "42ch",
                marginBottom: "2rem",
              }}
            >
              Launch your free directory profile and get discovered by
              Melbourne&rsquo;s digital neighbourhood. Zero setup, zero fees.
            </p>

            <button
              onClick={handleCreatorCTA}
              className="btn-primary"
              data-testid="cta-get-started"
            >
              Get Started — Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right — glass card */}
          <div>
            <div
              className="p-8 md:p-10 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 8px 48px rgba(108, 92, 231, 0.08), 0 1px 0 rgba(255,255,255,0.04) inset",
              }}
            >
              <h3
                className="font-display mb-6"
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Your Digital Storefront
              </h3>

              <ul className="space-y-4">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3.5">
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg"
                      style={{
                        background: "var(--accent-atmosphere-muted)",
                        border: "1px solid rgba(108, 92, 231, 0.15)",
                      }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: "var(--accent-atmosphere)" }} />
                    </span>
                    <span
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="mt-8 pt-6"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-tertiary)",
                    lineHeight: 1.55,
                    marginBottom: 0,
                  }}
                >
                  100% creator-backed. No lock-in. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </section>
  );
}
