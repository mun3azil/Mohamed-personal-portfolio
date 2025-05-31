'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

interface ProjectTagProps {
  tag: string;
  index?: number;
  onClick?: () => void;
  isActive?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const tagColors: Record<string, string> = {
  'React': 'bg-blue-500/80 dark:bg-blue-600/80',
  'React Native': 'bg-blue-600/80 dark:bg-blue-700/80',
  'Next.js': 'bg-black/80 dark:bg-gray-800/80 text-white',
  'Node.js': 'bg-green-600/80 dark:bg-green-700/80',
  'TypeScript': 'bg-blue-700/80 dark:bg-blue-800/80',
  'JavaScript': 'bg-yellow-500/80 dark:bg-yellow-600/80 text-black dark:text-white',
  'MongoDB': 'bg-green-500/80 dark:bg-green-600/80',
  'Firebase': 'bg-orange-500/80 dark:bg-orange-600/80',
  'Redux': 'bg-purple-600/80 dark:bg-purple-700/80',
  'Tailwind': 'bg-cyan-500/80 dark:bg-cyan-600/80',
  'CSS': 'bg-blue-400/80 dark:bg-blue-500/80',
  'HTML': 'bg-orange-600/80 dark:bg-orange-700/80',
  'API': 'bg-indigo-500/80 dark:bg-indigo-600/80',
  'GraphQL': 'bg-pink-600/80 dark:bg-pink-700/80',
  'Chart.js': 'bg-green-400/80 dark:bg-green-500/80',
  'Framer Motion': 'bg-purple-500/80 dark:bg-purple-600/80',
  // Default color for any other tags
  'default': 'bg-primary-600/80 dark:bg-primary-700/80',
};

const ProjectTag = ({ 
  tag, 
  index = 0, 
  onClick, 
  isActive = false,
  size = 'sm',
  className = ''
}: ProjectTagProps) => {
  // Determine tag color based on tag name
  const tagColor = tagColors[tag] || tagColors.default;
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };
  
  // Animation variants
  const tagVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        delay: index * 0.05
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.span
      className={`${sizeClasses[size]} rounded-full ${tagColor} text-white font-medium inline-flex items-center justify-center ${
        onClick ? 'cursor-pointer' : ''
      } ${isActive ? 'ring-2 ring-white/50' : ''} ${className}`}
      variants={tagVariants}
      initial="initial"
      animate="animate"
      whileHover={onClick ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick && isActive ? true : undefined}
    >
      {tag}
    </motion.span>
  );
};

export default memo(ProjectTag);
