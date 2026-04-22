"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, User, Home } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

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
    <nav
      data-testid="mobile-nav"
      className="fixed bottom-4 left-4 right-4 z-50 md:hidden rounded-2xl overflow-hidden"
      style={{
        background: "rgba(17, 17, 24, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex justify-around items-center h-16 pb-safe">
        {links.map((link) => {
          const active = link.isActive(pathname);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center w-full h-full gap-1 transition-all"
              style={{
                color: active ? "var(--accent-atmosphere)" : "var(--text-tertiary)",
              }}
              data-testid={`mobile-nav-${link.label.toLowerCase()}`}
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={active ? 2 : 1.5}
              />
              <span
                className="text-[10px] tracking-wide"
                style={{ fontWeight: active ? 600 : 400 }}
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
