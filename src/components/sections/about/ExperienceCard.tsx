'use client';

import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useRef, useState, memo } from 'react';

interface ExperienceCardProps {
  number: number;
  label: string;
  icon: React.ReactNode;
  description?: string;
  delay?: number;
  index?: number;
}

const ExperienceCard = ({
  number,
  label,
  icon,
  description,
  delay = 0,
  index = 0
}: ExperienceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  // For counting animation
  const [displayNumber, setDisplayNumber] = useState(0);

  // Start counting animation when in view
  useState(() => {
    if (isInView && !prefersReducedMotion) {
      const start = 0;
      const end = number;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
        const easedProgress = easeOutQuart(progress);

        const currentValue = Math.floor(easedProgress * end);
        setDisplayNumber(currentValue);

        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16); // ~60fps

      return () => clearInterval(timer);
    } else if (prefersReducedMotion) {
      setDisplayNumber(number);
    }
  });

  // Card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Icon variants
  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: delay + 0.1
      }
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Number variants
  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: delay + 0.2
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`bg-light-200 dark:bg-dark-100 rounded-2xl p-6 flex flex-col items-center shadow-md transition-all duration-300 ${
        isClicked ? 'bg-primary-50 dark:bg-dark-200' : ''
      }`}
      variants={prefersReducedMotion ? {} : cardVariants}
      initial="hidden"
      animate={isInView ? (isHovered ? "hover" : "visible") : "hidden"}
      whileTap={prefersReducedMotion ? {} : "tap"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${number}+`}
      aria-expanded={isClicked}
      aria-describedby={description ? `exp-desc-${index}` : undefined}
    >
      <motion.div
        className="text-primary-600 dark:text-primary-400 mb-4 text-3xl"
        variants={prefersReducedMotion ? {} : iconVariants}
        animate={isInView ? (isHovered ? "hover" : "visible") : "hidden"}
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      <motion.div
        className="text-4xl font-bold text-dark-100 dark:text-light-100 mb-2 relative"
        variants={prefersReducedMotion ? {} : numberVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <span className="relative z-10">
          {isInView ? displayNumber : 0}+
        </span>

        {/* Decorative underline */}
        <motion.span
          className="absolute -bottom-1 left-0 right-0 h-2 bg-primary-200 dark:bg-primary-900/30 rounded-full -z-10"
          initial={{ width: 0 }}
          animate={isInView ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          aria-hidden="true"
        />
      </motion.div>

      <motion.p
        className="text-dark-100/80 dark:text-light-100/80 text-center font-medium"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
      >
        {label}
      </motion.p>

      {/* Expandable description */}
      <AnimatePresence>
        {isClicked && description && (
          <motion.div
            id={`exp-desc-${index}`}
            className="mt-4 text-sm text-dark-100/70 dark:text-light-100/70 text-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(ExperienceCard);
