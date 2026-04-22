import { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FEATURED_SLOT, MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing | SuburbMates",
  description: "Zero fees. No commission. Direct architecture for Melbourne's digital creators.",
};

export default function Pricing() {
  const features = [
    `Up to ${MAX_PRODUCTS_PER_CREATOR} active product slots`,
    "Public studio identity + region-specific indexing",
    "Direct outbound routing (zero commission model)",
    "Melbourne-wide discovery layer integration",
    "ABN verification badge (optional)",
    `Featured visibility available (${FEATURED_SLOT.DURATION_DAYS} days / A$${(FEATURED_SLOT.PRICE_CENTS / 100).toFixed(0)})`,
  ];

  const faqs = [
    { question: "Any costs?", answer: "Creating a studio profile and indexing your services is completely free. No subscription fees or commissions. You maintain 100% of your revenue." },
    { question: "How does commerce work?", answer: "Suburbmates is a discovery layer, not a marketplace. We bridge high-intent Melbourne traffic directly to your existing website." },
    { question: "What are featured slots?", answer: `Featured slots provide priority placement in your Melbourne region. They run for ${FEATURED_SLOT.DURATION_DAYS} days for a flat A$${(FEATURED_SLOT.PRICE_CENTS / 100).toFixed(0)} fee.` },
    { question: "How do I claim my profile?", answer: "If our concierge team has pre-seeded your studio, follow your unique invitation link. A claim protocol will appear on your dashboard." },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%]" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 10%, var(--accent-atmosphere-soft) 0%, transparent 65%)" }} />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <div className="py-32 text-center" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="container-custom max-w-4xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-pill" style={{ background: "var(--accent-cta-muted)", border: "1px solid rgba(249, 115, 22, 0.15)" }}>
              <span className="text-xs font-medium" style={{ color: "var(--accent-cta)" }}>Pricing</span>
            </div>
            <h1 className="font-display mb-6" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--text-primary)" }}>
              Zero Fees.{" "}
              <span style={{ color: "var(--text-tertiary)" }}>Pure Growth.</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Suburbmates is Melbourne&apos;s infrastructure for discovery. We build the audience, you retain the value.
            </p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="py-24">
          <div className="container-custom max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--glass-border)", boxShadow: "0 8px 48px rgba(108, 92, 231, 0.06)" }}>
              <div className="p-10 md:p-14" style={{ background: "var(--bg-surface-1)" }}>
                <h2 className="text-xs font-semibold mb-10" style={{ color: "var(--accent-atmosphere)" }}>What you get</h2>
                <ul className="space-y-6">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 mt-0.5" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.12)" }}>
                        <Check className="h-3.5 w-3.5" style={{ color: "var(--accent-atmosphere)" }} />
                      </div>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: "var(--bg-surface-2)" }}>
                <div className="mb-10">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-display text-6xl font-bold" style={{ color: "var(--text-primary)" }}>$0</span>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>/ forever</span>
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Studio Identity</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    Join the discovery network without operational overhead.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link href="/auth/signup" className="btn-primary w-full justify-center">Join Now <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/regions" className="btn-secondary w-full justify-center">Browse Directory</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-24" style={{ background: "var(--bg-surface-1)" }}>
          <div className="container-custom max-w-4xl mx-auto px-6">
            <h2 className="font-display text-center mb-14" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-xl" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                  <h3 className="font-display text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    <span style={{ color: "var(--accent-atmosphere)" }}>0{index + 1} </span>{faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-32 text-center">
          <div className="container-custom">
            <h2 className="font-display mb-8" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
              Ready to Scale Your Studio?
            </h2>
            <Link href="/auth/signup" className="btn-primary">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
