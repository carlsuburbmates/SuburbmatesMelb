'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, ExternalLink, Clock, Phone, Globe } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { LazyBusinessCard } from '@/components/ui/LazyBusinessCard';

interface Business {
  id: string;
  name: string;
  description?: string;
  suburb: string;
  category: string;
  phone?: string;
  website?: string;
  profileImageUrl?: string;
  isVendor: boolean;
  productCount: number;
  slug: string;
  verified: boolean;
  createdAt: string;
}

interface DirectoryListingProps {
  suburb?: string;
  category?: string;
  search?: string;
  page: number;
}

const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Melbourne Tutoring Hub',
    description: 'Professional tutoring services for VCE, university entrance and academic support across all subjects.',
    suburb: 'Carlton',
    category: 'tutoring',
    phone: '+61 3 9123 4567',
    website: 'https://melbournetutoring.com.au',
    isVendor: true,
    productCount: 12,
    slug: 'melbourne-tutoring-hub',
    verified: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Inner City Yoga Studio',
    description: 'Holistic yoga and wellness center offering classes, workshops and retreats in the heart of Fitzroy.',
    suburb: 'Fitzroy',
    category: 'fitness',
    phone: '+61 3 9876 5432',
    isVendor: false,
    productCount: 0,
    slug: 'inner-city-yoga',
    verified: false,
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Creative Design Co',
    description: 'Brand identity, web design and digital marketing solutions for small to medium businesses.',
    suburb: 'Richmond',
    category: 'design',
    website: 'https://creativedesignco.com.au',
    isVendor: true,
    productCount: 8,
    slug: 'creative-design-co',
    verified: true,
    createdAt: '2024-01-28T09:15:00Z'
  },
  {
    id: '4',
    name: 'Brunswick Business Consulting',
    description: 'Strategic business consulting, startup mentoring and growth planning for Melbourne entrepreneurs.',
    suburb: 'Brunswick',
    category: 'consulting',
    phone: '+61 3 9555 1234',
    website: 'https://brunswickbusiness.com.au',
    isVendor: true,
    productCount: 5,
    slug: 'brunswick-consulting',
    verified: true,
    createdAt: '2024-03-05T11:45:00Z'
  },
  {
    id: '5',
    name: 'South Yarra Photography',
    description: 'Wedding, portrait and event photography with over 10 years experience in Melbourne.',
    suburb: 'South Yarra',
    category: 'photography',
    phone: '+61 3 9888 7777',
    isVendor: false,
    productCount: 0,
    slug: 'south-yarra-photography',
    verified: false,
    createdAt: '2024-02-12T16:20:00Z'
  },
  {
    id: '6',
    name: 'Tech Solutions Melbourne',
    description: 'Custom software development, IT consulting and digital transformation for businesses.',
    suburb: 'Collingwood',
    category: 'technology',
    website: 'https://techsolutionsmelb.com.au',
    isVendor: true,
    productCount: 15,
    slug: 'tech-solutions-melbourne',
    verified: true,
    createdAt: '2024-01-10T08:30:00Z'
  }
];

export function DirectoryListing({ suburb, category, search, page }: DirectoryListingProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 12;
  const cardsAnimation = useStaggeredAnimation(businesses.length, 100);

  useEffect(() => {
    // Simulate API call - replace with actual API call to /api/business
    const fetchBusinesses = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data based on search criteria
      let filteredBusinesses = MOCK_BUSINESSES;
      
      if (search) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.name.toLowerCase().includes(search.toLowerCase()) ||
          business.description?.toLowerCase().includes(search.toLowerCase()) ||
          business.category.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (category) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.category === category
        );
      }
      
      if (suburb) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.suburb.toLowerCase() === suburb.toLowerCase()
        );
      }
      
      // Pagination
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + itemsPerPage);
      
      setBusinesses(paginatedBusinesses);
      setTotalCount(filteredBusinesses.length);
      setLoading(false);
    };

    fetchBusinesses();
  }, [suburb, category, search, page]);

  if (loading) {
    return <DirectoryListingSkeleton />;
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search criteria or explore different suburbs and categories.
        </p>
        <Link href="/directory" className="btn-primary">
          Browse All Businesses
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {businesses.length} of {totalCount} businesses
          {suburb && <span> in {suburb}</span>}
          {category && <span> in {category}</span>}
        </p>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Updated daily</span>
        </div>
      </div>

      {/* Business Cards */}
      <div 
        ref={cardsAnimation.containerRef}
        className="grid gap-6"
      >
        {businesses.map((business, index) => (
          <div 
            key={business.id}
            className={cardsAnimation.getItemClassName(index)}
          >
            <BusinessCard business={business} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <DirectoryPagination 
          currentPage={page}
          totalPages={totalPages}
          suburb={suburb}
          category={category}
          search={search}
        />
      )}
    </div>
  );
}

function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        {/* Business Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {business.profileImageUrl ? (
              <img 
                src={business.profileImageUrl} 
                alt={business.name}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-gray-600">
                {business.name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Business Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {business.name}
                </h3>
                {business.verified && (
                  <div className="flex-shrink-0">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                  </div>
                )}
                {business.isVendor && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Marketplace Vendor
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{business.suburb}</span>
                </div>
                <span className="capitalize">{business.category}</span>
                {business.isVendor && business.productCount > 0 && (
                  <span>{business.productCount} products</span>
                )}
              </div>

              {business.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {business.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="flex items-center space-x-4 text-sm">
                {business.phone && (
                  <a 
                    href={`tel:${business.phone}`}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{business.phone}</span>
                  </a>
                )}
                {business.website && (
                  <a 
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0 ml-4">
              <Link
                href={`/business/${business.slug}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectoryPagination({ 
  currentPage, 
  totalPages, 
  suburb, 
  category, 
  search 
}: {
  currentPage: number;
  totalPages: number;
  suburb?: string;
  category?: string;
  search?: string;
}) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (suburb) params.set('suburb', suburb);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (page > 1) params.set('page', page.toString());
    
    return `/directory?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link 
          href={createPageUrl(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Previous
        </Link>
      )}

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        const isActive = pageNum === currentPage;
        
        return (
          <Link
            key={pageNum}
            href={createPageUrl(pageNum)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link 
          href={createPageUrl(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </div>
  );
}

function DirectoryListingSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}