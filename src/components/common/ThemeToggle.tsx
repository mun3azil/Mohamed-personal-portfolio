'use client';

import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import useLocalStorage from '@/hooks/useLocalStorage';


interface ThemeToggleProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to show the theme name
   */
  showLabel?: boolean;
  
  /**
   * Custom icon for light theme
   */
  lightIcon?: React.ReactNode;
  
  /**
   * Custom icon for dark theme
   */
  darkIcon?: React.ReactNode;
  
  /**
   * Custom icon for system theme
   */
  systemIcon?: React.ReactNode;
  
  /**
   * Whether to include system theme option
   */
  includeSystem?: boolean;
}

/**
 * Theme toggle component with localStorage persistence
 * 
 * @param props Component props
 * @returns Theme toggle component
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  lightIcon = '☀️',
  darkIcon = '🌙',
  systemIcon = '🖥️',
  includeSystem = true,
}) => {
  // Use next-themes for theme management
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Use localStorage to persist user preference for system theme
  const [preferSystemTheme, setPreferSystemTheme] = useLocalStorage('preferSystemTheme', false);
  
  // Determine the current theme
  const currentTheme = theme || 'system';
  
  // Set the theme based on user preference
  useEffect(() => {
    if (preferSystemTheme && theme !== 'system') {
      setTheme('system');
    }
  }, [preferSystemTheme, theme, setTheme]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (currentTheme === 'dark' || (currentTheme === 'system' && resolvedTheme === 'dark')) {
      setTheme('light');
      setPreferSystemTheme(false);
    } else {
      setTheme('dark');
      setPreferSystemTheme(false);
    }
  };
  
  // Set theme to system
  const setSystemTheme = () => {
    setTheme('system');
    setPreferSystemTheme(true);
  };
  
  // Get the current theme icon
  const getThemeIcon = () => {
    if (currentTheme === 'system') {
      return systemIcon;
    }
    return currentTheme === 'dark' ? darkIcon : lightIcon;
  };
  
  // Get the current theme label
  const getThemeLabel = () => {
    if (currentTheme === 'system') {
      return 'System';
    }
    return currentTheme === 'dark' ? 'Dark' : 'Light';
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label={`Toggle theme, current theme is ${getThemeLabel()}`}
      >
        <span className="text-xl">{getThemeIcon()}</span>
        {showLabel && (
          <span className="ml-2">{getThemeLabel()}</span>
        )}
      </button>
      
      {includeSystem && (
        <button
          type="button"
          onClick={setSystemTheme}
          className={`ml-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 ${currentTheme === 'system' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          aria-label="Use system theme"
        >
          <span className="text-xl">{systemIcon}</span>
          {showLabel && (
            <span className="ml-2">System</span>
          )}
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;