'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, Search } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard, ProductCardSkeleton } from '@/components/marketplace/ProductCard';
import { Input } from '@/components/ui/input';

interface ProductExtended extends Product {
  download_count?: number;
  image_url?: string | null;
}

interface BusinessProductsProps {
  vendorId?: string;
  businessId?: string;
  limit?: number;
  view?: 'grid' | 'list';
}

export function BusinessProducts({ vendorId, businessId, limit }: BusinessProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const idToUse = vendorId;
      
      if (!idToUse) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/products?vendor_id=${idToUse}`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        // Ensure data exists and is array
        const allProducts = data.products || [];
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [businessId, vendorId]);

  // Filtering
  const filteredProducts = products.filter(product => {
     const titleMatch = product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
     const categoryMatch = product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
     return titleMatch || categoryMatch;
  });

  // Slicing (apply limit after filter if needed, OR before? Usually limit is "latest X", so applied before filter if we only fetched X. But here we fetched all (if limit was undefined in fetch, but our API uses limit...))
  // Wait, if I pass limit to BusinessProducts component (e.g. 6), the API fetch was NOT using it in previous code?
  // Previous code: `const allProducts = data.products || []; setProducts(limit ? allProducts.slice(0, limit) : allProducts);`
  // But wait, the API call should probably limit it IF we don't want to filter all of them? 
  // But if we want to Search, we need ALL products.
  // PR8 says: "Search/Filter within the vendor's own products"
  // If I only fetch 6, I can't search effectively.
  // So if `limit` is present (Dashboard/Profile preview), maybe Search is disabled?
  // Or I fetch all and slice for display?
  // Let's assume if limit is present, we are in "Preview Mode" (no search).
  // If no limit (Shop Tab), we enable Search.

  const isPreview = !!limit;
  const displayProducts = isPreview ? products.slice(0, limit) : filteredProducts;

  if (loading) {
     return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
               <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(limit || 3)].map((_, i) => (
                  <div key={i} className="h-64"><ProductCardSkeleton /></div>
               ))}
            </div>
        </div>
     );
  }

  if (products.length === 0) {
     // Only hide if NOT searching (no products at all)
     // If searching and no results, show "No results".
     // But here products.length 0 means vendor has no products.
    return null; 
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Digital Products</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {products.length}
          </span>
        </div>
        
        {/* Only show Search filter if NOT in preview mode and we have enough products to warrant search (e.g. > 4) */}
        {!isPreview && products.length > 4 && (
            <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
               <Input 
                  placeholder="Search products..." 
                  className="pl-9 h-9 text-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
        )}

        {/* View All Link (only if preview) */}
        {isPreview && (
            <Link 
            href={`/marketplace?vendor=${businessId}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 whitespace-nowrap"
            >
            <span>View All</span>
            <ExternalLink className="w-3 h-3" />
            </Link>
        )}
      </div>

      {displayProducts.length === 0 && searchQuery && (
          <div className="text-center py-12 text-gray-500">
              No products match &quot;{searchQuery}&quot;
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <div key={product.id} className="h-full">
               <ProductCard 
                product={{
                  ...product,
                  slug: product.slug || '',
                  downloadCount: (product as ProductExtended).download_count || 0,
                  rating: 4.5,
                  category: product.category || 'Digital',
                  isFeatured: false,
                  imageUrl: product.thumbnail_url || (product as ProductExtended).image_url || undefined
                }} 
                showVendor={false} 
               />
          </div>
        ))}
      </div>
    </div>
  );
}
