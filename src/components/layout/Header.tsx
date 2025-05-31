'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/providers/Providers';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import Link from 'next/link';
import { useComponentAnimation } from '@/hooks/useComponentAnimation';

export default function Header() {
  const t = useTranslations('navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale } = useLocale();
  const { variants } = useComponentAnimation({ component: 'header' });

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: t('home') },
    { href: '#about', label: t('about') },
    { href: '#projects', label: t('projects') },
    { href: '#blog', label: t('blog') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-light-100/80 dark:bg-dark-200/80 backdrop-blur-md py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          variants={(variants as any).logo || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate="visible"
          className="flex items-center"
        >
          <Link href="#home" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Mohamed
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          variants={(variants as any).nav || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center space-x-8"
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              variants={(variants as any).navItem || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              custom={index}
            >
              <Link
                href={item.href}
                className="text-dark-100 dark:text-light-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Theme and Language Toggles */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageToggle />

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-dark-100 dark:text-light-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variants={(variants as any).hamburger || { open: {}, closed: {} }}
            animate={isMobileMenuOpen ? "open" : "closed"}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={(variants as any).mobileMenu || { open: { opacity: 1 }, closed: { opacity: 0 } }}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-light-100 dark:bg-dark-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  variants={(variants as any).mobileMenuItems || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  custom={index}
                >
                  <Link
                    href={item.href}
                    className="text-dark-100 dark:text-light-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
