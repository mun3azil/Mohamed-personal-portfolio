'use client';

import { useEffect, useCallback, useRef } from 'react';

interface UseHeaderBehaviorProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsScrolled: (scrolled: boolean) => void;
  setActiveSection: (section: string) => void;
  navItems: Array<{ id: string; href: string; label: string }>;
}

export function useHeaderBehavior({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setIsScrolled,
  setActiveSection,
  navItems
}: UseHeaderBehaviorProps) {
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    // Update header style based on scroll position
    setIsScrolled(window.scrollY > 50);

    // Detect active section
    const sections = navItems.map(item => item.id);
    const scrollPosition = window.scrollY + 100; // Offset for better detection

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sections[i]);
        break;
      }
    }
  }, [navItems, setIsScrolled, setActiveSection]);

  // Memoized click outside handler
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!isMobileMenuOpen) return;

    const target = e.target as HTMLElement;
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    if (
      mobileMenu &&
      !mobileMenu.contains(target) &&
      mobileMenuButton &&
      !mobileMenuButton.contains(target)
    ) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Memoized keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isMobileMenuOpen) return;

    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
      // Return focus to the button that opened the menu
      if (mobileMenuButtonRef.current) {
        mobileMenuButtonRef.current.focus();
      }
    }

    // Handle focus trap within mobile menu
    if (e.key === 'Tab') {
      const mobileMenu = document.getElementById('mobile-menu');
      if (!mobileMenu) return;

      const focusableElements = mobileMenu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Memoized resize handler
  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Single useEffect for all event listeners
  useEffect(() => {
    // Add all event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    // Initial scroll check
    handleScroll();

    // Cleanup all event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleClickOutside, handleKeyDown, handleResize]);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Store the currently focused element
      lastFocusedElementRef.current = document.activeElement as HTMLElement;
      
      // Focus the first focusable element in the mobile menu
      setTimeout(() => {
        const mobileMenu = document.getElementById('mobile-menu');
        const firstFocusable = mobileMenu?.querySelector('a[href], button') as HTMLElement;
        firstFocusable?.focus();
      }, 100); // Small delay to ensure menu is rendered
    } else {
      // Return focus to the last focused element (usually the menu button)
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }
  }, [isMobileMenuOpen]);

  return {
    mobileMenuButtonRef
  };
}
