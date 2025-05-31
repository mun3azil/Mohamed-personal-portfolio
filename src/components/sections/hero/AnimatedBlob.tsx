'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useHeroMotion } from '@/hooks/useHeroMotion';

interface AnimatedBlobProps {
  className?: string;
  duration?: number;
  reverse?: boolean;
}

const AnimatedBlob = memo(({ className = '', duration = 20, reverse = false }: AnimatedBlobProps) => {
  const { blobAnimation, prefersReducedMotion } = useHeroMotion();

  // Adjust animation based on reverse prop
  const animation = {
    ...blobAnimation,
    rotate: reverse
      ? (prefersReducedMotion ? 0 : [0, -5, 0, 5, 0])
      : (prefersReducedMotion ? 0 : [0, 5, 0, -5, 0]),
    transition: {
      ...blobAnimation.transition,
      duration: duration
    }
  };

  return (
    <motion.div
      className={`${className} select-none`}
      animate={animation}
      style={{
        willChange: prefersReducedMotion ? 'auto' : 'transform, border-radius'
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        role="img"
        aria-label="Decorative animated blob shape"
      >
        <defs>
          <linearGradient id={`blobGradient-${reverse ? 'reverse' : 'normal'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#blobGradient-${reverse ? 'reverse' : 'normal'})`}
          d="M39.9,-65.7C51.1,-58.4,59.5,-46.6,65.8,-33.8C72.1,-21,76.3,-7.1,74.9,6.2C73.5,19.5,66.5,32.2,57.4,43.4C48.3,54.6,37.1,64.3,24.2,69.7C11.3,75.1,-3.2,76.2,-16.9,73C-30.6,69.8,-43.5,62.3,-53.8,51.7C-64.1,41.1,-71.8,27.4,-74.6,12.7C-77.4,-2,-75.3,-17.7,-68.8,-30.7C-62.3,-43.7,-51.4,-54,-39.1,-60.9C-26.8,-67.8,-13.4,-71.3,0.5,-72.1C14.4,-72.9,28.8,-72.9,39.9,-65.7Z"
          transform="translate(100 100)"
        />
      </svg>
    </motion.div>
  );
});

AnimatedBlob.displayName = 'AnimatedBlob';

export default AnimatedBlob;
