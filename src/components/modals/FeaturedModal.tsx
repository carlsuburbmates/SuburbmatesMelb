'use client';

import { Modal } from '@/components/ui/modal';
import { Star, MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface FeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeaturedModal({ isOpen, onClose }: FeaturedModalProps) {
  const benefits = [
    {
      icon: <Star className="w-5 h-5 text-amber-500" />,
      title: "Prime Search Position",
      description: "Appear at the top of search results in your suburb",
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      title: "Enhanced Visibility",
      description: "Stand out with a distinctive badge and prominent placement",
    },
    {
      icon: <Clock className="w-5 h-5 text-green-500" />,
      title: "30 Days Duration",
      description: "Full month of featured placement for maximum exposure",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-purple-500" />,
      title: "Affordable Investment",
      description: "Just A$20 per placement - excellent ROI for local businesses",
    }
  ];

  const handleGetFeatured = () => {
    analytics.featuredClick();
    onClose();
    window.location.href = '/vendor/dashboard';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Get Featured Placement"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Boost Your Local Visibility
          </h3>
          <p className="text-gray-600 text-lg">
            Get premium placement in your suburb&rsquo;s creator directory and attract more customers
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">A$20</span>
            <span className="text-gray-600 ml-2">per placement</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">30 Days Guaranteed</span>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            One-time payment, no recurring fees. Cancel or extend anytime.
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">How Featured Placement Works:</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <p className="text-sm text-gray-600">
                Purchase featured placement for your business listing
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <p className="text-sm text-gray-600">
                Your listing appears at the top of search results with a &lsquo;Featured&rsquo; badge
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <p className="text-sm text-gray-600">
                Enjoy 30 days of premium visibility and increased customer discovery
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Maybe Later
          </button>
          <button
            onClick={handleGetFeatured}
            className="flex-1 btn-primary text-center"
          >
            Get Featured Now
          </button>
        </div>

        {/* Fine Print */}
        <p className="text-xs text-gray-500 text-center">
          Featured placement is available to verified businesses only. Subject to community guidelines.
        </p>
      </div>
    </Modal>
  );
}
