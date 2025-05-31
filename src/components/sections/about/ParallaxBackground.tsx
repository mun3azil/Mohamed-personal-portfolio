'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, memo } from 'react';

interface ParallaxBackgroundProps {
  className?: string;
}

const ParallaxBackground = ({ className = '' }: ParallaxBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Create transforms for each element (always call hooks)
  const y1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const x1 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const x2 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const x3 = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 15]);

  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 0.9, 1.1]);
  const scale3 = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.8, 0.5]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.9, 0.6]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);

  // Skip parallax effects if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        ref={ref}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-200/20 dark:bg-primary-900/10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary-200/20 dark:bg-secondary-900/10" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-accent-200/20 dark:bg-accent-900/10" />
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Top left blob */}
      <motion.div 
        className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-200/20 dark:bg-primary-900/10"
        style={{ 
          y: y1,
          x: x1,
          rotate: rotate1,
          scale: scale1,
          opacity: opacity1
        }}
      />
      
      {/* Bottom right blob */}
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary-200/20 dark:bg-secondary-900/10"
        style={{ 
          y: y2,
          x: x2,
          rotate: rotate2,
          scale: scale2,
          opacity: opacity2
        }}
      />
      
      {/* Middle blob */}
      <motion.div 
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-accent-200/20 dark:bg-accent-900/10"
        style={{ 
          y: y3,
          x: x3,
          rotate: rotate3,
          scale: scale3,
          opacity: opacity3
        }}
      />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
    </div>
  );
};

export default memo(ParallaxBackground);

// Add this to your global CSS file:
/*
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

@media (prefers-color-scheme: dark) {
  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  }
}
*/
