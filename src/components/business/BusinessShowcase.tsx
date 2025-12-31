'use client';

import { Award, TrendingUp, Users } from 'lucide-react';
import { useFadeIn, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { MappedBusinessProfile } from "@/lib/types";

interface BusinessShowcaseProps {
  business: MappedBusinessProfile;
}

export function BusinessShowcase({ business }: BusinessShowcaseProps) {
  const headerAnimation = useFadeIn<HTMLDivElement>({ delay: 100, duration: 700 });
  const statsAnimation = useStaggeredAnimation<HTMLDivElement>(4, 150);

  const defaultAchievements = [
    {
      icon: '⭐',
      title: 'Customer Rating',
      value: business.rating ? `${business.rating}/5` : '4.8/5',
      description: `Based on ${business.reviewCount || 127} reviews`
    },
    {
      icon: '👥', 
      title: 'Clients Served',
      value: business.clientsServed ? `${business.clientsServed}+` : '200+',
      description: 'Happy customers across Melbourne'
    },
    {
      icon: '📅',
      title: 'Years of Experience',
      value: business.yearsActive ? `${business.yearsActive}+` : '5+',
      description: 'Years serving the community'
    },
    {
      icon: '🏆',
      title: 'Success Rate',
      value: '95%+',
      description: 'Customer satisfaction rate'
    }
  ];

  const achievements = business.achievements || defaultAchievements;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div 
        ref={headerAnimation.elementRef}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${headerAnimation.className}`}
        style={headerAnimation.style}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Business Showcase</h3>
          {business.verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified Business
            </span>
          )}
        </div>
        
        <p className="text-gray-600">
          {business.name} has established itself as a trusted provider in the Melbourne community, 
          delivering exceptional service and building lasting relationships with customers.
        </p>
      </div>

      {/* Key Statistics */}
      <div 
        ref={statsAnimation.containerRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${statsAnimation.getItemClassName(index)}`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">{achievement.value}</div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Awards and Certifications */}
      {(business.awards || business.certifications) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span>Recognition & Certifications</span>
          </h4>
          
          <div className="space-y-4">
            {business.awards && business.awards.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Awards</h5>
                <div className="flex flex-wrap gap-2">
                  {business.awards.map((award, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                    >
                      🏆 {award}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {business.certifications && business.certifications.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Certifications</h5>
                <div className="flex flex-wrap gap-2">
                  {business.certifications.map((cert, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      📜 {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-green-500" />
          <span>Why Customers Choose {business.name}</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">✅</span>
            </div>
            <h5 className="font-medium text-gray-900 mb-1">Reliable Service</h5>
            <p className="text-sm text-gray-600">Consistent quality and on-time delivery</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🤝</span>
            </div>
            <h5 className="font-medium text-gray-900 mb-1">Local Expertise</h5>
            <p className="text-sm text-gray-600">Deep understanding of Melbourne market</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">💎</span>
            </div>
            <h5 className="font-medium text-gray-900 mb-1">Premium Quality</h5>
            <p className="text-sm text-gray-600">Exceptional results that exceed expectations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
