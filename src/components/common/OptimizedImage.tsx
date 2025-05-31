'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getResponsiveSizes, generateAltText, getImageQuality } from '@/lib/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  imageType?: 'profile' | 'project' | 'blog' | 'hero' | 'default';
  title?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  quality?: number;
}

/**
 * OptimizedImage component that extends Next.js Image with additional features
 * - Automatic responsive sizes based on image type
 * - Fallback image handling
 * - Automatic alt text generation if none provided
 * - Optimized quality settings
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  imageType = 'default',
  title = '',
  onClick,
  loading,
  sizes,
  quality,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate alt text if not provided
  const imageAlt = alt || (title ? generateAltText(title, imageType) : 'Image');
  
  // Get responsive sizes based on image type if not explicitly provided
  const imageSizes = sizes || getResponsiveSizes(imageType);
  
  // Get appropriate quality based on image type if not explicitly provided
  const imageQuality = quality || getImageQuality(imageType);

  // Handle image load complete
  const handleLoadComplete = () => {
    setIsLoaded(true);
  };

  // Handle image load error
  const handleError = () => {
    setHasError(true);
  };

  // Fallback image based on image type
  const fallbackSrc = `/images/fallbacks/${imageType}-fallback.svg`;

  return (
    <div className={`relative ${className} ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
      <Image
        src={hasError ? fallbackSrc : src}
        alt={imageAlt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        loading={loading || (priority ? 'eager' : 'lazy')}
        sizes={imageSizes}
        quality={imageQuality}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={handleLoadComplete}
        onError={handleError}
        onClick={onClick}
      />
    </div>
  );
}
