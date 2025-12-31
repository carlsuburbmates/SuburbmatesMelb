"use client";

import { StandardTemplate } from "./StandardTemplate";
import { HighEndTemplate } from "./HighEndTemplate";
import { StickyActionBar } from "../StickyActionBar";
import { BusinessProfileExtended } from "@/lib/types";

interface BusinessProfileRendererProps {
  business: BusinessProfileExtended;
}

export function BusinessProfileRenderer({ business }: BusinessProfileRendererProps) {
  const templateKey = business.template_key || "standard";

  // Map database profile to UI component interface
  const mappedBusiness = {
    id: business.id,
    name: business.business_name,
    description: business.profile_description || "",
    suburb: business.suburb || "Melbourne",
    category: business.category || "General",
    phone: business.phone || undefined,
    email: business.email || undefined,
    website: business.website || undefined,
    address: business.address || undefined,
    profileImageUrl: business.profile_image_url || undefined,
    isVendor: business.is_vendor ?? true,
    productCount: business.product_count ?? 0,
    verified: business.abn_verified ?? false,
    rating: 4.8, // Fallback for beta
    reviewCount: 12, // Fallback for beta
    createdAt: business.created_at || new Date().toISOString(),
  };

  const renderTemplate = () => {
    switch (templateKey) {
      case "high_end":
        return <HighEndTemplate business={business} mappedBusiness={mappedBusiness} />;
      default:
        return <StandardTemplate business={business} mappedBusiness={mappedBusiness} />;
    }
  };

  return (
    <>
      {renderTemplate()}
      <StickyActionBar business={mappedBusiness} />
    </>
  );
}
