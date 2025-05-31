'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import useClickOutside from '@/hooks/useClickOutside';

export type DropdownOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type DropdownPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

interface DropdownProps {
  /**
   * Options to display in the dropdown
   */
  options: DropdownOption[];
  
  /**
   * Currently selected option value
   */
  value?: string;
  
  /**
   * Callback when an option is selected
   */
  onChange?: (value: string) => void;
  
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  
  /**
   * Whether the dropdown is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom CSS class for the dropdown container
   */
  className?: string;
  
  /**
   * Custom CSS class for the dropdown button
   */
  buttonClassName?: string;
  
  /**
   * Custom CSS class for the dropdown menu
   */
  menuClassName?: string;
  
  /**
   * Custom CSS class for dropdown options
   */
  optionClassName?: string;
  
  /**
   * Position of the dropdown menu relative to the button
   * @default 'bottom-left'
   */
  position?: DropdownPosition;
  
  /**
   * Width of the dropdown menu (in px or CSS units)
   * @default 'auto'
   */
  width?: string | number;
  
  /**
   * Maximum height of the dropdown menu (in px or CSS units)
   * @default '300px'
   */
  maxHeight?: string | number;
  
  /**
   * Whether to close the dropdown after selecting an option
   * @default true
   */
  closeOnSelect?: boolean;
  
  /**
   * Custom trigger element instead of the default button
   */
  trigger?: React.ReactNode;
  
  /**
   * Whether the dropdown is searchable
   * @default false
   */
  searchable?: boolean;
  
  /**
   * Placeholder for the search input
   * @default 'Search...'
   */
  searchPlaceholder?: string;
  
  /**
   * Whether to disable animations
   * @default false
   */
  disableAnimation?: boolean;
  
  /**
   * ID for accessibility
   */
  id?: string;
  
  /**
   * ARIA label for the dropdown
   */
  ariaLabel?: string;
  
  /**
   * Custom icon for the dropdown button
   */
  icon?: React.ReactNode;
  
  /**
   * Whether to show a clear button when an option is selected
   * @default false
   */
  clearable?: boolean;
  
  /**
   * Callback when dropdown is opened
   */
  onOpen?: () => void;
  
  /**
   * Callback when dropdown is closed
   */
  onClose?: () => void;
  
  /**
   * Whether the dropdown is multi-select
   * @default false
   */
  multiSelect?: boolean;
  
  /**
   * Selected values for multi-select mode
   */
  selectedValues?: string[];
  
  /**
   * Callback when selected values change in multi-select mode
   */
  onMultiChange?: (values: string[]) => void;
}

/**
 * Dropdown component for selecting options from a list
 * 
 * @param props Component props
 * @returns Dropdown component
 */
