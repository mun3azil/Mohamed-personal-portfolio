'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useHeroMotion } from '@/hooks/useHeroMotion';

interface HeroCTAProps {
  className?: string;
}

const HeroCTA = memo(({ className = '' }: HeroCTAProps) => {
  const t = useTranslations('hero');
  const { variants, prefersReducedMotion } = useHeroMotion();

  const buttonBaseClasses = "px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.div
      className={`flex flex-col sm:flex-row gap-4 sm:gap-6 ${className}`}
      variants={variants.item}
      initial="hidden"
      animate="visible"
    >
      {/* Primary CTA - View Projects */}
      <Link href="#projects" className="group">
        <motion.button
          className={`${buttonBaseClasses} bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500 group-focus-visible:ring-2`}
          variants={(variants as any).cta || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          whileHover={prefersReducedMotion ? {} : "hover"}
          whileTap={prefersReducedMotion ? {} : "tap"}
          style={{
            willChange: prefersReducedMotion ? 'auto' : 'transform'
          }}
          aria-label="View my projects and portfolio work"
        >
          <span className="flex items-center gap-2">
            {t('cta.projects')}
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={prefersReducedMotion ? {} : { x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </span>
        </motion.button>
      </Link>

      {/* Secondary CTA - Contact */}
      <Link href="#contact" className="group">
        <motion.button
          className={`${buttonBaseClasses} bg-transparent border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-600/10 dark:hover:bg-primary-400/10 focus:ring-primary-500 group-focus-visible:ring-2`}
          variants={(variants as any).cta || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          whileHover={prefersReducedMotion ? {} : "hover"}
          whileTap={prefersReducedMotion ? {} : "tap"}
          style={{
            willChange: prefersReducedMotion ? 'auto' : 'transform'
          }}
          aria-label="Get in touch and start a conversation"
        >
          <span className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ rotate: 0 }}
              whileHover={prefersReducedMotion ? {} : { rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
            {t('cta.contact')}
          </span>
        </motion.button>
      </Link>
    </motion.div>
  );
});

HeroCTA.displayName = 'HeroCTA';

export default HeroCTA;
