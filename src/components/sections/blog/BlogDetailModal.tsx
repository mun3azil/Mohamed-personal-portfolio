'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { BlogPost } from './BlogCard';
import BlogCategoryTag from './BlogCategoryTag';
import ReadTimeIndicator from './ReadTimeIndicator';
import { formatDate } from '@/lib/utils';
import { useLocale } from '@/providers/Providers';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import OptimizedImage from '@/components/common/OptimizedImage';

interface BlogDetailModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogDetailModal = ({ post, isOpen, onClose }: BlogDetailModalProps) => {
  const t = useTranslations('blog');
  const { locale } = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('');

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Fetch article content (simulated)
  useEffect(() => {
    if (post && isOpen) {
      // In a real app, you would fetch the markdown content from an API or file
      // For this example, we'll use a placeholder
      const fetchContent = async () => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Placeholder markdown content
        const placeholderContent = `
# ${post.title}

${post.excerpt}

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.

## Main Content

- Point one about this topic
- Another important consideration
- Technical implementation details

\`\`\`javascript
// Example code
function example() {
  console.log("Hello, world!");
}
\`\`\`

## Conclusion

In conclusion, this article has covered the key points about ${post.title}. I hope you found it useful!
        `;

        setContent(placeholderContent);
      };

      fetchContent();
    }
  }, [post, isOpen]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  // Format date based on locale
  const formattedDate = post ? formatDate(post.date, locale === 'ar' ? 'ar-EG' : 'en-US') : '';

  return (
    <AnimatePresence>
      {isOpen && post && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            ref={modalRef}
            className="bg-light-100 dark:bg-dark-200 rounded-2xl overflow-hidden shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-modal-title"
            dir={post.locale === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Article header */}
            <div className="relative w-full h-64 md:h-80">
              <OptimizedImage
                src={post.coverImage.replace('/blog/', '/images/optimized/blog/')}
                alt={post.title}
                title={post.title}
                imageType="blog"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <div className="mb-4">
                  <BlogCategoryTag category={post.category} size="md" />
                </div>
                <h2
                  id="blog-modal-title"
                  className="text-2xl md:text-3xl font-bold text-white mb-2"
                >
                  {post.title}
                </h2>
                <div className="flex flex-wrap items-center text-sm text-white/80 gap-3">
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

                  <span className="mx-1 text-white/50">•</span>

                  <ReadTimeIndicator minutes={post.readTime} className="text-white/80" />

                  {post.author && (
                    <>
                      <span className="mx-1 text-white/50">•</span>
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
                </div>
              </div>
            </div>

            {/* Article content */}
            <div className="p-6 overflow-y-auto">
              {content ? (
                <div className="prose dark:prose-invert prose-img:rounded-xl prose-headings:text-dark-100 dark:prose-headings:text-light-100 prose-a:text-primary-600 dark:prose-a:text-primary-400 max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center py-10">
                  <svg className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}

              {/* Read full article link */}
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/blog/${post.slug}`}
                  className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors inline-flex items-center"
                >
                  {t('readMore')}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${
                      locale === 'ar' ? 'mr-1 rtl:rotate-180' : 'ml-1'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogDetailModal;
