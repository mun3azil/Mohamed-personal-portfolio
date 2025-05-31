'use client';

import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatDate, truncateString } from '@/lib/utils';
import { useState, useRef, memo } from 'react';
import { useLocale } from '@/providers/Providers';
import BlogCategoryTag from './BlogCategoryTag';
import ReadTimeIndicator from './ReadTimeIndicator';
import OptimizedImage from '@/components/common/OptimizedImage';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  category: string;
  readTime: number;
  slug: string;
  featured?: boolean;
  locale?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: (post: BlogPost) => void;
}

const BlogCard = ({
  post,
  index,
  variant = 'default',
  onClick
}: BlogCardProps) => {
  const t = useTranslations('blog');
  const { locale } = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  // Format date based on locale
  const formattedDate = formatDate(post.date, locale === 'ar' ? 'ar-EG' : 'en-US');

  // Determine if the post matches the current locale
  const isCurrentLocale = !post.locale || post.locale === locale;

  // Card variants based on type
  const getCardClasses = () => {
    switch (variant) {
      case 'featured':
        return 'bg-gradient-to-br from-primary-600/10 to-secondary-600/10 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl border-2 border-primary-500/20 dark:border-primary-400/20';
      case 'compact':
        return 'bg-light-200 dark:bg-dark-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md';
      default:
        return 'bg-light-200 dark:bg-dark-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl';
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.5 }
    },
    initial: {
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: index * 0.1 + 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick(post);
      }
    }
  };

  // Determine image height based on variant
  const imageHeight = variant === 'compact' ? 'h-32' : variant === 'featured' ? 'h-56' : 'h-48';

  return (
    <motion.article
      ref={cardRef}
      className={`${getCardClasses()} transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      } ${!isCurrentLocale ? 'opacity-70' : ''}`}
      variants={prefersReducedMotion ? {} : cardVariants}
      initial="hidden"
      animate={isInView ? (isHovered ? "hover" : "visible") : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => onClick && onClick(post)}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `Read article: ${post.title}` : undefined}
      dir={post.locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block"
        onClick={(e) => onClick && e.preventDefault()}
        tabIndex={onClick ? -1 : 0}
      >
        <div className={`relative ${imageHeight} w-full overflow-hidden`}>
          <motion.div
            variants={prefersReducedMotion ? {} : imageVariants}
            animate={isHovered ? "hover" : "initial"}
            className="h-full w-full"
          >
            <OptimizedImage
              src={post.coverImage.replace('/blog/', '/images/optimized/blog/')}
              alt={post.title}
              title={post.title}
              imageType="blog"
              fill
              className="object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Category Tag */}
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
            <BlogCategoryTag category={post.category} />
          </div>

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10">
              <motion.div
                className="bg-accent-600 text-white text-xs font-bold px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              >
                {locale === 'ar' ? 'مميز' : 'Featured'}
              </motion.div>
            </div>
          )}

          {/* Language Indicator (if different from current) */}
          {post.locale && post.locale !== locale && (
            <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 z-10">
              <motion.div
                className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {post.locale === 'ar' ? 'العربية' : 'English'}
              </motion.div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        </div>

        <motion.div
          className="p-6"
          variants={prefersReducedMotion ? {} : contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Meta Information */}
          <motion.div
            className="flex flex-wrap items-center text-sm text-dark-100/70 dark:text-light-100/70 mb-3 gap-2"
            variants={prefersReducedMotion ? {} : itemVariants}
          >
            <time dateTime={post.date} className="flex items-center">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </time>

            <span className="mx-2 text-dark-100/30 dark:text-light-100/30">•</span>

            <ReadTimeIndicator minutes={post.readTime} />

            {/* Author (if provided) */}
            {post.author && (
              <>
                <span className="mx-2 text-dark-100/30 dark:text-light-100/30">•</span>
                <span className="flex items-center">
                  {post.author.avatar ? (
                    <OptimizedImage
                      src={post.author.avatar.replace('/profile.jpg', '/images/optimized/profile/mohamed.webp')}
                      alt={post.author.name}
                      title={post.author.name}
                      imageType="profile"
                      width={20}
                      height={20}
                      className="rounded-full mr-1 rtl:ml-1 rtl:mr-0"
                    />
                  ) : (
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                  {post.author.name}
                </span>
              </>
            )}
          </motion.div>

          {/* Title */}
          <motion.h3
            className={`font-bold text-dark-100 dark:text-light-100 mb-2 line-clamp-2 ${
              variant === 'featured' ? 'text-2xl' : 'text-xl'
            }`}
            variants={prefersReducedMotion ? {} : itemVariants}
          >
            {post.title}
          </motion.h3>

          {/* Excerpt */}
          {variant !== 'compact' && (
            <motion.p
              className="text-dark-100/80 dark:text-light-100/80 mb-4 line-clamp-3"
              variants={prefersReducedMotion ? {} : itemVariants}
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Read More Link */}
          <motion.div
            className="flex items-center text-primary-600 dark:text-primary-400 font-medium group"
            variants={prefersReducedMotion ? {} : itemVariants}
          >
            {t('readMore')}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${
                locale === 'ar'
                  ? 'mr-1 rtl:rotate-180 group-hover:-translate-x-1'
                  : 'ml-1 group-hover:translate-x-1'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </Link>
    </motion.article>
  );
};

export default memo(BlogCard);
