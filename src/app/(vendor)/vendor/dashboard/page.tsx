"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { MapPin, Package, Sparkles, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
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
        <div className="flex flex-col items-center space-y-3 text-ink-tertiary">
          <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-ink-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
             Syncing Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-900/10 border border-red-900/20 rounded-sm p-8 text-red-400 flex items-center space-x-4">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="font-black uppercase tracking-[0.2em] text-[10px]">
             System Error
          </p>
          <p className="text-[10px] uppercase font-bold mt-1 opacity-70">
            {error ?? "Protocol communication failure."}
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
          value={stats.activeProducts}
          hint={`${MAX_PRODUCTS_PER_CREATOR - stats.activeProducts} slots remaining`}
          icon={<Package className="w-4 h-4 text-ink-primary" />}
        />
        <StatCard
          label="Draft Archive"
          value={stats.inactiveProducts}
          icon={<Sparkles className="w-4 h-4 text-ink-secondary" />}
        />
        <StatCard
          label="Last Update"
          value={formatDate(stats.lastUpdated)}
          icon={<TrendingUp className="w-4 h-4 text-ink-secondary" />}
        />
      </section>

      <div className="grid gap-12 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-12">
          {/* Recent Activity */}
          <div className="bg-ink-surface-1 border border-white/5 p-8 lg:p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xs font-black text-ink-primary uppercase tracking-[0.3em]">
                  Asset Repository
                </h2>
                <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest mt-2">
                  Live snapshot of creator directory
                </p>
              </div>
              <Link
                href="/regions"
                className="text-[9px] font-black text-ink-secondary uppercase tracking-[0.2em] hover:text-ink-primary transition-colors pb-1 border-b border-white/5 hover:border-white/10"
              >
                Global Feed &rarr;
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/5 bg-white/[0.01]">
                <p className="text-[10px] font-black text-ink-tertiary uppercase tracking-[0.3em]">
                  Repository Empty
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between group"
                  >
                    <div>
                      <p className="font-black text-ink-primary uppercase tracking-[0.2em] text-xs">
                        {product.title}
                      </p>
                      <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest mt-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-white/10 rounded-full" />
                        SYNCED {formatDate(product.updated_at ?? undefined)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-8 mt-6 sm:mt-0">
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 ${
                          product.is_active
                            ? "text-ink-primary bg-white/5"
                            : "text-ink-tertiary border border-white/5"
                        }`}
                      >
                        {product.is_active ? "VISIBLE" : "HIDDEN"}
                      </span>
                      <Link
                        href={`/vendor/products/${product.id}`}
                        className="p-3 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all"
                      >
                         <Sparkles className="w-3.5 h-3.5 text-ink-primary" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-12 pt-10 border-t border-white/5">
               <Link 
                href="/vendor/products/new"
                className="w-full flex items-center justify-center py-5 bg-ink-primary text-ink-base text-[10px] font-black uppercase tracking-[0.5em] hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
               >
                 Initialize New Drop
               </Link>
            </div>
          </div>
        </div>

        {/* Sidebar/Protocol */}
        <div className="space-y-8">
          <div className="bg-ink-surface-1 border border-white/5 p-8 space-y-8">
            <h3 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.4em]">
              Creator Protocol
            </h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-ink-tertiary uppercase tracking-widest">
                  Direct Architecture
                </p>
                <p className="text-[11px] leading-relaxed text-ink-secondary uppercase font-bold tracking-wider">
                  Suburbmates routes all signals directly. No marketplace interference. No commission overhead.
                </p>
              </div>
              <div className="space-y-2 pt-8 border-t border-white/5">
                <p className="text-[9px] font-black text-ink-tertiary uppercase tracking-widest">
                  Resource Allocation
                </p>
                <p className="text-[11px] leading-relaxed text-ink-secondary uppercase font-bold tracking-wider">
                  Every instance is allocated 5 primary asset slots. Legacy data will be archived automatically.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/help"
            className="block bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
          >
             <p className="text-[9px] font-black text-ink-tertiary uppercase tracking-widest mb-3 group-hover:text-ink-secondary transition-colors">
               Documentation
             </p>
             <span className="text-[10px] font-black text-ink-primary uppercase tracking-[0.2em] flex items-center gap-2">
               Creator Support Center <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
             </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, icon }: { label: string; value: number | string; hint?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-ink-surface-1 border border-white/5 p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-8">
        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm">
          {icon}
        </div>
        {hint && (
          <span className="text-[8px] font-bold text-ink-tertiary uppercase tracking-widest text-right max-w-[100px]">
            {hint}
          </span>
        )}
      </div>
      <div>
        <p className="text-[9px] font-black text-ink-tertiary uppercase tracking-[0.3em] mb-2">
          {label}
        </p>
        <p className="text-3xl font-black text-ink-primary tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}

