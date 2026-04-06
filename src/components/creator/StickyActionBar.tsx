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
      try {
        await navigator.share({
          title: business.name,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    }
  };

  const handleSave = () => {
    setIsLiked(!isLiked);
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 pb-safe md:hidden shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {/* Save */}
          <button
            onClick={handleSave}
            className="flex flex-col items-center justify-center text-ink-tertiary hover:text-ink-primary min-w-[3rem] transition-colors"
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-ink-primary text-ink-primary" : ""}`} />
            <span className="text-[8px] mt-1 font-bold uppercase tracking-widest leading-none">Save</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center text-ink-tertiary hover:text-ink-primary min-w-[3rem] transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold uppercase tracking-widest leading-none">Share</span>
          </button>
        </div>

        {/* Dynamic Actions */}
        <div className="flex-1">
           {(business.productCount || 0) > 0 ? (
             <button 
                onClick={scrollToProducts}
                className="w-full bg-ink-primary text-black px-6 py-4 flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
             >
               <ArrowUpRight className="w-3.5 h-3.5 mr-2" />
               Explore Portfolio
             </button>
           ) : business.website ? (
             <a
               href={business.website}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full bg-white text-black px-6 py-4 flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
             >
               <Globe className="w-3.5 h-3.5 mr-2" />
               Direct Website
             </a>
           ) : (business.email || business.phone) ? (
             <a
               href={business.email ? `mailto:${business.email}` : `tel:${business.phone}`}
               className="w-full bg-white text-black px-6 py-4 flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
             >
               {business.email ? <Mail className="w-3.5 h-3.5 mr-2" /> : <Phone className="w-3.5 h-3.5 mr-2" />}
               Contact Studio
             </a>
           ) : null}
        </div>
      </div>
    </div>
  );
}