const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  optionClassName = '',
  position = 'bottom-left',
  width = 'auto',
  maxHeight = '300px',
  closeOnSelect = true,
  trigger,
  searchable = false,
  searchPlaceholder = 'Search...',
  disableAnimation = false,
  id,
  ariaLabel,
  icon,
  clearable = false,
  onOpen,
  onClose,
  multiSelect = false,
  selectedValues = [],
  onMultiChange,
}) => {
  // State for dropdown open/close
  const [isOpen, setIsOpen] = useState(false);
  
  // State for search input
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for multi-select values
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(selectedValues);
  
  // Refs for dropdown elements
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Get the selected option based on value
  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(option => 
        typeof option.label === 'string' 
          ? option.label.toLowerCase().includes(searchTerm.toLowerCase())
          : false
      )
    : options;
  
  // Toggle dropdown open/close
  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      
      if (newIsOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    }
  }, [disabled, isOpen, onOpen, onClose]);
  
  // Close dropdown
  const closeDropdown = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    }
  }, [isOpen, onClose]);
  
  // Handle option selection
  const handleSelect = useCallback((option: DropdownOption) => {
    if (option.disabled) return;
    
    if (multiSelect) {
      const newValues = internalSelectedValues.includes(option.value)
        ? internalSelectedValues.filter(v => v !== option.value)
        : [...internalSelectedValues, option.value];
      
      setInternalSelectedValues(newValues);
      onMultiChange?.(newValues);
    } else {
      onChange?.(option.value);
      
      if (closeOnSelect) {
        closeDropdown();
      }
    }
  }, [onChange, closeOnSelect, closeDropdown, multiSelect, internalSelectedValues, onMultiChange]);
  
  // Handle clear button click
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (multiSelect) {
      setInternalSelectedValues([]);
      onMultiChange?.([]);
    } else {
      onChange?.('');
    }
    
    closeDropdown();
  }, [onChange, closeDropdown, multiSelect, onMultiChange]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          toggleDropdown();
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          closeDropdown();
        }
        break;
      case 'ArrowDown':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
          onOpen?.();
        }
        break;
    }
  }, [disabled, isOpen, toggleDropdown, closeDropdown, onOpen]);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, searchable]);
  
  // Update internal selected values when prop changes
  useEffect(() => {
    setInternalSelectedValues(selectedValues);
  }, [selectedValues]);
  
  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);
  
  // Use click outside hook to close dropdown when clicking outside
  useClickOutside(dropdownRef, closeDropdown, isOpen);
  
  // Get display text for the button
  const getButtonText = () => {
    if (multiSelect) {
      if (internalSelectedValues.length === 0) return placeholder;
      
      if (internalSelectedValues.length === 1) {
        const option = options.find(opt => opt.value === internalSelectedValues[0]);
        return option ? option.label : placeholder;
      }
      
      return `${internalSelectedValues.length} items selected`;
    }
    
    return selectedOption ? selectedOption.label : placeholder;
  };
  
  // Get width style
  const getWidthStyle = () => {
    if (width === 'auto') return {};
    return { width: typeof width === 'number' ? `${width}px` : width };
  };
  
  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };
  
  // Get position style for the menu
  const getPositionStyle = (): React.CSSProperties => {
    switch (position) {
      case 'bottom-left':
        return { top: '100%', left: 0 };
      case 'bottom-right':
        return { top: '100%', right: 0 };
      case 'top-left':
        return { bottom: '100%', left: 0 };
      case 'top-right':
        return { bottom: '100%', right: 0 };
      default:
        return { top: '100%', left: 0 };
    }
  };
  
  // Default dropdown button
  const defaultTrigger = (
    <button
      ref={buttonRef}
      type="button"
      className={`flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${buttonClassName}`}
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-labelledby={id}
      aria-label={ariaLabel}
      disabled={disabled}
      data-testid="dropdown-button"
    >
      <span className="truncate">{getButtonText()}</span>
      <span className="flex items-center ml-2">
        {clearable && (selectedOption || (multiSelect && internalSelectedValues.length > 0)) ? (
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            onClick={handleClear}
            aria-label="Clear selection"
            data-testid="dropdown-clear-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        ) : icon ? (
          icon
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    </button>
  );
  
  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
      style={getWidthStyle()}
      data-testid="dropdown"
    >
      {trigger || defaultTrigger}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-10 mt-1 bg-white rounded-md shadow-lg dark:bg-gray-800 ${menuClassName}`}
            style={{
              ...getPositionStyle(),
              maxHeight,
              overflowY: 'auto',
              width: width === 'auto' ? undefined : '100%',
            }}
            initial={disableAnimation ? 'visible' : 'hidden'}
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.1 }}
            role="listbox"
            aria-labelledby={id}
            data-testid="dropdown-menu"
          >
            {searchable && (
              <div className="sticky top-0 p-2 bg-white dark:bg-gray-800">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  data-testid="dropdown-search"
                />
              </div>
            )}
            
            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = multiSelect
                    ? internalSelectedValues.includes(option.value)
                    : option.value === value;
                  
                  return (
                    <div
                      key={option.value}
                      className={`flex items-center px-4 py-2 text-sm cursor-pointer ${isSelected ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'} ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${optionClassName}`}
                      onClick={() => handleSelect(option)}
                      role="option"
                      aria-selected={isSelected}
                      data-testid={`dropdown-option-${option.value}`}
                    >
                      {multiSelect && (
                        <div className="flex items-center justify-center w-5 h-5 mr-2">
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                      
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      
                      <span>{option.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400" data-testid="dropdown-no-results">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;