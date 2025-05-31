'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useTranslations } from 'next-intl';

interface BlogCategoryTagProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

const BlogCategoryTag = ({ 
  category, 
  size = 'sm', 
  onClick, 
  isActive = false,
  className = '' 
}: BlogCategoryTagProps) => {
  const t = useTranslations('blog.categories');
  
  // Category colors mapping
  const categoryColors: Record<string, string> = {
    'technical': 'bg-blue-600 hover:bg-blue-700',
    'personal': 'bg-purple-600 hover:bg-purple-700',
    'learning': 'bg-green-600 hover:bg-green-700',
    'all': 'bg-primary-600 hover:bg-primary-700',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-base',
  };
  
  // Get color class based on category
  const colorClass = categoryColors[category] || 'bg-primary-600 hover:bg-primary-700';
  
  // Get translated category label
  const categoryLabel = t(category as any) || category;
  
  return (
    <motion.span
      className={`
        ${sizeClasses[size]} 
        ${colorClass} 
        ${isActive ? 'ring-2 ring-white/50' : ''} 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
        rounded-full font-medium text-white inline-flex items-center justify-center transition-colors
      `}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick && isActive ? true : undefined}
    >
      {categoryLabel}
    </motion.span>
  );
};

export default memo(BlogCategoryTag);
