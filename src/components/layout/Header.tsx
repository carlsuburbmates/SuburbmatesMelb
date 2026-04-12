"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, ChevronRight, Search } from "lucide-react";
import { SignupModal } from "@/components/modals/SignupModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "DIRECTORY", href: "/regions" },
  { label: "ABOUT", href: "/about" },
  { label: "HELP", href: "/help" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-ink-base/80 backdrop-blur-xl border-b border-white/5 selection:bg-white selection:text-black">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 overflow-hidden hover:rotate-90 transition-transform duration-500 bg-ink-surface-1">
              <Image
                src="/icon.png"
                alt="SM"
                width={64}
                height={64}
                className="object-cover grayscale brightness-200"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-[0.3em] leading-none text-ink-primary">
                Suburbmates
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-1 text-ink-tertiary">
                Melbourne&apos;s Top Digital Creators
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.4em] transition-colors text-ink-secondary hover:text-ink-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Global Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem(
                "globalSearch",
              ) as HTMLInputElement;
              const val = input?.value?.trim();
              if (val) {
                router.push(`/regions?search=${encodeURIComponent(val)}`);
                input.value = "";
              }
            }}
            className="hidden md:flex items-center relative"
          >
            <Search className="absolute left-3 h-3.5 w-3.5 text-ink-tertiary" />
            <input
              name="globalSearch"
              type="text"
              placeholder="Search creators..."
              className="w-44 lg:w-56 h-9 pl-9 pr-3 text-xs font-medium focus:outline-none bg-ink-surface-1 border border-white/10 text-ink-primary rounded-sm transition-all focus:border-white/20"
            />
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/10 border-t-white animate-spin rounded-full" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-6">
                {user?.user_type === "business_owner" && (
                  <Link
                    href="/vendor/dashboard"
                    className="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-ink-primary"
                  >
                    Studio Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 transition-colors text-ink-secondary hover:text-ink-primary"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  href="/auth/login"
                  className="text-[10px] font-black uppercase tracking-widest transition-colors text-ink-secondary hover:text-ink-primary"
                >
                  Sign In
                </Link>
                <button
                  onClick={openSignupModal}
                  className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors bg-white text-black hover:bg-white/90 rounded-sm"
                >
                  Join Feed
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-ink-primary"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-20 z-[90] md:hidden animate-in fade-in slide-in-from-top-4 duration-300 bg-ink-base"
        >
          <nav className="p-8 space-y-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between text-3xl font-black uppercase tracking-tighter text-ink-primary"
                onClick={closeMenu}
              >
                {link.label}
                <ChevronRight className="w-6 h-6" />
              </Link>
            ))}

            <div className="pt-12 flex flex-col gap-6 border-t border-white/10">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-black uppercase tracking-widest text-ink-primary"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu();
                      openSignupModal();
                    }}
                    className="w-full py-4 text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-white/90 rounded-sm"
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
                  className="text-left text-sm font-black uppercase tracking-widest text-red-500"
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
