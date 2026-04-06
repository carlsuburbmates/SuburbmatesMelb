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
    <main className="min-h-screen bg-transparent pb-24">
      {/* Full Width Hero for High End - Tesla style */}
      <div className="relative w-full h-[70vh] bg-ink-base overflow-hidden">
        {business.profile_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={business.profile_image_url} 
            alt={business.business_name}
            className="w-full h-full object-cover opacity-40 brightness-75 grayscale hover:grayscale-0 transition-all duration-1000"
          />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-ink-base to-ink-surface-1" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent/20 to-transparent">
           <Container className="h-full flex flex-col justify-end pb-24">
              <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.5em] mb-4 block underline decoration-white/20 underline-offset-8">
                Premium Protocol / {business.category || "Studio"}
              </span>
              <h1 className="text-5xl md:text-8xl font-bold text-ink-primary mb-6 tracking-tighter uppercase leading-none">{business.business_name}</h1>
              <p className="text-ink-secondary text-xl max-w-2xl font-medium tracking-tight leading-relaxed">{business.profile_description}</p>
           </Container>
        </div>
      </div>

      <Container className="py-24">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            <div className="lg:col-span-2 space-y-32">
                <section id="products">
                  <h2 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.4em] mb-12 border-b border-white/10 pb-4">
                    Featured Asset Showcase
                  </h2>
                  <BusinessProducts 
                     vendorId={business.vendor_id}
                     vendorProfile={{
                        name: mappedBusiness.name,
                        slug: mappedBusiness.slug,
                        imageUrl: mappedBusiness.logoUrl,
                        isVerified: mappedBusiness.is_verified 
                     }}
                  />
                  {/* Sharp border illumination effect */}
                  <div className="absolute inset-0 border border-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
                </section>
                
                <section>
                  <h2 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.4em] mb-12 border-b border-white/10 pb-4">
                    Studio Gallery / Visual Proof
                  </h2>
                  <ImageGallery images={business.images || []} />
                </section>

                <section className="bg-ink-surface-1 p-12 rounded-sm border border-white/5">
                  <h2 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.4em] mb-8">
                    The Origin Narrative
                  </h2>
                  <p className="text-ink-secondary leading-relaxed whitespace-pre-wrap text-xl font-light">
                    {business.profile_description || "No description provided yet."}
                  </p>
                </section>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-ink-surface-1 p-8 rounded-sm border border-white/5 sticky top-24 shadow-2xl">
                    <BusinessContact business={mappedBusiness} />
                    <Separator className="my-10 bg-white/5" />
                    <BusinessInfo business={mappedBusiness} />
                    <section className="bg-transparent border-b border-white/10">
                      <p className="text-[9px] text-ink-tertiary text-center uppercase tracking-[0.3em] font-bold opacity-50">
                        Authorized Studio Profile v2.1
                      </p>
                    </section>
                </div>
            </div>
         </div>
      </Container>
    </main>
  );
}
