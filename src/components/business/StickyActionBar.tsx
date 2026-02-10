"use client";

import { Share2, Heart, Globe, Mail, Phone, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    // TODO: Implement actual save logic
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 pb-safe md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around gap-2">
        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={isLiked ? "Unsave business" : "Save business"}
          aria-pressed={isLiked}
          className={cn(
            "flex flex-col items-center justify-center text-gray-600 hover:text-amber-600 min-w-[3.5rem] rounded-md transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
            isLiked && "text-red-500"
          )}
        >
          <Heart
            className={cn(
              "w-6 h-6 transition-all duration-300",
              isLiked ? "fill-red-500 scale-110" : ""
            )}
          />
          <span className="text-[10px] mt-1 font-medium">Save</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share business"
          className="flex flex-col items-center justify-center text-gray-600 hover:text-amber-600 min-w-[3.5rem] rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          <Share2 className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Share</span>
        </button>

        {/* Dynamic Actions */}
        <div className="flex items-center gap-2 flex-1 justify-end ml-2">
          {business.isVendor && (business.productCount || 0) > 0 ? (
            <button
              type="button"
              onClick={scrollToProducts}
              className="flex-1 bg-amber-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center shadow-sm font-semibold text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 hover:bg-amber-700"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop
            </button>
          ) : business.website ? (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg flex items-center justify-center shadow-sm font-semibold text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 hover:bg-gray-800"
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit
            </a>
          ) : business.email || business.phone ? (
            <a
              href={
                business.email
                  ? `mailto:${business.email}`
                  : `tel:${business.phone}`
              }
              className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg flex items-center justify-center shadow-sm font-semibold text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 hover:bg-gray-800"
            >
              {business.email ? (
                <Mail className="w-4 h-4 mr-2" />
              ) : (
                <Phone className="w-4 h-4 mr-2" />
              )}
              Contact
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
