'use client';

import React from 'react';
import { motion } from 'framer-motion';


interface SkeletonProps {
  /**
   * Width of the skeleton
   * @default '100%'
   */
  width?: string | number;
  
  /**
   * Height of the skeleton
   * @default '1rem'
   */
  height?: string | number;
  
  /**
   * Border radius of the skeleton
   * @default '0.25rem'
   */
  borderRadius?: string | number;
  
  /**
   * Whether to animate the skeleton
   * @default true
   */
  animate?: boolean;
  
  /**
   * Custom CSS class name
   */
  className?: string;
  
  /**
   * Shape of the skeleton
   * @default 'rectangle'
   */
  variant?: 'rectangle' | 'circle' | 'text';
  
  /**
   * Number of lines to render (only for text variant)
   * @default 1
   */
  lines?: number;
  
  /**
   * Gap between lines (only for text variant)
   * @default '0.5rem'
   */
  gap?: string | number;
}

/**
 * Skeleton component for loading states
 * 
 * @param props Component props
 * @returns Skeleton component
 */
const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.25rem',
  animate = true,
  className = '',
  variant = 'rectangle',
  lines = 1,
  gap = '0.5rem',
}) => {
  // Base styles for all skeleton types
  const baseStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    backgroundColor: 'var(--skeleton-bg, #e2e8f0)',
    display: 'block',
  };
  
  // Adjust styles based on variant
  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'circle':
        return {
          ...baseStyle,
          borderRadius: '50%',
          aspectRatio: '1 / 1', // Ensure it's a perfect circle
        };
      case 'text':
        return baseStyle;
      default:
        return baseStyle;
    }
  };
  
  // Animation properties
  const animationProps = animate ? {
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        repeat: Infinity,
        duration: 1.5,
      },
    },
  } : {};
  
  // Render multiple lines for text variant
  if (variant === 'text' && lines > 1) {
    return (
      <div 
        className={`skeleton-text ${className}`}
        style={{ display: 'flex', flexDirection: 'column', gap: typeof gap === 'number' ? `${gap}px` : gap }}
        data-testid="skeleton-text-multi"
      >
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className="skeleton-line"
            style={{
              ...getVariantStyle(),
              width: index === lines - 1 && lines > 1 ? '80%' : width, // Make last line shorter
            }}
            {...animationProps}
            data-testid={`skeleton-line-${index}`}
          />
        ))}
      </div>
    );
  }
  
  // Render single skeleton
  return (
    <motion.div
      className={`skeleton ${variant} ${className}`}
      style={getVariantStyle()}
      {...animationProps}
      data-testid={`skeleton-${variant}`}
    />
  );
};

export default Skeleton;