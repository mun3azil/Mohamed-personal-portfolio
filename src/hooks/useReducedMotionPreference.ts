'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Custom hook that combines Framer Motion's useReducedMotion with
 * the user's explicit preference from localStorage
 */
export function useReducedMotionPreference() {
  // Get system preference via Framer Motion
  const prefersReducedMotionSystem = useReducedMotion();
  
  // State for user's explicit preference (overrides system)
  const [userPreference, setUserPreference] = useState<boolean | null>(null);
  
  // Load user preference from localStorage on mount
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem('reducedMotion');
      if (savedPreference !== null) {
        setUserPreference(savedPreference === 'true');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);
  
  // Save user preference to localStorage
  const setReducedMotion = (value: boolean) => {
    try {
      localStorage.setItem('reducedMotion', String(value));
      setUserPreference(value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  // Toggle current preference
  const toggleReducedMotion = () => {
    const newValue = !(userPreference ?? prefersReducedMotionSystem);
    setReducedMotion(newValue);
  };
  
  // Final preference: user preference overrides system preference
  const prefersReducedMotion = userPreference !== null 
    ? userPreference 
    : prefersReducedMotionSystem;
  
  return {
    prefersReducedMotion,
    setReducedMotion,
    toggleReducedMotion,
    isSystemPreference: userPreference === null
  };
}