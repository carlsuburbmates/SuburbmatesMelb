'use client';

import { useFadeIn, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { Check } from 'lucide-react';
import { getImageBySection, generateImageUrl } from '@/lib/images';
import { LazyImage } from '@/components/ui/LazyImage';

export function WhyJoinSection() {
  const sectionAnimation = useFadeIn<HTMLDivElement>({ delay: 100, duration: 700 });
  const whyJoinImage = getImageBySection('why-join')[0];
  // The original benefits array is replaced by a new features array as per the instruction's intent
  // and the rendering part of the component.
  const features = [
    'No setup fees or monthly costs for directory profiles',
    'Keep 92-94% of every digital product sale',
    'Local customer base in your suburb',
    'Verified studio credentials and reviews',
    'Direct customer relationships (no platform interference)',
    'Australian-owned and operated'
  ];
  // The animation now uses the length of the new features array
  const benefitsAnimation = useStaggeredAnimation<HTMLDivElement>(features.length, 80);

  return (
    <section className="relative overflow-hidden py-16 md:py-24 accent-overlay-rose">
      <div className="absolute inset-0">
        {whyJoinImage ? (
          <LazyImage
            src={generateImageUrl(whyJoinImage)}
            alt={whyJoinImage.description}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
      </div>
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative container-custom">
        <div
          ref={sectionAnimation.elementRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${sectionAnimation.className}`}
          style={sectionAnimation.style}
        >
          <div>
            <h2 className="text-white mb-8">
              Why Join SuburbMates?
            </h2>
            <div ref={benefitsAnimation.containerRef} className="space-y-4">
              {/* Original benefits list replaced with new features and styling */}
              <ul className="space-y-3 text-white">
                {features.map((feature, index) => (
                  <li key={index} className={`flex items-center ${benefitsAnimation.getItemClassName(index)}`}>
                    <div className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 className="text-white mb-4 text-xl">
                Ready to Get Started?
              </h3>
              {/* Original paragraph replaced with new content including avatars */}
              <div className="mb-6">
                <div className="mt-8 pt-8 border-t border-gray-100"> {/* This border-t seems misplaced here, but keeping as per instruction */}
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                          {/* Placeholder avatars - would be real users */}
                          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100" />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-white/80">
                      Join Melbourne&rsquo;s verified local creators and studios on SuburbMates
                    </p>
                  </div>
                </div>
              </div>
              <a href="/auth/signup" className="btn-secondary bg-white text-gray-900 hover:bg-gray-100 w-full block text-center">
                Join Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
