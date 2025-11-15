import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BusinessHeader } from '@/components/business/BusinessHeader';
import { BusinessInfo } from '@/components/business/BusinessInfo';
import { BusinessContact } from '@/components/business/BusinessContact';
import { BusinessProducts } from '@/components/business/BusinessProducts';
import { BusinessReviews } from '@/components/business/BusinessReviews';
import { ImageGallery } from '@/components/business/ImageGallery';
import { BusinessShowcase } from '@/components/business/BusinessShowcase';
import { Container } from '@/components/layout/Container';

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;

  // TODO: Replace with actual API call to /api/business/[slug]
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <BusinessHeader business={business} />
      
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <BusinessInfo business={business} />
            
            {/* Image Gallery */}
            {business.images && business.images.length > 0 && (
              <ImageGallery images={business.images} businessName={business.name} />
            )}
            
            {/* Business Showcase */}
            <BusinessShowcase business={business} />
            
            {business.isVendor && business.productCount > 0 && (
              <Suspense fallback={<ProductsSkeleton />}>
                <BusinessProducts businessId={business.id} />
              </Suspense>
            )}
            
            <Suspense fallback={<ReviewsSkeleton />}>
              <BusinessReviews businessId={business.id} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BusinessContact business={business} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

// Mock data function - replace with actual API call
async function getBusinessBySlug(slug: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const mockBusinesses: any = {
    'melbourne-tutoring-hub': {
      id: '1',
      name: 'Melbourne Tutoring Hub',
      description: 'Professional tutoring services for VCE, university entrance and academic support across all subjects. Our experienced tutors have helped hundreds of students achieve their academic goals with personalized learning plans and proven teaching methods.',
      suburb: 'Carlton',
      category: 'Tutoring & Education',
      phone: '+61 3 9123 4567',
      email: 'hello@melbournetutoring.com.au',
      website: 'https://melbournetutoring.com.au',
      address: '123 Lygon Street, Carlton VIC 3053',
      profileImageUrl: null,
      isVendor: true,
      productCount: 12,
      slug: 'melbourne-tutoring-hub',
      verified: true,
      createdAt: '2024-01-15T10:00:00Z',
      businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/melbournetutoringhub',
        instagram: '@melbournetutoring',
        linkedin: 'https://linkedin.com/company/melbourne-tutoring-hub'
      },
      specialties: ['VCE Mathematics', 'English Literature', 'Science Tutoring', 'University Prep'],
      rating: 4.8,
      reviewCount: 127,
      images: [
        {
          id: '1',
          url: '/api/placeholder/800/600?text=Tutoring+Studio',
          alt: 'Melbourne Tutoring Hub main classroom',
          caption: 'Our modern learning environment in Carlton'
        },
        {
          id: '2', 
          url: '/api/placeholder/800/600?text=Study+Materials',
          alt: 'Study materials and resources',
          caption: 'Comprehensive study materials and resources'
        },
        {
          id: '3',
          url: '/api/placeholder/800/600?text=One+on+One',
          alt: 'One-on-one tutoring session',
          caption: 'Personalized one-on-one tutoring sessions'
        }
      ],
      yearsActive: 8,
      clientsServed: 850,
      awards: ['Best Educational Service 2023', 'Community Choice Award'],
      certifications: ['VCE Teaching Certification', 'Educational Excellence Certificate']
    },
    'creative-design-co': {
      id: '3',
      name: 'Creative Design Co',
      description: 'Brand identity, web design and digital marketing solutions for small to medium businesses. We specialize in creating memorable brand experiences that drive growth and customer engagement.',
      suburb: 'Richmond',
      category: 'Design & Creative',
      phone: '+61 3 9876 5432',
      email: 'hello@creativedesignco.com.au',
      website: 'https://creativedesignco.com.au',
      address: '456 Bridge Road, Richmond VIC 3121',
      isVendor: true,
      productCount: 8,
      slug: 'creative-design-co',
      verified: true,
      createdAt: '2024-01-28T09:15:00Z',
      businessHours: {
        monday: '8:30 AM - 5:30 PM',
        tuesday: '8:30 AM - 5:30 PM',
        wednesday: '8:30 AM - 5:30 PM',
        thursday: '8:30 AM - 5:30 PM',
        friday: '8:30 AM - 5:30 PM',
        saturday: 'By appointment',
        sunday: 'Closed'
      },
      specialties: ['Brand Identity', 'Web Design', 'Digital Marketing', 'Logo Design'],
      rating: 4.9,
      reviewCount: 89,
      images: [
        {
          id: '1',
          url: '/api/placeholder/800/600?text=Design+Studio',
          alt: 'Creative Design Co studio workspace',
          caption: 'Our creative studio in Richmond'
        },
        {
          id: '2',
          url: '/api/placeholder/800/600?text=Brand+Work',
          alt: 'Brand design examples',
          caption: 'Examples of our brand design work'
        },
        {
          id: '3',
          url: '/api/placeholder/800/600?text=Team+Collaboration',
          alt: 'Team working on project',
          caption: 'Our collaborative design process'
        }
      ],
      yearsActive: 6,
      clientsServed: 320,
      awards: ['Melbourne Design Awards 2023', 'Creative Excellence Award'],
      certifications: ['Adobe Certified Expert', 'Google Digital Marketing Certificate']
    }
  };

  return mockBusinesses[slug] || null;
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
    title: `${business.name} - ${business.suburb} | SuburbMates`,
    description: business.description || `${business.name} - Local business in ${business.suburb}, Melbourne. ${business.category}.`,
    openGraph: {
      title: `${business.name} - ${business.suburb}`,
      description: business.description,
      type: 'business.business',
      locale: 'en_AU',
      images: business.profileImageUrl ? [business.profileImageUrl] : [],
    },
  };
}