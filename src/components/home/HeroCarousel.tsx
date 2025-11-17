"use client";

import { LazyImage } from "@/components/ui/LazyImage";
import { useParallax } from "@/hooks/useScrollAnimation";
import { analytics } from "@/lib/analytics";
import {
  generateImageUrl,
  getAccentOverlayClass,
  getImageBySection,
  getImagePriority,
} from "@/lib/images";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

// Get hero images from specification
const heroImages = getImageBySection("hero");

const heroSlides = [
  {
    id: 1,
    image: heroImages[0],
    title: "Build Your Brand",
    subtitle: "Melbourne's digital neighbourhood",
    accent: "orange",
  },
  {
    id: 2,
    image: heroImages[1],
    title: "Connect Locally",
    subtitle: "Where businesses thrive together",
    accent: "teal",
  },
  {
    id: 3,
    image: heroImages[2],
    title: "Sell Digital Products",
    subtitle: "Turn your expertise into revenue",
    accent: "purple",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { elementRef: parallaxRef, offset: parallaxOffset } = useParallax({
    strength: -0.15,
  });

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    analytics.heroSlideView(currentSlide + 1);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      ref={parallaxRef}
      className="relative min-h-[600px] md:min-h-screen h-screen w-full overflow-hidden"
    >
      {/* Slides Container */}
      <div className="relative h-full w-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div
              className={`absolute inset-0 ${getAccentOverlayClass(
                slide.accent
              )}`}
              style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
            >
              {slide.image ? (
                <LazyImage
                  src={generateImageUrl(slide.image)}
                  alt={slide.image.description}
                  fill
                  priority={getImagePriority("hero")}
                  className="object-cover"
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-cover bg-center bg-gray-400" />
              )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container-custom pb-20 md:pb-32">
                <div className="max-w-2xl">
                  <h1 className="text-white mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-white/90 text-lg md:text-2xl font-light mb-6 md:mb-8 animate-slide-up">
                    {slide.subtitle}
                  </p>
                  <p className="text-white/70 text-sm md:text-base max-w-lg animate-slide-up leading-relaxed">
                    No sign-up required to browse. Discover local businesses and
                    digital products in your suburb.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 right-4 md:right-8 animate-bounce hidden md:flex">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs mb-2 font-medium tracking-wider uppercase">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
