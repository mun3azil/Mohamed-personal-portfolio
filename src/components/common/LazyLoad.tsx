'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface LazyLoadProps {
  /** The content to be lazy loaded */
  children: ReactNode;
  /** Optional placeholder to show while content is loading */
  placeholder?: ReactNode;
  /** Root margin for the intersection observer */
  rootMargin?: string;
  /** Threshold for the intersection observer */
  threshold?: number;
  /** Whether to freeze the visibility once the element is visible */
  freezeOnceVisible?: boolean;
  /** Whether to only trigger the intersection once */
  triggerOnce?: boolean;
  /** Delay in ms before starting to observe */
  delay?: number;
  /** Whether to skip lazy loading and render immediately */
  skip?: boolean;
  /** Additional className for the wrapper div */
  className?: string;
  /** Additional inline style for the wrapper div */
  style?: React.CSSProperties;
}

/**
 * LazyLoad component that renders children only when they enter the viewport
 * 
 * @param props Component props
 * @returns LazyLoad component
 */
export default function LazyLoad({
  children,
  placeholder = null,
  rootMargin = '0px',
  threshold = 0.1,
  freezeOnceVisible = true,
  triggerOnce = true,
  delay = 0,
  skip = false,
  className = '',
  style = {}
}: LazyLoadProps) {
  // State to track if content should be rendered
  const [shouldRender, setShouldRender] = useState(skip);
  
  // Use intersection observer to detect when element enters viewport
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    threshold,
    freezeOnceVisible,
    triggerOnce,
    delay
  });

  // Update shouldRender state when element becomes visible
  useEffect(() => {
    if (isVisible && !shouldRender) {
      setShouldRender(true);
    }
  }, [isVisible, shouldRender]);

  return (
    <div ref={ref} className={className} style={style}>
      {shouldRender ? children : placeholder}
    </div>
  );
}