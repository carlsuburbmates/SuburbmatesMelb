'use client';

import { useFadeIn, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { getImageBySection, generateImageUrl } from '@/lib/images';
import { LazyImage } from '@/components/ui/LazyImage';

export function WhyJoinSection() {
  const sectionAnimation = useFadeIn<HTMLDivElement>({ delay: 100, duration: 700 });
  const whyJoinImage = getImageBySection('why-join')[0];
  const benefits = [
    'No setup fees or monthly costs for directory profiles',
    'Keep 92-94% of every digital product sale',
    'Local customer base in your suburb',
    'Verified business credentials and reviews',
    'Direct customer relationships (no platform interference)',
    'Australian-owned and operated'
  ];
  const benefitsAnimation = useStaggeredAnimation<HTMLDivElement>(benefits.length, 80);

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
              {benefits.map((benefit, index) => (
                <div key={index} className={`flex items-start ${benefitsAnimation.getItemClassName(index)}`}>
                  <div className="w-2 h-2 bg-white rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                  <span className="text-white/90 text-sm leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 className="text-white mb-4 text-xl">
                Ready to Get Started?
              </h3>
              <p className="text-white/80 text-sm mb-6">
                Join hundreds of Melbourne businesses already using SuburbMates 
                to connect with their local community.
              </p>
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
