"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Loader2, AlertCircle, Eye } from "lucide-react";
import { SearchFirstOnboarding } from "@/components/creator/SearchFirstOnboarding";

const navLinks = [
  { href: "/vendor/dashboard", label: "Overview" },
  { href: "/vendor/products", label: "Products" },
  { href: "/vendor/analytics", label: "Analytics" },
  { href: "/vendor/settings", label: "Settings" },
];

export function VendorLayoutClient({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, vendor, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, isLoading, router]);

  const isVendor = Boolean(vendor);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-t-2 animate-spin" style={{ borderColor: "var(--accent-atmosphere)" }} />
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading workspace...</p>
        </div>
      </div>
    );
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setIsCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/auth/create-vendor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ business_name: businessName.trim() }) });
      const data = await res.json();
      if (res.ok && data.success) window.location.reload();
      else { setCreateError(data?.error?.message ?? "Failed to create listing."); setIsCreating(false); }
    } catch { setCreateError("Network error."); setIsCreating(false); }
  };

  if (!isVendor) {
    if (showCreateForm) {
      return (
        <div className="min-h-screen flex items-start justify-center p-6 pt-20" style={{ background: "var(--bg-base)" }}>
          <div className="max-w-lg w-full space-y-8">
            <div className="space-y-3">
              <button onClick={() => setShowCreateForm(false)} className="text-xs font-medium transition-colors" style={{ color: "var(--text-tertiary)" }}>&larr; Back to search</button>
              <h1 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Create your listing</h1>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>Give your creator listing a name. You can add full details in settings after creation.</p>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label htmlFor="business_name" className="block text-xs font-medium mb-2.5" style={{ color: "var(--text-secondary)" }}>Business / Creator Name</label>
                <input id="business_name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Studio Mila, Josh Nguyen Design" className="w-full h-12 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }} autoFocus required />
              </div>
              {createError && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /><p>{createError}</p>
                </div>
              )}
              <button type="submit" disabled={isCreating || !businessName.trim()} className="btn-primary w-full justify-center disabled:opacity-30">
                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Listing"}
              </button>
            </form>
          </div>
        </div>
      );
    }
    return <SearchFirstOnboarding onCreateNew={() => setShowCreateForm(true)} />;
  }

  const productCount = vendor?.product_count ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }} data-testid="vendor-layout">
      <header style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-8 gap-5">
            <div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Creator Workspace</p>
              <h2 className="font-display text-2xl font-bold mt-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{vendor?.business_name || "Your Studio"}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-pill" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.12)", color: "var(--accent-atmosphere)" }}>{productCount} products</span>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Active</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/regions" className="btn-secondary !py-2.5 !px-4 !min-h-0 !text-xs"><Eye className="w-3.5 h-3.5" /> View Directory</Link>
              <button type="button" onClick={logout} className="btn-secondary !py-2.5 !px-4 !min-h-0 !text-xs"><LogOut className="w-3.5 h-3.5" /> Log out</button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1 pt-3 pb-3" style={{ borderTop: "1px solid var(--border)" }}>
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} className="px-5 py-2.5 text-sm font-medium rounded-xl transition-all" style={{ background: active ? "var(--accent-atmosphere-muted)" : "transparent", color: active ? "var(--accent-atmosphere)" : "var(--text-tertiary)", border: active ? "1px solid rgba(108, 92, 231, 0.12)" : "1px solid transparent" }} data-testid={`vendor-nav-${link.label.toLowerCase()}`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container-custom py-10">{children}</main>
    </div>
  );
}
