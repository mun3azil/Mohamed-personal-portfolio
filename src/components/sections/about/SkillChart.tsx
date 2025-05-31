'use client';

import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, memo } from 'react';

interface SkillChartProps {
  name: string;
  percentage: number;
  color?: 'primary' | 'secondary' | 'accent';
  icon?: React.ReactNode;
  description?: string;
  index?: number;
}

const SkillChart = ({
  name,
  percentage,
  color = 'primary',
  icon,
  description,
  index = 0
}: SkillChartProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  // For counting up animation
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      // Animate percentage counter
      const start = 0;
      const end = percentage;
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smoother animation
        const easeOutQuad = (t: number) => t * (2 - t);
        const easedProgress = easeOutQuad(progress);

        const currentValue = Math.floor(easedProgress * end);
        setDisplayPercentage(currentValue);

        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16); // ~60fps

      return () => clearInterval(timer);
    } else if (prefersReducedMotion) {
      // If user prefers reduced motion, just set the final value
      setDisplayPercentage(percentage);
    }
  }, [isInView, percentage, prefersReducedMotion]);

  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    accent: 'text-accent-600 dark:text-accent-400',
  };

  const bgColorClasses = {
    primary: 'bg-primary-600 dark:bg-primary-400',
    secondary: 'bg-secondary-600 dark:bg-secondary-400',
    accent: 'bg-accent-600 dark:bg-accent-400',
  };

  const gradientClasses = {
    primary: 'from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600',
    secondary: 'from-secondary-500 to-secondary-700 dark:from-secondary-400 dark:to-secondary-600',
    accent: 'from-accent-500 to-accent-700 dark:from-accent-400 dark:to-accent-600',
  };

  const trackColorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/30',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/30',
    accent: 'bg-accent-100 dark:bg-accent-900/30',
  };

  // Calculate the circumference of the circle
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(isInView ? displayPercentage : 0) * circumference / 100} ${circumference}`;

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center group"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      aria-label={`${name}: ${percentage}% proficiency`}
    >
      <div className="relative w-24 h-24 mb-4">
        {/* Skill icon (if provided) */}
        {icon && (
          <motion.div
            className={`absolute inset-0 flex items-center justify-center z-10 ${colorClasses[color]}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: index * 0.1 + 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            style={{ opacity: isHovered ? 0 : 1 }}
            aria-hidden="true"
          >
            {icon}
          </motion.div>
        )}

        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            className={`${trackColorClasses[color]} transition-all duration-300`}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
          />

          {/* Progress Circle with gradient */}
          <motion.circle
            className={`bg-gradient-to-r ${gradientClasses[color]} transition-all duration-300`}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke={`url(#gradient-${name.replace(/\s+/g, '-').toLowerCase()})`}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={prefersReducedMotion ? 0 : circumference * 0.25} // Start from top
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.5,
              ease: "easeOut"
            }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`gradient-${name.replace(/\s+/g, '-').toLowerCase()}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                className={color === 'primary'
                  ? 'text-primary-500 dark:text-primary-400'
                  : color === 'secondary'
                    ? 'text-secondary-500 dark:text-secondary-400'
                    : 'text-accent-500 dark:text-accent-400'}
                stopColor="currentColor"
              />
              <stop
                offset="100%"
                className={color === 'primary'
                  ? 'text-primary-700 dark:text-primary-600'
                  : color === 'secondary'
                    ? 'text-secondary-700 dark:text-secondary-600'
                    : 'text-accent-700 dark:text-accent-600'}
                stopColor="currentColor"
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`text-xl font-bold ${colorClasses[color]} transition-opacity duration-300`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: isHovered ? 0 : 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            {displayPercentage}%
          </motion.span>
        </div>

        {/* Hover description */}
        <AnimatePresence>
          {isHovered && description && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-light-200/90 dark:bg-dark-100/90 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs text-center px-2 text-dark-100 dark:text-light-100">
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.h3
        className="text-lg font-medium text-dark-100 dark:text-light-100 relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      >
        {name}
        <motion.span
          className={`absolute -bottom-1 left-0 h-0.5 ${bgColorClasses[color]} transition-all duration-300`}
          initial={{ width: 0 }}
          animate={isInView ? { width: isHovered ? '100%' : '0%' } : { width: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />
      </motion.h3>
    </motion.div>
  );
};

export default memo(SkillChart);
