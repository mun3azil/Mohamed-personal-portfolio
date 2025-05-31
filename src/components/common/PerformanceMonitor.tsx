'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring, PerformanceObserver, preloadCriticalResources, PerformanceMonitorService } from '@/lib/performance';

/**
 * Performance monitoring component that tracks Core Web Vitals
 * and other performance metrics
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initPerformanceMonitoring();

    // Preload critical resources
    preloadCriticalResources();

    // Initialize performance observers
    const performanceMonitorService = PerformanceMonitorService.getInstance();
    performanceMonitorService.startMonitoring();

    // Cleanup on unmount
    return () => {
      performanceMonitorService.stopMonitoring();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
