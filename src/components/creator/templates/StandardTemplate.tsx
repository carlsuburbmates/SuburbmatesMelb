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
    <main className="min-h-screen pb-24" style={{ background: "transparent" }}>
      <BusinessHeader business={mappedBusiness} />

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            {/* About */}
            <section id="about" className="max-w-3xl">
              <h2 className="text-xs font-semibold mb-6" style={{ color: "var(--accent-atmosphere)" }}>Studio Profile</h2>
              <p className="text-xl leading-relaxed font-medium" style={{ color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
                {mappedBusiness.description || "Digital creator & professional services based in Melbourne."}
              </p>
            </section>

            {/* Products */}
            <section id="products">
              <div className="mb-8">
                <h2 className="text-xs font-semibold mb-1" style={{ color: "var(--accent-atmosphere)" }}>Featured Digital Works</h2>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Discovery-first product feed</p>
              </div>
              <BusinessProducts
                vendorId={business.vendor_id}
                vendorProfile={{ name: mappedBusiness.name, slug: mappedBusiness.slug, imageUrl: mappedBusiness.logoUrl, isVerified: mappedBusiness.is_verified }}
              />
            </section>

            {/* Gallery */}
            <section id="gallery">
              <ImageGallery images={business.images || []} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <BusinessContact business={mappedBusiness} />
              <BusinessInfo business={mappedBusiness} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
