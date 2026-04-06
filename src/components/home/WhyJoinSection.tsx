'use client';

import { useFadeIn, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { Check } from 'lucide-react';

export function WhyJoinSection() {
  const sectionAnimation = useFadeIn<HTMLDivElement>({ delay: 100, duration: 700 });
  const features = [
    'No setup fees or monthly costs for directory profiles',
    'Direct Outbound Routing. Keep 100% of your traffic.',
    'Regional visibility across Melbourne creators',
    'Studio credentials and reviews',
    'Direct neighbour relationships (no platform interference)',
    'Australian-owned and operated',
  ];
  const benefitsAnimation = useStaggeredAnimation<HTMLDivElement>(features.length, 80);

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: 'var(--bg-surface-1)' }}
    >
      {/* Ambient glow — sage */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 20% 60%, rgba(60, 120, 100, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative container-custom">
        <div
          ref={sectionAnimation.elementRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${sectionAnimation.className}`}
          style={sectionAnimation.style}
        >
          {/* Left — Features list */}
          <div>
            <h2 className="mb-8" style={{ color: 'var(--ink-primary)' }}>
              Why Join SuburbMates?
            </h2>
            <div ref={benefitsAnimation.containerRef} className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className={`flex items-center ${benefitsAnimation.getItemClassName(index)}`}
                  >
                    <div
                      className="p-1 mr-3 flex-shrink-0"
                      style={{ background: 'rgba(60, 120, 100, 0.15)' }}
                    >
                      <Check className="h-4 w-4" style={{ color: 'var(--ink-secondary)' }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — CTA card */}
          <div className="text-center lg:text-left">
            <div
              className="p-8 glass-shine"
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
              }}
            >
              <h3 className="mb-4 text-xl" style={{ color: 'var(--ink-primary)' }}>
                Ready to Get Started?
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                Join Melbourne&rsquo;s local creators and studios on SuburbMates. Free profile, no platform fees, direct traffic.
              </p>
              <a
                href="/auth/signup"
                className="block w-full text-center px-8 py-3 text-sm font-semibold tracking-wide transition-colors"
                style={{
                  background: 'var(--ink-primary)',
                  color: 'var(--bg-surface-0)',
                }}
              >
                Join Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
