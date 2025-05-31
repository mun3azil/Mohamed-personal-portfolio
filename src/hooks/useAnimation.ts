'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

type AnimationVariantType = 'fade' | 'slide' | 'scale' | 'rotate' | 'stagger';
type DirectionType = 'up' | 'down' | 'left' | 'right' | 'none';

interface AnimationOptions {
  type?: AnimationVariantType | AnimationVariantType[];
  direction?: DirectionType;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  delayChildren?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  distance?: number;
  scale?: number;
  rotation?: number;
}

/**
 * Custom hook for creating reusable animation variants
 * @param options Animation configuration options
 * @returns Object with animation variants and motion preferences
 */
export function useAnimation(options: AnimationOptions = {}) {
  const {
    type = ['fade'],
    direction = 'up',
    duration = 0.6,
    delay = 0,
    staggerChildren = 0.1,
    delayChildren = 0.1,
    stiffness = 100,
    damping = 20,
    mass = 1,
    distance = 30,
    scale = 0.95,
    rotation = 0
  } = options;
  
  const prefersReducedMotion = useReducedMotion();
  const types = useMemo(() => Array.isArray(type) ? type : [type], [type]);

  // Memoized animation variants for performance
  const variants = useMemo(() => {
    // Base transition for spring animations
    const baseTransition = {
      type: "spring" as const,
      stiffness,
      damping,
      mass
    };

    // Simplified variants for users who prefer reduced motion
    const reducedVariants = {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.3,
            staggerChildren: 0.05,
            delayChildren: 0.05
          }
        }
      },
      item: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
      }
    };

    // Return reduced variants if user prefers reduced motion
    if (prefersReducedMotion) {
      return reducedVariants;
    }

    // Calculate direction-based offsets
    const getOffset = () => {
      switch (direction) {
        case 'up': return { y: distance };
        case 'down': return { y: -distance };
        case 'left': return { x: distance };
        case 'right': return { x: -distance };
        case 'none': return {};
        default: return { y: distance };
      }
    };

    // Build hidden state based on animation types
    const hiddenState: any = { transition: baseTransition };
    const visibleState: any = { transition: { ...baseTransition, delay } };

    if (types.includes('fade')) {
      hiddenState.opacity = 0;
      visibleState.opacity = 1;
    }

    if (types.includes('slide')) {
      const offset = getOffset();
      Object.assign(hiddenState, offset);

      if ('x' in offset) visibleState.x = 0;
      if ('y' in offset) visibleState.y = 0;
    }

    if (types.includes('scale')) {
      hiddenState.scale = scale;
      visibleState.scale = 1;
    }

    if (types.includes('rotate')) {
      hiddenState.rotate = rotation;
      visibleState.rotate = 0;
    }

    return {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            ...baseTransition,
            staggerChildren,
            delayChildren
          }
        }
      },
      item: {
        hidden: hiddenState,
        visible: visibleState
      },
      hover: {
        scale: 1.05,
        transition: { duration: 0.2 }
      },
      tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
      }
    };
  }, [prefersReducedMotion, types, direction, delay, staggerChildren,
      delayChildren, stiffness, damping, mass, distance, scale, rotation]);

  return {
    variants,
    prefersReducedMotion,
    willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
  };
}