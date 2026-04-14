"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Check, Globe } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { MappedBusinessProfile } from "@/lib/types";

interface BusinessHeaderProps {
  business: MappedBusinessProfile;
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <section
      data-testid="business-header"
      className="relative overflow-hidden"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[60%] h-[80%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 20% 30%, var(--accent-atmosphere-soft) 0%, transparent 65%)",
          }}
        />
      </div>

      <Container className="relative z-10 py-12 md:py-20">
        {/* Navigation */}
        <div className="mb-10">
          <Link
            href="/regions"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all rounded-pill px-4 py-2 hover:bg-white/5"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            data-testid="back-to-directory"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div
              className="w-28 h-28 md:w-40 md:h-40 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: "var(--bg-surface-1)",
                border: "1px solid var(--border)",
              }}
            >
              {business.logoUrl ? (
                <Image
                  src={business.logoUrl}
                  alt={business.name}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                  priority={true}
                />
              ) : (
                <span
                  className="text-4xl font-display font-bold"
                  style={{ color: "var(--accent-atmosphere)" }}
                >
                  {business.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Business Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-pill"
                    style={{
                      color: "var(--accent-atmosphere)",
                      background: "var(--accent-atmosphere-muted)",
                      border: "1px solid rgba(108, 92, 231, 0.12)",
                    }}
                  >
                    {business.category || "Creative Studio"}
                  </span>
                  {business.is_verified && (
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" style={{ color: "var(--accent-atmosphere)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                <h1
                  className="font-display mb-5"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 4rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.0,
                    color: "var(--text-primary)",
                  }}
                >
                  {business.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <MapPin className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                    <span>{business.location} neighbourhood</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Globe className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                    <span>Melbourne, VIC</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                {business.contact.website && (
                  <a
                    href={business.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !text-sm"
                    data-testid="creator-website-cta"
                  >
                    Official Website
                  </a>
                )}
                {business.contact.phone && (
                  <a
                    href={`tel:${business.contact.phone}`}
                    className="btn-secondary !text-sm"
                  >
                    {business.contact.phone}
                  </a>
                )}
                {business.contact.email && (
                  <a
                    href={`mailto:${business.contact.email}`}
                    className="btn-secondary !text-sm"
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
