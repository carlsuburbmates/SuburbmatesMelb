'use client';

import { useEffect, useRef, useState } from 'react';

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    duration = 600,
    easing = 'ease-out'
  } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!hasAnimated || !triggerOnce)) {
          // Apply delay if specified
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) setHasAnimated(true);
          }
          
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

  // Generate CSS variables for animation
  const animationStyles = {
    '--animation-duration': `${duration}ms`,
    '--animation-easing': easing,
  } as React.CSSProperties;

  return { 
    elementRef, 
    isVisible, 
    animationStyles,
    hasAnimated
  };
}

// Predefined animation variants
export function useFadeIn(options?: ScrollAnimationOptions) {
  const { elementRef, isVisible, animationStyles } = useScrollAnimation(options);
  
  const className = `transition-all duration-[var(--animation-duration)] ease-[var(--animation-easing)] ${
    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
  }`;
  
  return { elementRef, className, style: animationStyles };
}

export function useSlideInLeft(options?: ScrollAnimationOptions) {
  const { elementRef, isVisible, animationStyles } = useScrollAnimation(options);
  
  const className = `transition-all duration-[var(--animation-duration)] ease-[var(--animation-easing)] ${
    isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'
  }`;
  
  return { elementRef, className, style: animationStyles };
}

export function useSlideInRight(options?: ScrollAnimationOptions) {
  const { elementRef, isVisible, animationStyles } = useScrollAnimation(options);
  
  const className = `transition-all duration-[var(--animation-duration)] ease-[var(--animation-easing)] ${
    isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'
  }`;
  
  return { elementRef, className, style: animationStyles };
}

export function useScaleIn(options?: ScrollAnimationOptions) {
  const { elementRef, isVisible, animationStyles } = useScrollAnimation(options);
  
  const className = `transition-all duration-[var(--animation-duration)] ease-[var(--animation-easing)] ${
    isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
  }`;
  
  return { elementRef, className, style: animationStyles };
}

// Staggered animations for lists/grids
export function useStaggeredAnimation(itemCount: number, staggerDelay = 100) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate items with stagger effect
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * staggerDelay);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [itemCount, staggerDelay]);

  const getItemClassName = (index: number) => {
    return `transition-all duration-500 ease-out ${
      visibleItems[index] 
        ? 'opacity-100 transform translate-y-0' 
        : 'opacity-0 transform translate-y-4'
    }`;
  };

  return { containerRef, getItemClassName, visibleItems };
}