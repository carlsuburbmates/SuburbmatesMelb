'use client';

import { MapPin, Calendar, Tag } from 'lucide-react';
import { MappedBusinessProfile } from "@/lib/types";

interface BusinessInfoProps {
  business: MappedBusinessProfile;
}

export function BusinessInfo({ business }: BusinessInfoProps) {
  return (
    <div className="space-y-12">
      {/* Business Details */}
      <div className="space-y-10">
        <h2 className="text-[11px] font-black text-ink-primary uppercase tracking-widest border-b border-white/10 pb-4">
          Studio Specifications
        </h2>
        
        <div className="space-y-8">
          {/* Location */}
          {business.location && (
            <div className="flex items-start space-x-4">
              <MapPin className="w-4 h-4 text-ink-tertiary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[11px] font-bold text-ink-tertiary uppercase tracking-widest mb-1">Location</h3>
                <p className="text-ink-primary font-medium tracking-tight uppercase text-sm">{business.location}, Melbourne</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.location + " Melbourne")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-tertiary hover:text-ink-primary text-[11px] font-bold uppercase tracking-widest mt-2 inline-block border-b border-white/10"
                >
                  Global Map Reference →
                </a>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="flex items-start space-x-4">
            <Tag className="w-4 h-4 text-ink-tertiary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-[11px] font-bold text-ink-tertiary uppercase tracking-widest mb-1">Industry</h3>
              <p className="text-ink-primary font-medium tracking-tight uppercase text-sm">{business.category || "General Creative"}</p>
            </div>
          </div>

          {/* Established */}
          <div className="flex items-start space-x-4">
            <Calendar className="w-4 h-4 text-ink-tertiary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-[11px] font-bold text-ink-tertiary uppercase tracking-widest mb-1">Deployment Date</h3>
              <p className="text-ink-primary font-medium tracking-tight uppercase text-sm">
                {new Date(business.createdAt).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      {business.specialties && business.specialties.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-[11px] font-black text-ink-primary uppercase tracking-widest border-b border-white/10 pb-4">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {business.specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 bg-ink-surface-1 border border-white/10 text-[10px] font-bold text-ink-primary uppercase tracking-widest"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Media */}
      {business.socialMedia && Object.values(business.socialMedia).some(v => !!v) && (
        <div className="space-y-6">
          <h2 className="text-[11px] font-black text-ink-primary uppercase tracking-widest border-b border-white/10 pb-4">
            Network Presence
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {business.socialMedia.facebook && (
              <a
                href={business.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-ink-surface-1 border border-white/10 hover:bg-white hover:text-black transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest">Facebook Connectivity</span>
                <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">Launch →</span>
              </a>
            )}
            {business.socialMedia.instagram && (
              <a
                href={`https://instagram.com/${business.socialMedia.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-ink-surface-1 border border-white/10 hover:bg-white hover:text-black transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest">Instagram Visuals</span>
                <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">Launch →</span>
              </a>
            )}
            {business.socialMedia.linkedin && (
              <a
                href={business.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-ink-surface-1 border border-white/10 hover:bg-white hover:text-black transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest">LinkedIn Enterprise</span>
                <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">Launch →</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}