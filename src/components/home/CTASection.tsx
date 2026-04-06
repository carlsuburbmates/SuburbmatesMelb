"use client";

import { SignupModal } from "@/components/modals/SignupModal";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

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
      className="relative overflow-hidden py-20 md:py-32"
      style={{
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Ambient colour glow — replaces background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(70, 100, 160, 0.10) 0%, transparent 65%)",
            "radial-gradient(ellipse 50% 40% at 10% 20%, rgba(60, 100, 80, 0.08) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      <div
        ref={contentAnimation.elementRef}
        className={`container-custom relative z-10 ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — copy */}
          <div>
            <p
              className="mb-4"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              Creator Profiles
            </p>

            <h2
              className="mb-4"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
            >
              Claim Your Profile
            </h2>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.65,
                maxWidth: "40ch",
                marginBottom: "2.5rem",
              }}
            >
              Launch your free directory profile and get discovered by
              Melbourne&rsquo;s digital neighbourhood.
            </p>

            <button
              onClick={handleCreatorCTA}
              className="btn-primary inline-flex items-center gap-2"
            >
              Get Started — Free
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right — glass card with feature list + coloured shadow */}
          <div>
            <div
              className="p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "2px",
                boxShadow: [
                  "0 4px 32px 0 rgba(70, 100, 160, 0.14)",
                  "0 1px 0 0 rgba(255,255,255,0.06) inset",
                ].join(", "),
              }}
            >
              <h3
                className="mb-6"
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Your Digital Storefront
              </h3>

              <ul className="space-y-4">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-5 h-5"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "2px",
                      }}
                    >
                      <Check className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Bottom — visual separator */}
              <div
                className="mt-8 pt-6"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.04em",
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
