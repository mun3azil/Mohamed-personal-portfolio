'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import ExperienceCard from './ExperienceCard';
import OptimizedImage from '@/components/common/OptimizedImage';

// Dynamic import for SkillChart to reduce initial bundle size
const SkillChart = dynamic(() => import('./SkillChart'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 mx-auto"></div>
    </div>
  ),
  ssr: true
});

export default function AboutSection() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const skills = [
    {
      name: 'React',
      percentage: 95,
      color: 'primary' as const,
      icon: (
        <OptimizedImage
          src="/images/optimized/skills/react-skill.svg"
          alt="React"
          width={24}
          height={24}
          imageType="default"
        />
      ),
      description: 'Building dynamic user interfaces'
    },
    {
      name: 'TypeScript',
      percentage: 90,
      color: 'secondary' as const,
      icon: (
        <OptimizedImage
          src="/images/optimized/skills/typescript-skill.svg"
          alt="TypeScript"
          width={24}
          height={24}
          imageType="default"
        />
      ),
      description: 'Type-safe JavaScript development'
    },
    {
      name: 'Node.js',
      percentage: 85,
      color: 'accent' as const,
      icon: (
        <OptimizedImage
          src="/images/optimized/skills/nodejs-skill.svg"
          alt="Node.js"
          width={24}
          height={24}
          imageType="default"
        />
      ),
      description: 'Server-side JavaScript runtime'
    },
    {
      name: 'Next.js',
      percentage: 92,
      color: 'primary' as const,
      icon: (
        <OptimizedImage
          src="/images/optimized/skills/nextjs-skill.svg"
          alt="Next.js"
          width={24}
          height={24}
          imageType="default"
        />
      ),
      description: 'Full-stack React framework'
    },
    {
      name: 'TailwindCSS',
      percentage: 95,
      color: 'secondary' as const,
      icon: (
        <OptimizedImage
          src="/images/optimized/skills/tailwind-skill.svg"
          alt="TailwindCSS"
          width={24}
          height={24}
          imageType="default"
        />
      ),
      description: 'Utility-first CSS framework'
    },
    {
      name: 'MongoDB',
      percentage: 80,
      color: 'accent' as const,
      icon: (
        <OptimizedImage
          src="/images/optimized/skills/mongodb-skill.svg"
          alt="MongoDB"
          width={24}
          height={24}
          imageType="default"
        />
      ),
      description: 'NoSQL database management'
    },
  ];

  const experiences = [
    {
      number: 5,
      label: t('experience.years'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      number: 30,
      label: t('experience.projects'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
        </svg>
      )
    },
    {
      number: 20,
      label: t('experience.clients'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
      )
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-light-100 dark:bg-dark-200 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-dark-100 dark:text-light-100 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="text-lg text-dark-100/80 dark:text-light-100/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Profile Image with Parallax Effect */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            style={{ y }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary-500 dark:border-primary-400 shadow-xl">
              <OptimizedImage
                src="/images/optimized/profile/mohamed.webp"
                alt="Mohamed"
                fill
                imageType="profile"
                title="Mohamed"
                className="object-cover"
                priority
              />
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-secondary-400 dark:bg-secondary-600 z-10"
              animate={{
                y: [0, -10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />

            <motion.div
              className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-accent-400 dark:bg-accent-600 z-10"
              animate={{
                y: [0, 10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-dark-100 dark:text-light-100 mb-4">
              {t('subtitle')}
            </h3>
            <p className="text-dark-100/80 dark:text-light-100/80 mb-6 leading-relaxed">
              {t('description')}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                <span className="text-dark-100 dark:text-light-100">React & Next.js</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                <span className="text-dark-100 dark:text-light-100">TypeScript</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                <span className="text-dark-100 dark:text-light-100">Node.js & Express</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></div>
                <span className="text-dark-100 dark:text-light-100">MongoDB & SQL</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <div className="mb-20">
          <motion.h3
            className="text-2xl font-bold text-dark-100 dark:text-light-100 mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            {t('skills.title')}
          </motion.h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SkillChart
                  name={skill.name}
                  percentage={skill.percentage}
                  color={skill.color as 'primary' | 'secondary' | 'accent'}
                  icon={skill.icon}
                  description={skill.description}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div>
          <motion.h3
            className="text-2xl font-bold text-dark-100 dark:text-light-100 mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            {t('experience.title')}
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={exp.label}
                number={exp.number}
                label={exp.label}
                icon={exp.icon}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
