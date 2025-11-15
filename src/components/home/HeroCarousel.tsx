'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getImageBySection, generateImageUrl, getAccentOverlayClass, getImagePriority } from '@/lib/images';
import { LazyImage } from '@/components/ui/LazyImage';

// Get hero images from specification
const heroImages = getImageBySection('hero');

const heroSlides = [
  {
    id: 1,
    image: heroImages[0],
    title: 'Build Your Brand',
    subtitle: 'Melbourne\'s digital neighbourhood',
    accent: 'orange'
  },
  {
    id: 2,
    image: heroImages[1],
    title: 'Connect Locally', 
    subtitle: 'Where businesses thrive together',
    accent: 'teal'
  },
  {
    id: 3,
    image: heroImages[2],
    title: 'Sell Digital Products',
    subtitle: 'Turn your expertise into revenue',
    accent: 'purple'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full w-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className={`absolute inset-0 ${getAccentOverlayClass(slide.accent)}`}>
              {slide.image ? (
                <LazyImage
                  src={generateImageUrl(slide.image, true)} // Use placeholder until real images available
                  alt={slide.image.description}
                  fill
                  priority={getImagePriority('hero')}
                  className="object-cover"
                  sizes="100vw"
                />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-gray-400"
                  style={{
                    backgroundImage: `url(/images/hero-${slide.accent}.jpg)`,
                    filter: 'grayscale(100%)'
                  }}
                />
              )}
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container-custom pb-24 md:pb-32">
                <div className="max-w-2xl">
                  <h1 className="text-white mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-white/90 text-xl md:text-2xl font-light mb-8 animate-slide-up">
                    {slide.subtitle}
                  </p>
                  <p className="text-white/70 text-sm md:text-base max-w-lg animate-slide-up">
                    No sign-up required to browse. Discover local businesses and digital products in your suburb.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs mb-2 font-medium tracking-wider uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}