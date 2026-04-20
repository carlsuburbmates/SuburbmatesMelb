"use client";

import { MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";
import { useFadeIn } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does traffic route to my inventory?",
    answer:
      "Suburbmates acts as a high-density discovery layer. When a user clicks your product, it routes visitors directly to your external assets. No middlemen, no extra fees.",
  },
  {
    question: "Is it really free?",
    answer: `Yes. Directory profiles and listing up to ${MAX_PRODUCTS_PER_CREATOR} products are completely free. No platform fees. We route traffic; you keep the revenue.`,
  },
  {
    question: "What is a featured slot?",
    answer:
      "Featured slots give your studio priority placement in your specific Melbourne region, ensuring you are the first thing local creators see.",
  },
  {
    question: "Can I sell digital products?",
    answer:
      "Suburbmates is designed specifically for digital assets: templates, guides, music, presets, and code. Any digital product with a URL can be listed.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[number]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isOpen ? "var(--bg-surface-2)" : "var(--bg-surface-1)",
        border: `1px solid ${isOpen ? "rgba(108, 92, 231, 0.12)" : "var(--border)"}`,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors"
        data-testid={`faq-item-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: "var(--accent-atmosphere)", minWidth: "1.5rem" }}
          >
            0{index + 1}
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {faq.question}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
          style={{
            color: "var(--text-tertiary)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        id={`faq-answer-${index}`}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? "200px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p
          className="px-6 pb-6 pl-[3.5rem] text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)", marginBottom: 0 }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const contentAnimation = useFadeIn<HTMLDivElement>({ delay: 150, duration: 700 });

  return (
    <section
      data-testid="faq-section"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[40%] h-[60%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 15% 30%, var(--accent-atmosphere-soft) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="font-display"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Common Questions
            </h2>
          </div>

          <div
            ref={contentAnimation.elementRef}
            className={`space-y-3 ${contentAnimation.className}`}
            style={contentAnimation.style}
          >
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
