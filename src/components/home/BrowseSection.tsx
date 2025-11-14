'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export function BrowseSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/directory?search=${encodeURIComponent(searchTerm)}`;
    } else {
      window.location.href = '/directory';
    }
  };

  return (
    <section className="py-16 md:py-24 accent-overlay-teal">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/browse-neighborhood.jpg)',
          filter: 'grayscale(100%)'
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-white mb-6">
            Browse by Suburb
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Discover local businesses in your neighborhood. Find everything from 
            cafes to consultants, all verified and locally focused.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Try: Fitzroy, Collingwood, Brunswick..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-lg bg-white/90 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-600"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="text-white/70 text-sm mb-8">
            Or browse all businesses in the directory
          </div>

          <Link href="/directory" className="btn-secondary bg-white text-gray-900 hover:bg-gray-100">
            Browse Now
          </Link>
        </div>
      </div>
    </section>
  );
}