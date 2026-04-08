"use client";

import { StandardTemplate } from "./StandardTemplate";
import { StickyActionBar } from "../StickyActionBar";
import { BusinessProfileExtended, MappedBusinessProfile } from "@/lib/types";

interface BusinessProfileRendererProps {
  business: BusinessProfileExtended;
  slug?: string;
}

export function BusinessProfileRenderer({ business, slug }: BusinessProfileRendererProps) {
  // Transform to display model (SSOT v2.1 minimalist)
  const mappedBusiness: MappedBusinessProfile = {
      name: business.business_name,
      slug: slug || business.slug || "",
      description: business.profile_description || "",
      location: business.region || "Melbourne, VIC",
      heroImage: business.images?.find((img) => img.caption === "hero")?.url || "/placeholder-hero.jpg",
      logoUrl: business.profile_image_url || "/placeholder-avatar.jpg",
      is_verified: business.is_verified || false,
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
    createdAt: business.created_at || new Date().toISOString(),
    businessHours: business.business_hours,
    specialties: business.specialties,
      socialMedia: business.social_media,
  };

  return (
    <>
      <StandardTemplate business={business} mappedBusiness={mappedBusiness} />
      <StickyActionBar business={mappedBusiness} />
    </>
  );
}
