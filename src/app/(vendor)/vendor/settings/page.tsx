"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TemplateSelector } from "@/components/vendor/TemplateSelector";
import { Loader2 } from "lucide-react";
import { BusinessProfile } from "@/lib/types";

export default function VendorSettingsPage() {
  const { vendor, token, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isLoading && !vendor) {
      router.push("/auth/login");
    }
  }, [isLoading, vendor, router]);

  useEffect(() => {
    if (!token) return;

    async function fetchProfile() {
      try {
        const res = await fetch('/api/vendor/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
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
  }, [token]);

  if (isLoading || loadingProfile) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
             <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
        </div>
    );
  }

  if (!profile) {
      return <div>Profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your business profile preferences.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile Appearance</h2>
          <p className="text-sm text-gray-500 mb-6">
            Choose how your business profile looks to customers.
          </p>
        </div>
        
        <TemplateSelector currentTemplate={profile.template_key || "standard"} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Theme Colors</h2>
        <p className="text-sm text-gray-500">
           Coming soon to Pro and Premium plans.
        </p>
      </div>
    </div>
  );
}
