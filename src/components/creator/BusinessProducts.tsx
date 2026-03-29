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
     return (product.title?.toLowerCase().includes(text) || 
             product.category?.toLowerCase().includes(text));
  });

  const isPreview = !!limit;
  const displayProducts = isPreview ? products.slice(0, limit) : filteredProducts;

  if (loading) return <SkeletonGrid limit={limit} />;
  if (products.length === 0) return null;

  return (
    <div className="bg-white">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6 border-b border-slate-100 pb-8">
        <div>
          <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <Zap className="w-3 h-3 fill-black text-black" />
            Studio Collection
          </h3>
          <p className="text-sm text-slate-400 font-medium">Selected digital works and professional offerings.</p>
        </div>
        
        {!isPreview && products.length > 3 && (
            <div className="relative w-full sm:w-72">
               <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
               <input 
                  type="text"
                  placeholder="SEARCH CATALOGUE..." 
                  className="w-full pl-8 py-2 bg-transparent border-b border-black text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-0 focus:border-slate-400 transition-colors placeholder:text-slate-300" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
        {displayProducts.map((product) => (
          <div key={product.id} className="group bg-white p-5 hover:bg-slate-50 transition-colors flex flex-col">
            <Link 
              href={`/api/redirect?productId=${product.id}`}
              target="_blank"
              onClick={() => analytics.productClick(product.id as string)}
              className="aspect-[4/3] relative bg-slate-50 overflow-hidden mb-6 block"
            >
              {Array.isArray(product.images) && product.images[0] ? (
                <Image
                  src={product.images[0] as string}
                  alt={product.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border-b border-slate-50">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Preview</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>

            <div className="flex flex-col flex-grow">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                {product.category || "GENERAL"}
              </span>
              <Link 
                href={`/api/redirect?productId=${product.id}`}
                target="_blank"
                onClick={() => analytics.productClick(product.id as string)}
                className="group/title block mb-4"
              >
                <h4 className="text-sm font-black text-black uppercase tracking-tight leading-snug line-clamp-2 min-h-[40px] group-hover/title:underline decoration-1 underline-offset-4">
                  {product.title}
                </h4>
              </Link>
              
              <div className="mt-auto pt-4 border-t border-slate-50">
                <Link
                  href={`/api/redirect?productId=${product.id}`}
                  target="_blank"
                  className="inline-flex items-center text-[10px] font-black text-black uppercase tracking-widest group/btn py-1"
                  onClick={() => analytics.productClick(product.id as string)}
                >
                  View Asset
                  <ArrowUpRight className="w-3 h-3 ml-1 translate-y-px transition-transform group-hover/btn:-translate-y-px group-hover/btn:translate-x-px" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && searchQuery && (
          <div className="text-center py-20 border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                No matching results in catalogue
              </span>
          </div>
      )}
    </div>
  );
}

function SkeletonGrid({ limit }: { limit?: number }) {
  return (
    <div className="space-y-8">
      <div className="h-4 w-32 bg-slate-50 animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 border border-slate-100">
        {[...Array(limit || 3)].map((_, i) => (
           <div key={i} className="bg-white p-6 h-[320px] space-y-6">
              <div className="w-full h-40 bg-slate-50 animate-pulse" />
              <div className="w-2/3 h-4 bg-slate-50 animate-pulse" />
              <div className="w-1/2 h-3 bg-slate-50 animate-pulse" />
           </div>
        ))}
      </div>
    </div>
  );
}
