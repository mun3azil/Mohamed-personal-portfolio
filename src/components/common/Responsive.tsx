'use client';

import React, { ReactNode } from 'react';
import useMediaQuery, { breakpoints } from '@/hooks/useMediaQuery';


type BreakpointKey = keyof typeof breakpoints;

interface ResponsiveProps {
  /**
   * Content to render when the media query matches
   */
  children: ReactNode;
  
  /**
   * Show content only above this breakpoint
   */
  above?: BreakpointKey;
  
  /**
   * Show content only below this breakpoint
   */
  below?: BreakpointKey;
  
  /**
   * Show content only at this breakpoint
   */
  at?: BreakpointKey;
  
  /**
   * Custom media query to use instead of breakpoints
   */
  query?: string;
  
  /**
   * Content to render when the media query doesn't match
   */
  fallback?: ReactNode;
  
  /**
   * Whether to render the fallback when server-side rendering
   */
  ssr?: boolean;
}

/**
 * Component for conditionally rendering content based on media queries
 * 
 * @param props Component props
 * @returns Responsive component
 */
const Responsive: React.FC<ResponsiveProps> = ({
  children,
  above,
  below,
  at,
  query,
  fallback = null,
  ssr = false,
}) => {
  // Determine which media query to use
  let mediaQuery = query;

  if (!mediaQuery) {
    if (at) {
      mediaQuery = breakpoints[at];
    } else if (above && below) {
      // Between two breakpoints
      mediaQuery = `${breakpoints[above]} and ${breakpoints[below].replace('min-width', 'max-width')}`;
    } else if (above) {
      // Above a breakpoint
      mediaQuery = breakpoints[above];
    } else if (below) {
      // Below a breakpoint
      mediaQuery = breakpoints[below].replace('min-width', 'max-width');
    }
  }

  // Always call the hook - React hooks must be called in the same order every render
  const matches = useMediaQuery(mediaQuery || '(min-width: 0px)');

  // If no media query is specified, always render children
  if (!mediaQuery) {
    return <>{children}</>;
  }

  // During SSR, render based on the ssr prop
  if (typeof window === 'undefined') {
    return <>{ssr ? children : fallback}</>;
  }

  // Render children if the media query matches, otherwise render fallback
  return <>{matches ? children : fallback}</>;
};

// Create convenience components for common breakpoints
export const Mobile: React.FC<Omit<ResponsiveProps, 'below'>> = (props) => (
  <Responsive below="md" {...props} />
);

export const Tablet: React.FC<Omit<ResponsiveProps, 'at'>> = (props) => (
  <Responsive at="md" {...props} />
);

export const Desktop: React.FC<Omit<ResponsiveProps, 'above'>> = (props) => (
  <Responsive above="lg" {...props} />
);

export const TabletAndAbove: React.FC<Omit<ResponsiveProps, 'above'>> = (props) => (
  <Responsive above="md" {...props} />
);

export const TabletAndBelow: React.FC<Omit<ResponsiveProps, 'below'>> = (props) => (
  <Responsive below="lg" {...props} />
);

export default Responsive;