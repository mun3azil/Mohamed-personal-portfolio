'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef, memo } from 'react';
import { debounce } from '@/lib/utils';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceTime?: number;
}

const SearchInput = ({ 
  onSearch, 
  placeholder = 'Search projects...', 
  className = '',
  debounceTime = 300
}: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Debounced search function
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearch(value);
    }, debounceTime)
  ).current;
  
  // Update search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  // Clear search on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      onSearch('');
      inputRef.current?.blur();
    }
  };
  
  // Animation variants
  const containerVariants = {
    focus: { 
      scale: 1.02,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: { duration: 0.2 }
    },
    blur: { 
      scale: 1,
      boxShadow: 'none',
      transition: { duration: 0.2 }
    }
  };
  
  const iconVariants = {
    focus: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    blur: { 
      scale: 1,
      rotate: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const clearButtonVariants = {
    hidden: { opacity: 0, scale: 0, x: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: 0, 
      x: 10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`relative w-full ${className}`}
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="blur"
      animate={isFocused ? "focus" : "blur"}
    >
      <div className="relative">
        <motion.span
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-100/50 dark:text-light-100/50"
          variants={prefersReducedMotion ? {} : iconVariants}
          animate={isFocused ? "focus" : "blur"}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </motion.span>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 rounded-full bg-light-300 dark:bg-dark-100 text-dark-100 dark:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          aria-label="Search projects"
        />
        
        {query && (
          <motion.button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-100/50 dark:text-light-100/50 hover:text-dark-100 dark:hover:text-light-100 transition-colors"
            onClick={() => {
              setQuery('');
              onSearch('');
              inputRef.current?.focus();
            }}
            variants={prefersReducedMotion ? {} : clearButtonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default memo(SearchInput);
