'use client';

import React, { ComponentType, useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { IMAGE_QUALITY } from '@/lib/constants';

// Define the props that will be injected by the HOC
export interface WithImageOptimizationProps {
  /**
   * Function to optimize an image URL with quality and format parameters
   */
  optimizeImageUrl: (url: string, options?: OptimizeImageOptions) => string;
  
  /**
   * Component that renders an optimized image
   */
  OptimizedImage: React.FC<OptimizedImageProps>;
}

// Options for image optimization
export interface OptimizeImageOptions {
  /**
   * Image quality (1-100)
   */
  quality?: number;
  
  /**
   * Image format (webp, avif, jpeg, png)
   */
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  
  /**
   * Width of the image
   */
  width?: number;
  
  /**
   * Height of the image
   */
  height?: number;
}

// Props for the OptimizedImage component
export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  /**
   * Image source URL or path
   */
  src: string;
  
  /**
   * Image optimization options
   */
  optimizationOptions?: OptimizeImageOptions;
}

/**
 * Higher-order component that adds image optimization capabilities
 * 
 * @param WrappedComponent The component to enhance with image optimization
 * @returns Enhanced component with image optimization props
 */
export default function withImageOptimization<P extends object>(
  WrappedComponent: ComponentType<P & WithImageOptimizationProps>
) {
  // Return a new component with the added functionality
  return function WithImageOptimization(props: P) {
    // Default image quality from constants
    const defaultQuality = IMAGE_QUALITY.DEFAULT;
    
    /**
     * Optimizes an image URL by adding quality and format parameters
     */
    const optimizeImageUrl = (url: string, options?: OptimizeImageOptions): string => {
      if (!url) return url;
      
      // Skip optimization for data URLs or relative paths
      if (url.startsWith('data:') || url.startsWith('/')) {
        return url;
      }
      
      try {
        const imageUrl = new URL(url);
        
        // Add quality parameter if not already present
        if (!imageUrl.searchParams.has('q')) {
          imageUrl.searchParams.set('q', String(options?.quality || defaultQuality));
        }
        
        // Add format parameter if specified and not already present
        if (options?.format && !imageUrl.searchParams.has('fm')) {
          imageUrl.searchParams.set('fm', options.format);
        }
        
        // Add width parameter if specified
        if (options?.width) {
          imageUrl.searchParams.set('w', String(options.width));
        }
        
        // Add height parameter if specified
        if (options?.height) {
          imageUrl.searchParams.set('h', String(options.height));
        }
        
        return imageUrl.toString();
      } catch (error) {
        // If URL parsing fails, return the original URL
        console.warn('Image URL optimization failed:', error);
        return url;
      }
    };
    
    /**
     * Component that renders an optimized image using Next.js Image
     */
    const OptimizedImage: React.FC<OptimizedImageProps> = ({
      src,
      optimizationOptions,
      alt,
      ...imageProps
    }) => {
      // State to track if the image has loaded
      const [isLoaded, setIsLoaded] = useState(false);

      // Optimize the image URL
      const optimizedSrc = optimizeImageUrl(src, optimizationOptions);

      // Handle image load event
      const handleImageLoad = () => {
        setIsLoaded(true);
      };

      // Reset loaded state when src changes
      useEffect(() => {
        setIsLoaded(false);
      }, [src]);

      return (
        <div className={`relative ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <Image
            src={optimizedSrc}
            onLoad={handleImageLoad}
            alt={alt || ''}
            {...imageProps}
          />
        </div>
      );
    };
    
    // Pass the optimization utilities to the wrapped component
    return (
      <WrappedComponent
        {...props}
        optimizeImageUrl={optimizeImageUrl}
        OptimizedImage={OptimizedImage}
      />
    );
  };
}