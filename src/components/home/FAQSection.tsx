'use client';

import { MAX_PRODUCTS_PER_CREATOR } from '@/lib/constants';
import { useFadeIn } from '@/hooks/useScrollAnimation';

const faqs = [
  {
    question: 'How does traffic route to my inventory?',
    answer: 'Suburbmates acts as a high-density discovery layer. When a user clicks your product, it routes visitors directly to your external assets. No middlemen, no extra fees.',
  },
  {
    question: 'Is it really free?',
    answer: `Yes. Directory profiles and listing up to ${MAX_PRODUCTS_PER_CREATOR} products are completely free. No platform fees. We route traffic; you keep the revenue.`,
  },
  {
    question: 'What is a featured slot?',
    answer: 'Featured slots give your studio priority placement in your specific Melbourne region, ensuring you are the first thing local makers see.',
  },
  {
    question: 'Can I sell digital products?',
    answer: 'Suburbmates is designed specifically for digital assets: templates, guides, music, presets, and code. Any digital product with a URL can be listed.',
  },
];

export function FAQSection() {
  const contentAnimation = useFadeIn<HTMLDivElement>({ delay: 150, duration: 700 });

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: 'var(--bg-surface-0)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Ambient glow — ochre, top-left */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 45% 40% at 15% 30%, rgba(150, 120, 60, 0.05) 0%, transparent 65%)',
        }}
      />

      <div className="container-custom relative px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-[11px] font-black uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--ink-tertiary)' }}
            >
              FAQ
            </h2>
            <h3
              className="text-3xl font-black uppercase tracking-[-0.02em]"
              style={{ color: 'var(--ink-primary)' }}
            >
              Common Questions
            </h3>
          </div>

          <div
            ref={contentAnimation.elementRef}
            className={`grid grid-cols-1 md:grid-cols-2 gap-12 ${contentAnimation.className}`}
            style={contentAnimation.style}
          >
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-4">
                <h4
                  className="text-[13px] font-black uppercase tracking-wider flex items-center gap-3"
                  style={{ color: 'var(--ink-primary)' }}
                >
                  <span style={{ color: 'var(--ink-tertiary)' }} className="w-6">
                    0{index + 1}
                  </span>
                  {faq.question}
                </h4>
                <p
                  className="text-[13px] font-medium leading-relaxed pl-9"
                  style={{
                    color: 'var(--ink-secondary)',
                    borderLeft: '1px solid var(--border)',
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
