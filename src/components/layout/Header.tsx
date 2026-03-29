'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { SignupModal } from '@/components/modals/SignupModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { label: 'DIRECTORY', href: '/regions' },
  { label: 'ABOUT', href: '/about' },
  { label: 'HELP', href: '/help' },
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
    router.push('/');
  };

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-black">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Minimal Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 bg-black overflow-hidden hover:rotate-90 transition-transform duration-500">
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
              <span className="text-sm font-black text-black uppercase tracking-[0.3em] leading-none">
                Suburbmates
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                Melbourne&apos;s Top Digital Creators
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Tesla Style */}
          <nav className="hidden md:flex items-center space-x-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-black text-black uppercase tracking-[0.4em] hover:text-slate-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-6">
                 {user?.user_type === 'vendor' && (
                  <Link
                    href="/dashboard"
                    className="text-[10px] font-black text-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                  >
                    Studio Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-black hover:bg-slate-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  href="/auth/login"
                  className="text-[10px] font-black text-black uppercase tracking-widest hover:text-slate-400 transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={openSignupModal}
                  className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-colors"
                >
                  Join Feed
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-black"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay - High Density */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 z-[90] bg-white md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="p-8 space-y-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between text-3xl font-black text-black uppercase tracking-tighter"
                onClick={closeMenu}
              >
                {link.label}
                <ChevronRight className="w-6 h-6" />
              </Link>
            ))}
            
            <div className="pt-12 border-t border-slate-100 flex flex-col gap-6">
              {!isAuthenticated ? (
                <>
                   <Link
                      href="/auth/login"
                      className="text-sm font-black text-black uppercase tracking-widest"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                    <button
                      onClick={() => { closeMenu(); openSignupModal(); }}
                      className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest"
                    >
                      Get Started
                    </button>
                </>
              ) : (
                <button
                  onClick={() => { closeMenu(); handleLogout(); }}
                  className="text-left text-sm font-black text-red-600 uppercase tracking-widest"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal} 
      />
    </header>
  );
}
