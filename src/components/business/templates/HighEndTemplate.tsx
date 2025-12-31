import { BusinessInfo } from "../BusinessInfo";
import { BusinessContact } from "../BusinessContact";
import { BusinessProducts } from "../BusinessProducts";
import { ImageGallery } from "../ImageGallery";
import { Container } from "@/components/layout/Container";
import { Separator } from "@/components/ui/separator";
import { BusinessProfileExtended, MappedBusinessProfile } from "@/lib/types";

interface HighEndTemplateProps {
  business: BusinessProfileExtended;
  mappedBusiness: MappedBusinessProfile;
}

export function HighEndTemplate({ business, mappedBusiness }: HighEndTemplateProps) {
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
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Featured Showcase</h2>
                  <BusinessProducts vendorId={business.user_id} limit={6} view="grid" />
                </section>
                
                <section>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Studio Gallery</h2>
                  <ImageGallery images={business.images || []} />
                </section>

                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Our Story</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                    {business.profile_description || "No description provided yet."}
                  </p>
                </section>
            </div>

            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                    <BusinessContact business={mappedBusiness} />
                    <Separator className="my-6" />
                    <BusinessInfo business={mappedBusiness} />
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-xs text-gray-400 text-center uppercase tracking-widest font-semibold">
                        Premium Studio Profile
                      </p>
                    </div>
                </div>
            </div>
         </div>
      </Container>
    </main>
  );
}
