"use client";

import { Share2, Heart, Globe, Mail, Phone, ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface StickyActionBarProps {
  business: {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    isVendor?: boolean;
    productCount?: number;
  };
}

export function StickyActionBar({ business }: StickyActionBarProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: business.name, url: window.location.href }); } catch (err) { console.error("Share failed", err); }
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-safe md:hidden" data-testid="sticky-action-bar">
      <div className="rounded-2xl flex items-center justify-between gap-3 px-4 py-3" style={{ background: "rgba(17, 17, 24, 0.92)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid var(--border)", boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center justify-center min-w-[3rem] p-2 rounded-xl transition-all hover:bg-white/5" style={{ color: isLiked ? "var(--accent-cta)" : "var(--text-tertiary)" }}>
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-[9px] mt-0.5 font-medium">Save</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center justify-center min-w-[3rem] p-2 rounded-xl transition-all hover:bg-white/5" style={{ color: "var(--text-tertiary)" }}>
            <Share2 className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-medium">Share</span>
          </button>
        </div>
        <div className="flex-1">
          {(business.productCount || 0) > 0 ? (
            <button onClick={scrollToProducts} className="btn-primary w-full justify-center !py-3 !min-h-0 !text-xs">
              <ArrowUpRight className="w-3.5 h-3.5" /> Explore Portfolio
            </button>
          ) : business.website ? (
            <a href={business.website} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center !py-3 !min-h-0 !text-xs">
              <Globe className="w-3.5 h-3.5" /> Visit Website
            </a>
          ) : (business.email || business.phone) ? (
            <a href={business.email ? `mailto:${business.email}` : `tel:${business.phone}`} className="btn-primary w-full justify-center !py-3 !min-h-0 !text-xs">
              {business.email ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />} Contact
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
