'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  wrapperClassName = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${wrapperClassName}`}
        style={{ width, height, ...style }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div
      className={`relative ${fill ? 'h-full w-full' : ''} ${
        isLoading ? 'animate-pulse bg-gray-200' : ''
      } ${wrapperClassName}`}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        fill={fill}
        style={style}
        {...props}
      />
    </div>
  );
}
