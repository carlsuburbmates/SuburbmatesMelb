"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Store, User, Home } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  // Hide on business pages (replaced by StickyActionBar)
  if (pathname.startsWith("/business/")) {
    return null;
  }

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isActive: (path: string) => path === "/",
    },
    {
      href: "/directory",
      label: "Discover",
      icon: Compass,
      isActive: (path: string) => path.startsWith("/directory") || path.startsWith("/business"),
    },
    {
      href: "/marketplace",
      label: "Shop",
      icon: Store,
      isActive: (path: string) => path.startsWith("/marketplace"),
    },
    {
      href: "/dashboard",
      label: "Profile",
      icon: User,
      isActive: (path: string) => path.startsWith("/dashboard") || path.startsWith("/auth"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe md:hidden">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const active = link.isActive(pathname);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                active ? "text-amber-600" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? "fill-current" : ""}`} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
