'use client';

import { useFadeIn } from '@/hooks/useScrollAnimation';

interface LazyBusinessCardProps {
  business: {
    id: string;
    name: string;
    description?: string;
    region: string;
    category: string;
    slug: string;
  };
  delay?: number;
}

export function LazyBusinessCard({ business, delay = 0 }: LazyBusinessCardProps) {
  const { elementRef, className, style } = useFadeIn<HTMLDivElement>({ delay, duration: 500 });

  return (
    <div 
      ref={elementRef}
      className={`bg-white/40 backdrop-blur-2xl border border-white/60 rounded-2xl p-4 md:p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${className}`}
      style={style}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex space-x-4">
          {/* Business Avatar - High Contrast Mono */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-onyx rounded-xl flex items-center justify-center border border-white/5">
              <span className="text-xl font-mono font-bold text-silica">
                {business.name.charAt(0)}
              </span>
            </div>
          </div>

          {/* Business Info - Editorial Layout */}
          <div className="flex-1 min-w-0">
            <h3 className="font-sans text-lg md:text-xl font-bold text-onyx truncate mb-1 leading-tight">
              {business.name}
            </h3>
            
            <div className="flex items-center space-x-4 font-mono text-[10px] tracking-[0.2em] uppercase text-onyx/50 mb-2">
              <span className="flex items-center">
                {business.region}
              </span>
              <span className="border-l border-onyx/10 pl-4">
                {business.category}
              </span>
            </div>

            {business.description && (
              <p className="text-onyx/60 text-xs font-medium line-clamp-2 leading-relaxed font-sans">
                {business.description}
              </p>
            )}
          </div>
        </div>

        {/* High-Contrast Pill Action Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-onyx text-silica px-6 py-2 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform">
            View Studio
          </button>
        </div>
      </div>
    </div>
  );
}
