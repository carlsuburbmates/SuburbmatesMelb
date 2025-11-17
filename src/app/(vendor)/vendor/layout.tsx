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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-3 text-gray-600">
          <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-gray-900" />
          <p className="text-sm font-medium">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!isVendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <Package className="w-12 h-12 mx-auto text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">
            Vendor access required
          </h1>
          <p className="text-gray-600">
            Create a vendor profile to access the SuburbMates vendor dashboard
            and manage your products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/create-vendor"
              className="btn-primary inline-flex justify-center"
            >
              Create vendor profile
            </Link>
            <Link
              href="/help"
              className="btn-secondary inline-flex justify-center"
            >
              Visit help centre
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tierLabel = vendor?.tier ?? "basic";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 space-y-4 md:space-y-0">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">
                Vendor Workspace
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                {vendor?.business_name || "Your Business"}
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-600">
                  Tier:{" "}
                  <span className="font-semibold uppercase">{tierLabel}</span>
                </span>
                {vendor?.product_count !== undefined && (
                  <span className="text-sm text-gray-500">
                    • {vendor.product_count} products live
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/marketplace"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <EyeIcon className="w-4 h-4" />
                <span>View marketplace</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3 border-t border-gray-100 pt-4 pb-2">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-gray-900 text-white shadow"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
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
