'use client';

import { TrendingUp, Eye, Phone, Mail, ExternalLink, MessageCircle } from 'lucide-react';
import { useFadeIn } from '@/hooks/useScrollAnimation';

interface AnalyticsData {
  views: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  contacts: {
    total: number;
    thisMonth: number;
    types: {
      phone: number;
      email: number;
      website: number;
      form: number;
    };
  };
  engagement: {
    averageTime: string;
    bounceRate: number;
    returnVisitors: number;
  };
}

interface BusinessAnalyticsProps {
  businessId: string;
  isOwner?: boolean;
}

export function BusinessAnalytics({ businessId, isOwner = false }: BusinessAnalyticsProps) {
  const animation = useFadeIn({ delay: 200, duration: 600 });

  // Mock analytics data - in production this would come from actual analytics
  const analyticsData: AnalyticsData = {
    views: {
      total: 2847,
      thisMonth: 342,
      growth: 15.3
    },
    contacts: {
      total: 89,
      thisMonth: 12,
      types: {
        phone: 34,
        email: 28,
        website: 19,
        form: 8
      }
    },
    engagement: {
      averageTime: '2m 34s',
      bounceRate: 32,
      returnVisitors: 23
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div 
      ref={animation.elementRef as any}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${animation.className}`}
      style={animation.style}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Business Analytics</h3>
        </div>
        <span className="text-sm text-gray-500">Last 30 days</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Profile Views</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{analyticsData.views.thisMonth}</div>
          <div className="flex items-center space-x-1 text-sm text-blue-700">
            <span>+{analyticsData.views.growth}%</span>
            <span>from last month</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Contact Requests</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{analyticsData.contacts.thisMonth}</div>
          <div className="text-sm text-green-700">
            {analyticsData.contacts.total} total contacts
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Engagement</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{analyticsData.engagement.averageTime}</div>
          <div className="text-sm text-purple-700">
            Average visit duration
          </div>
        </div>
      </div>

      {/* Contact Breakdown */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Contact Method Breakdown</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Phone Calls</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(analyticsData.contacts.types.phone / analyticsData.contacts.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">
                {analyticsData.contacts.types.phone}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Email</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(analyticsData.contacts.types.email / analyticsData.contacts.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">
                {analyticsData.contacts.types.email}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Website Visits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(analyticsData.contacts.types.website / analyticsData.contacts.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">
                {analyticsData.contacts.types.website}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Contact Form</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${(analyticsData.contacts.types.form / analyticsData.contacts.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">
                {analyticsData.contacts.types.form}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Performance Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bounce Rate:</span>
            <span className="font-medium text-gray-900">{analyticsData.engagement.bounceRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Return Visitors:</span>
            <span className="font-medium text-gray-900">{analyticsData.engagement.returnVisitors}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Profile Views:</span>
            <span className="font-medium text-gray-900">{analyticsData.views.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Conversion Rate:</span>
            <span className="font-medium text-gray-900">3.5%</span>
          </div>
        </div>
      </div>
    </div>
  );
}