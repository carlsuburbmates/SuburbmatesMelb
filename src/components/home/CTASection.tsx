'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignupModal } from '@/components/modals/SignupModal';

export function CTASection() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Melbourne's Dual Platform
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Start with a free business directory profile, then upgrade to sell digital products 
            when you're ready to monetize your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* Creator Path */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
            <h3 className="mb-4">Build Your Brand</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Create a free directory profile to establish your local presence. 
              Perfect for service businesses and professionals.
            </p>
            <button 
              onClick={openSignupModal}
              className="btn-primary"
            >
              Start Free
            </button>
          </div>

          {/* Vendor Path */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
            </div>
            <h3 className="mb-4">Start Selling</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Sell digital products, guides, and courses to your local community. 
              Keep 92-94% of every sale.
            </p>
            <button 
              onClick={openSignupModal}
              className="btn-cta"
            >
              Become Vendor
            </button>
          </div>
        </div>

        {/* Dual Model Explanation */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Every vendor starts with a directory profile. Upgrade anytime to unlock 
            marketplace features and start generating revenue from your digital expertise.
          </p>
        </div>
      </div>
      
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
      />
    </section>
  );
}