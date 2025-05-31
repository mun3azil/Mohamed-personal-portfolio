'use client';

import { useState, useCallback } from 'react';


interface UseModalOptions {
  /**
   * Initial open state of the modal
   * @default false
   */
  defaultIsOpen?: boolean;
  
  /**
   * Callback when the modal is opened
   */
  onOpen?: () => void;
  
  /**
   * Callback when the modal is closed
   */
  onClose?: () => void;
}

/**
 * Hook for managing modal state
 * 
 * @param options - Modal options
 * @returns Modal state and methods
 */
function useModalBase(options: UseModalOptions = {}) {
  const { defaultIsOpen = false, onOpen, onClose } = options;
  
  // State for tracking if the modal is open
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  
  // Open the modal
  const open = useCallback(() => {
    setIsOpen(true);
    if (onOpen) onOpen();
  }, [onOpen]);
  
  // Close the modal
  const close = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);
  
  // Toggle the modal
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default useModalBase;