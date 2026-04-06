
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';

interface ImageGalleryProps {
  images: {
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }[];
  businessName?: string;
}

export function ImageGallery({ images, businessName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = useCallback(() => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  const prevImage = useCallback(() => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, prevImage, nextImage]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="bg-black border border-white/5 overflow-hidden">
      <div className="p-8 border-b border-white/5 space-y-4">
        <h3 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.4em]">Visual Documentation</h3>
        <p className="text-ink-tertiary text-xs uppercase tracking-widest">
          Captured perspectives of {businessName || "the studio"} workspace
        </p>
      </div>

      {/* Main Image - Tesla high-precision style */}
      <div className="relative aspect-video bg-ink-surface-1 group overflow-hidden">
        <button
          className="w-full h-full cursor-none focus:outline-none block relative"
          onClick={() => openModal(currentIndex)}
          aria-label={`View full screen image of ${images[currentIndex].alt}`}
        >
          <LazyImage
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-[1.01] hover:scale-100"
          />
        </button>

        <button
          onClick={() => openModal(currentIndex)}
          className="absolute top-6 right-6 bg-black/80 backdrop-blur-md text-white p-3 border border-white/10 hover:bg-white hover:text-black transition-all group/zoom"
          aria-label="View full screen"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Navigation arrows - clinical style */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white p-4 border border-white/10 hover:bg-white hover:text-black transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white p-4 border border-white/10 hover:bg-white hover:text-black transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image caption - clinical overlay */}
        {images[currentIndex].caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 pointer-events-none">
            <p className="text-ink-primary text-[10px] font-bold uppercase tracking-[0.2em]">{images[currentIndex].caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail grid - high precision grid */}
      {images.length > 1 && (
        <div className="p-px bg-white/5">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-px">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}: ${image.alt}`}
                aria-current={index === currentIndex ? 'true' : undefined}
                className={`relative aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all hover:bg-white/5 active:scale-95 ${index === currentIndex
                    ? 'grayscale-0 outline outline-1 outline-white z-10'
                    : 'opacity-40 hover:opacity-100'
                  }`}
              >
                <LazyImage
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Overlay - Clinical Darkroom Mode */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 md:p-12 animate-in fade-in duration-500"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <LazyImage
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
              />
            </div>

            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-white hover:text-ink-primary p-4 z-50 group"
              aria-label="Close gallery"
            >
              <X className="w-8 h-8 transition-transform group-hover:rotate-90" />
            </button>

            {/* Navigation in modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-4 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-12 h-12" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-4 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-12 h-12" />
                </button>
              </>
            )}

            {/* Counter and Caption */}
            <div className="absolute bottom-8 left-0 right-0 text-center space-y-4 px-12 pointer-events-none">
              <div className="inline-block bg-white text-black px-4 py-1 text-[9px] font-black uppercase tracking-[0.3em]">
                FRAME {currentIndex + 1} / {images.length}
              </div>
              {images[currentIndex].caption && (
                <p className="text-ink-primary text-xs font-bold uppercase tracking-[0.2em] max-w-xl mx-auto">
                  {images[currentIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
