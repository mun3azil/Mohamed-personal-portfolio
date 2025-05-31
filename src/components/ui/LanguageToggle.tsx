'use client';

import { useLocale } from '@/providers/Providers';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      className="p-2 rounded-full bg-light-200 dark:bg-dark-100 text-dark-100 dark:text-light-100"
      aria-label="Toggle language"
    >
      {locale === 'en' ? (
        <span className="font-medium text-sm">AR</span>
      ) : (
        <span className="font-medium text-sm">EN</span>
      )}
    </motion.button>
  );
}
