'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Portal from './Portal';


interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
  
  /**
   * The content of the modal
   */
  children: React.ReactNode;
  
  /**
   * The title of the modal
   */
  title?: React.ReactNode;
  
  /**
   * Custom CSS class name for the modal container
   */
  className?: string;
  
  /**
   * Custom CSS class name for the modal content
   */
  contentClassName?: string;
  
  /**
   * Whether to close the modal when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  
  /**
   * Whether to close the modal when pressing Escape key
   * @default true
   */
  closeOnEsc?: boolean;
  
  /**
   * Whether to show a close button
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * The size of the modal
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * The ID of the modal for accessibility
   */
  id?: string;
  
  /**
   * Whether to disable the portal and render the modal inline
   * @default false
   */
  disablePortal?: boolean;
  
  /**
   * Custom footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Whether to disable animations
   * @default false
   */
  disableAnimation?: boolean;
}

/**
 * Modal component for displaying content in a dialog
 * 
 * @param props Component props
 * @returns Modal component
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  contentClassName = '',
  closeOnOutsideClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  size = 'md',
  id,
  disablePortal = false,
  footer,
  disableAnimation = false,
}) => {
  // State to track if the modal is mounted
  const [isMounted, setIsMounted] = useState(false);
  
  // Ref for the modal content
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Set mounted to true on client-side
  useEffect(() => {
    setIsMounted(true);
    
    return () => setIsMounted(false);
  }, []);
  
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isMounted && isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore scrolling when modal is closed
      document.body.style.overflow = '';
    };
  }, [isMounted, isOpen, closeOnEsc, onClose]);
  
  // Handle outside click
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnOutsideClick &&
      contentRef.current &&
      !contentRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };
  
  // Get size class
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full m-4';
      default:
        return 'max-w-md';
    }
  };
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };
  
  // Modal content
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 ${className}`}
          initial={disableAnimation ? 'visible' : 'hidden'}
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.2 }}
          onClick={handleOutsideClick}
          data-testid="modal-overlay"
          aria-modal="true"
          role="dialog"
          aria-labelledby={title ? `modal-title-${id || ''}` : undefined}
        >
          <motion.div
            ref={contentRef}
            className={`relative mx-auto my-8 w-full rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800 ${getSizeClass()} ${contentClassName}`}
            initial={disableAnimation ? 'visible' : 'hidden'}
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-content"
          >
            {/* Modal header */}
            {(title || showCloseButton) && (
              <div className="mb-4 flex items-center justify-between">
                {title && (
                  <h3
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                    id={`modal-title-${id || ''}`}
                    data-testid="modal-title"
                  >
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={onClose}
                    aria-label="Close modal"
                    data-testid="modal-close-button"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {/* Modal body */}
            <div className="space-y-4" data-testid="modal-body">
              {children}
            </div>
            
            {/* Modal footer */}
            {footer && (
              <div className="mt-4 flex items-center justify-end space-x-2" data-testid="modal-footer">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  // If not mounted (server-side), render nothing
  if (!isMounted) {
    return null;
  }
  
  // Render with or without portal
  return disablePortal ? modalContent : <Portal>{modalContent}</Portal>;
};

export default Modal;