import { Clock, MapPin, Calendar, Tag } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  description: string;
  suburb: string;
  category: string;
  address?: string;
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  specialties?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: string;
}

interface BusinessInfoProps {
  business: Business;
}

export function BusinessInfo({ business }: BusinessInfoProps) {
  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About {business.name}</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed">{business.description}</p>
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          {business.address && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600">{business.address}</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="flex items-start space-x-3">
            <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Category</h3>
              <p className="text-gray-600">{business.category}</p>
            </div>
          </div>

          {/* Established */}
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Established</h3>
              <p className="text-gray-600">
                {new Date(business.createdAt).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      {business.businessHours && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Business Hours</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(business.businessHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-900 capitalize">
                  {day}
                </span>
                <span className="text-gray-600">
                  {hours || 'Closed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialties */}
      {business.specialties && business.specialties.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {business.specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Media */}
      {business.socialMedia && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            {business.socialMedia.facebook && (
              <a
                href={business.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Facebook
              </a>
            )}
            {business.socialMedia.instagram && (
              <a
                href={`https://instagram.com/${business.socialMedia.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
              >
                Instagram
              </a>
            )}
            {business.socialMedia.linkedin && (
              <a
                href={business.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}