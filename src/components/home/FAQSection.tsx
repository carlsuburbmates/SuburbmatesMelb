'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { UNIVERSAL_PRODUCT_LIMIT } from '@/lib/tier-utils';
import { getImageBySection, generateImageUrl } from '@/lib/images';
import { LazyImage } from '@/components/ui/LazyImage';
import { useFadeIn } from '@/hooks/useScrollAnimation';

const faqs = [
  {
    question: 'How do customers buy from my studio?',
    answer: 'Suburbmates acts as a high-density discovery layer. When a user clicks your product, we land them directly on your checkout page or website. No middlemen, no extra fees.'
  },
  {
    question: 'Is it really free?',
    answer: `Yes. Directory profiles and listing up to ${UNIVERSAL_PRODUCT_LIMIT} products are completely free. We don't take a commission on your sales.`
  },
  {
    question: 'What is a featured slot?',
    answer: 'Featured slots give your studio priority placement in your specific Melbourne region, ensuring you are the first thing local makers see.'
  },
  {
    question: 'Can I sell digital products?',
    answer: 'Suburbmates is designed specifically for digital assets: templates, guides, music, presets, and code. Any digital product with a URL can be listed.'
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqImage = getImageBySection('faq')[0];
  const contentAnimation = useFadeIn<HTMLDivElement>({ delay: 150, duration: 700 });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-white border-t border-gray-100">
      <div className="container-custom relative px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">FAQ</h2>
            <h3 className="text-3xl font-black uppercase tracking-[-0.02em]">Common Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-4">
                <h4 className="text-[13px] font-black uppercase tracking-wider flex items-center gap-3">
                  <span className="text-gray-300 w-6">0{index + 1}</span>
                  {faq.question}
                </h4>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed pl-9 border-l border-gray-50">
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
