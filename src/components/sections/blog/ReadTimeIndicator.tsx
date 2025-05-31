'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/providers/Providers';

interface ReadTimeIndicatorProps {
  minutes: number;
  className?: string;
}

const ReadTimeIndicator = ({ minutes, className = '' }: ReadTimeIndicatorProps) => {
  const { locale } = useLocale();
  
  // Format read time based on locale
  const formattedTime = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(minutes);
  
  // Get the appropriate label based on locale and count
  const getTimeLabel = () => {
    if (locale === 'ar') {
      // Arabic pluralization rules
      if (minutes === 1) {
        return 'دقيقة للقراءة';
      } else if (minutes === 2) {
        return 'دقيقتان للقراءة';
      } else if (minutes >= 3 && minutes <= 10) {
        return 'دقائق للقراءة';
      } else {
        return 'دقيقة للقراءة';
      }
    } else {
      // English pluralization
      return minutes === 1 ? 'min read' : 'mins read';
    }
  };

  return (
    <motion.div 
      className={`flex items-center text-dark-100/70 dark:text-light-100/70 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span className="text-sm">
        {formattedTime} {getTimeLabel()}
      </span>
    </motion.div>
  );
};

export default memo(ReadTimeIndicator);
