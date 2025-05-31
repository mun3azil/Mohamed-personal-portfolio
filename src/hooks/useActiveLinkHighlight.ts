'use client';

import { useEffect, useState, useCallback } from 'react';


interface NavItem {
  id: string;
  href: string;
  label: string;
}

/**
 * Custom hook for tracking active navigation link based on scroll position
 * @param navItems Array of navigation items
 * @param offset Offset for section detection (default: 100)
 * @returns Object with active section and setter function
 */
function useActiveLinkHighlightBase(navItems: NavItem[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>('home');
  
  const updateActiveSection = useCallback(() => {
    const scrollPosition = window.scrollY + offset;
    const sections = navItems.map(item => item.id);
    
    // Find the current section based on scroll position
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sections[i]);
        break;
      }
    }
  }, [navItems, offset]);
  
  useEffect(() => {
    // Throttled scroll handler for performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Initial check
    updateActiveSection();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateActiveSection]);
  
  return {
    activeSection,
    setActiveSection
  };
}

/**
 * Hook for smooth scrolling to sections
 * @returns Function to scroll to section smoothly
 */
function useSmoothScrollBase() {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Adjust based on your header height
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);
  
  return { scrollToSection };
}

export { useActiveLinkHighlightBase as useActiveLinkHighlight, useSmoothScrollBase as useSmoothScroll };
