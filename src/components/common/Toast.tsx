'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Toast.module.css';


export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  /**
   * The message to display in the toast
   */
  message: string;
  
  /**
   * The type of toast
   * @default 'info'
   */
  type?: ToastType;
  
  /**
   * Duration in milliseconds to show the toast
   * @default 3000
   */
  duration?: number;
  
  /**
   * Whether the toast is visible
   * @default true
   */
  visible?: boolean;
  
  /**
   * Callback when the toast is closed
   */
  onClose?: () => void;
  
  /**
   * Custom CSS class name
   */
  className?: string;
  
  /**
   * Position of the toast
   * @default 'bottom-center'
   */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  
  /**
   * Whether to show a close button
   * @default true
   */
  showCloseButton?: boolean;
}

/**
 * Toast component for displaying notifications
 * 
 * @param props Component props
 * @returns Toast component
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  visible = true,
  onClose,
  className = '',
  position = 'bottom-center',
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  // Handle auto-close after duration
  useEffect(() => {
    setIsVisible(visible);
    
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);
  
  // Handle manual close
  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) onClose();
  }, [onClose]);
  
  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  // Get position CSS class based on position prop
  const getPositionClassName = (): string => {
    switch (position) {
      case 'top-left':
        return styles.toastTopLeft;
      case 'top-center':
        return styles.toastTopCenter;
      case 'top-right':
        return styles.toastTopRight;
      case 'bottom-left':
        return styles.toastBottomLeft;
      case 'bottom-right':
        return styles.toastBottomRight;
      case 'bottom-center':
      default:
        return styles.toastBottomCenter;
    }
  };
  
  // Get background color based on type
  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return 'var(--toast-success-bg, #10b981)';
      case 'error':
        return 'var(--toast-error-bg, #ef4444)';
      case 'warning':
        return 'var(--toast-warning-bg, #f59e0b)';
      case 'info':
      default:
        return 'var(--toast-info-bg, #3b82f6)';
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${styles.toast} ${styles[type]} ${getPositionClassName()} ${className}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: getBackgroundColor(),
          }}
          data-testid={`toast-${type}`}
        >
          <div className={styles.toastIcon}>
            {getIcon()}
          </div>
          <div className={styles.toastMessage}>
            {message}
          </div>
          {showCloseButton && (
            <button
              type="button"
              className={styles.toastClose}
              onClick={handleClose}
              aria-label="Close toast"
              data-testid="toast-close-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;