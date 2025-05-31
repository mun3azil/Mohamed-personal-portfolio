'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';


/**
 * Custom hook for optimized hero section animations
 * Memoizes all animation variants and respects reduced motion preferences
 */
function useHeroMotionBase() {
  const prefersReducedMotion = useReducedMotion();

  // Memoized animation variants for performance
  const variants = useMemo(() => {
    const baseTransition = {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      mass: 1
    };

    const reducedVariants = {
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
      },
      item: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
      },
      floatingIcon: {
        hidden: { opacity: 0 },
        visible: { opacity: 0.7 }
      },
      scrollIndicator: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    };

    const fullVariants = {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            ...baseTransition,
            staggerChildren: 0.15,
            delayChildren: 0.1
          }
        }
      },
      item: {
        hidden: { 
          opacity: 0, 
          y: 30,
          scale: 0.95
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            ...baseTransition,
            duration: 0.6
          }
        }
      },
      floatingIcon: {
        hidden: { 
          opacity: 0, 
          scale: 0,
          rotate: -180
        },
        visible: { 
          opacity: 0.7, 
          scale: 1,
          rotate: 0,
          transition: {
            ...baseTransition,
            duration: 0.8
          }
        }
      },
      scrollIndicator: {
        hidden: { 
          opacity: 0, 
          y: 20,
          scale: 0.8
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            ...baseTransition,
            delay: 1.2,
            duration: 0.6
          }
        }
      },
      cta: {
        hidden: { 
          opacity: 0, 
          y: 20,
          scale: 0.9
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            ...baseTransition,
            duration: 0.5
          }
        },
        hover: { 
          scale: 1.05,
          transition: { duration: 0.2 }
        },
        tap: { 
          scale: 0.95,
          transition: { duration: 0.1 }
        }
      }
    };

    return prefersReducedMotion ? reducedVariants : fullVariants;
  }, [prefersReducedMotion]);

  // Memoized floating animation for icons
  const floatingAnimation = useMemo(() => {
    if (prefersReducedMotion) {
      return {};
    }

    return {
      y: [0, -12, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    };
  }, [prefersReducedMotion]);

  // Memoized scroll indicator animation
  const scrollIndicatorAnimation = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        mouse: {},
        wheel: {}
      };
    }

    return {
      mouse: {
        y: [0, 8, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      wheel: {
        height: ['20%', '40%', '20%'],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };
  }, [prefersReducedMotion]);

  // Memoized blob animation
  const blobAnimation = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        scale: 1,
        rotate: 0,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
      };
    }

    return {
      scale: [1, 1.05, 1.1, 1.05, 1],
      rotate: [0, 5, 0, -5, 0],
      borderRadius: [
        '30% 70% 70% 30% / 30% 30% 70% 70%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '30% 60% 70% 40% / 50% 60% 30% 60%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '30% 70% 70% 30% / 30% 30% 70% 70%'
      ],
      transition: {
        duration: 20,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    };
  }, [prefersReducedMotion]);

  return {
    variants,
    floatingAnimation,
    scrollIndicatorAnimation,
    blobAnimation,
    prefersReducedMotion
  };
}

const useHeroMotion = useHeroMotionBase;

/**
 * Hook for managing hero section intersection and visibility
 */
function useHeroVisibilityBase() {
  // This could be enhanced with Intersection Observer for better performance
  // For now, we'll use a simple approach that works with the existing structure
  return {
    isVisible: true, // Always visible for hero section
    shouldAnimate: true
  };
}

const useHeroVisibility = useHeroVisibilityBase;

export { useHeroMotion, useHeroVisibility };
