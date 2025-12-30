import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BusinessHeader } from '@/components/business/BusinessHeader';
import { BusinessInfo } from '@/components/business/BusinessInfo';
import { BusinessContact } from '@/components/business/BusinessContact';
import { BusinessProducts } from '@/components/business/BusinessProducts';
import { BusinessReviews } from '@/components/business/BusinessReviews';
import { StickyActionBar } from '@/components/business/StickyActionBar';
import { ImageGallery } from '@/components/business/ImageGallery';
import { BusinessShowcase } from '@/components/business/BusinessShowcase';
import { Container } from '@/components/layout/Container';
import { BusinessProfileRenderer } from '@/components/business/templates/BusinessProfileRenderer';

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
  name: string;
  description: string;
  suburb: string;
  category: string;
  slug: string;
  isVendor: boolean;
  vendorId?: string;
  productCount: number;
  verified: boolean;
  tier: string;
  createdAt: string;
  profileImageUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  businessHours: Record<string, unknown>;
  specialties: string[];
  socialMedia: Record<string, string>;
  rating: number;
  reviewCount: number;
  images: BusinessImage[];
  templateKey?: string;
  themeConfig?: Record<string, unknown>;
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
    name: toStringValue(raw.name, "Business"),
    description: toStringValue(raw.description, ""),
    suburb: toStringValue(raw.suburb, "Melbourne"),
    category: toStringValue(raw.category, "General"),
    slug: toStringValue(raw.slug, ""),
    isVendor: raw.isVendor === true,
    vendorId: typeof raw.vendorId === "string" ? raw.vendorId : undefined,
    productCount: toNumberValue(raw.productCount, 0),
    verified: raw.verified === true,
    tier: toStringValue(raw.tier, "basic"),
    createdAt: toStringValue(raw.createdAt, ""),
    profileImageUrl: typeof raw.profileImageUrl === "string" ? raw.profileImageUrl : undefined,
    phone: typeof raw.phone === "string" ? raw.phone : undefined,
    email: typeof raw.email === "string" ? raw.email : undefined,
    website: typeof raw.website === "string" ? raw.website : undefined,
    address: typeof raw.address === "string" ? raw.address : undefined,
    businessHours,
    specialties,
    socialMedia,
    rating: toNumberValue(raw.rating, 0),
    reviewCount: toNumberValue(raw.reviewCount, 0),
    images,
    templateKey: typeof raw.templateKey === "string" ? raw.templateKey : undefined,
    themeConfig: raw.themeConfig && typeof raw.themeConfig === "object" ? (raw.themeConfig as Record<string, unknown>) : undefined,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;

  // Fetch business data from API
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <BusinessProfileRenderer 
      business={business} 
      templateKey={business.templateKey || "standard"} 
      themeConfig={business.themeConfig} 
    />
  );
}

// Fetch business data from API
async function getBusinessBySlug(slug: string): Promise<BusinessData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/business/${slug}`, {
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

function ProductsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-32 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: 'Business Not Found - SuburbMates',
    };
  }

  return {
    title: `${business.name} - ${business.suburb || 'Melbourne'} | SuburbMates`,
    description: business.description || `${business.name} - Local business in ${business.suburb || 'Melbourne'}, Melbourne. ${business.category || 'Services'}.`,
    openGraph: {
      title: `${business.name} - ${business.suburb || 'Melbourne'}`,
      description: business.description,
      type: 'business.business',
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
