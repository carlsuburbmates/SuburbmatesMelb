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
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, prevImage, nextImage]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
        <p className="text-gray-600 text-sm">
          Photos of {businessName} and their workspace
        </p>
      </div>

      {/* Main Image */}
      <div className="relative aspect-video bg-gray-100 group">
        <button
          className="w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 block"
          onClick={() => openModal(currentIndex)}
          aria-label={`View full screen image of ${images[currentIndex].alt}`}
        >
          <LazyImage
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            fill
            className="object-cover hover:opacity-95 transition-opacity"
          />
        </button>
        
        <button
          onClick={() => openModal(currentIndex)}
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="View full screen"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image caption */}
        {images[currentIndex].caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
            <p className="text-white text-sm">{images[currentIndex].caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}: ${image.alt}`}
                aria-current={index === currentIndex ? 'true' : undefined}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  index === currentIndex 
                    ? 'border-gray-900 ring-2 ring-gray-900/20' 
                    : 'border-gray-200 hover:border-gray-400'
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery view"
        >
          <div className="relative w-full h-full max-w-4xl max-h-4xl">
            <LazyImage
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              fill
              className="object-contain"
            />
            
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation in modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-lg hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-lg hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              {currentIndex + 1} of {images.length}
            </div>

            {/* Caption in modal */}
            {images[currentIndex].caption && (
              <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-lg max-w-md mx-auto inline-block">
                  {images[currentIndex].caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
