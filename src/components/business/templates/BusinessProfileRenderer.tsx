"use client";

import { StandardTemplate } from "./StandardTemplate";
import { HighEndTemplate } from "./HighEndTemplate";
import { StickyActionBar } from "../StickyActionBar";
import { BusinessProfileExtended, MappedBusinessProfile } from "@/lib/types";

interface BusinessProfileRendererProps {
  business: BusinessProfileExtended;
  template_key?: string;
  slug?: string;
}

export function BusinessProfileRenderer({ business, slug }: BusinessProfileRendererProps) {
  const templateKey = business.template_key || "standard";

  // Transform to display model
  const mappedBusiness: MappedBusinessProfile = {
      name: business.business_name,
      slug: slug || business.slug || "", // Use prop, then data, then empty
      description: business.profile_description || "",
      location: business.suburb || "Melbourne, VIC",
      heroImage: business.images?.find((img) => img.caption === "hero")?.url || "/placeholder-hero.jpg",
      logoUrl: business.profile_image_url || "/placeholder-avatar.jpg",
      verified: business.abn_verified || false,
      isVendor: business.is_vendor || false,
      address: business.address || undefined,
      category: business.category || "General",
      sections: {
          about: !!business.profile_description,
          products: (business.product_count || 0) > 0,
          gallery: (business.images?.length || 0) > 0,
          contact: true
      },
      contact: {
          phone: business.phone || undefined,
          email: business.email || undefined,
          website: business.website || undefined
      },
    rating: 4.8, // Fallback for beta
    reviewCount: 12, // Fallback for beta
    createdAt: business.created_at || new Date().toISOString(),
    businessHours: business.business_hours,
    specialties: business.specialties,
    socialMedia: business.social_media,
    yearsActive: undefined,
    clientsServed: undefined,
    awards: [],
    certifications: [],
    achievements: undefined
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
