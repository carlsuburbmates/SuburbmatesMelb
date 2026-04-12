"use client";

import { useState } from "react";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { Package, Sparkles, TrendingUp, AlertCircle, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { FeaturedRequestModal } from "@/components/vendor/FeaturedRequestModal";
import { MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";

function formatDate(dateString?: string | null) {
  if (!dateString) return "\u2014";
  try { return new Date(dateString).toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" }); } catch { return dateString; }
}

export function VendorDashboardClient() {
  const { products, stats, isLoading, error } = useVendorProducts();
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 rounded-full border-t-2" style={{ borderColor: "var(--accent-atmosphere)" }} />
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 rounded-xl flex items-center gap-4" style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
        <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#ef4444" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>Error loading dashboard</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{error ?? "Please try again."}</p>
        </div>
      </div>
    );
  }

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-10" data-testid="vendor-dashboard">
      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Live Assets" value={stats.activeProducts} hint={`${MAX_PRODUCTS_PER_CREATOR - stats.activeProducts} slots remaining`} icon={<Package className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />} />
        <StatCard label="Drafts" value={stats.inactiveProducts} icon={<Sparkles className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />} />
        <StatCard label="Last Update" value={formatDate(stats.lastUpdated)} icon={<TrendingUp className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />} />
      </section>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <div className="rounded-2xl p-8 lg:p-10" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)" }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>Recent Products</h2>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Your live assets in the directory</p>
              </div>
              <Link href="/regions" className="text-xs font-medium transition-colors" style={{ color: "var(--accent-atmosphere)" }}>View in directory &rarr;</Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ background: "var(--bg-surface-2)", border: "1px dashed var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No products yet</p>
              </div>
            ) : (
              <div className="space-y-0" style={{ borderTop: "1px solid var(--border)" }}>
                {recentProducts.map((product) => (
                  <div key={product.id} className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{product.title}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Updated {formatDate(product.updated_at ?? undefined)}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-pill" style={{ background: product.is_active ? "var(--accent-atmosphere-muted)" : "var(--bg-surface-2)", color: product.is_active ? "var(--accent-atmosphere)" : "var(--text-tertiary)", border: `1px solid ${product.is_active ? "rgba(108, 92, 231, 0.12)" : "var(--border)"}` }}>
                        {product.is_active ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <Link href="/vendor/products/new" className="btn-primary w-full justify-center">Add New Product</Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <button type="button" onClick={() => setFeaturedModalOpen(true)} className="w-full text-left p-6 rounded-2xl transition-all group" style={{ background: "var(--accent-cta-muted)", border: "1px solid rgba(249, 115, 22, 0.15)" }} data-testid="featured-request-btn">
            <div className="flex items-center gap-2.5 mb-2">
              <Star className="w-4 h-4" style={{ color: "var(--accent-cta)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--accent-cta)" }}>Featured Placement</span>
            </div>
            <span className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              Request Featured Listing <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <Link href="/help" className="block p-6 rounded-2xl transition-all group" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>Documentation</p>
            <span className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              Help Centre <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <div className="p-6 rounded-2xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-medium mb-3" style={{ color: "var(--accent-atmosphere)" }}>Quick tip</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Suburbmates routes all traffic directly to your site. No marketplace fees, no commission overhead.
            </p>
          </div>
        </div>
      </div>

      <FeaturedRequestModal isOpen={featuredModalOpen} onClose={() => setFeaturedModalOpen(false)} />
    </div>
  );
}

function StatCard({ label, value, hint, icon }: { label: string; value: number | string; hint?: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl flex flex-col justify-between" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="p-2.5 rounded-xl" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.12)" }}>{icon}</div>
        {hint && <span className="text-[10px] text-right max-w-[100px]" style={{ color: "var(--text-tertiary)" }}>{hint}</span>}
      </div>
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>{label}</p>
        <p className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{value}</p>
      </div>
    </div>
  );
}
