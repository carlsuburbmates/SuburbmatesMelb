"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";

interface ImageGalleryProps {
  images: { id: string; url: string; alt: string; caption?: string }[];
  businessName?: string;
}

export function ImageGallery({ images, businessName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = useCallback(() => { if (!images?.length) return; setCurrentIndex((prev) => (prev + 1) % images.length); }, [images]);
  const prevImage = useCallback(() => { if (!images?.length) return; setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }, [images]);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const openModal = (index: number) => { setCurrentIndex(index); setIsModalOpen(true); };

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); if (e.key === "ArrowLeft") prevImage(); if (e.key === "ArrowRight") nextImage(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal, prevImage, nextImage]);

  if (!images || images.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }} data-testid="image-gallery">
      <div className="p-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="text-xs font-semibold" style={{ color: "var(--accent-atmosphere)" }}>Gallery</h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)", marginBottom: 0 }}>Visual portfolio of {businessName || "the studio"}</p>
      </div>

      <div className="relative aspect-video group overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
        <button className="w-full h-full focus:outline-none block relative" onClick={() => openModal(currentIndex)}>
          <LazyImage src={images[currentIndex].url} alt={images[currentIndex].alt} fill className="object-cover transition-all duration-700 hover:scale-[1.02]" />
        </button>
        <button onClick={() => openModal(currentIndex)} className="absolute top-4 right-4 p-2.5 rounded-xl transition-all" style={{ background: "rgba(9,9,15,0.8)", backdropFilter: "blur(12px)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
          <ZoomIn className="w-4 h-4" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all" style={{ background: "rgba(9,9,15,0.8)", backdropFilter: "blur(12px)", border: "1px solid var(--border)", color: "var(--text-primary)" }}><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all" style={{ background: "rgba(9,9,15,0.8)", backdropFilter: "blur(12px)", border: "1px solid var(--border)", color: "var(--text-primary)" }}><ChevronRight className="w-4 h-4" /></button>
          </>
        )}
        {images[currentIndex].caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(9,9,15,0.9), transparent)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{images[currentIndex].caption}</p>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="p-2 grid grid-cols-4 md:grid-cols-6 gap-1.5">
          {images.map((image, index) => (
            <button key={image.id} onClick={() => setCurrentIndex(index)} className={`relative aspect-square rounded-lg overflow-hidden transition-all ${index === currentIndex ? "ring-2 ring-[#6C5CE7] opacity-100" : "opacity-40 hover:opacity-80"}`}>
              <LazyImage src={image.url} alt={image.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(9,9,15,0.95)" }} role="dialog" aria-modal="true">
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12">
            <div className="relative w-full h-full"><LazyImage src={images[currentIndex].url} alt={images[currentIndex].alt} fill className="object-contain" /></div>
            <button onClick={closeModal} className="absolute top-6 right-6 p-3 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-primary)" }}><X className="w-6 h-6" /></button>
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all" style={{ color: "var(--text-secondary)" }}><ChevronLeft className="w-8 h-8" /></button>
                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all" style={{ color: "var(--text-secondary)" }}><ChevronRight className="w-8 h-8" /></button>
              </>
            )}
            <div className="absolute bottom-6 text-center">
              <span className="px-3 py-1.5 rounded-pill text-xs font-medium" style={{ background: "var(--accent-atmosphere-muted)", color: "var(--accent-atmosphere)" }}>{currentIndex + 1} / {images.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
