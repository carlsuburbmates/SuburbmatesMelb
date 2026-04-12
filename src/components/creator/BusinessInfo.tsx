"use client";

import { MapPin, Calendar, Tag } from "lucide-react";
import { MappedBusinessProfile } from "@/lib/types";

interface BusinessInfoProps {
  business: MappedBusinessProfile;
}

export function BusinessInfo({ business }: BusinessInfoProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xs font-semibold pb-3" style={{ color: "var(--accent-atmosphere)", borderBottom: "1px solid var(--border)" }}>Studio Details</h2>
        <div className="space-y-5">
          {business.location && (
            <div className="flex items-start gap-3.5">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
              <div>
                <h3 className="text-xs font-medium mb-0.5" style={{ color: "var(--text-tertiary)" }}>Location</h3>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)", marginBottom: "0.25rem" }}>{business.location}, Melbourne</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(business.location + " Melbourne")}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium transition-colors" style={{ color: "var(--accent-atmosphere)" }}>
                  View on map &rarr;
                </a>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3.5">
            <Tag className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
            <div>
              <h3 className="text-xs font-medium mb-0.5" style={{ color: "var(--text-tertiary)" }}>Category</h3>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)", marginBottom: 0 }}>{business.category || "General Creative"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
            <div>
              <h3 className="text-xs font-medium mb-0.5" style={{ color: "var(--text-tertiary)" }}>Joined</h3>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)", marginBottom: 0 }}>
                {new Date(business.createdAt).toLocaleDateString("en-AU", { year: "numeric", month: "short" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {business.specialties && business.specialties.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold pb-3" style={{ color: "var(--accent-atmosphere)", borderBottom: "1px solid var(--border)" }}>Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {business.specialties.map((specialty, index) => (
              <span key={index} className="px-3 py-1.5 rounded-pill text-xs font-medium" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.12)", color: "var(--accent-atmosphere)" }}>
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {business.socialMedia && Object.values(business.socialMedia).some((v) => !!v) && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold pb-3" style={{ color: "var(--accent-atmosphere)", borderBottom: "1px solid var(--border)" }}>Social</h2>
          <div className="space-y-2">
            {business.socialMedia.instagram && (
              <a href={`https://instagram.com/${business.socialMedia.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                Instagram
                <span className="text-xs" style={{ color: "var(--accent-atmosphere)" }}>&rarr;</span>
              </a>
            )}
            {business.socialMedia.facebook && (
              <a href={business.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                Facebook
                <span className="text-xs" style={{ color: "var(--accent-atmosphere)" }}>&rarr;</span>
              </a>
            )}
            {business.socialMedia.linkedin && (
              <a href={business.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                LinkedIn
                <span className="text-xs" style={{ color: "var(--accent-atmosphere)" }}>&rarr;</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
