'use client';

import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState, useRef, memo } from 'react';
import ProjectTag from './ProjectTag';
import OptimizedImage from '@/components/common/OptimizedImage';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  sourceUrl: string;
  category: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect?: (project: Project) => void;
}

const ProjectCard = ({ project, index, onSelect }: ProjectCardProps) => {
  const t = useTranslations('projects');
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

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
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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

  const overlayVariants = {
    hover: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    initial: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const tagsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(project);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`bg-light-200 dark:bg-dark-100 rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${
        project.featured ? 'border-2 border-primary-500 dark:border-primary-400' : ''
      }`}
      variants={prefersReducedMotion ? {} : cardVariants}
      initial="hidden"
      animate={isInView ? (isHovered ? "hover" : "visible") : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => onSelect?.(project)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details of ${project.title}`}
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          >
            Featured
          </motion.div>
        </div>
      )}

      <div className="relative h-48 w-full overflow-hidden">
        <motion.div
          variants={prefersReducedMotion ? {} : imageVariants}
          animate={isHovered ? "hover" : "initial"}
          className="h-full w-full"
        >
          <OptimizedImage
            src={project.image.replace('/projects/', '/images/optimized/projects/')}
            alt={project.title}
            title={project.title}
            imageType="project"
            fill
            className="object-cover"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4"
          variants={prefersReducedMotion ? {} : overlayVariants}
          animate={isHovered ? "hover" : "initial"}
        >
          <motion.div
            className="flex flex-wrap gap-2"
            variants={prefersReducedMotion ? {} : tagsContainerVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          >
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <ProjectTag key={tag} tag={tag} index={tagIndex} />
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/30 text-white">
                +{project.tags.length - 3}
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="p-6">
        <motion.h3
          className="text-xl font-bold text-dark-100 dark:text-light-100 mb-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className="text-dark-100/80 dark:text-light-100/80 mb-4 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          {project.description}
        </motion.p>

        <motion.div
          className="flex space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        >
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Visit live project: ${project.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {t('viewProject')}
          </motion.a>

          <motion.a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-transparent border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-600/10 font-medium transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`View source code: ${project.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {t('viewCode')}
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(ProjectCard);
