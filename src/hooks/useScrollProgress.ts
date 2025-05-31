'use client';

import { useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';


/**
 * Custom hook for tracking scroll progress with smooth animations
 * @returns Object containing scroll progress values and spring animations
 */
function useScrollProgressBase() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get scroll progress from Framer Motion
  const { scrollYProgress } = useScroll();
  
  // Create smooth spring animation for progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Transform scroll progress to percentage
  const progressPercentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Track if user has scrolled (for navbar styling)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsScrolled(latest > 0.01); // Threshold for "scrolled" state
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  return {
    scrollYProgress,
    scaleX,
    progressPercentage,
    isScrolled
  };
}

/**
 * Hook for detecting scroll direction
 * @returns Object with scroll direction and position
 */
function useScrollDirectionBase() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
      }
      
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };
    
    const handleScroll = () => {
      requestAnimationFrame(updateScrollDirection);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDirection, lastScrollY]);
  
  return { scrollDirection, lastScrollY };
}

export { useScrollProgressBase as useScrollProgress, useScrollDirectionBase as useScrollDirection };
