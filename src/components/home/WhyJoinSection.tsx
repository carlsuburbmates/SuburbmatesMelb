"use client";

import { useFadeIn, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import { Check, ArrowRight } from "lucide-react";

export function WhyJoinSection() {
  const sectionAnimation = useFadeIn<HTMLDivElement>({ delay: 100, duration: 700 });
  const features = [
    "No setup fees or monthly costs for directory profiles",
    "Direct Outbound Routing. Keep 100% of your traffic.",
    "Regional visibility across Melbourne creators",
    "Studio credentials and reviews",
    "Direct neighbour relationships (no platform interference)",
    "Australian-owned and operated",
  ];
  const benefitsAnimation = useStaggeredAnimation<HTMLDivElement>(features.length, 80);

  return (
    <section
      data-testid="why-join-section"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--bg-surface-1)" }}
    >
      {/* Atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 w-[50%] h-[70%]"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 20% 80%, var(--accent-atmosphere-soft) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative container-custom">
        <div
          ref={sectionAnimation.elementRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${sectionAnimation.className}`}
          style={sectionAnimation.style}
        >
          {/* Left — Features list */}
          <div>
            <h2
              className="font-display mb-10"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Why Join SuburbMates?
            </h2>
            <div ref={benefitsAnimation.containerRef} className="space-y-4">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3.5 ${benefitsAnimation.getItemClassName(index)}`}
                  >
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg mt-0.5"
                      style={{
                        background: "var(--accent-atmosphere-muted)",
                        border: "1px solid rgba(108, 92, 231, 0.12)",
                      }}
                    >
                      <Check className="h-3.5 w-3.5" style={{ color: "var(--accent-atmosphere)" }} />
                    </div>
                    <span className="text-[0.9375rem] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — CTA card */}
          <div>
            <div
              className="p-8 md:p-10 rounded-2xl"
              style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 8px 48px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.04) inset",
              }}
            >
              <h3
                className="font-display mb-4 text-xl"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Ready to Get Started?
              </h3>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Join Melbourne&rsquo;s local creators and studios on SuburbMates. Free profile, no platform fees, direct traffic.
              </p>
              <a
                href="/auth/signup"
                className="btn-primary w-full justify-center"
                data-testid="why-join-cta"
              >
                Join Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
