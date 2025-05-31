'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';


interface PortalProps {
  /**
   * The content to render in the portal
   */
  children: React.ReactNode;
  
  /**
   * The DOM node to mount the portal to
   * @default document.body
   */
  container?: HTMLElement | null;
  
  /**
   * Whether to disable the portal and render children normally
   * @default false
   */
  disabled?: boolean;
  
  /**
   * The ID to assign to the portal container
   */
  id?: string;
  
  /**
   * The class name to assign to the portal container
   */
  className?: string;
}

/**
 * Portal component for rendering content outside the normal DOM hierarchy
 * 
 * @param props Component props
 * @returns Portal component
 */
const Portal: React.FC<PortalProps> = ({
  children,
  container,
  disabled = false,
  id,
  className,
}) => {
  // State to track if we're in the browser
  const [mounted, setMounted] = useState(false);
  
  // Set mounted to true on client-side
  useEffect(() => {
    setMounted(true);
    
    return () => setMounted(false);
  }, []);
  
  // If disabled, render children normally
  if (disabled) {
    return <>{children}</>;
  }
  
  // If not mounted (server-side) or no document, render nothing
  if (!mounted || typeof document === 'undefined') {
    return null;
  }
  
  // Use the specified container or default to document.body
  const targetContainer = container || document.body;
  
  // Create a div with the specified ID and class name
  const portalContainer = document.createElement('div');
  if (id) portalContainer.id = id;
  if (className) portalContainer.className = className;
  
  // Create the portal
  return createPortal(children, targetContainer);
};

export default Portal;