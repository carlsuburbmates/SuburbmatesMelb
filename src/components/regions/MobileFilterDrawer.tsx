"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { FilterInputs } from "./FilterInputs";
import { useEffect } from "react";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedRegion: string;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function MobileFilterDrawer({
  isOpen, onClose, selectedCategory, selectedRegion, onFilterChange, onClear
}: MobileFilterDrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={shouldReduceMotion ? { duration: 0.15 } : { type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 z-[101] bg-ink-surface-1 shadow-2xl md:hidden max-h-[95vh] flex flex-col pt-2 border-t border-white/10"
          >
            {/* Swipe Handle */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-ink-primary uppercase tracking-widest">Filter Directory</h3>
              <button 
                onClick={onClose} 
                className="p-2 -mr-2 text-ink-secondary hover:text-ink-primary hover:bg-white/5 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 pb-24 overflow-y-auto">
              <FilterInputs 
                selectedCategory={selectedCategory} 
                selectedRegion={selectedRegion} 
                onFilterChange={onFilterChange} 
              />
            </div>

            {/* Sticky Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-ink-surface-1 border-t border-white/10 flex gap-px">
              <button 
                onClick={() => { onClear(); onClose(); }}
                className="flex-1 py-4 px-4 bg-ink-surface-2 text-ink-primary text-xs font-bold uppercase tracking-widest hover:bg-white/10 border border-white/5"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-4 px-4 bg-white/5 text-ink-primary text-xs font-bold uppercase tracking-widest hover:bg-white/10 shadow-none border border-white/10"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
