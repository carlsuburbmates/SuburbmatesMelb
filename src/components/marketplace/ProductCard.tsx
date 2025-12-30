import Link from 'next/link';
import Image from 'next/image';
import { Download, Star, ExternalLink, Check } from 'lucide-react';
import { Product, BusinessProfile } from '@/lib/types'; // Assuming types exist or I'll define compatible ones

interface ProductCardProps {
  product: Product & {
    slug?: string;
    downloadCount?: number;
    rating?: number;
    category?: string;
    isFeatured?: boolean;
    imageUrl?: string; // mapping from thumbnail_url or image_url
  };
  vendor?: {
    name: string;
    slug: string;
    imageUrl?: string;
    isVerified?: boolean;
  };
  showVendor?: boolean;
}

export function ProductCard({ product, vendor, showVendor = false }: ProductCardProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(cents / 100);
  };

  // Determine image source
  const imageSrc = product.imageUrl || product.thumbnail_url;

  return (
    <div className="group border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(min-width: 768px) 50vw, (min-width: 1200px) 33vw, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Download className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {product.published && product.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shadow-sm">
              Featured
            </span>
          </div>
        )}
        
        {product.category && (
            <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur text-gray-800 shadow-sm border border-gray-100">
                {product.category}
            </span>
            </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 text-lg">
            {product.title}
            </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Price and Rating Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          {/* Default download count if missing */}
          <div className="flex items-center space-x-1 text-xs text-gray-500">
             <Download className="w-3 h-3" />
             <span>{product.downloadCount || 0}</span>
          </div>
        </div>

        {/* Middleman UX: Sold by footer */}
        {showVendor && vendor && (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <Link href={`/business/${vendor.slug}`} className="flex items-center space-x-2 group/vendor">
                    <div className="w-6 h-6 rounded-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                        {vendor.imageUrl ? (
                            <Image src={vendor.imageUrl} alt={vendor.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200" />
                        )}
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover/vendor:text-gray-900 truncate max-w-[120px]">
                        {vendor.name}
                    </span>
                    {vendor.isVerified && (
                        <Check className="w-3 h-3 text-blue-500" />
                    )}
                </Link>
                <Link href={`/products/${product.slug}`} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                    View
                </Link>
            </div>
        )}
        
        {!showVendor && (
             <Link
             href={`/products/${product.slug}`}
             className="w-full inline-flex items-center justify-center px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors mt-auto"
           >
             View Details
           </Link>
        )}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white h-full">
      <div className="aspect-video bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
        <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-8 bg-gray-100 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
