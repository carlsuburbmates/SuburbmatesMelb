"use client";

import { useFadeIn, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import { UserPlus, Radar, Zap } from "lucide-react";

export function HowItWorks() {
  const headerAnimation = useFadeIn<HTMLDivElement>({ delay: 200, duration: 800 });
  const steps = [
    {
      number: "01",
      title: "Apply as Founding Creator",
      description:
        "Submit your profile details for Melbourne beta review. Applications are screened before publication.",
      Icon: UserPlus,
      gradient: "linear-gradient(135deg, var(--accent-atmosphere-muted), rgba(72, 52, 212, 0.08))",
    },
    {
      number: "02",
      title: "Curated Review",
      description:
        "Founding creators are approved in controlled suburb cohorts to protect quality and trust.",
      Icon: Radar,
      gradient: "linear-gradient(135deg, var(--accent-cta-muted), rgba(249, 115, 22, 0.06))",
    },
    {
      number: "03",
      title: "Go Live in Rollout",
      description:
        "Approved creators go live as each suburb opens, helping discovery grow with reliable inventory.",
      Icon: Zap,
      gradient: "linear-gradient(135deg, rgba(108, 92, 231, 0.08), var(--accent-cta-muted))",
    },
  ];
  const stepsAnimation = useStaggeredAnimation<HTMLDivElement>(steps.length, 150);

  return (
    <section
      data-testid="how-it-works-section"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%]"
          style={{
            background: "radial-gradient(ellipse 50% 50% at 50% 50%, var(--accent-atmosphere-soft) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative container-custom">
        <div
          ref={headerAnimation.elementRef}
          className={`text-center mb-20 ${headerAnimation.className}`}
          style={headerAnimation.style}
        >
          <h2
            className="font-display mb-5"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            How It Works
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)", marginBottom: 0 }}
          >
            Join the prelaunch flow built for controlled, trusted creator
            discovery.
          </p>
        </div>

        <div
          ref={stepsAnimation.containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`${stepsAnimation.getItemClassName(index)} group rounded-2xl p-8 md:p-10 text-center transition-all duration-300 hover:scale-[1.02]`}
              style={{
                background: "var(--bg-surface-1)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Step number */}
              <div
                className="text-xs font-bold tracking-wider mb-6"
                style={{ color: "var(--text-tertiary)" }}
              >
                Step {step.number}
              </div>

              {/* Icon */}
              <div
                className="w-16 h-16 flex items-center justify-center mx-auto mb-6 rounded-2xl transition-all"
                style={{
                  background: step.gradient,
                  border: "1px solid var(--border)",
                }}
              >
                <step.Icon
                  className="w-7 h-7"
                  style={{ color: "var(--text-secondary)" }}
                  strokeWidth={1.5}
                />
              </div>

              <h3
                className="font-display mb-3 text-xl"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="/auth/signup"
            className="btn-primary"
            data-testid="how-it-works-cta"
          >
            Apply to Join
          </a>
        </div>
      </div>
    </section>
  );
}
