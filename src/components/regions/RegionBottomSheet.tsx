"use client";

import { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import Papa from 'papaparse';

export interface RegionBottomSheetProps {
  region: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RegionBottomSheet({ region, isOpen, onClose }: RegionBottomSheetProps) {
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Lock body scroll when open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const fetchSuburbs = async () => {
      if (!region || !isOpen) return;
      setIsLoading(true);
      try {
        const res = await fetch('/data/suburbs-ssot.csv');
        const csv = await res.text();
        Papa.parse(csv, {
          header: true,
          complete: (results: Papa.ParseResult<{ region: string; suburb: string }>) => {
            if (!isMounted) return;
            const filtered = results.data
              .filter((row) => row.region === region)
              .map((row) => row.suburb);
            setSuburbs(filtered);
            setIsLoading(false);
          }
        });
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSuburbs();
    
    return () => { 
      isMounted = false;
      document.body.style.overflow = 'unset'; 
    };
  }, [isOpen, region]);

  if (!isOpen || !region) return null;

  const displaySuburbs = suburbs.slice(0, 5);
  const remaining = suburbs.length > 5 ? suburbs.length - 5 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center">
      {/* Background Backdrop */}
      <div 
        className="absolute inset-0 bg-ink-base/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet UI */}
      <div className="relative w-full sm:max-w-sm bg-ink-surface-1 border-t sm:border border-white/10 sm:rounded-sm rounded-t-2xl p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-200">
        
        {/* Swipe Handle (Mobile) */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />
        
        {/* Dismiss Button */}
        <button 
          aria-label="Close region details"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ink-tertiary hover:text-ink-primary hover:bg-white/5 transition-colors rounded-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-ink-primary uppercase tracking-widest border-b border-white/5 pb-2">
            {region} Region
          </h3>
          <p className="text-[10px] font-bold text-ink-secondary tracking-widest uppercase">
            Includes
          </p>
          
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <span className="text-[10px] text-ink-tertiary uppercase tracking-widest animate-pulse">Loading...</span>
            ) : displaySuburbs.length > 0 ? (
              <>
                {displaySuburbs.map(suburb => (
                  <span key={suburb} className="px-2.5 py-1 text-[10px] font-medium tracking-wider bg-white/5 border border-white/10 text-ink-primary rounded-sm whitespace-nowrap">
                    {suburb}
                  </span>
                ))}
                {remaining > 0 && (
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest bg-ink-surface-2 border border-white/10 text-ink-secondary rounded-sm whitespace-nowrap">
                    +{remaining} MORE
                  </span>
                )}
              </>
            ) : (
              <span className="text-[10px] text-ink-tertiary uppercase tracking-widest">No suburbs mapped</span>
            )}
          </div>
          
          <div className="pt-4 mt-2 border-t border-white/5">
            <a 
              href={`/regions?region=${region}`} 
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-ink-primary text-xs font-bold uppercase tracking-widest transition-colors rounded-sm group"
            >
              Browse Studios
              <Search className="w-3.5 h-3.5 text-ink-secondary group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
