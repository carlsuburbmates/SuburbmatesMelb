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

  useEffect(() => { if (!isLoading && !vendor) router.push("/auth/login"); }, [isLoading, vendor, router]);
  useEffect(() => {
    if (!vendor) return;
    async function fetchProfile() { try { const res = await fetch("/api/vendor/profile"); const data = await res.json(); if (data.success && data.data?.profile) setProfile(data.data.profile); } catch (err) { console.error("Failed to fetch profile", err); } finally { setLoadingProfile(false); } }
    fetchProfile();
  }, [vendor]);

  if (isLoading || loadingProfile) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-t-2 animate-spin" style={{ borderColor: "var(--accent-atmosphere)" }} />
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading settings...</p>
      </div>
    );
  }

  if (!profile) return <div className="p-6 text-sm" style={{ color: "var(--text-tertiary)" }}>Profile not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24" data-testid="vendor-settings">
      <header className="pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Manage your profile and preferences</p>
      </header>

      <section className="rounded-2xl p-8 lg:p-10 space-y-6" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)" }}>
        <div>
          <h2 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Profile Settings</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Your public creator page uses the standard template. Visibility is controlled by publish state and region mapping.
          </p>
        </div>
      </section>

      <section className="rounded-2xl p-8 lg:p-10 opacity-40 cursor-not-allowed" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
        <h2 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Visual Identity</h2>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Custom themes and advanced rendering — coming soon.</p>
        <div className="mt-4 px-3 py-1.5 rounded-pill inline-flex" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.12)" }}>
          <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>Pro Upgrade Required</span>
        </div>
      </section>
    </div>
  );
}
