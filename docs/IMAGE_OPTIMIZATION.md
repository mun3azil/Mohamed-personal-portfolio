# Image Optimization Guide

This document outlines the image optimization strategy implemented in the portfolio project to ensure high-quality visuals with optimal performance.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Image Formats](#image-formats)
4. [Optimization Components](#optimization-components)
5. [Usage Guidelines](#usage-guidelines)
6. [Performance Considerations](#performance-considerations)
7. [Accessibility](#accessibility)
8. [Future Improvements](#future-improvements)

## Overview

The portfolio website uses a comprehensive image optimization strategy that includes:

- Modern image formats (WebP, AVIF) with fallbacks
- Responsive image sizing
- Lazy loading for non-critical images
- Automatic quality adjustments based on image type
- Fallback images for error handling
- Accessibility improvements with proper alt text

## Directory Structure

```
public/
├── images/
│   ├── optimized/
│   │   ├── profile/
│   │   ├── projects/
│   │   └── blog/
│   ├── fallbacks/
│   │   ├── profile-fallback.svg
│   │   ├── project-fallback.svg
│   │   ├── blog-fallback.svg
│   │   ├── hero-fallback.svg
│   │   └── default-fallback.svg
│   ├── hero/
│   └── icons/
└── ...
```

## Image Formats

- **Primary Format**: WebP (better compression, wide browser support)
- **Secondary Format**: AVIF (best compression, limited browser support)
- **Fallback Format**: JPG (universal support)
- **Vector Graphics**: SVG (for icons, logos, and decorative elements)

## Optimization Components

### 1. Next.js Configuration

The `next.config.ts` file includes image optimization settings:

```typescript
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### 2. OptimizedImage Component

A custom component that extends Next.js Image with additional features:

- Automatic responsive sizes based on image type
- Fallback image handling
- Automatic alt text generation
- Optimized quality settings

```tsx
<OptimizedImage
  src="/images/optimized/profile/mohamed.webp"
  alt="Mohamed"
  imageType="profile"
  fill
  className="object-cover"
  priority
/>
```

### 3. Image Utility Functions

Utility functions in `src/lib/imageUtils.ts` provide:

- Path transformation for optimized images
- Responsive size calculations
- Alt text generation
- Quality settings based on image type

## Usage Guidelines

### Profile Images

- Dimensions: 400x400px (1:1 aspect ratio)
- Format: WebP with JPG fallback
- Quality: 90% for WebP, 85% for JPG

### Project Images

- Dimensions: 800x600px (4:3 aspect ratio)
- Format: WebP with JPG fallback
- Quality: 80% for WebP, 75% for JPG

### Blog Images

- Dimensions: 800x450px (16:9 aspect ratio)
- Format: WebP with JPG fallback
- Quality: 80% for WebP, 75% for JPG

## Performance Considerations

- Use `priority` only for above-the-fold images
- Use `loading="lazy"` for below-the-fold images
- Specify appropriate `sizes` attribute for responsive images
- Use the correct image dimensions to avoid unnecessary scaling
- Consider using blur placeholders for large images

## Accessibility

- Always provide descriptive `alt` text for images
- Use empty `alt=""` for decorative images
- Ensure sufficient contrast for text overlays on images
- Consider users with reduced motion preferences

## Future Improvements

- Implement blur placeholders for better loading experience
- Add automatic image compression in the build process
- Implement responsive art direction for different viewports
- Add support for dark mode-specific images
- Implement image preloading for critical paths
