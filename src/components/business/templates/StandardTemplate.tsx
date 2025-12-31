import { BusinessHeader } from "../BusinessHeader";
import { BusinessInfo } from "../BusinessInfo";
import { BusinessContact } from "../BusinessContact";
import { BusinessProducts } from "../BusinessProducts";
import { BusinessReviews } from "../BusinessReviews";
import { ImageGallery } from "../ImageGallery";
import { BusinessShowcase } from "../BusinessShowcase";
import { Container } from "@/components/layout/Container";
import { BusinessProfileExtended, MappedBusinessProfile } from "@/lib/types";

interface StandardTemplateProps {
  business: BusinessProfileExtended;
  mappedBusiness: MappedBusinessProfile;
}

export function StandardTemplate({ business, mappedBusiness }: StandardTemplateProps) {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <BusinessHeader business={mappedBusiness} />
      
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <BusinessShowcase business={mappedBusiness} />

            {/* Upgrade CTA for Basic Templates */}
            {!business.template_key || business.template_key === 'standard' ? (
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-sm overflow-hidden relative group">
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <h3 className="font-semibold text-lg mb-1">Upgrade to a creator mini-site</h3>
                       <p className="text-gray-200 text-sm max-w-md">
                         Get a premium layout, featured products, and a page you can confidently share as your official home.
                       </p>
                    </div>
                    <a 
                      href="/vendor/settings" 
                      className="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
                    >
                      Upgrade profile
                    </a>
                 </div>
                 {/* Decorative background element */}
                 <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500" />
              </div>
            ) : null}
            
            <section id="about" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Studio</h2>
              <div className="prose prose-amber max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {mappedBusiness.description || "No description provided yet."}
                </p>
              </div>
            </section>
            
            <section id="products">
              <BusinessProducts 
                vendorId={business.user_id} 
                vendorProfile={{
                  name: mappedBusiness.name,
                  slug: mappedBusiness.slug,
                  imageUrl: mappedBusiness.logoUrl,
                  isVerified: mappedBusiness.verified // Assuming mappedBusiness has this or we use business.tier
                }}
              />
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
    </main>
  );
}
