'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import ProjectCard, { Project } from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import SearchInput from './SearchInput';

// Dynamic import for modal to reduce initial bundle size
const ProjectDetailModal = dynamic(() => import('./ProjectDetailModal'), {
  loading: () => null, // No loading state needed for modal
  ssr: false // Modal doesn't need SSR
});

const ProjectsSection = () => {
  const t = useTranslations('projects');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Sample projects data with enhanced details
  const projects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with product management, cart functionality, and payment integration. Built with React for the frontend and Node.js for the backend, with MongoDB as the database.',
      image: '/projects/ecommerce.webp', // Will be transformed to optimized path in ProjectCard
      tags: ['React', 'Node.js', 'MongoDB', 'Redux', 'Express'],
      liveUrl: 'https://ecommerce-demo.com',
      sourceUrl: 'https://github.com/mohamed/ecommerce',
      category: 'web',
      featured: true,
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A productivity app for managing tasks, projects, and team collaboration with real-time updates. Features include drag-and-drop task organization, deadline reminders, and team member assignment.',
      image: '/projects/taskmanager.webp',
      tags: ['React', 'Firebase', 'Tailwind', 'Context API'],
      liveUrl: 'https://taskmanager-demo.com',
      sourceUrl: 'https://github.com/mohamed/taskmanager',
      category: 'web',
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'A weather application that provides real-time weather data and forecasts for locations worldwide. Includes interactive maps, hourly and daily forecasts, and severe weather alerts.',
      image: '/projects/weather.webp',
      tags: ['JavaScript', 'API', 'CSS', 'Chart.js'],
      liveUrl: 'https://weather-demo.com',
      sourceUrl: 'https://github.com/mohamed/weather',
      category: 'web',
    },
    {
      id: '4',
      title: 'Social Media App',
      description: 'A social networking platform with user profiles, posts, comments, and real-time messaging. Built with React Native for cross-platform mobile support and Firebase for backend services.',
      image: '/projects/social.webp',
      tags: ['React Native', 'Firebase', 'Redux', 'Expo'],
      liveUrl: 'https://socialmedia-demo.com',
      sourceUrl: 'https://github.com/mohamed/socialmedia',
      category: 'mobile',
      featured: true,
    },
    {
      id: '5',
      title: 'Portfolio Website',
      description: 'A responsive portfolio website showcasing projects and skills with modern design elements. Features include smooth animations, dark mode support, and multilingual content.',
      image: '/projects/portfolio.webp',
      tags: ['Next.js', 'Tailwind', 'Framer Motion', 'TypeScript'],
      liveUrl: 'https://portfolio-demo.com',
      sourceUrl: 'https://github.com/mohamed/portfolio',
      category: 'design',
    },
    {
      id: '6',
      title: 'Fitness Tracker',
      description: 'A mobile app for tracking workouts, nutrition, and fitness progress with data visualization. Includes workout plans, calorie tracking, and progress charts to help users achieve their fitness goals.',
      image: '/projects/fitness.webp',
      tags: ['React Native', 'GraphQL', 'Chart.js', 'Apollo'],
      liveUrl: 'https://fitness-demo.com',
      sourceUrl: 'https://github.com/mohamed/fitness',
      category: 'mobile',
    },
  ];

  const filters = [
    { id: 'all', label: t('filters.all') },
    { id: 'web', label: t('filters.web') },
    { id: 'mobile', label: t('filters.mobile') },
    { id: 'design', label: t('filters.design') },
  ];

  // Filter projects based on category and search query
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeFilter === 'all' || project.category === activeFilter;
    const matchesSearch = searchQuery === '' ||
                          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort projects to show featured ones first
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  // Handlers
  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilter(filterId);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
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

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 bg-light-200 dark:bg-dark-300 relative overflow-hidden"
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

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <ProjectFilter
            options={filters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            className="justify-center md:justify-start"
          />

          <SearchInput
            onSearch={handleSearch}
            placeholder="Search projects..."
            className="w-full md:w-64"
          />
        </div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={prefersReducedMotion ? {} : gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          id={`${activeFilter}-projects`}
          role="tabpanel"
          aria-labelledby={`${activeFilter}-tab`}
        >
          {sortedProjects.length > 0 ? (
            sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={handleProjectSelect}
              />
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-10"
              variants={prefersReducedMotion ? {} : emptyStateVariants}
            >
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-dark-100/80 dark:text-light-100/80 text-lg">
                No projects found matching your criteria.
              </p>
              <motion.button
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default memo(ProjectsSection);
