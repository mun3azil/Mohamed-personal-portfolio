/**
 * Performance monitoring utilities for Core Web Vitals
 */

// Types for Web Vitals metrics
export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

/**
 * Get the rating for a metric value
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Instead of using any, extend the Window interface in src/types/global.d.ts
// and use type guards for window.gtag and window.va

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: WebVitalMetric) {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag: (...args: unknown[]) => void }).gtag === 'function') {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Example: Send to Vercel Analytics
    if (typeof window !== 'undefined' && typeof (window as unknown as { va: (...args: unknown[]) => void }).va === 'function') {
      (window as unknown as { va: (...args: unknown[]) => void }).va('track', 'Web Vitals', {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Dynamic import of web-vitals to avoid SSR issues
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('CLS', metric.value),
      });
    });

    onFID((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('FID', metric.value),
      });
    });

    onFCP((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('FCP', metric.value),
      });
    });

    onLCP((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('LCP', metric.value),
      });
    });

    onTTFB((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('TTFB', metric.value),
      });
    });

    onINP((metric) => {
      reportWebVitals({
        ...metric,
        rating: getRating('INP', metric.value),
      });
    });
  }).catch((error) => {
    console.warn('Failed to load web-vitals:', error);
  });
}

/**
 * Performance observer for custom metrics
 */
export class PerformanceObserver {
  private observers: globalThis.PerformanceObserver[] = [];

  /**
   * Observe resource loading times
   */
  observeResources() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new window.PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Log slow resources in development
          if (process.env.NODE_ENV === 'development' && resourceEntry.duration > 1000) {
            console.warn(`[Performance] Slow resource: ${resourceEntry.name} (${Math.round(resourceEntry.duration)}ms)`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  /**
   * Observe navigation timing
   */
  observeNavigation() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new window.PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Calculate key metrics
          const metrics = {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstByte: navEntry.responseStart - navEntry.requestStart,
            domInteractive: navEntry.domInteractive - navEntry.startTime,
          };

          if (process.env.NODE_ENV === 'development') {
            console.log('[Performance] Navigation metrics:', metrics);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  /**
   * Disconnect all observers
   */
  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Performance monitoring service
 */
export class PerformanceMonitorService {
  private static instance: PerformanceMonitorService;
  private observers: PerformanceObserver[] = [];
  private metrics: Record<string, WebVitalMetric> = {};

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initPerformanceObservers();
    }
  }

  /**
   * Get the singleton instance of PerformanceMonitor
   */
  public static getInstance(): PerformanceMonitorService {
    if (!PerformanceMonitorService.instance) {
      PerformanceMonitorService.instance = new PerformanceMonitorService();
    }
    return PerformanceMonitorService.instance;
  }

  private initPerformanceObservers() {
    // Initialize performance observers here
    // This is a placeholder implementation
  }

  public startMonitoring() {
    if (typeof window === 'undefined') return;
    initPerformanceMonitoring();
  }

  public stopMonitoring() {
    if (typeof window === 'undefined') return;
    this.observers.forEach(observer => {
      observer.disconnect();
    });
  }

  public getMetric(name: string): WebVitalMetric | undefined {
    return this.metrics[name];
  }

  public setMetric(metric: WebVitalMetric) {
    this.metrics[metric.name] = metric;
  }
}

// Initialize and start monitoring when the script loads in the browser
if (typeof window !== 'undefined') {
  const monitor = PerformanceMonitorService.getInstance();
  monitor.startMonitoring();
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontUrls = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-var-italic.woff2',
  ];

  fontUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = document.querySelectorAll('img[data-critical="true"]');
  criticalImages.forEach((img) => {
    if (img instanceof HTMLImageElement && img.dataset.src) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = img.dataset.src;
      preloadLink.as = 'image';
      document.head.appendChild(preloadLink);

      // Also load the image directly
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
}

/**
 * Lazy load images
 */
export function lazyLoadImages() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const images = document.querySelectorAll('img[data-src]:not([data-critical="true"])');
  if (images.length === 0) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}
