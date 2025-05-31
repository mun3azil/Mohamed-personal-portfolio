'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getResponsiveSizes, getImageQuality, generateAltText } from '@/lib/imageUtils';
import { IMAGE_QUALITY } from '@/lib/constants';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  imageType?: 'profile' | 'project' | 'blog' | 'hero' | 'default';
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  quality,
  className = '',
  imageType = 'default',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [supportsModernFormats, setSupportsModernFormats] = useState(false);

  // Check for modern format support
  useEffect(() => {
    const checkAvifSupport = async () => {
      if (typeof window !== 'undefined') {
        const avifSupported = await testAvifSupport();
        setSupportsModernFormats(avifSupported);
      }
    };
    
    checkAvifSupport();
  }, []);

  // Test for AVIF support
  const testAvifSupport = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  };

  // Calculate responsive sizes if not provided
  const calculatedSizes = !sizes ? getResponsiveSizes(imageType) : sizes;
  
  // Calculate quality if not provided
  const calculatedQuality = quality || getImageQuality(imageType);

  // Generate alt text if not provided
  const calculatedAlt = alt || generateAltText(src, imageType);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Fallback image based on image type
  const fallbackImage = `/images/fallbacks/${imageType}-fallback.jpg`;

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {!isLoaded && !hasError && (
        <div 
          className={`absolute inset-0 bg-light-300 dark:bg-dark-100 animate-pulse rounded-md ${className}`}
          aria-hidden="true"
        />
      )}
      
      <Image
        src={hasError ? fallbackImage : src}
        alt={calculatedAlt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={calculatedSizes}
        priority={priority}
        quality={calculatedQuality}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        // Enable modern formats if supported
        {...(supportsModernFormats && { formats: ['avif', 'webp'] })}
        // Add loading="eager" for above-the-fold images with priority
        {...(priority && { loading: 'eager' })}
      />
    </div>
  );
}