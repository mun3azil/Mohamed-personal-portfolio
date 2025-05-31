'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { memo, useCallback } from 'react';
import BlogCategoryTag from './BlogCategoryTag';

interface FilterOption {
  id: string;
  label: string;
}

interface BlogFilterProps {
  options: FilterOption[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

const BlogFilter = ({ 
  options, 
  activeCategory, 
  onCategoryChange,
  className = ''
}: BlogFilterProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string) => {
    onCategoryChange(categoryId);
  }, [onCategoryChange]);
  
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

  return (
    <motion.div 
      className={`flex flex-wrap gap-2 ${className}`}
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      role="tablist"
      aria-label="Blog categories"
    >
      {options.map((option, index) => (
        <motion.div
          key={option.id}
          variants={prefersReducedMotion ? {} : itemVariants}
          custom={index}
          role="tab"
          aria-selected={activeCategory === option.id}
          aria-controls={`${option.id}-articles`}
          id={`${option.id}-tab`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCategoryChange(option.id);
            }
          }}
        >
          <BlogCategoryTag
            category={option.id}
            size="md"
            isActive={activeCategory === option.id}
            onClick={() => handleCategoryChange(option.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default memo(BlogFilter);
