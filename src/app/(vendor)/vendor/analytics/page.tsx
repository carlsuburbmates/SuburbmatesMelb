"use client";

import { useVendorProducts } from "@/hooks/useVendorProducts";
import { BarChart3, TrendingUp, Users, Package } from "lucide-react";
import { MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";

export default function AnalyticsPage() {
  const { stats, isLoading } = useVendorProducts();

  if (isLoading) return <div className="p-8">Loading Analytics...</div>;
  if (!stats) return <div className="p-8">Analytics unavailable.</div>;

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-black">
          Performance Protocol
        </h1>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
          System telemetry and asset utilization
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          label="Profile Discovery"
          value="0"
          hint="+0% from last period"
          icon={<Users className="w-5 h-5 text-gray-400" />}
        />
        <AnalyticsCard
          label="Asset Clicks"
          value="0"
          hint="+0% from last period"
          icon={<BarChart3 className="w-5 h-5 text-gray-400" />}
        />
        <AnalyticsCard
          label="Conversion Rate"
          value="0.0%"
          hint="Direct outbound routes"
          icon={<TrendingUp className="w-5 h-5 text-gray-400" />}
        />
        <AnalyticsCard
          label="Asset Quota"
          value={`${stats.totalProducts}/${MAX_PRODUCTS_PER_CREATOR}`}
          hint="Standard Creator Limit"
          icon={<Package className="w-5 h-5 text-gray-400" />}
        />
      </div>

      <section className="bg-slate-50 border border-slate-200 p-12 text-center rounded-none">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">
          Data Integration Pending
        </p>
        <p className="max-w-md mx-auto text-xs leading-relaxed text-slate-500 uppercase tracking-widest font-bold">
          High-performance tracking is currently being rolled out across the platform. Detailed asset telemetry will appear here as soon as your portfolio reaches sufficient traffic thresholds.
        </p>
      </section>
    </div>
  );
}

function AnalyticsCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {label}
        </p>
        {icon}
      </div>
      <p className="text-3xl font-black text-black tracking-tighter mb-1">
        {value}
      </p>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        {hint}
      </p>
    </div>
  );
}
