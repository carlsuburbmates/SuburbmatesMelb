"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Package } from "lucide-react";

const navLinks = [
  { href: "/vendor/dashboard", label: "Overview" },
  { href: "/vendor/products", label: "Products" },
  { href: "/vendor/analytics", label: "Analytics" },
  { href: "/vendor/settings", label: "Settings" },
];

export default function VendorLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, vendor, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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

  if (!isVendor) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-lg w-full border border-white/10 rounded-sm p-12 text-center space-y-8">
          <div className="flex justify-center">
            <Package className="w-12 h-12 text-white/20" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Access Restricted
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
              Your account does not have an active vendor profile. Please
              initialise your profile to access the directory tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 text-[11px] uppercase tracking-widest font-bold bg-white text-black rounded-sm hover:bg-white/90 transition-all"
            >
              Create Creator Account
            </Link>
            <Link
              href="/help"
              className="px-8 py-3 text-[11px] uppercase tracking-widest font-bold border border-white/10 text-white rounded-sm hover:bg-white/5 transition-all"
            >
              Help Centre
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productCount = vendor?.product_count ?? 0;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <header className="bg-black border-b border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-8 space-y-6 md:space-y-0">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">
                Vendor Workspace
              </p>
              <h1 className="text-3xl font-bold text-white mt-2 tracking-tight">
                {vendor?.business_name || "Your Business"}
              </h1>
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
