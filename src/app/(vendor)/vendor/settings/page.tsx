"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BusinessProfile } from "@/lib/types";

export default function VendorSettingsPage() {
  const { vendor, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isLoading && !vendor) {
      router.push("/auth/login");
    }
  }, [isLoading, vendor, router]);

  useEffect(() => {
    if (!vendor) return;

    async function fetchProfile() {
      try {
        const res = await fetch('/api/vendor/profile');
        const data = await res.json();
        if (data.success && data.data?.profile) {
            setProfile(data.data.profile);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    
    fetchProfile();
  }, [vendor]);

  if (isLoading || loadingProfile) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center space-y-6">
        <div className="w-8 h-8 rounded-full border-t border-white animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ink-tertiary">
          Initialising Parameters...
        </p>
      </div>
    );
  }

  if (!profile) {
      return <div>Profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24">
      <header className="pb-8 border-b border-white/5">
        <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-ink-primary">
          Workspace Parameters
        </h1>
        <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.2em] mt-3">
          Manage directory profile preferences and architectural settings
        </p>
      </header>

      <section className="bg-ink-surface-1 border border-white/5 p-12 lg:p-16 space-y-12">
        <div>
          <h2 className="text-xs font-black text-ink-primary uppercase tracking-[0.3em] mb-3">
            Profile Architecture
          </h2>
          <p className="text-[11px] font-bold text-ink-tertiary uppercase tracking-widest leading-relaxed max-w-lg">
            Public creator pages use the standard launch template. Directory visibility is controlled by publish state and canonical region mapping.
          </p>
        </div>
      </section>

      <section className="bg-ink-surface-1 border border-white/5 p-12 lg:p-16 opacity-30 cursor-not-allowed">
        <h2 className="text-xs font-black text-ink-primary uppercase tracking-[0.3em] mb-4">
          Visual Identity
        </h2>
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-ink-tertiary uppercase tracking-widest">
            Extended visual themes and custom rendering protocols.
          </p>
          <p className="text-[9px] font-black text-ink-primary uppercase tracking-[0.3em] pt-4">
            Allocation pending - Pro System Upgrade Required
          </p>
        </div>
      </section>
    </div>
  );
}
