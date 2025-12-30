"use client";

import { useMemo } from "react";
import { BusinessHeader } from "../BusinessHeader";
import { BusinessInfo } from "../BusinessInfo";
import { BusinessContact } from "../BusinessContact";
import { BusinessProducts } from "../BusinessProducts";
import { BusinessReviews } from "../BusinessReviews";
import { ImageGallery } from "../ImageGallery";
import { BusinessShowcase } from "../BusinessShowcase";
import { Container } from "@/components/layout/Container";
import { Separator } from "@/components/ui/separator";

interface BusinessProfileRendererProps {
  business: any; // Using any for now to avoid deep type updates, ideally use full Business type
  templateKey?: string | null;
  themeConfig?: any;
}

export function BusinessProfileRenderer({ business, templateKey = "standard", themeConfig }: BusinessProfileRendererProps) {
  
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
                      <BusinessContact business={business} />
                      <Separator className="my-6" />
                      <BusinessInfo business={business} />
                  </div>
              </div>
           </div>
        </Container>
      </main>
    );
  }

  // Standard Template (Default)
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <BusinessHeader business={business} />
      
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <BusinessShowcase business={business} />
            
            <section id="about" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Studio</h2>
              <div className="prose prose-amber max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {business.profile_description || "No description provided yet."}
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
              <BusinessContact business={business} />
              <BusinessInfo business={business} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
