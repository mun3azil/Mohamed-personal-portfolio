'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { memo } from 'react';

interface SocialIconProps {
  name: string;
  url: string;
  icon: React.ReactNode;
  color?: string;
  className?: string;
}

const SocialIcon = ({ name, url, icon, color, className = '' }: SocialIconProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Define color classes based on social media platform
  const getColorClass = () => {
    if (color) return color;
    
    switch (name.toLowerCase()) {
      case 'github':
        return 'hover:text-gray-800 dark:hover:text-white';
      case 'linkedin':
        return 'hover:text-blue-600 dark:hover:text-blue-400';
      case 'twitter':
      case 'x':
        return 'hover:text-blue-400 dark:hover:text-blue-300';
      case 'instagram':
        return 'hover:text-pink-600 dark:hover:text-pink-400';
      case 'facebook':
        return 'hover:text-blue-700 dark:hover:text-blue-500';
      case 'youtube':
        return 'hover:text-red-600 dark:hover:text-red-500';
      case 'dribbble':
        return 'hover:text-pink-500 dark:hover:text-pink-400';
      case 'behance':
        return 'hover:text-blue-800 dark:hover:text-blue-600';
      default:
        return 'hover:text-primary-600 dark:hover:text-primary-400';
    }
  };
  
  // Animation variants
  const iconVariants = {
    initial: { 
      scale: 1,
      rotate: 0,
      y: 0
    },
    hover: { 
      scale: 1.15,
      rotate: prefersReducedMotion ? 0 : 5,
      y: prefersReducedMotion ? 0 : -3,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { 
      scale: 0.9,
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };
  
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-dark-100/80 dark:text-light-100/80 ${getColorClass()} transition-colors ${className}`}
      variants={prefersReducedMotion ? {} : iconVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      aria-label={`Visit ${name}`}
      title={`Visit ${name}`}
    >
      {icon}
    </motion.a>
  );
};

export default memo(SocialIcon);
