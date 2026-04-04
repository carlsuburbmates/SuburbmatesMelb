'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { UNIVERSAL_PRODUCT_LIMIT } from '@/lib/tier-utils';

const faqs = [
  {
    question: 'How does traffic route to my inventory?',
    answer: 'Suburbmates acts as a high-density discovery layer. When a user clicks your product, it routes visitors directly to your external assets. No middlemen, no extra fees.'
  },
  {
    question: 'Is it really free?',
    answer: `Yes. Directory profiles and listing up to ${UNIVERSAL_PRODUCT_LIMIT} products are completely free. Zero Commission. We route traffic; you keep the revenue.`
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
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="flex flex-col">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="group text-[13px] font-black uppercase tracking-wider flex items-center gap-3 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 rounded-sm py-2"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-gray-300 w-6 group-hover:text-black transition-colors">0{index + 1}</span>
                    <span className="flex-1">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[13px] text-gray-500 font-medium leading-relaxed pl-9 border-l border-gray-100">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
