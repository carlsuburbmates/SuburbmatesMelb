"use client";

import { useVendorProducts } from "@/hooks/useVendorProducts";
import { BarChart3, TrendingUp, Users, Package } from "lucide-react";
import { MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";

export default function AnalyticsPage() {
  const { stats, isLoading } = useVendorProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3 text-ink-tertiary">
          <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-ink-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
             Fetching Telemetry...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white/[0.02] border border-white/5 p-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ink-tertiary">
          Data Stream Unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-24">
      <header className="pb-8 border-b border-white/5">
        <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-ink-primary">
          Performance Protocol
        </h1>
        <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.2em] mt-3">
          Real-time telemetry and directory asset utilization
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          label="Profile Discovery"
          value="0"
          hint="+0% FROM PREV. CYCLE"
          icon={<Users className="w-4 h-4 text-ink-secondary" />}
        />
        <AnalyticsCard
          label="Asset Clicks"
          value="0"
          hint="+0% FROM PREV. CYCLE"
          icon={<BarChart3 className="w-4 h-4 text-ink-secondary" />}
        />
        <AnalyticsCard
          label="Conversion Weight"
          value="0.0%"
          hint="DIRECT OUTBOUND RATE"
          icon={<TrendingUp className="w-4 h-4 text-ink-secondary" />}
        />
        <AnalyticsCard
          label="Asset Utilization"
          value={`${stats.totalProducts}/${MAX_PRODUCTS_PER_CREATOR}`}
          hint="STANDARD QUOTA LIMIT"
          icon={<Package className="w-4 h-4 text-ink-secondary" />}
        />
      </div>

      <section className="bg-ink-surface-1 border border-white/5 p-16 text-center">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="w-12 h-[1px] bg-white/10 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-ink-primary">
            Syncing Analytics Engine
          </p>
          <p className="text-[12px] leading-relaxed text-ink-secondary uppercase tracking-[0.1em] font-bold">
            High-precision tracking is currently being deployed across the Suburbmates network. Detailed asset telemetry and conversion data will appear here as soon as your portfolio generates sufficient traffic signals.
          </p>
          <div className="w-12 h-[1px] bg-white/10 mx-auto" />
        </div>
      </section>
    </div>
  );
}


function AnalyticsCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return (
    <div className="bg-ink-surface-1 border border-white/5 p-10 group hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-ink-tertiary group-hover:text-ink-secondary transition-colors">
          {label}
        </p>
        <span className="text-ink-tertiary group-hover:text-ink-primary transition-colors">{icon}</span>
      </div>
      <p className="text-4xl font-black text-ink-primary tracking-tighter mb-2 leading-none">
        {value}
      </p>
      <p className="text-[8px] font-bold text-ink-tertiary uppercase tracking-widest leading-loose">
        {hint}
      </p>
    </div>
  );
}

