'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useHeroMotion } from '@/hooks/useHeroMotion';

interface ScrollIndicatorProps {
  className?: string;
}

const ScrollIndicator = memo(({ className = '' }: ScrollIndicatorProps) => {
  const { variants, scrollIndicatorAnimation, prefersReducedMotion } = useHeroMotion();

  const handleScrollClick = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.div
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group ${className}`}
      variants={variants.scrollIndicator}
      initial="hidden"
      animate="visible"
      onClick={handleScrollClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleScrollClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Scroll down to about section"
      style={{
        willChange: prefersReducedMotion ? 'auto' : 'transform'
      }}
    >
      {/* Mouse Container */}
      <motion.div
        className="w-6 h-10 rounded-full border-2 border-dark-100/60 dark:border-light-100/60 flex justify-center p-1 group-hover:border-primary-600 dark:group-hover:border-primary-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-200"
        animate={scrollIndicatorAnimation.mouse}
        whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      >
        {/* Mouse Wheel */}
        <motion.div
          className="w-1 bg-dark-100/60 dark:bg-light-100/60 rounded-full group-hover:bg-primary-600 dark:group-hover:bg-primary-400 transition-colors duration-300"
          animate={scrollIndicatorAnimation.wheel}
          style={{
            willChange: prefersReducedMotion ? 'auto' : 'height'
          }}
        />
      </motion.div>

      {/* Scroll Text */}
      <motion.div
        className="mt-3 text-xs font-medium text-dark-100/60 dark:text-light-100/60 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="block text-center">Scroll</span>
        <motion.svg
          className="w-3 h-3 mx-auto mt-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={prefersReducedMotion ? {} : { y: [0, 3, 0] }}
          transition={prefersReducedMotion ? {} : {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';

export default ScrollIndicator;
