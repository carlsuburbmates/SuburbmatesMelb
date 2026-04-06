"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, User, Home } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  // Hidden on creator pages — replaced by StickyActionBar
  if (pathname.startsWith("/creator/")) return null;

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isActive: (path: string) => path === "/",
    },
    {
      href: "/regions",
      label: "Discover",
      icon: Compass,
      isActive: (path: string) =>
        path.startsWith("/regions") || path.startsWith("/creator"),
    },
    {
      href: "/vendor/dashboard",
      label: "Profile",
      icon: User,
      isActive: (path: string) =>
        path.startsWith("/vendor") || path.startsWith("/dashboard") || path.startsWith("/auth"),
    },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden bg-ink-surface-1/90 backdrop-blur-xl border border-white/10 rounded-sm">
      <div className="flex justify-around items-center h-14 pb-safe">
        {links.map((link) => {
          const active = link.isActive(pathname);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center w-full h-full gap-1 transition-opacity"
              style={{ color: active ? "#F5F5F7" : "#636366" }}
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={active ? 2 : 1.5}
              />
              <span
                className="text-[10px] tracking-wide"
                style={{ fontWeight: active ? 500 : 400 }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
