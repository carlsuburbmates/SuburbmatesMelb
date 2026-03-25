"use client";

import { Check, Store } from "lucide-react";
import Link from "next/link";
import { FEATURED_SLOT } from "@/lib/constants";
import { UNIVERSAL_PRODUCT_LIMIT } from "@/lib/tier-utils";

export default function Pricing() {
  const features = [
    `Up to ${UNIVERSAL_PRODUCT_LIMIT} published products`,
    "Public creator profile + directory listing",
    "Self-managed checkout (send users to your own site)",
    "Melbourne-wide search discovery",
    "ABN verified badge (optional)",
    `Featured placement available (paid, ${FEATURED_SLOT.DURATION_DAYS} days / $${(FEATURED_SLOT.PRICE_CENTS / 100).toFixed(0)})`,
  ];

  const faqs = [
    {
      question: "How much does it cost?",
      answer: "Creating a directory profile and listing your studio is completely free. We do not charge subscription fees or commissions on your sales since you handle the checkout on your own website.",
    },
    {
      question: "Can I sell directly on Suburbmates?",
      answer: "In SSOT v2.0, we have transitioned to a discovery-first model. You list your products here, and we send high-intent Melbourne traffic directly to your primary website or checkout page.",
    },
    {
      question: "What is a Featured Slot?",
      answer: `Featured slots give your studio top-of-page visibility in your specific Melbourne region. Each slot runs for ${FEATURED_SLOT.DURATION_DAYS} days for a flat fee of $${(FEATURED_SLOT.PRICE_CENTS / 100).toFixed(0)}.`,
    },
    {
      question: "How do I claim my profile?",
      answer: "If you received an invitation from our concierge team, follow the link in your email to log in via Magic Link. You'll see a claim banner on your dashboard to finalize ownership.",
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Tesla Aesthetic Header */}
      <div className="py-24 border-b border-gray-100">
        <div className="container-custom max-w-4xl mx-auto text-center px-6">
          <h1 className="text-[40px] md:text-[64px] font-black uppercase tracking-[-0.04em] leading-none mb-8">
            Zero Friction.<br />Zero Fees.
          </h1>
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-[0.2em] font-medium leading-relaxed max-w-2xl mx-auto">
            Suburbmates is Melbourne&apos;s hyper-local discovery layer. We build the audience, you keep 100% of the revenue.
          </p>
        </div>
      </div>

      {/* The Single Plan */}
      <div className="py-24 bg-gray-50/50">
        <div className="container-custom max-w-xl mx-auto px-6">
          <div className="bg-white border border-gray-200 p-12 md:p-16 shadow-sm">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Creator</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Standard Model</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black uppercase tracking-tighter">$0</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Forever</p>
              </div>
            </div>

            <ul className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Check className="h-4 w-4 text-black mt-1 flex-shrink-0" />
                  <span className="text-[13px] text-gray-600 font-medium tracking-tight leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full bg-black text-white text-center py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all duration-300"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 border-t border-gray-100">
        <div className="container-custom max-w-3xl mx-auto px-6">
          <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-center mb-16">Frequently Asked</h2>
          <div className="grid gap-12">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 inline-flex items-center gap-2">
                  <span className="text-gray-300">0{index + 1}</span> {faq.question}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed font-medium tracking-tight ml-8 border-l border-gray-100 pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-32 bg-black text-white text-center">
        <div className="container-custom px-6">
          <Store className="w-12 h-12 mx-auto mb-8 text-white opacity-20" />
          <h2 className="text-[40px] font-black uppercase tracking-[-0.04em] mb-12">Scale Your Studio.</h2>
          <Link
            href="/auth/signup"
            className="inline-block border border-white/20 px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500"
          >
            Join Suburbmates
          </Link>
        </div>
      </div>
    </div>
  );
}
