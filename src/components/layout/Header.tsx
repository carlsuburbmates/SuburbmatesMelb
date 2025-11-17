'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { SignupModal } from '@/components/modals/SignupModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const navLinks = useMemo(
    () => [
      { label: 'Directory', href: '/directory' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'About', href: '/about' },
      { label: 'Help', href: '/help' },
    ],
    []
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo1.jpg"
              alt="SuburbMates logo"
              width={32}
              height={32}
              className="rounded-full object-cover"
              unoptimized
              priority
            />
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              SuburbMates
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Log in
            </Link>
            <button 
              onClick={openSignupModal}
              className="btn-primary"
            >
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          />
          <div
            className="relative ml-auto h-full w-[85%] max-w-xs bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col animate-slide-in-left"
            role="dialog"
            aria-modal="true"
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent-orange/70 via-accent-teal/70 to-accent-purple/70" aria-hidden />
            <div className="flex items-center justify-between p-4 border-b border-white/40">
              <div className="flex items-center space-x-2">
                <Image src="/logo1.jpg" alt="SuburbMates" width={32} height={32} className="rounded-full object-cover" unoptimized />
                
                <span className="font-semibold text-gray-900">Menu</span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-full"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-900 font-medium text-lg flex items-center justify-between"
                  onClick={closeMenu}
                >
                  {link.label}
                  <span className="text-gray-400">→</span>
                </Link>
              ))}
            </nav>
            <div className="px-6 pb-6 space-y-3 border-t border-white/30 pt-4">
              <Link
                href="/auth/login"
                className="block text-gray-600 hover:text-gray-900 font-medium"
                onClick={closeMenu}
              >
                Log in
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  openSignupModal();
                }}
                className="btn-cta w-full text-center"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      )}
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal} 
      />
    </header>
  );
}
