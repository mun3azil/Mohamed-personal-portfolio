'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from './Toast';


interface ToastOptions {
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

interface ToastItem extends ToastOptions {
  /**
   * Unique ID for the toast
   */
  id: string;
  
  /**
   * The message to display in the toast
   */
  message: string;
}

interface ToastContextValue {
  /**
   * Show a toast with the given message and options
   */
  showToast: (message: string, options?: ToastOptions) => string;
  
  /**
   * Hide a toast with the given ID
   */
  hideToast: (id: string) => void;
  
  /**
   * Hide all toasts
   */
  hideAllToasts: () => void;
  
  /**
   * Show a success toast
   */
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  
  /**
   * Show an error toast
   */
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  
  /**
   * Show a warning toast
   */
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  
  /**
   * Show an info toast
   */
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  /**
   * Children components
   */
  children: React.ReactNode;
  
  /**
   * Default options for all toasts
   */
  defaultOptions?: ToastOptions;
  
  /**
   * Maximum number of toasts to show at once
   * @default 5
   */
  maxToasts?: number;
}

/**
 * Provider component for managing toasts
 * 
 * @param props Component props
 * @returns ToastProvider component
 */
const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultOptions = {},
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Generate a unique ID for a toast
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  
  // Show a toast with the given message and options
  const showToast = useCallback((message: string, options?: ToastOptions) => {
    const id = generateId();
    
    setToasts((prevToasts) => {
      // Remove oldest toasts if we exceed the maximum
      const newToasts = [...prevToasts];
      if (newToasts.length >= maxToasts) {
        newToasts.shift(); // Remove the oldest toast
      }
      
      return [...newToasts, { id, message, ...defaultOptions, ...options }];
    });
    
    return id;
  }, [generateId, maxToasts, defaultOptions]);
  
  // Hide a toast with the given ID
  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);
  
  // Hide all toasts
  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  // Convenience methods for different toast types
  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'success' });
    },
    [showToast]
  );
  
  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'error' });
    },
    [showToast]
  );
  
  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'warning' });
    },
    [showToast]
  );
  
  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'info' });
    },
    [showToast]
  );
  
  const contextValue: ToastContextValue = {
    showToast,
    hideToast,
    hideAllToasts,
    success,
    error,
    warning,
    info,
  };
  
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          showCloseButton={toast.showCloseButton}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

/**
 * Hook for using the toast context
 * 
 * @returns Toast context value
 * @throws Error if used outside of a ToastProvider
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastProvider;