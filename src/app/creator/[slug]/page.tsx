import { notFound } from 'next/navigation';
import { BusinessProfileRenderer } from '@/components/creator/templates/BusinessProfileRenderer';
import { ClaimButton } from '@/components/creator/ClaimButton';

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface BusinessImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface BusinessData {
  id: string;
  owner_user_id?: string;
  name: string;
  description: string;
  region: string;
  category: string;
  slug: string;
  vendorId?: string;
  productCount: number;
  is_verified: boolean;
  createdAt: string;
  profileImageUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  businessHours: Record<string, unknown>;
  specialties: string[];
  socialMedia: Record<string, string>;
  images: BusinessImage[];
}

function normalizeBusinessData(raw: Record<string, unknown>): BusinessData {
  const toStringValue = (value: unknown, fallback = ""): string =>
    typeof value === "string" ? value : fallback;
  const toNumberValue = (value: unknown, fallback = 0): number =>
    typeof value === "number"
      ? value
      : typeof value === "string" && !Number.isNaN(Number(value))
      ? Number(value)
      : fallback;

  const businessHours =
    raw.businessHours && typeof raw.businessHours === "object"
      ? (raw.businessHours as Record<string, unknown>)
      : {};

  const socialMedia =
    raw.socialMedia && typeof raw.socialMedia === "object"
      ? (Object.entries(raw.socialMedia) as Array<[string, unknown]>).reduce(
          (acc, [key, value]) => {
            if (typeof value === "string") {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>
        )
      : {};

  const specialties = Array.isArray(raw.specialties)
    ? raw.specialties.filter((item): item is string => typeof item === "string")
    : [];

  const images: BusinessImage[] = Array.isArray(raw.images)
    ? raw.images
        .filter((img): img is string | Record<string, unknown> => Boolean(img))
        .map((value, index) => {
          if (typeof value === "string") {
            return {
              id: `${raw.id ?? "image"}-${index}`,
              url: value,
              alt: `${raw.name ?? "Business"} image ${index + 1}`,
            };
          }

          const record = value as Record<string, unknown>;
          const url = typeof record.url === "string" ? record.url : "";
          return {
            id:
              typeof record.id === "string"
                ? record.id
                : `${raw.id ?? "image"}-${index}`,
            url,
            alt:
              typeof record.alt === "string"
                ? record.alt
                : `${raw.name ?? "Business"} image ${index + 1}`,
            caption:
              typeof record.caption === "string"
                ? record.caption
                : undefined,
          };
        })
    : [];

  return {
    id: toStringValue(raw.id, ""),
    owner_user_id: typeof raw.owner_user_id === "string" ? raw.owner_user_id : undefined,
    name: toStringValue(raw.name, "Business"),
    description: toStringValue(raw.description, ""),
    region: toStringValue(raw.region, "Melbourne"),
    category: toStringValue(raw.category, "General"),
    slug: toStringValue(raw.slug, ""),
    vendorId: typeof raw.vendorId === "string" ? raw.vendorId : undefined,
    productCount: toNumberValue(raw.productCount, 0),
    is_verified: raw.is_verified === true,
    createdAt: toStringValue(raw.createdAt, ""),
    profileImageUrl: typeof raw.profileImageUrl === "string" ? raw.profileImageUrl : undefined,
    phone: typeof raw.phone === "string" ? raw.phone : undefined,
    email: typeof raw.email === "string" ? raw.email : undefined,
    website: typeof raw.website === "string" ? raw.website : undefined,
    address: typeof raw.address === "string" ? raw.address : undefined,
    businessHours,
    specialties,
    socialMedia,
    images,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;

  // Fetch business data from API
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

   // Map BusinessData to BusinessProfileExtended
   const extendedProfile = {
     id: business.id,
     business_name: business.name,
     profile_description: business.description,
     profile_image_url: business.profileImageUrl,
     created_at: business.createdAt,
     user_id: "",
      vendor_id: business.vendorId,
      region: business.region,
      category: business.category,
      email: business.email,
      phone: business.phone,
     website: business.website,
     address: business.address,
      product_count: business.productCount,
      is_verified: business.is_verified,
      images: business.images,
      slug: business.slug,
      business_hours: business.businessHours as Record<string, string>,
      specialties: business.specialties,
     social_media: business.socialMedia
   };

  const category = business.category || "General";
  const glowColors = category.includes("Design") 
    ? ["rgba(180, 120, 60, 0.08)", "rgba(100, 80, 140, 0.07)"]
    : category.includes("Technology") || category.includes("Software")
    ? ["rgba(60, 120, 180, 0.08)", "rgba(80, 140, 120, 0.07)"]
    : ["rgba(180, 120, 60, 0.08)", "rgba(80, 100, 140, 0.07)"];

  return (
    <div className="min-h-screen bg-ink-base relative overflow-hidden">
      {/* Radial ambient glows — category-aware depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            `radial-gradient(ellipse 70% 50% at 15% 20%, ${glowColors[0]} 0%, transparent 65%)`,
            `radial-gradient(ellipse 60% 45% at 85% 10%, ${glowColors[1]} 0%, transparent 60%)`,
            "radial-gradient(ellipse 80% 40% at 50% 60%, rgba(60, 100, 90, 0.05) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10">
        <BusinessProfileRenderer 
          business={extendedProfile} 
          slug={slug}
        />

        {/* Claim entry point — only visible to authenticated users who don't own this listing */}
        <div className="max-w-5xl mx-auto px-6 pb-16 flex justify-end">
          <ClaimButton
            businessProfileId={business.id}
            listingName={business.name}
            ownerId={business.owner_user_id ?? ''}
          />
        </div>
      </div>
    </div>
  );
}

// Fetch business data from API
async function getBusinessBySlug(slug: string): Promise<BusinessData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/creator/${slug}`, {
      cache: 'no-store', // Ensure fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.business ? normalizeBusinessData(data.business) : null;
  } catch (error) {
    console.error('Error fetching business data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: 'Creator Not Found - Suburbmates',
    };
  }

  return {
    title: `${business.name} - ${business.region || 'Melbourne'} | Suburbmates`,
    description: business.description || `${business.name} - Local creator in ${business.region || 'Melbourne'}, Melbourne. ${business.category || 'Portfolio'}.`,
    openGraph: {
      title: `${business.name} - ${business.region || 'Melbourne'}`,
      description: business.description,
      type: 'profile',
      locale: 'en_AU',
      images: business.profileImageUrl
        ? [
            {
              id: `${business.id}-hero`,
              url: business.profileImageUrl,
              alt: `${business.name} profile image`,
            },
          ]
        : [],
    },
  };
}
