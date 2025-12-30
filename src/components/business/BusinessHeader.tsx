import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, MapPin, Clock, Globe, Phone, Mail, Check } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Business {
  id: string;
  name: string;
  description: string;
  suburb: string;
  category: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  profileImageUrl?: string;
  isVendor: boolean;
  productCount: number;
  verified: boolean;
  rating?: number;
  reviewCount?: number;
}

interface BusinessHeaderProps {
  business: Business;
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <Container className="py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link 
            href="/directory"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Business Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              {business.profileImageUrl ? (
                <Image
                  src={business.profileImageUrl}
                  alt={business.name}
                  width={128}
                  height={128}
                  className="w-full h-full rounded-lg object-cover"
                  sizes="(min-width: 768px) 8rem, 6rem"
                />
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-gray-600">
                  {business.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                {/* Title and Badges */}
                <div className="flex items-start space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {business.name}
                  </h1>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0 mt-1">
                    {business.verified && (
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full" title="ABN Verified">
                        <Check className="w-3 h-3 text-blue-500" />
                      </div>
                    )}
                    {business.isVendor && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Marketplace Seller
                      </span>
                    )}
                  </div>
                </div>

                {/* Location and Category */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{business.suburb}, Melbourne</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{business.category}</span>
                  </div>
                </div>

                {/* Rating */}
                {business.rating && business.reviewCount && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-amber-400 fill-current" />
                      <span className="font-semibold text-gray-900">{business.rating}</span>
                    </div>
                    <span className="text-gray-600">
                      ({business.reviewCount} reviews)
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-700 leading-relaxed max-w-3xl">
                  {business.description}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-8">
                <div className="flex flex-row flex-wrap md:flex-col gap-3">
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  )}
                  
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  )}
                  
                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
