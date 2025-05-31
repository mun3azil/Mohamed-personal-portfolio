'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { memo } from 'react';

interface FilterOption {
  id: string;
  label: string;
}

interface ProjectFilterProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  className?: string;
}

const ProjectFilter = ({ 
  options, 
  activeFilter, 
  onFilterChange,
  className = ''
}: ProjectFilterProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    active: { 
      scale: 1,
      backgroundColor: 'var(--primary-color)',
      color: 'white'
    },
    inactive: { 
      scale: 1,
      backgroundColor: 'var(--inactive-bg)',
      color: 'var(--inactive-text)'
    }
  };

  return (
    <motion.div 
      className={`flex flex-wrap gap-2 ${className}`}
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      role="tablist"
      aria-label="Project filters"
    >
      {options.map((option, index) => {
        const isActive = activeFilter === option.id;
        
        return (
          <motion.button
            key={option.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'bg-light-300 dark:bg-dark-100 text-dark-100 dark:text-light-100 hover:bg-primary-600/20'
            }`}
            onClick={() => onFilterChange(option.id)}
            whileHover={prefersReducedMotion ? {} : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
            variants={prefersReducedMotion ? {} : itemVariants}
            custom={index}
            style={{
              '--primary-color': 'var(--tw-color-primary-600)',
              '--inactive-bg': 'var(--tw-color-light-300)',
              '--inactive-text': 'var(--tw-color-dark-100)'
            } as React.CSSProperties}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${option.id}-projects`}
            id={`${option.id}-tab`}
            tabIndex={isActive ? 0 : -1}
          >
            {option.label}
            
            {/* Active indicator dot */}
            {isActive && (
              <motion.span
                className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-white"
                layoutId="activeFilterDot"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default memo(ProjectFilter);
