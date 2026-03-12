"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { FilterInputs } from "./FilterInputs";
import { useEffect } from "react";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedSuburb: string;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function MobileFilterDrawer({
  isOpen, onClose, selectedCategory, selectedSuburb, onFilterChange, onClear
}: MobileFilterDrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Prevent body scroll when open and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={shouldReduceMotion ? { duration: 0.1 } : { type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-xl p-6 pb-20 md:hidden max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-title"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 id="mobile-filter-title" className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-900 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            
            <FilterInputs 
              selectedCategory={selectedCategory} 
              selectedSuburb={selectedSuburb} 
              onFilterChange={onFilterChange} 
            />

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => { onClear(); onClose(); }}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 shadow-sm"
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
