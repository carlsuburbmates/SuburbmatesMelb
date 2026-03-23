"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ExternalLink, Package } from "lucide-react";
import { analytics } from "@/lib/analytics";

type ShuffledProduct = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  external_url: string;
  vendor_id: string;
  business_name: string;
  business_slug: string;
  created_at: string;
};

export function FreshSignals() {
  const [products, setProducts] = useState<ShuffledProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShuffle() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient<Database>(supabaseUrl, supabaseKey);

      try {
        const { data, error } = await supabase.rpc('get_daily_shuffle_products', { p_limit: 8 });

        if (error) {
          console.error("Shuffle Error:", error);
        } else {
          setProducts((data as ShuffledProduct[]) || []);
        }
      } catch (error: unknown) {
        console.error('Fetch shuffle products error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchShuffle();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50/50">
        <div className="container-custom">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 bg-gray-200 animate-pulse rounded w-48" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50/50 border-y border-gray-100">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Daily Discoveries</h2>
              <p className="text-sm text-gray-500">Fresh finds from Melbourne creators, updated daily.</p>
            </div>
          </div>
          <Link
            href="/directory"
            className="text-sm font-bold text-gray-900 hover:underline inline-flex items-center"
          >
            Browse Everything <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-gray-200/40"
            >
              <div className="aspect-square relative bg-gray-100 overflow-hidden">
                {product.thumbnail_url ? (
                  <Image
                    src={product.thumbnail_url}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <Link 
                  href={`/api/redirect?productId=${product.id}`}
                  target="_blank"
                  className="group/link"
                  onClick={() => analytics.productClick(product.id)}
                >
                  <h3 className="text-sm font-bold text-gray-900 group-hover/link:text-blue-600 transition-colors line-clamp-2 min-h-[40px] mb-2 leading-snug">
                    {product.title}
                  </h3>
                </Link>
                
                <div className="mt-auto pt-3 border-t border-gray-50">
                  <Link 
                    href={`/business/${product.business_slug}`}
                    className="flex items-center text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-[8px] font-bold overflow-hidden">
                      {product.business_name.charAt(0)}
                    </div>
                    <span className="truncate flex-grow">{product.business_name}</span>
                  </Link>
                </div>
              </div>

              <Link
                href={`/api/redirect?productId=${product.id}`}
                target="_blank"
                className="block w-full py-3 bg-gray-50 text-gray-900 text-center text-xs font-bold border-t border-gray-100 hover:bg-gray-900 hover:text-white transition-all duration-300"
                onClick={() => analytics.productClick(product.id)}
              >
                Visit Website
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
