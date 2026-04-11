"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Loader2, AlertCircle } from "lucide-react";
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
  const [businessName, setBusinessName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const isVendor = Boolean(vendor);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
            Initialising Workspace
          </p>
        </div>
      </div>
    );
  }

  const handleCreateNew = async () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setIsCreating(true);
    setCreateError('');

    try {
      const res = await fetch('/api/auth/create-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.reload();
      } else {
        setCreateError(data?.error?.message ?? 'Failed to create listing. Please try again.');
        setIsCreating(false);
      }
    } catch {
      setCreateError('Network error. Please try again.');
      setIsCreating(false);
    }
  };

  if (!isVendor) {
    if (showCreateForm) {
      return (
        <div className="min-h-screen bg-black flex items-start justify-center p-6 pt-16">
          <div className="max-w-lg w-full space-y-8">
            <div className="space-y-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors font-bold"
              >
                ← Back to search
              </button>
              <h1 className="text-3xl font-black text-white tracking-tight">Create your listing</h1>
              <p className="text-sm text-white/40 leading-relaxed">
                Give your creator listing a name. You can add full profile details in settings after
                creation.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="business_name"
                  className="block text-[10px] font-bold text-white/40 uppercase tracking-widest"
                >
                  Business / Creator Name
                </label>
                <input
                  id="business_name"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Studio Mila, The Linen Co, Josh Nguyen Design"
                  className="w-full h-14 px-4 bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                  autoFocus
                  required
                />
              </div>

              {createError && (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/10 border border-red-900/20 p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-xs">{createError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating || !businessName.trim()}
                className="w-full h-14 bg-white text-black text-[11px] uppercase tracking-widest font-black hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating listing
                  </>
                ) : (
                  'Create Listing'
                )}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return <SearchFirstOnboarding onCreateNew={handleCreateNew} />;
  }

  const productCount = vendor?.product_count ?? 0;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <header className="bg-black border-b border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-8 space-y-6 md:space-y-0">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">
                Creator Workspace
              </p>
              <h2 className="text-3xl font-bold text-white mt-2 tracking-tight">
                {vendor?.business_name || "Your Business"}
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-[11px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">
                  {productCount} products live
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[11px] uppercase tracking-wider text-white/30">
                  Active Member
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/regions"
                className="px-4 py-2 text-[11px] uppercase tracking-widest font-bold border border-white/10 rounded-sm hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
              >
                <EyeIcon className="w-3.5 h-3.5" />
                <span>View directory</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 text-[11px] uppercase tracking-widest font-bold border border-white/10 rounded-sm hover:border-white/40 transition-all duration-300 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1 border-t border-white/5 pt-4 pb-4">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-sm ${
                    active
                      ? "bg-white text-black"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container-custom py-12">{children}</main>
    </div>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
