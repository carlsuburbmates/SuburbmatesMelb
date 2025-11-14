'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded"></div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              SuburbMates
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/directory" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Directory
            </Link>
            <Link 
              href="/marketplace" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Marketplace
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/help" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Help
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/auth/signup"
              className="btn-primary"
            >
              Sign up
            </Link>
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
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container-custom py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/directory"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={toggleMenu}
              >
                Directory
              </Link>
              <Link 
                href="/marketplace"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={toggleMenu}
              >
                Marketplace
              </Link>
              <Link 
                href="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                href="/help"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={toggleMenu}
              >
                Help
              </Link>
              <div className="border-t border-gray-200 pt-4 flex flex-col space-y-3">
                <Link 
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={toggleMenu}
                >
                  Log in
                </Link>
                <Link 
                  href="/auth/signup"
                  className="btn-primary text-center"
                  onClick={toggleMenu}
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}