'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useRef, memo } from 'react';
import { useTranslations } from 'next-intl';
import SocialIcon from './SocialIcon';

interface ContactInfoProps {
  email: string;
  location: string;
  socialLinks: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
}

const ContactInfo = ({ email, location, socialLinks }: ContactInfoProps) => {
  const t = useTranslations('contact');
  const prefersReducedMotion = useReducedMotion();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const iconContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    }
  };
  
  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };
  
  // Handle hover for contact items
  const handleItemHover = (item: string) => {
    setHoveredItem(item);
  };
  
  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-light-200 dark:bg-dark-100 rounded-2xl p-6 md:p-8 shadow-md h-full"
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.h3 
        className="text-2xl font-bold text-dark-100 dark:text-light-100 mb-6"
        variants={prefersReducedMotion ? {} : itemVariants}
      >
        {t('letConnect')}
      </motion.h3>
      
      <div className="space-y-6 mb-8">
        {/* Email */}
        <motion.div 
          className={`flex items-start p-4 rounded-lg transition-colors ${
            hoveredItem === 'email' 
              ? 'bg-primary-50 dark:bg-primary-900/10' 
              : 'hover:bg-light-300/50 dark:hover:bg-dark-200/50'
          }`}
          variants={prefersReducedMotion ? {} : itemVariants}
          onMouseEnter={() => handleItemHover('email')}
          onMouseLeave={handleItemLeave}
          onFocus={() => handleItemHover('email')}
          onBlur={handleItemLeave}
          tabIndex={0}
        >
          <div className={`text-primary-600 dark:text-primary-400 mr-4 transition-transform duration-300 ${
            hoveredItem === 'email' ? 'scale-125' : ''
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-medium text-dark-100 dark:text-light-100">Email</h4>
            <a 
              href={`mailto:${email}`} 
              className="text-dark-100/80 dark:text-light-100/80 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label={`Send email to ${email}`}
            >
              {email}
            </a>
          </div>
        </motion.div>
        
        {/* Location */}
        <motion.div 
          className={`flex items-start p-4 rounded-lg transition-colors ${
            hoveredItem === 'location' 
              ? 'bg-primary-50 dark:bg-primary-900/10' 
              : 'hover:bg-light-300/50 dark:hover:bg-dark-200/50'
          }`}
          variants={prefersReducedMotion ? {} : itemVariants}
          onMouseEnter={() => handleItemHover('location')}
          onMouseLeave={handleItemLeave}
          onFocus={() => handleItemHover('location')}
          onBlur={handleItemLeave}
          tabIndex={0}
        >
          <div className={`text-primary-600 dark:text-primary-400 mr-4 transition-transform duration-300 ${
            hoveredItem === 'location' ? 'scale-125' : ''
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-medium text-dark-100 dark:text-light-100">Location</h4>
            <p className="text-dark-100/80 dark:text-light-100/80">
              {location}
            </p>
          </div>
        </motion.div>
      </div>
      
      <motion.h4 
        className="text-lg font-medium text-dark-100 dark:text-light-100 mb-4"
        variants={prefersReducedMotion ? {} : itemVariants}
      >
        {t('followMe')}
      </motion.h4>
      
      <motion.div 
        className="flex flex-wrap gap-4"
        variants={prefersReducedMotion ? {} : iconContainerVariants}
      >
        {socialLinks.map((link, index) => (
          <motion.div
            key={link.name}
            variants={prefersReducedMotion ? {} : iconVariants}
            custom={index}
          >
            <SocialIcon
              name={link.name}
              url={link.url}
              icon={link.icon}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default memo(ContactInfo);
