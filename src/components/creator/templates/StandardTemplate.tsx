import { BusinessHeader } from "../BusinessHeader";
import { BusinessInfo } from "../BusinessInfo";
import { BusinessContact } from "../BusinessContact";
import { BusinessProducts } from "../BusinessProducts";
import { ImageGallery } from "../ImageGallery";
import { Container } from "@/components/layout/Container";
import { BusinessProfileExtended, MappedBusinessProfile } from "@/lib/types";

interface StandardTemplateProps {
  business: BusinessProfileExtended;
  mappedBusiness: MappedBusinessProfile;
}

export function StandardTemplate({ business, mappedBusiness }: StandardTemplateProps) {
  return (
    <main className="min-h-screen bg-transparent pb-24">
      {/* Tesla-style minimal header */}
      <BusinessHeader business={mappedBusiness} />
      
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content (3 cols) */}
          <div className="lg:col-span-3 space-y-20">
            
            {/* High-Density About Section */}
            <section id="about" className="max-w-3xl">
              <h2 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.3em] mb-8 border-b border-white/20 pb-2 inline-block">
                Studio Profile
              </h2>
              <div className="max-w-none">
                <p className="text-xl text-ink-primary font-medium leading-relaxed tracking-tight whitespace-pre-wrap">
                  {mappedBusiness.description || "Digital creator & professional services based in Melbourne."}
                </p>
              </div>
            </section>
            
            {/* Products / Discovery Grid */}
            <section id="products">
              <div className="mb-12">
                <h2 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.3em] mb-2">
                  Featured Digital Works
                </h2>
                <p className="text-sm text-ink-tertiary font-medium uppercase tracking-widest">Discovery-first product feed</p>
              </div>
              <BusinessProducts 
                vendorId={business.vendor_id} 
                vendorProfile={{
                  name: mappedBusiness.name,
                  slug: mappedBusiness.slug,
                  imageUrl: mappedBusiness.logoUrl,
                  isVerified: mappedBusiness.is_verified
                }}
              />
            </section>
            
            {/* Minimal Gallery */}
            <section id="gallery">
               <ImageGallery images={business.images || []} />
            </section>
          </div>

          {/* Sidebar (1 col) - High Density Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-12">
              <BusinessContact business={mappedBusiness} />
              <BusinessInfo business={mappedBusiness} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
