"use client";

import { useVendorProducts } from "@/hooks/useVendorProducts";
import { BarChart3, TrendingUp, Users, Package } from "lucide-react";
import { MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";

export default function AnalyticsPage() {
  const { stats, isLoading } = useVendorProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 rounded-full border-t-2" style={{ borderColor: "var(--accent-atmosphere)" }} />
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-10 rounded-2xl text-center" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Analytics data unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24" data-testid="vendor-analytics">
      <header className="pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Performance metrics and directory utilization</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Profile Views" value="0" hint="Coming soon" icon={<Users className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />} />
        <Card label="Product Clicks" value="0" hint="Coming soon" icon={<BarChart3 className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />} />
        <Card label="Conversion Rate" value="0.0%" hint="Outbound rate" icon={<TrendingUp className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />} />
        <Card label="Slot Usage" value={`${stats.totalProducts}/${MAX_PRODUCTS_PER_CREATOR}`} hint="Standard quota" icon={<Package className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />} />
      </div>

      <section className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)" }}>
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>Analytics Coming Soon</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Detailed tracking is being deployed across the Suburbmates network. Product-level click data and conversion metrics will appear here as your portfolio generates traffic.
          </p>
        </div>
      </section>
    </div>
  );
}

function Card({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</p>
        <div className="p-2 rounded-xl" style={{ background: "var(--accent-atmosphere-muted)" }}>{icon}</div>
      </div>
      <p className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{value}</p>
      <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>{hint}</p>
    </div>
  );
}
