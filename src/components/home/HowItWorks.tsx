'use client';

import { useFadeIn, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { UserPlus, Radar, Zap } from 'lucide-react';

export function HowItWorks() {
  const headerAnimation = useFadeIn<HTMLDivElement>({ delay: 200, duration: 800 });
  const steps = [
    {
      number: '01',
      title: 'Create Profile',
      description: 'Launch your creator profile. Add imagery, contact details, and showcase your digital drops.',
      Icon: UserPlus,
      glow: 'rgba(70, 110, 160, 0.08)',
    },
    {
      number: '02',
      title: 'Get Discovered',
      description: 'Surface in your local region. Melbourne visitors browse by category and metro area to find creators like you.',
      Icon: Radar,
      glow: 'rgba(60, 120, 100, 0.08)',
    },
    {
      number: '03',
      title: 'Drive Traffic',
      description: 'Deploy your digital assets. Direct-to-creator outbound routing architecture.',
      Icon: Zap,
      glow: 'rgba(160, 100, 60, 0.08)',
    },
  ];
  const stepsAnimation = useStaggeredAnimation<HTMLDivElement>(steps.length, 150);

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: 'var(--bg-surface-0)' }}
    >
      {/* Ambient glow — slate */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(70, 110, 160, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative container-custom">
        <div
          ref={headerAnimation.elementRef}
          className={`text-center mb-16 ${headerAnimation.className}`}
          style={headerAnimation.style}
        >
          <h2 className="mb-6" style={{ color: 'var(--ink-primary)' }}>
            How It Works
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ink-secondary)' }}>
            Three simple steps to establish your local digital presence and start
            building meaningful connections with your community.
          </p>
        </div>

        <div
          ref={stepsAnimation.containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`${stepsAnimation.getItemClassName(index)} text-center`}
            >
              <div
                className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
                style={{
                  background: step.glow,
                  border: '1px solid var(--border)',
                }}
              >
                <step.Icon
                  className="w-8 h-8"
                  style={{ color: 'var(--ink-secondary)' }}
                  strokeWidth={1.5}
                />
              </div>
              <div
                className="text-sm font-medium tracking-wider uppercase mb-2"
                style={{ color: 'var(--ink-tertiary)' }}
              >
                Step {step.number}
              </div>
              <h3 className="mb-4 text-xl" style={{ color: 'var(--ink-primary)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/auth/signup"
            className="inline-block px-8 py-3 text-sm font-semibold tracking-wide transition-colors"
            style={{
              background: 'var(--bg-surface-2)',
              color: 'var(--ink-primary)',
              border: '1px solid var(--border)',
            }}
          >
            Start Now
          </a>
        </div>
      </div>
    </section>
  );
}
