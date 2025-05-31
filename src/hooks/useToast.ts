'use client';

import { useToast as useToastProvider } from '@/components/common/ToastProvider';


/**
 * Hook for using toast notifications throughout the application
 * 
 * @returns Toast methods for showing different types of notifications
 */
const useToastBase = () => {
  // Get the toast context from the provider
  const toast = useToastProvider();
  
  return {
    /**
     * Show a toast notification
     * 
     * @param message - The message to display
     * @param options - Toast options (type, duration, position, etc.)
     * @returns The ID of the created toast
     */
    show: toast.showToast,
    
    /**
     * Show a success toast notification
     * 
     * @param message - The message to display
     * @param options - Toast options (duration, position, etc.)
     * @returns The ID of the created toast
     */
    success: toast.success,
    
    /**
     * Show an error toast notification
     * 
     * @param message - The message to display
     * @param options - Toast options (duration, position, etc.)
     * @returns The ID of the created toast
     */
    error: toast.error,
    
    /**
     * Show a warning toast notification
     * 
     * @param message - The message to display
     * @param options - Toast options (duration, position, etc.)
     * @returns The ID of the created toast
     */
    warning: toast.warning,
    
    /**
     * Show an info toast notification
     * 
     * @param message - The message to display
     * @param options - Toast options (duration, position, etc.)
     * @returns The ID of the created toast
     */
    info: toast.info,
    
    /**
     * Hide a specific toast notification
     * 
     * @param id - The ID of the toast to hide
     */
    hide: toast.hideToast,
    
    /**
     * Hide all toast notifications
     */
    hideAll: toast.hideAllToasts,
  };
};

export default useToastBase;