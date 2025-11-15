'use client';

import { useState } from 'react';
import { useFadeIn } from '@/hooks/useScrollAnimation';

interface LazyBusinessCardProps {
  business: {
    id: string;
    name: string;
    description?: string;
    suburb: string;
    category: string;
    slug: string;
  };
  delay?: number;
}

export function LazyBusinessCard({ business, delay = 0 }: LazyBusinessCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const animation = useFadeIn({ delay, duration: 500 });

  return (
    <div 
      ref={animation.elementRef as any}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 ${animation.className}`}
      style={animation.style}
    >
      <div className="flex space-x-4">
        {/* Business Avatar with lazy loading */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {!imageLoaded ? (
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <span className="text-xl font-bold text-gray-600">
                {business.name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Business Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
            {business.name}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
            <span>{business.suburb}</span>
            <span className="capitalize">{business.category}</span>
          </div>

          {business.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {business.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}