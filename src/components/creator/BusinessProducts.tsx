'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Search, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { analytics } from '@/lib/analytics';

interface BusinessProductsProps {
  vendorId?: string;
  businessId?: string;
  limit?: number;
  vendorProfile?: {
    name: string;
    slug: string;
    imageUrl?: string;
    isVerified?: boolean;
  };
}

export function BusinessProducts({ vendorId, limit }: BusinessProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendorId) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/products?vendor_id=${vendorId}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [vendorId]);

  const filteredProducts = products.filter(product => {
     const text = searchQuery.toLowerCase();
     return (product.title?.toLowerCase().includes(text));
  });

  const isPreview = !!limit;
  const displayProducts = isPreview ? products.slice(0, limit) : filteredProducts;

  if (loading) return <SkeletonGrid limit={limit} />;
  if (products.length === 0) return null;

  return (
    <div className="bg-black">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-ink-primary uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 text-ink-primary" />
            Studio Collection
          </h3>
          <p className="text-sm text-ink-tertiary font-medium uppercase tracking-tight">Verified digital assets and professional output.</p>
        </div>
        
        {!isPreview && products.length > 3 && (
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-primary w-4 h-4" />
               <input 
                  type="text"
                  placeholder="SEARCH CATALOGUE..." 
                  className="w-full pl-10 py-3 bg-transparent border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-ink-primary focus:outline-none focus:border-white transition-colors placeholder:text-white/20" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
        )}
      </div>

      {/* Grid - High Precision Spatial Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-px sm:bg-white/5 border-white/5 sm:border sm:overflow-hidden">
        {displayProducts.map((product) => (
          <div key={product.id} className="group bg-black sm:p-8 hover:bg-ink-surface-1 transition-all flex flex-col relative sm:border-r sm:border-b sm:border-white/5 last:border-r-0">
            <Link 
              href={`/api/redirect?productId=${product.id}`}
              target="_blank"
              onClick={() => analytics.productClick(product.id as string)}
              className="aspect-square relative bg-ink-surface-1/50 overflow-hidden mb-8 block grayscale group-hover:grayscale-0 transition-all duration-1000"
            >
              {Array.isArray(product.image_urls) && product.image_urls[0] ? (
                <Image
                  src={product.image_urls[0] as string}
                  alt={product.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border-b border-white/5">
                  <span className="text-[10px] font-black text-ink-tertiary uppercase tracking-widest">No Preview</span>
                </div>
              )}
            </Link>

            <div className="flex flex-col flex-grow">
              <span className="text-[10px] font-black text-ink-tertiary uppercase tracking-widest mb-3 block">
                {product.category_id ? `Category ${product.category_id}` : "GENERAL"}
              </span>
              <Link 
                href={`/api/redirect?productId=${product.id}`}
                target="_blank"
                onClick={() => analytics.productClick(product.id as string)}
                className="group/title block mb-6"
              >
                <h4 className="text-sm font-black text-ink-primary uppercase tracking-tighter leading-[1.2] line-clamp-2 min-h-[3rem] group-hover/title:text-ink-secondary transition-colors">
                  {product.title}
                </h4>
              </Link>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                <Link
                  href={`/api/redirect?productId=${product.id}`}
                  target="_blank"
                  className="inline-flex items-center text-[10px] font-black text-ink-primary uppercase tracking-widest group/btn"
                  onClick={() => analytics.productClick(product.id as string)}
                >
                  View Full Asset
                  <ArrowUpRight className="w-3 h-3 ml-2 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
                <span className="text-[9px] font-bold text-ink-tertiary uppercase">Studio Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && searchQuery && (
          <div className="text-center py-32 bg-ink-surface-1/30 border border-white/5">
              <span className="text-[10px] font-black text-ink-tertiary uppercase tracking-[0.5em] mb-4 block">
                Zero matching results detected
              </span>
              <p className="text-[9px] text-ink-tertiary uppercase tracking-widest opacity-50">Refine search parameters for alternative results</p>
          </div>
      )}
    </div>
  );
}

function SkeletonGrid({ limit }: { limit?: number }) {
  return (
    <div className="space-y-12">
      <div className="h-6 w-48 bg-white/5 animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
        {[...Array(limit || 3)].map((_, i) => (
           <div key={i} className="bg-black p-8 h-[400px] space-y-6">
              <div className="w-full aspect-square bg-white/5 animate-pulse" />
              <div className="w-2/3 h-4 bg-white/5 animate-pulse" />
              <div className="w-1/2 h-3 bg-white/5 animate-pulse" />
           </div>
        ))}
      </div>
    </div>
  );
}
