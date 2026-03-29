"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { MapPin, Package, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { MAX_PRODUCTS_PER_CREATOR, FEATURED_SLOT } from "@/lib/constants";
import { useState, useEffect, useCallback } from "react";

function formatDate(dateString?: string | null) {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("en-AU", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function VendorDashboardPage() {
  const { products, stats, isLoading, error } = useVendorProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3 text-gray-600">
          <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-black" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            Loading Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-none p-6 text-red-700 flex items-center space-x-4">
        <AlertCircle className="w-6 h-6" />
        <div>
          <p className="font-black uppercase tracking-widest text-xs">
            Workspace Error
          </p>
          <p className="text-[10px] uppercase font-bold mt-1 opacity-70">
            {error ?? "Connection failed."}
          </p>
        </div>
      </div>
    );
  }

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-12">
      {/* Header Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Live Assets"
          value={stats.publishedProducts}
          hint={`${MAX_PRODUCTS_PER_CREATOR - stats.publishedProducts} slots remaining`}
          icon={<Package className="w-5 h-5 text-white" />}
          accent="bg-black"
        />
        <StatCard
          label="Drafts"
          value={stats.draftProducts}
          icon={<Sparkles className="w-5 h-5 text-white" />}
          accent="bg-slate-700"
        />
        <StatCard
          label="Last Activity"
          value={formatDate(stats.lastUpdated)}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          accent="bg-slate-700"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          {/* Performance/Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-black text-black uppercase tracking-[0.2em]">
                  Asset Index
                </h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                  Snapshot of your latest uploads
                </p>
              </div>
              <Link
                href="/regions"
                className="text-[10px] font-black text-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
              >
                View Feed &rarr;
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  No assets found. Start your first drop.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between group"
                  >
                    <div>
                      <p className="font-black text-black uppercase tracking-widest text-sm">
                        {product.title}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Updated {formatDate(product.updated_at ?? undefined)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                      <span
                        className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest ${
                          product.published
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {product.published ? "Published" : "Draft"}
                      </span>
                      <Link
                        href={`/vendor/products/${product.id}`}
                        className="p-2 border border-gray-100 hover:border-black transition-colors"
                      >
                         <Sparkles className="w-4 h-4 text-black" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-100">
               <Link 
                href="/vendor/products/new"
                className="w-full flex items-center justify-center py-6 border-2 border-black bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-900 transition-all"
               >
                 Create New Drop
               </Link>
            </div>
          </div>
        </div>

        {/* Sidebar/Guides */}
        <div className="space-y-6">
          <div className="bg-black text-white p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em]">
              Creator Protocol
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Zero Commission
                </p>
                <p className="text-xs leading-relaxed text-slate-200">
                  Suburbmates does not take a cut. Your external links route buyers directly to your own checkout or studio.
                </p>
              </div>
              <div className="space-y-1 pt-4 border-t border-white/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Growth Quota
                </p>
                <p className="text-xs leading-relaxed text-slate-200">
                  Every creator starts with a standard 10-asset limit. Focus on quality drops over quantity.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 border border-slate-200">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
               Need Help?
             </p>
             <Link 
              href="/help"
              className="text-xs font-black text-black uppercase tracking-widest hover:underline"
             >
               Visit Creator Support &rarr;
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ReactNode;
  accent?: string;
}

function StatCard({ label, value, hint, icon, accent }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 p-6 flex items-center space-x-6">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-none ${
          accent ?? "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p className="text-2xl font-black text-black tracking-tight">{value}</p>
        {hint && (
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
