"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Check, Globe } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { MappedBusinessProfile } from "@/lib/types";

interface BusinessHeaderProps {
  business: MappedBusinessProfile;
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <section className="bg-transparent border-b border-white/10">
      <Container className="py-12 md:py-20">
        {/* Minimal Navigation */}
        <div className="mb-12">
          <Link 
            href="/regions"
            className="inline-flex items-center space-x-2 text-[11px] font-black text-ink-primary uppercase tracking-widest hover:text-ink-secondary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Directory</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-10">
          {/* Studio Profile Image - High Density Rectangular */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-ink-surface-1 border border-white/5 flex items-center justify-center overflow-hidden">
              {business.logoUrl ? (
                <Image
                  src={business.logoUrl}
                  alt={business.name}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                  priority={true}
                />
              ) : (
                <span className="text-4xl font-black text-ink-tertiary">
                  {business.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Business Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] font-black text-ink-primary border border-white/20 px-2 py-0.5 uppercase tracking-tight bg-white/5">
                    {business.category || "CREATIVE STUDIO"}
                  </span>
                  {business.is_verified ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">
                      <Check className="w-3 h-3" />
                      Verified Studio
                    </div>
                  ) : null}
                </div>

                <h1 className="text-5xl md:text-8xl font-extrabold text-ink-primary uppercase tracking-tighter leading-[0.85] mb-6">
                  {business.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] font-black text-ink-secondary uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-ink-tertiary" />
                    <span>{business.location} neighbourhood</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-ink-tertiary" />
                    <span>Melbourne, VIC</span>
                  </div>
                </div>
              </div>

              {/* Action Grid */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {business.contact.website && (
                  <a
                    href={business.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-ink-primary text-black text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    Official Website
                  </a>
                )}
                {business.contact.phone && (
                  <a
                    href={`tel:${business.contact.phone}`}
                    className="px-8 py-4 border border-white/10 bg-black text-ink-primary text-[11px] font-black uppercase tracking-widest hover:bg-ink-surface-1 transition-colors"
                  >
                    {business.contact.phone}
                  </a>
                )}
                {business.contact.email && (
                  <a
                    href={`mailto:${business.contact.email}`}
                    className="px-8 py-4 border border-white/10 bg-black text-ink-primary text-[11px] font-black uppercase tracking-widest hover:bg-ink-surface-1 transition-colors"
                  >
                    Email Studio
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
