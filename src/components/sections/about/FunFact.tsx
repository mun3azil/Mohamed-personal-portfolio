'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useState, memo } from 'react';

interface FunFactProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}

const FunFact = ({ icon, title, description, index = 0 }: FunFactProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  
  // Card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    },
    hover: { 
      y: -5,
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
    hidden: { scale: 0, rotate: -10 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: index * 0.1 + 0.2
      }
    },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="bg-light-200 dark:bg-dark-100 rounded-xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
      variants={prefersReducedMotion ? {} : cardVariants}
      initial="hidden"
      animate={isInView ? (isHovered ? "hover" : "visible") : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
    >
      <motion.div
        className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400"
        variants={prefersReducedMotion ? {} : iconVariants}
        animate={isInView ? (isHovered ? "hover" : "visible") : "hidden"}
        aria-hidden="true"
      >
        {icon}
      </motion.div>
      
      <div>
        <motion.h4
          className="text-lg font-medium text-dark-100 dark:text-light-100 mb-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        >
          {title}
        </motion.h4>
        
        <motion.p
          className="text-sm text-dark-100/80 dark:text-light-100/80"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default memo(FunFact);
