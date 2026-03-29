"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Signal } from "lucide-react";
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
        if (error) console.error("Shuffle Error:", error);
        else setProducts((data as ShuffledProduct[]) || []);
      } catch (error) {
        console.error('Fetch shuffle products error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchShuffle();
  }, []);

  if (loading) return <SkeletonSection />;
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 mb-4">
              <Signal className="w-4 h-4 text-black animate-pulse" />
              <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Live Feed</span>
            </div>
            <h2 className="text-4xl font-extrabold text-black tracking-tighter uppercase mb-4 leading-none">
              Daily Discoveries
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Fresh discoveries from Melbourne&apos;s digital creators. 
              Automatically curated from the local neighbourhood network.
            </p>
          </div>
          <Link
            href="/regions"
            className="text-[10px] font-black text-black uppercase tracking-widest hover:underline inline-flex items-center"
          >
            Explore All 
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-white overflow-hidden hover:bg-slate-50 transition-colors"
            >
              <Link 
                href={`/api/redirect?productId=${product.id}`}
                target="_blank"
                className="aspect-square relative bg-slate-50 overflow-hidden block"
                onClick={() => analytics.productClick(product.id)}
              >
                {product.thumbnail_url ? (
                  <Image
                    src={product.thumbnail_url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
              
              <div className="p-5 flex flex-col flex-grow min-h-[160px]">
                <div className="mb-4">
                  <Link 
                    href={`/creator/${product.business_slug}`}
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black transition-colors block mb-2"
                  >
                    {product.business_name}
                  </Link>
                  <Link 
                    href={`/api/redirect?productId=${product.id}`}
                    target="_blank"
                    onClick={() => analytics.productClick(product.id)}
                    className="block group/title"
                  >
                    <h3 className="text-sm font-black text-black uppercase tracking-tight leading-snug line-clamp-2 min-h-[40px] group-hover/title:underline decoration-1 underline-offset-4">
                      {product.title}
                    </h3>
                  </Link>
                </div>
                
                <div className="mt-auto">
                  <Link
                    href={`/api/redirect?productId=${product.id}`}
                    target="_blank"
                    className="inline-flex items-center text-[10px] font-black text-black uppercase tracking-widest group/btn py-2"
                    onClick={() => analytics.productClick(product.id)}
                  >
                    Visit Website
                    <ArrowUpRight className="w-3 h-3 ml-1 translate-y-px transition-transform group-hover/btn:-translate-y-px group-hover/btn:translate-x-px" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkeletonSection() {
  return (
    <div className="py-24 container-custom">
      <div className="h-4 w-24 bg-slate-50 animate-pulse mb-4" />
      <div className="h-10 w-64 bg-slate-50 animate-pulse mb-16" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 border border-slate-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 h-[240px] space-y-4">
             <div className="w-full h-32 bg-slate-50 animate-pulse" />
             <div className="w-2/3 h-4 bg-slate-50 animate-pulse" />
             <div className="w-1/2 h-3 bg-slate-50 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
