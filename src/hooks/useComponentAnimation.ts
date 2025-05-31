'use client';

import { useMemo } from 'react';
import { useReducedMotionPreference } from './useReducedMotionPreference';
import { ANIMATION } from '@/lib/constants';

type ComponentType = 'hero' | 'header' | 'footer' | 'section';
type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface ComponentAnimationOptions {
  component: ComponentType;
  direction?: AnimationDirection;
  custom?: Record<string, any>;
}

/**
 * Custom hook for component-specific animations
 * Provides optimized, reusable animation variants for different components
 * 
 * @param options Configuration options for the animation
 * @returns Object with animation variants and motion preferences
 */
export function useComponentAnimation(options: ComponentAnimationOptions) {
  const { component, direction = 'up', custom = {} } = options;
  const { prefersReducedMotion } = useReducedMotionPreference();
  
  // Memoized animation variants for performance
  const variants = useMemo(() => {
    // Base transition for spring animations
    const baseTransition = {
      type: "spring" as const,
      stiffness: ANIMATION.STIFFNESS.MEDIUM,
      damping: ANIMATION.DAMPING.MEDIUM
    };

    // Simplified variants for users who prefer reduced motion
    const reducedVariants = {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: ANIMATION.DURATION.FAST,
            staggerChildren: ANIMATION.STAGGER.TIGHT,
            delayChildren: ANIMATION.DELAY.SHORT
          }
        }
      },
      item: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      logo: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      nav: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      navItem: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      floatingIcon: {
        hidden: { opacity: 0 },
        visible: { opacity: 0.5, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      scrollIndicator: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      blob: {
        hidden: { opacity: 0 },
        visible: { opacity: 0.2, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      cta: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: ANIMATION.DURATION.FAST } }
      },
      mobileMenu: {
        open: { opacity: 1, height: 'auto' },
        closed: { opacity: 0, height: 0 }
      },
      mobileMenuItems: {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: 20 }
      },
      hamburger: {
        open: {},
        closed: {}
      },
      socialIcon: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: ANIMATION.DURATION.FAST } }
      }
    };

    // Return reduced variants if user prefers reduced motion
    if (prefersReducedMotion) {
      return reducedVariants;
    }

    // Component-specific variants
    switch (component) {
      case 'hero':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: ANIMATION.STAGGER.NORMAL,
                delayChildren: ANIMATION.DELAY.SHORT,
                ...baseTransition
              }
            }
          },
          item: {
            hidden: { opacity: 0, y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0, x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0 },
            visible: {
              opacity: 1,
              y: 0,
              x: 0,
              transition: {
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }
          },
          floatingIcon: {
            hidden: { opacity: 0, scale: 0 },
            visible: (delay: number) => ({
              opacity: 0.7,
              scale: 1,
              transition: {
                delay,
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }),
            float: {
              y: [0, -10, 0],
              transition: {
                repeat: Infinity,
                duration: ANIMATION.DURATION.SLOW * 3,
                ease: "easeInOut"
              }
            }
          },
          scrollIndicator: {
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: ANIMATION.DELAY.LONG * 3,
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            },
            bounce: {
              y: [0, 10, 0],
              transition: {
                repeat: Infinity,
                duration: ANIMATION.DURATION.SLOW * 1.5,
                ease: "easeInOut"
              }
            },
            pulse: {
              height: ['20%', '40%', '20%'],
              transition: {
                repeat: Infinity,
                duration: ANIMATION.DURATION.SLOW * 1.5,
                ease: "easeInOut"
              }
            }
          },
          blob: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 0.2,
              scale: 1,
              transition: {
                duration: ANIMATION.DURATION.SLOW,
                ...baseTransition
              }
            }
          },
          cta: {
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                delay: ANIMATION.DELAY.MEDIUM,
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            },
            hover: { scale: 1.05, transition: { duration: ANIMATION.DURATION.FAST } },
            tap: { scale: 0.95, transition: { duration: ANIMATION.DURATION.FAST / 2 } }
          },
          ...custom
        };

      case 'header':
        return {
          container: {
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: ANIMATION.STAGGER.TIGHT,
                ...baseTransition
              }
            }
          },
          logo: {
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }
          },
          nav: {
            hidden: { opacity: 0, y: -10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: ANIMATION.DELAY.SHORT,
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }
          },
          navItem: {
            hidden: { opacity: 0, y: -10 },
            visible: (i: number) => ({
              opacity: 1,
              y: 0,
              transition: {
                delay: ANIMATION.DELAY.SHORT + (i * ANIMATION.STAGGER.TIGHT),
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            })
          },
          mobileMenu: {
            open: { 
              opacity: 1, 
              height: 'auto',
              transition: {
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            },
            closed: { 
              opacity: 0, 
              height: 0,
              transition: {
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }
          },
          mobileMenuItems: {
            open: (i: number) => ({
              opacity: 1, 
              x: 0,
              transition: {
                delay: i * ANIMATION.STAGGER.TIGHT,
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }),
            closed: { 
              opacity: 0, 
              x: 20,
              transition: {
                duration: ANIMATION.DURATION.FAST,
                ...baseTransition
              }
            }
          },
          hamburger: {
            open: {
              rotate: 45,
              transition: {
                duration: ANIMATION.DURATION.FAST,
                ...baseTransition
              }
            },
            closed: {
              rotate: 0,
              transition: {
                duration: ANIMATION.DURATION.FAST,
                ...baseTransition
              }
            }
          },
          hamburgerTop: {
            open: {
              rotate: 90,
              y: 6,
              transition: {
                duration: ANIMATION.DURATION.FAST,
                ...baseTransition
              }
            },
            closed: {
              rotate: 0,
              y: 0,
              transition: {
                duration: ANIMATION.DURATION.FAST,
                ...baseTransition
              }
            }
          },
          hamburgerBottom: {
            open: {
              rotate: 90,
              y: -6,
              transition: {
                duration: ANIMATION.DURATION.FAST,
                ...baseTransition
              }
            },
            closed: {
              rotate: 0,
              y: 0,
              transition: {
                duration: ANIMATION.DURATION.FAST,
                ...baseTransition
              }
            }
          },
          ...custom
        };

      case 'footer':
        return {
          container: {
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: ANIMATION.STAGGER.NORMAL,
                ...baseTransition
              }
            }
          },
          item: {
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }
          },
          socialIcon: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: (i: number) => ({
              opacity: 1,
              scale: 1,
              transition: {
                delay: i * ANIMATION.STAGGER.TIGHT,
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }),
            hover: { scale: 1.2, transition: { duration: ANIMATION.DURATION.FAST } }
          },
          ...custom
        };

      case 'section':
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: ANIMATION.STAGGER.NORMAL,
                ...baseTransition
              }
            }
          },
          item: {
            hidden: { opacity: 0, y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0, x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0 },
            visible: {
              opacity: 1,
              y: 0,
              x: 0,
              transition: {
                duration: ANIMATION.DURATION.MEDIUM,
                ...baseTransition
              }
            }
          },
          ...custom
        };

      default:
        return reducedVariants;
    }
  }, [component, direction, custom, prefersReducedMotion]);

  return {
    variants,
    prefersReducedMotion,
    willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
  };
}