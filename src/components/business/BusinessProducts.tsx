'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ExternalLink, Star, Download } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  downloadCount: number;
  rating: number;
  slug: string;
  isFeatured: boolean;
}

interface BusinessProductsProps {
  businessId: string;
}

export function BusinessProducts({ businessId }: BusinessProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call to /api/products?vendor_id=${businessId}
    const fetchProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Mock products data
      const mockProducts: Product[] = [
        {
          id: '1',
          title: 'VCE Mathematics Study Guide',
          description: 'Comprehensive study guide covering all VCE Mathematics topics with practice questions and solutions.',
          price: 2500, // $25.00 in cents
          imageUrl: '/api/placeholder/300/200',
          category: 'Study Guides',
          downloadCount: 342,
          rating: 4.8,
          slug: 'vce-mathematics-study-guide',
          isFeatured: true
        },
        {
          id: '2',
          title: 'English Literature Essay Templates',
          description: 'Professional essay templates and structure guides for VCE English Literature students.',
          price: 1500, // $15.00 in cents
          category: 'Templates',
          downloadCount: 156,
          rating: 4.6,
          slug: 'english-literature-essay-templates',
          isFeatured: false
        },
        {
          id: '3',
          title: 'University Entrance Exam Prep',
          description: 'Complete preparation package for university entrance exams including practice tests.',
          price: 4900, // $49.00 in cents
          category: 'Exam Prep',
          downloadCount: 89,
          rating: 4.9,
          slug: 'university-entrance-exam-prep',
          isFeatured: false
        },
        {
          id: '4',
          title: 'Science Study Notes Bundle',
          description: 'Detailed study notes for Biology, Chemistry, and Physics with diagrams and explanations.',
          price: 3500, // $35.00 in cents
          category: 'Study Notes',
          downloadCount: 203,
          rating: 4.7,
          slug: 'science-study-notes-bundle',
          isFeatured: false
        }
      ];

      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [businessId]);

  if (loading) {
    return <ProductsSkeleton />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Digital Products</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>
        
        <Link 
          href={`/marketplace?vendor=${businessId}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
        >
          <span>View All Products</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-video bg-gray-100 relative">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Download className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {product.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Featured
            </span>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Downloads */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span>{product.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{product.downloadCount} downloads</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
