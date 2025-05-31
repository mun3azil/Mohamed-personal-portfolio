'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import BlogCard, { BlogPost } from './BlogCard';
import BlogFilter from './BlogFilter';
import Link from 'next/link';
import { useLocale } from '@/providers/Providers';

// Dynamic import for modal to reduce initial bundle size
const BlogDetailModal = dynamic(() => import('./BlogDetailModal'), {
  loading: () => null, // No loading state needed for modal
  ssr: false // Modal doesn't need SSR
});

const BlogSection = () => {
  const t = useTranslations('blog');
  const { locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Sample blog posts data with enhanced details
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Building Responsive Layouts with CSS Grid and Flexbox',
      excerpt: 'Learn how to create modern, responsive layouts using CSS Grid and Flexbox for better web design. This comprehensive guide covers everything from basic concepts to advanced techniques.',
      coverImage: '/blog/css-layout.webp',
      date: '2025-04-15',
      category: 'technical',
      readTime: 8,
      slug: 'building-responsive-layouts',
      featured: true,
      author: {
        name: 'Mohamed',
        avatar: '/profile.jpg'
      }
    },
    {
      id: '2',
      title: 'Getting Started with React Hooks',
      excerpt: 'A comprehensive guide to React Hooks and how they can simplify your functional components. Learn about useState, useEffect, useContext, and custom hooks implementation.',
      coverImage: '/blog/react-hooks.webp',
      date: '2025-03-28',
      category: 'technical',
      readTime: 10,
      slug: 'getting-started-with-react-hooks',
      author: {
        name: 'Mohamed',
        avatar: '/profile.jpg'
      }
    },
    {
      id: '3',
      title: 'My Journey as a Self-Taught Developer',
      excerpt: 'Personal reflections on the challenges and rewards of learning to code without a formal education. Discover the strategies that helped me succeed in the tech industry.',
      coverImage: '/blog/journey.webp',
      date: '2025-03-10',
      category: 'personal',
      readTime: 6,
      slug: 'journey-self-taught-developer',
      author: {
        name: 'Mohamed',
        avatar: '/profile.jpg'
      }
    },
    {
      id: '4',
      title: 'Optimizing Performance in Next.js Applications',
      excerpt: 'Practical tips and techniques for improving the performance of your Next.js web applications. Learn about code splitting, image optimization, and server-side rendering strategies.',
      coverImage: '/blog/nextjs-performance.webp',
      date: '2025-02-22',
      category: 'technical',
      readTime: 12,
      slug: 'optimizing-nextjs-performance',
      featured: true,
      author: {
        name: 'Mohamed',
        avatar: '/profile.jpg'
      }
    },
    {
      id: '5',
      title: 'Learning TypeScript: A Beginner\'s Guide',
      excerpt: 'A step-by-step introduction to TypeScript for JavaScript developers looking to level up their skills. Understand types, interfaces, generics, and more with practical examples.',
      coverImage: '/blog/typescript.webp',
      date: '2025-02-05',
      category: 'learning',
      readTime: 9,
      slug: 'learning-typescript-beginners-guide',
      author: {
        name: 'Mohamed',
        avatar: '/profile.jpg'
      }
    },
    {
      id: '6',
      title: 'Balancing Work and Life as a Developer',
      excerpt: 'Strategies for maintaining a healthy work-life balance in the demanding field of software development. Learn practical approaches to avoid burnout and stay productive.',
      coverImage: '/blog/work-life.webp',
      date: '2025-01-18',
      category: 'personal',
      readTime: 7,
      slug: 'balancing-work-life-developer',
      author: {
        name: 'Mohamed',
        avatar: '/profile.jpg'
      }
    },
    // Arabic articles
    {
      id: '7',
      title: 'تطوير واجهات المستخدم باستخدام React',
      excerpt: 'دليل شامل لتطوير واجهات المستخدم الحديثة باستخدام مكتبة React وأفضل الممارسات في تصميم وبناء التطبيقات.',
      coverImage: '/blog/react-ar.webp',
      date: '2025-01-10',
      category: 'technical',
      readTime: 9,
      slug: 'react-ui-development-arabic',
      locale: 'ar',
      author: {
        name: 'محمد',
        avatar: '/profile.jpg'
      }
    },
    {
      id: '8',
      title: 'رحلتي في تعلم البرمجة',
      excerpt: 'تجربتي الشخصية في تعلم البرمجة والتحديات التي واجهتها والدروس المستفادة خلال مسيرتي المهنية كمطور برمجيات.',
      coverImage: '/blog/journey-ar.webp',
      date: '2024-12-15',
      category: 'personal',
      readTime: 6,
      slug: 'my-coding-journey-arabic',
      locale: 'ar',
      featured: true,
      author: {
        name: 'محمد',
        avatar: '/profile.jpg'
      }
    },
  ];

  const categories = [
    { id: 'all', label: t('categories.all') },
    { id: 'technical', label: t('categories.technical') },
    { id: 'personal', label: t('categories.personal') },
    { id: 'learning', label: t('categories.learning') },
  ];

  // Filter blog posts based on category and current locale
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesLocale = !post.locale || post.locale === locale;

    return matchesCategory && matchesLocale;
  });

  // Sort posts to show featured ones first
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Sort by date (newest first) if featured status is the same
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get featured posts
  const featuredPosts = sortedPosts.filter(post => post.featured);

  // Get regular posts (excluding featured ones)
  const regularPosts = sortedPosts.filter(post => !post.featured);

  // Handlers
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const handlePostSelect = useCallback((post: BlogPost) => {
    setSelectedPost(post);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="py-20 bg-light-100 dark:bg-dark-200 relative overflow-hidden"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/20 dark:bg-primary-900/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={prefersReducedMotion ? {} : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-dark-100 dark:text-light-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400"
            variants={prefersReducedMotion ? {} : titleVariants}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="text-lg text-dark-100/80 dark:text-light-100/80 max-w-2xl mx-auto"
            variants={prefersReducedMotion ? {} : titleVariants}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Categories Filter */}
        <div className="mb-10">
          <BlogFilter
            options={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            className="justify-center"
          />
        </div>

        {/* Featured Blog Posts (if any) */}
        {featuredPosts.length > 0 && (
          <motion.div
            className="mb-12"
            variants={prefersReducedMotion ? {} : gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-xl font-bold text-dark-100 dark:text-light-100 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 text-accent-600 dark:text-accent-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              {locale === 'ar' ? 'مقالات مميزة' : 'Featured Articles'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  variant="featured"
                  onClick={handlePostSelect}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Blog Posts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={prefersReducedMotion ? {} : gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          id={`${activeCategory}-articles`}
          role="tabpanel"
          aria-labelledby={`${activeCategory}-tab`}
        >
          {regularPosts.length > 0 ? (
            regularPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                onClick={handlePostSelect}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-dark-100/30 dark:text-light-100/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-dark-100/80 dark:text-light-100/80 text-lg">
                {locale === 'ar'
                  ? 'لا توجد مقالات في هذه الفئة حالياً.'
                  : 'No articles found in this category.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          variants={prefersReducedMotion ? {} : buttonVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Link href="/blog">
            <motion.button
              className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors inline-flex items-center"
              variants={prefersReducedMotion ? {} : buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {locale === 'ar' ? 'عرض جميع المقالات' : 'View All Articles'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${locale === 'ar' ? 'mr-2 rtl:rotate-180' : 'ml-2'}`}
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
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Blog Detail Modal */}
      <BlogDetailModal
        post={selectedPost}
        isOpen={selectedPost !== null}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default memo(BlogSection);
