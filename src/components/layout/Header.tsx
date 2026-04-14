"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, ChevronRight, Search } from "lucide-react";
import { SignupModal } from "@/components/modals/SignupModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "Directory", href: "/regions" },
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-testid="header"
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      style={{
        background: scrolled ? "rgba(9, 9, 15, 0.85)" : "rgba(9, 9, 15, 0.60)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" data-testid="header-logo">
            <div className="relative w-9 h-9 overflow-hidden rounded-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
            >
              <Image
                src="/icon.png"
                alt="SM"
                width={48}
                height={48}
                className="object-cover brightness-200"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display font-bold tracking-tight text-ink-primary">
                Suburbmates
              </span>
              <span className="text-[10px] font-medium text-ink-tertiary hidden sm:block">
                Creator Discovery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-white/5"
                style={{ color: "var(--text-secondary)" }}
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Global Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem("globalSearch") as HTMLInputElement;
              const val = input?.value?.trim();
              if (val) {
                router.push(`/regions?search=${encodeURIComponent(val)}`);
                input.value = "";
              }
            }}
            className="hidden md:flex items-center relative"
          >
            <Search className="absolute left-3.5 h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
            <input
              name="globalSearch"
              type="text"
              placeholder="Search creators..."
              className="w-44 lg:w-52 h-9 pl-10 pr-3 text-sm font-medium focus:outline-none rounded-xl transition-all"
              style={{
                background: "var(--bg-surface-1)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              data-testid="header-search-input"
            />
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/10 border-t-white animate-spin rounded-full" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.user_type === "business_owner" && (
                  <Link
                    href="/vendor/dashboard"
                    className="text-sm font-medium rounded-xl px-4 py-2 transition-all"
                    style={{
                      color: "var(--text-primary)",
                      background: "var(--bg-surface-2)",
                      border: "1px solid var(--border)",
                    }}
                    data-testid="nav-dashboard"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl transition-all hover:bg-white/5"
                  style={{ color: "var(--text-secondary)" }}
                  title="Logout"
                  data-testid="nav-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium px-4 py-2 rounded-xl transition-all hover:bg-white/5"
                  style={{ color: "var(--text-secondary)" }}
                  data-testid="nav-signin"
                >
                  Sign In
                </Link>
                <button
                  onClick={openSignupModal}
                  className="btn-primary !py-2.5 !px-5 !min-h-0 !text-sm"
                  data-testid="nav-join"
                >
                  Join Feed
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl transition-all"
            style={{ color: "var(--text-primary)" }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-[90] md:hidden"
          style={{ background: "var(--bg-base)" }}
        >
          <nav className="p-6 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-5 rounded-xl text-lg font-display font-bold transition-all"
                style={{
                  color: "var(--text-primary)",
                  background: "var(--bg-surface-1)",
                  border: "1px solid var(--border)",
                }}
                onClick={closeMenu}
              >
                {link.label}
                <ChevronRight className="w-5 h-5" style={{ color: "var(--text-tertiary)" }} />
              </Link>
            ))}

            <div className="pt-6 flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/login"
                    className="btn-secondary w-full justify-center"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu();
                      openSignupModal();
                    }}
                    className="btn-primary w-full justify-center"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="btn-secondary w-full justify-center text-red-400 border-red-400/20"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />
    </header>
  );
}
