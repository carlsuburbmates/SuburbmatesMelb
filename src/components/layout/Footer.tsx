import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo2.jpg"
                alt="SuburbMates wordmark"
                width={40}
                height={40}
                className="rounded-full object-cover"
                unoptimized
              />
              <span className="font-bold text-xl text-gray-900">
                SuburbMates
              </span>
            </Link>
            <p className="text-gray-600 max-w-md mb-6">
              Melbourne's digital neighbourhood where local businesses build their brand and sell digital products.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Stay updated</h4>
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:hello@suburbmates.com.au" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/directory" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Digital Marketplace
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            © 2024 SuburbMates. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
