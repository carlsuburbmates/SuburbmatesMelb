'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

interface BusinessReviewsProps {
  businessId: string;
}

export function BusinessReviews({ businessId }: BusinessReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // TODO: Replace with actual API call to /api/reviews?business_id=${businessId}
    const fetchReviews = async () => {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: '1',
          customerName: 'Sarah M.',
          rating: 5,
          comment: 'Excellent tutoring service! My daughter\'s grades improved significantly after just a few sessions. The tutors are very professional and explain concepts clearly.',
          createdAt: '2024-03-15T10:00:00Z',
          helpful: 8,
          verified: true
        },
        {
          id: '2',
          customerName: 'David L.',
          rating: 5,
          comment: 'Highly recommend! They helped me prepare for my university entrance exams. The study materials are comprehensive and the one-on-one sessions were incredibly helpful.',
          createdAt: '2024-03-10T14:30:00Z',
          helpful: 5,
          verified: true
        },
        {
          id: '3',
          customerName: 'Jennifer K.',
          rating: 4,
          comment: 'Great service overall. The tutors are knowledgeable and patient. My son really enjoyed the sessions and his confidence in mathematics has improved a lot.',
          createdAt: '2024-03-05T16:45:00Z',
          helpful: 3,
          verified: false
        },
        {
          id: '4',
          customerName: 'Michael R.',
          rating: 5,
          comment: 'Outstanding! They offer flexible scheduling which was perfect for our busy family. The results speak for themselves - my daughter achieved her target ATAR.',
          createdAt: '2024-02-28T11:20:00Z',
          helpful: 12,
          verified: true
        },
        {
          id: '5',
          customerName: 'Lisa T.',
          rating: 4,
          comment: 'Very professional and well-organized. The tutors provide regular progress updates which I appreciate. Good value for money.',
          createdAt: '2024-02-20T09:15:00Z',
          helpful: 2,
          verified: true
        }
      ];

      const avgRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
      
      setReviews(mockReviews);
      setAverageRating(avgRating);
      setLoading(false);
    };

    fetchReviews();
  }, [businessId]);

  if (loading) {
    return <ReviewsSkeleton />;
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">Be the first to leave a review for this business!</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            {renderStars(Math.round(averageRating), 'md')}
          </div>
          <p className="text-gray-600">
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2 text-sm">
              <span className="w-3 text-gray-600">{rating}</span>
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-400 h-2 rounded-full"
                  style={{
                    width: `${reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <span className="w-6 text-gray-600 text-right">
                {ratingDistribution[rating as keyof typeof ratingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {review.customerName.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {review.customerName}
                    </h4>
                    {review.verified && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 leading-relaxed mb-3">
                  {review.comment}
                </p>

                {/* Review Actions */}
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                <div className="w-6 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
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