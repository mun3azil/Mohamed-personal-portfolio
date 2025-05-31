'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AnimatedBlob from './AnimatedBlob';
import TypewriterEffect from './TypewriterEffect';
import { useComponentAnimation } from '@/hooks/useComponentAnimation';

export default function HeroSection() {
  const t = useTranslations('hero');
  const [isVisible, setIsVisible] = useState(false);
  const { variants } = useComponentAnimation({ component: 'hero' });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const floatingIcons = [
    { icon: '⚛️', top: '20%', left: '10%', delay: 0 },
    { icon: '🔷', top: '70%', left: '15%', delay: 1 },
    { icon: '🚀', top: '30%', left: '85%', delay: 0.5 },
    { icon: '💻', top: '80%', left: '80%', delay: 1.5 },
    { icon: '🌐', top: '15%', left: '60%', delay: 2 },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-light-100 dark:bg-dark-200 pt-20"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedBlob
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 dark:opacity-10 text-primary-300"
          duration={20}
        />
        <AnimatedBlob
          className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-20 dark:opacity-10 text-secondary-300"
          duration={15}
          reverse
        />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={(variants as any).floatingIcon || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          custom={item.delay}
          style={{ top: item.top, left: item.left }}
        >
          <motion.div
            animate="float"
            variants={(variants as any).floatingIcon || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            custom={item.delay}
          >
            {item.icon}
          </motion.div>
        </motion.div>
      ))}

      <div className="container mx-auto px-4 z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={variants.container}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.h2
            variants={(variants as any).item || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-xl md:text-2xl font-medium text-dark-100 dark:text-light-100 mb-2"
          >
            {t('greeting')}
          </motion.h2>

          <motion.h1
            variants={(variants as any).item || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-dark-100 dark:text-light-100 mb-4"
          >
            {t('name')}
          </motion.h1>

          <motion.div variants={(variants as any).item || { hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="mb-6 h-12">
            <TypewriterEffect
              texts={[t('title'), 'React Developer', 'UI/UX Enthusiast', 'Problem Solver']}
              className="text-2xl md:text-3xl font-semibold text-primary-600 dark:text-primary-400"
            />
          </motion.div>

          <motion.p
            variants={(variants as any).item || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-lg md:text-xl text-dark-100/80 dark:text-light-100/80 max-w-2xl mb-8"
          >
            {t('description')}
          </motion.p>

          <motion.div
            variants={(variants as any).item || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
          >
            <Link href="#projects">
              <motion.button
                variants={(variants as any).cta || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                whileHover="hover"
                whileTap="tap"
                className="px-8 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
              >
                {t('cta.projects')}
              </motion.button>
            </Link>
            <Link href="#contact">
              <motion.button
                variants={(variants as any).cta || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                whileHover="hover"
                whileTap="tap"
                className="px-8 py-3 rounded-2xl bg-transparent border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-600/10 transition-colors"
              >
                {t('cta.contact')}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        variants={(variants as any).scrollIndicator || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={(variants as any).scrollIndicator || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          animate="bounce"
          className="w-6 h-10 rounded-full border-2 border-dark-100 dark:border-light-100 flex justify-center p-1"
        >
          <motion.div
            variants={(variants as any).scrollIndicator || { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            animate="pulse"
            className="w-1 bg-dark-100 dark:bg-light-100 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
