'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TIER_LIMITS } from '@/lib/constants';
import { getImageBySection, generateImageUrl } from '@/lib/images';
import { LazyImage } from '@/components/ui/LazyImage';
import { useFadeIn } from '@/hooks/useScrollAnimation';

const faqs = [
  {
    question: 'What\'s the difference between directory and marketplace?',
    answer: 'Directory profiles are free and showcase your studio information. Marketplace lets you sell digital products for a small commission. Every vendor starts with a directory profile.'
  },
  {
    question: 'How much does it cost?',
    answer: `Directory profiles are completely free. Basic vendors pay ${TIER_LIMITS.basic.commission_rate * 100}% commission per sale. Pro vendors pay $${TIER_LIMITS.pro.monthly_fee / 100}/month + ${TIER_LIMITS.pro.commission_rate * 100}% commission for priority features and support.`
  },
  {
    question: 'What can I sell on the marketplace?',
    answer: 'Digital products only: guides, templates, courses, software, music, photos, and digital services. No physical products or services requiring in-person delivery.'
  },
  {
    question: 'How do payments work?',
    answer: 'We use Stripe Connect. Customers pay through our platform, you receive money directly to your bank account (minus commission). You handle refunds and customer service as the merchant of record.'
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
    <section className="relative overflow-hidden py-16 md:py-24 accent-overlay-amber">
      <div className="absolute inset-0">
        {faqImage ? (
          <LazyImage
            src={generateImageUrl(faqImage)}
            alt={faqImage.description}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
      </div>
      <div className="absolute inset-0 bg-black/40" />
      
      <div
        ref={contentAnimation.elementRef}
        className={`relative container-custom ${contentAnimation.className}`}
        style={contentAnimation.style}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ */}
          <div>
            <h2 className="text-white mb-8">
              Frequently Asked
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-sm">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-white/80 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-white mb-8 text-xl">
              Simple Pricing
            </h3>
            <div className="space-y-4">
              {/* Creator (Free) */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h4 className="text-white font-semibold mb-2">Creator</h4>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-3">Free Forever</div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Directory profile</li>
                  <li>• Customer reviews</li>
                  <li>• Contact details</li>
                  <li>• Photo gallery</li>
                </ul>
              </div>

              {/* Basic Vendor */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h4 className="text-white font-semibold mb-2">Basic Vendor</h4>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-3">{TIER_LIMITS.basic.commission_rate * 100}% Commission</div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Everything in Creator</li>
                  <li>• Sell digital products</li>
                  <li>• Up to ${TIER_LIMITS.basic.product_quota} products</li>
                  <li>• {TIER_LIMITS.basic.storage_quota_gb}GB storage</li>
                </ul>
              </div>

              {/* Pro Vendor */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <h4 className="text-white font-semibold mb-2">Pro Vendor</h4>
                <div className="text-white/60 text-xs uppercase tracking-wider mb-3">$${TIER_LIMITS.pro.monthly_fee / 100}/month + {TIER_LIMITS.pro.commission_rate * 100}% Commission</div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Everything in Basic</li>
                  <li>• Unlimited products</li>
                  <li>• 10GB storage</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <a href="/pricing" className="text-white/70 hover:text-white text-sm underline">
                See Full Pricing Details →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
