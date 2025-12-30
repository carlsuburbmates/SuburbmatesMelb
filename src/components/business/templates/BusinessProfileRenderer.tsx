"use client";

import { BusinessHeader } from "../BusinessHeader";
import { BusinessInfo } from "../BusinessInfo";
import { BusinessContact } from "../BusinessContact";
import { BusinessProducts } from "../BusinessProducts";
import { BusinessReviews } from "../BusinessReviews";
import { ImageGallery } from "../ImageGallery";
import { BusinessShowcase } from "../BusinessShowcase";
import { StickyActionBar } from "../StickyActionBar";
import { Container } from "@/components/layout/Container";
import { Separator } from "@/components/ui/separator";

interface BusinessImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface BusinessProfileExtended {
  id: string;
  business_name: string;
  profile_description?: string | null;
  profile_image_url?: string | null;
  created_at?: string | null;
  user_id: string;
  suburb?: string;
  category?: string;
  email?: string;
  address?: string;
  phone?: string | null;
  website?: string | null;
  is_vendor?: boolean | null;
  product_count?: number;
  abn_verified?: boolean;
  images?: BusinessImage[];
}

interface BusinessProfileRendererProps {
  business: BusinessProfileExtended;
  templateKey?: string | null;
}

export function BusinessProfileRenderer({ business, templateKey = "standard" }: BusinessProfileRendererProps) {
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


  
  // High-End Template (Minimal / Showcase Focused)
  if (templateKey === "high_end") {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        {/* Full Width Hero for High End */}
        <div className="relative w-full h-[60vh] bg-gray-900 overflow-hidden">
          {business.profile_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={business.profile_image_url} 
              alt={business.business_name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
             <Container>
                <h1 className="text-4xl font-bold text-white mb-2">{business.business_name}</h1>
                <p className="text-gray-200 text-lg max-w-2xl text-shadow-sm">{business.profile_description}</p>
             </Container>
          </div>
        </div>

        <Container className="py-12">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-16">
                  <section>
                    <h2 className="text-2xl font-semibold mb-6">Latest Drops</h2>
                    <BusinessProducts vendorId={business.user_id} limit={6} view="grid" />
                  </section>
                  
                  <section>
                    <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                    <ImageGallery images={business.images || []} />
                  </section>
              </div>

              <div className="lg:col-span-1 space-y-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                      <BusinessContact business={mappedBusiness} />
                      <Separator className="my-6" />
                      <BusinessInfo business={mappedBusiness} />
                  </div>
              </div>
           </div>
        </Container>
        <StickyActionBar business={mappedBusiness} />
      </main>
    );
  }

  // Standard Template (Default)
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <BusinessHeader business={mappedBusiness} />
      
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <BusinessShowcase business={mappedBusiness} />
            
            <section id="about" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Studio</h2>
              <div className="prose prose-amber max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {mappedBusiness.description || "No description provided yet."}
                </p>
              </div>
            </section>
            
            <section id="products">
              <BusinessProducts vendorId={business.user_id} />
            </section>
            
            <section id="gallery">
               <ImageGallery images={business.images || []} />
            </section>

            <section id="reviews">
              <BusinessReviews vendorId={business.user_id} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <BusinessContact business={mappedBusiness} />
              <BusinessInfo business={mappedBusiness} />
            </div>
          </div>
        </div>
      </Container>
      <StickyActionBar business={mappedBusiness} />
    </main>
  );
}
