import { Metadata } from 'next';
import { Check, Store, Shield, Zap, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FEATURED_SLOT, MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";

export const metadata: Metadata = {
  title: 'Economic Protocol | SuburbMates',
  description: "Zero fees. No commission. Direct architecture for Melbourne's digital creators.",
};

export default function Pricing() {
  const features = [
    `Up to ${MAX_PRODUCTS_PER_CREATOR} active product slots`,
    "Public studio identity + region-specific indexing",
    "Direct outbound routing (zero commission model)",
    "Melbourne-wide discovery layer integration",
    "ABN protocol verification badge (optional)",
    `Featured visibility available (paid, ${FEATURED_SLOT.DURATION_DAYS} days / $${(FEATURED_SLOT.PRICE_CENTS / 100).toFixed(0)})`,
  ];

  const faqs = [
    {
      question: "Operational Costs?",
      answer: "Creating a studio profile and indexing your services is completely free. We do not charge subscription fees or commissions. You maintain 100% of your revenue by handling checkouts on your primary infrastructure.",
    },
    {
      question: "Commerce Integration?",
      answer: "Suburbmates acts as a discovery layer, not a marketplace. We bridge high-intent Melbourne traffic directly to your existing website. This eliminates transaction friction and middleman fees.",
    },
    {
      question: "Visibility Boosts?",
      answer: `Featured slots provide priority placement in your specific Melbourne region. These are tactical boosts that run for ${FEATURED_SLOT.DURATION_DAYS} days for a flat $${(FEATURED_SLOT.PRICE_CENTS / 100).toFixed(0)} fee.`,
    },
    {
      question: "Identity Claims?",
      answer: "If our concierge team has pre-seeded your studio, follow your unique invitation link. Once authenticated, a claim protocol will appear on your dashboard to finalize identity ownership.",
    },
  ];

  return (
    <div className="min-h-screen bg-ink-base selection:bg-white selection:text-black font-medium text-ink-primary">
      {/* High-Contrast Hero Navigation */}
      <div className="py-32 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
        
        <div className="container-custom max-w-5xl mx-auto text-center px-6 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="w-12 h-[1px] bg-white/20"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-ink-tertiary">Economic Protocol</span>
            <span className="w-12 h-[1px] bg-white/20"></span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-12">
            Zero Fees.<br />
            <span className="text-ink-tertiary">Pure Growth.</span>
          </h1>
          <p className="text-xs md:text-sm text-ink-tertiary uppercase tracking-[0.3em] font-bold leading-relaxed max-w-2xl mx-auto opacity-70">
            Suburbmates is Melbourne&apos;s infrastructure for discovery. We build the audience, you retain the value.
          </p>
        </div>
      </div>

      {/* The Unified Plan Configuration */}
      <div className="py-32 relative">
        <div className="container-custom max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/5 border border-white/10 shadow-2xl overflow-hidden rounded-sm">
            
            {/* Value Proposition */}
            <div className="lg:col-span-7 bg-black p-12 md:p-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-ink-tertiary mb-12">System Capabilities</h2>
              <ul className="space-y-10">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-6 group">
                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight text-ink-secondary group-hover:text-ink-primary transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Action */}
            <div className="lg:col-span-5 bg-ink-surface-1 p-12 md:p-20 flex flex-col justify-center border-l border-white/5">
              <div className="mb-12">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-7xl font-bold uppercase tracking-tighter">$0</span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink-tertiary">/ Forever</span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-ink-primary mb-4">Studio Identity</h3>
                <p className="text-[10px] text-ink-tertiary uppercase tracking-widest font-medium leading-relaxed">
                  Join the discovery network without operational overhead. We bridge the gap between your products and Melbourne&apos;s intent.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center gap-4 w-full bg-white text-ink-base py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-100 transition-all duration-300 rounded-sm"
                >
                  Join Protocol <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/regions"
                  className="flex items-center justify-center w-full border border-white/10 text-ink-primary py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white/5 transition-all duration-300 rounded-sm"
                >
                  Browse Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Intel (FAQ) */}
      <div className="py-32 border-t border-white/5 bg-black">
        <div className="container-custom max-w-5xl mx-auto px-6">
          <div className="flex flex-col items-center mb-24">
            <small className="text-[9px] font-bold uppercase tracking-[0.6em] text-ink-tertiary mb-6">Operational Intelligence</small>
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-center">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-ink-primary mb-4 flex items-center gap-4">
                  <span className="text-white/10 group-hover:text-white/30 transition-colors font-mono">0{index + 1}</span>
                  {faq.question}
                </h3>
                <p className="text-[11px] text-ink-tertiary leading-relaxed font-bold uppercase tracking-widest ml-12 border-l border-white/5 pl-8 py-2">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Call to Identity */}
      <div className="py-40 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container-custom px-6 relative z-10">
          <div className="w-16 h-16 border border-white/10 mx-auto mb-10 flex items-center justify-center bg-black rotate-45 group-hover:rotate-90 transition-transform duration-700">
            <Store className="w-6 h-6 text-white opacity-40 -rotate-45" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-16 max-w-3xl mx-auto">
            Ready to <span className="text-ink-tertiary">Scale Your Studio</span> Across Melbourne?
          </h2>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-6 border border-white/20 px-16 py-6 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all duration-700 rounded-sm"
          >
            Finalize Enrollment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Global Infrastructure Banner */}
      <div className="py-12 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-8 opacity-20">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Verified Infrastructure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3" />
            <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Hyper-Local Speed</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Melbourne Centrality</span>
          </div>
        </div>
      </div>
    </div>
  );
}
