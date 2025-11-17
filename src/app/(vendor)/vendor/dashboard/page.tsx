"use client";

import { useVendorProducts } from "@/hooks/useVendorProducts";
import { AlertTriangle, Package, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 2,
});

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
  const { products, stats, isLoading, error, tierUtilization } =
    useVendorProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3 text-gray-600">
          <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-gray-900" />
          <p className="text-sm font-medium">Loading dashboard insights…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
        <p className="font-semibold">Unable to load dashboard</p>
        <p className="text-sm mt-2">
          {error ?? "Please refresh the page or try again in a few minutes."}
        </p>
      </div>
    );
  }

  const productQuota = stats.productQuota ?? undefined;
  const remainingQuota =
    productQuota !== undefined && productQuota !== null
      ? Math.max(productQuota - stats.totalProducts, 0)
      : null;

  const quotaWarning =
    productQuota && stats.totalProducts >= productQuota * 0.8
      ? "You're close to your product limit. Consider upgrading to unlock more listings."
      : null;

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Live products"
          value={stats.publishedProducts}
          hint={
            remainingQuota !== null
              ? `${remainingQuota} slots remaining`
              : undefined
          }
          icon={<Package className="w-5 h-5 text-white" />}
          accent="bg-gray-900"
        />
        <StatCard
          label="Drafts"
          value={stats.draftProducts}
          hint="Finish drafts to grow your reach"
          icon={<Sparkles className="w-5 h-5 text-white" />}
          accent="bg-gray-800"
        />
        <StatCard
          label="Featured slots"
          value={stats.featuredSlots}
          hint="Premium vendors can highlight up to 3 products"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          accent="bg-gray-800"
        />
        <StatCard
          label="Last update"
          value={formatDate(stats.lastUpdated)}
          hint="Keep products fresh for better ranking"
          icon={<Sparkles className="w-5 h-5 text-white" />}
          accent="bg-gray-800"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Product performance
              </h2>
              <p className="text-sm text-gray-500">
                Snapshot of your latest listings
              </p>
            </div>
            <Link
              href="/vendor/products"
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              Manage products →
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Create your first product to get started.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {product.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Updated {formatDate(product.updated_at ?? undefined)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {currencyFormatter.format(product.price || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Tier utilization
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {productQuota
                ? `${stats.totalProducts} of ${productQuota} product slots used`
                : "Product quota unavailable (apply migration 009)."}
            </p>
            <div className="mt-4 h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all"
                style={{ width: `${tierUtilization * 100}%` }}
              />
            </div>
            {quotaWarning && (
              <div className="mt-4 flex items-start space-x-3 text-sm text-amber-600">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{quotaWarning}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5" />
              <p className="text-sm uppercase tracking-widest">
                Quick next steps
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li>
                • Publish drafts to unlock featured slot eligibility and higher
                ranking.
              </li>
              <li>
                • Add at least two media assets per product (max 3) for best
                conversion.
              </li>
              <li>
                • Premium tier unlocks 3 featured slots + analytics exports.
              </li>
            </ul>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center w-full btn-secondary bg-white text-gray-900"
            >
              Explore tiers
            </Link>
          </div>
        </div>
      </section>
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          accent ?? "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      </div>
    </div>
  );
}
