'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Portal from './Portal';


type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type TooltipTrigger = 'hover' | 'click' | 'focus';

interface TooltipProps {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;
  
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement;
  
  /**
   * The position of the tooltip relative to the trigger element
   * @default 'top'
   */
  position?: TooltipPosition;
  
  /**
   * The event that triggers the tooltip
   * @default 'hover'
   */
  trigger?: TooltipTrigger | TooltipTrigger[];
  
  /**
   * The delay before showing the tooltip (in ms)
   * @default 0
   */
  delayShow?: number;
  
  /**
   * The delay before hiding the tooltip (in ms)
   * @default 0
   */
  delayHide?: number;
  
  /**
   * Whether the tooltip is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom CSS class name for the tooltip container
   */
  className?: string;
  
  /**
   * Whether to disable the portal and render the tooltip inline
   * @default false
   */
  disablePortal?: boolean;
  
  /**
   * The offset from the trigger element (in px)
   * @default 8
   */
  offset?: number;
  
  /**
   * Whether to disable animations
   * @default false
   */
  disableAnimation?: boolean;
  
  /**
   * The ID for accessibility
   */
  id?: string;
  
  /**
   * Whether the tooltip is interactive (can be hovered/clicked)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * The maximum width of the tooltip
   * @default '200px'
   */
  maxWidth?: string | number;
}

/**
 * Tooltip component for displaying additional information
 * 
 * @param props Component props
 * @returns Tooltip component
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delayShow = 0,
  delayHide = 0,
  disabled = false,
  className = '',
  disablePortal = false,
  offset = 8,
  disableAnimation = false,
  id,
  interactive = false,
  maxWidth = '200px',
}) => {
  // State for tracking if the tooltip is visible
  const [isVisible, setIsVisible] = useState(false);
  
  // Refs for the trigger and tooltip elements
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Timers for show/hide delays
  const showTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hideTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Normalize trigger to array
  const triggers = useMemo(() => Array.isArray(trigger) ? trigger : [trigger], [trigger]);

  // Show the tooltip with delay
  const showTooltip = useCallback(() => {
    if (disabled) return;

    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    // Set show timeout
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayShow);
  }, [disabled, delayShow]);

  // Hide the tooltip with delay
  const hideTooltip = useCallback(() => {
    // Clear any existing show timeout
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }

    // Set hide timeout
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delayHide);
  }, [delayHide]);
  
  // Handle mouse enter on tooltip (for interactive tooltips)
  const handleTooltipMouseEnter = () => {
    if (interactive && triggers.includes('hover')) {
      // Clear any existing hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = undefined;
      }
    }
  };
  
  // Handle mouse leave on tooltip (for interactive tooltips)
  const handleTooltipMouseLeave = () => {
    if (interactive && triggers.includes('hover')) {
      hideTooltip();
    }
  };
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);
  
  // Handle click outside for click trigger
  useEffect(() => {
    if (!isVisible || !triggers.includes('click')) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, triggers, hideTooltip]);
  
  // Handle escape key press
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideTooltip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, hideTooltip]);
  
  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) {
      return { top: 0, left: 0 };
    }
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset + scrollY;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollX;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollY;
        left = triggerRect.right + offset + scrollX;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset + scrollY;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + scrollX;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2 + scrollY;
        left = triggerRect.left - tooltipRect.width - offset + scrollX;
        break;
    }
    
    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if needed
    if (left < 0) {
      left = 0;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width;
    }
    
    // Adjust vertical position if needed
    if (top < 0) {
      top = 0;
    } else if (top + tooltipRect.height > viewportHeight + scrollY) {
      top = viewportHeight + scrollY - tooltipRect.height;
    }
    
    return { top, left };
  };
  
  // Get tooltip arrow position and style
  const getArrowStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: '8px',
      height: '8px',
      transform: 'rotate(45deg)',
      backgroundColor: 'inherit',
    };
    
    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '-4px',
          left: 'calc(50% - 4px)',
        };
      case 'right':
        return {
          ...baseStyle,
          left: '-4px',
          top: 'calc(50% - 4px)',
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: '-4px',
          left: 'calc(50% - 4px)',
        };
      case 'left':
        return {
          ...baseStyle,
          right: '-4px',
          top: 'calc(50% - 4px)',
        };
    }
  };
  
  // Animation variants
  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };
  
  // Clone the trigger element with additional props
  const triggerElement = React.cloneElement(children as React.ReactElement<any>, {
    ref: (node: HTMLElement) => {
      // Merge refs if the child already has one
      triggerRef.current = node;
      if (typeof (children as any).ref === 'function') {
        (children as any).ref(node);
      } else if ((children as any).ref) {
        ((children as any).ref as React.MutableRefObject<HTMLElement>).current = node;
      }
    },
    'aria-describedby': isVisible && id ? id : undefined,
    ...(triggers.includes('hover') && {
      onMouseEnter: (e: React.MouseEvent) => {
        showTooltip();
        if ((children as any).props?.onMouseEnter) (children as any).props.onMouseEnter(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        hideTooltip();
        if ((children as any).props?.onMouseLeave) (children as any).props.onMouseLeave(e);
      },
    }),
    ...(triggers.includes('focus') && {
      onFocus: (e: React.FocusEvent) => {
        showTooltip();
        if ((children as any).props?.onFocus) (children as any).props.onFocus(e);
      },
      onBlur: (e: React.FocusEvent) => {
        hideTooltip();
        if ((children as any).props?.onBlur) (children as any).props.onBlur(e);
      },
    }),
    ...(triggers.includes('click') && {
      onClick: (e: React.MouseEvent) => {
        if (isVisible) {
          hideTooltip();
        } else {
          showTooltip();
        }
        if ((children as any).props?.onClick) (children as any).props.onClick(e);
      },
    }),
  });
  
  // Tooltip content
  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          id={id}
          role="tooltip"
          className={`absolute z-50 rounded-md bg-gray-800 px-2 py-1 text-sm text-white shadow-md dark:bg-gray-700 ${className}`}
          style={{
            ...getTooltipPosition(),
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          }}
          initial={disableAnimation ? 'visible' : 'hidden'}
          animate="visible"
          exit="hidden"
          variants={tooltipVariants}
          transition={{ duration: 0.2 }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          data-testid="tooltip"
        >
          {content}
          <div style={getArrowStyle()} data-testid="tooltip-arrow" />
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  return (
    <>
      {triggerElement}
      {disablePortal ? tooltipContent : <Portal>{tooltipContent}</Portal>}
    </>
  );
};

export default Tooltip;