import { useState, useEffect, useCallback } from 'react';


/**
 * Custom hook for detecting if a media query matches
 * 
 * @param query The media query to check
 * @returns Boolean indicating if the media query matches
 */
function useMediaQueryBase(query: string): boolean {
  // Initialize with null and update after mount to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Create a memoized match media function
  const getMatches = useCallback((query: string): boolean => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  }, []);

  // Handle change event
  const handleChange = useCallback(() => {
    setMatches(getMatches(query));
  }, [query, getMatches]);

  // Set up the listener and initial state
  useEffect(() => {
    // Set mounted to true
    setMounted(true);
    
    // Set initial value
    setMatches(getMatches(query));

    // Create media query list
    const matchMedia = window.matchMedia(query);

    // Listen for changes
    handleChange();

    // Use the right event listener based on browser support
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange);
    } else {
      // For older browsers
      matchMedia.addListener(handleChange);
    }

    // Clean up
    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        matchMedia.removeListener(handleChange);
      }
    };
  }, [query, getMatches, handleChange]);

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false;
}

// Common media query breakpoints
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  motion: '(prefers-reduced-motion: no-preference)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
};

export default useMediaQueryBase;