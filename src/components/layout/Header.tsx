'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, LogOut } from 'lucide-react';
import { SignupModal } from '@/components/modals/SignupModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Directory', href: '/directory' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { user, vendor, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || 'User';
  };

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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="SuburbMates logo"
              width={64}
              height={64}
              className="rounded-full object-cover shadow-md shrink-0 w-11 h-11 md:w-16 md:h-16"
              unoptimized
              priority
            />
            <span className="inline-flex items-end gap-0 text-xl md:text-2xl font-semibold tracking-tight">
              <span className="text-gray-900 leading-none">suburb</span>
              <span className="text-blue-600 leading-none">mates</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
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
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {getUserDisplayName()}
                    </span>
                    {vendor && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Vendor
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900 hover:border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
                {user?.user_type === 'vendor' && (
                  <Link
                    href="/dashboard"
                    className="btn-primary"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
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
            className="relative ml-auto h-full w-[85%] max-w-xs bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col overflow-y-auto animate-slide-in-left"
            role="dialog"
            aria-modal="true"
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent-orange/70 via-accent-teal/70 to-accent-purple/70" aria-hidden />
            <div className="flex items-center justify-between p-4 border-b border-white/40">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
                <Image
                  src="/icon.png"
                  alt="SuburbMates logo"
                  width={48}
                  height={48}
                  className="rounded-full object-cover shadow-md"
                  unoptimized
                />
                <span className="text-xl font-semibold tracking-tight">
                  <span className="text-gray-900">suburb</span>
                  <span className="text-blue-600">mates</span>
                </span>
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-full"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-6 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
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
            <div className="px-6 pb-6 space-y-3 border-t border-white/30 pt-4 mt-auto">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {getUserDisplayName()}
                      </span>
                      {vendor && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Vendor
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                      className="flex items-center space-x-1 text-white/80 hover:text-white font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                  {user?.user_type === 'vendor' && (
                    <Link
                      href="/dashboard"
                      className="btn-cta w-full text-center"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
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
