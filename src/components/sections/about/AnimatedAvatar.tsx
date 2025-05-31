'use client';

import { useState, useRef, memo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedAvatarProps {
  imageSrc: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedAvatar = ({ 
  imageSrc, 
  alt, 
  size = 'md', 
  className = '' 
}: AnimatedAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  // Parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  // Size mapping
  const sizeClasses = {
    sm: 'w-48 h-48 md:w-56 md:h-56',
    md: 'w-64 h-64 md:w-80 md:h-80',
    lg: 'w-72 h-72 md:w-96 md:h-96',
  };
  
  // Decorative elements
  const decorativeElements = [
    {
      position: 'absolute -top-6 -left-6 w-12 h-12 rounded-full bg-secondary-400 dark:bg-secondary-600 z-10',
      animation: {
        y: [0, -10, 0],
        opacity: [0.7, 1, 0.7]
      },
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    },
    {
      position: 'absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-accent-400 dark:bg-accent-600 z-10',
      animation: {
        y: [0, 10, 0],
        opacity: [0.7, 1, 0.7]
      },
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut"
      }
    },
    {
      position: 'absolute top-1/2 -right-8 w-8 h-8 rounded-full bg-primary-400 dark:bg-primary-600 z-10',
      animation: {
        x: [0, 10, 0],
        opacity: [0.7, 1, 0.7]
      },
      transition: {
        repeat: Infinity,
        duration: 3.5,
        ease: "easeInOut"
      }
    }
  ];
  
  // Hover animation variants
  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    initial: { 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };
  
  const borderVariants = {
    hover: { 
      boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)',
      transition: { duration: 0.3 }
    },
    initial: { 
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative flex justify-center lg:justify-end ${className}`}
      style={prefersReducedMotion ? {} : { y }}
    >
      <motion.div 
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-primary-500 dark:border-primary-400 shadow-xl`}
        variants={borderVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        tabIndex={0}
        role="img"
        aria-label={alt}
      >
        <motion.div
          variants={imageVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          whileTap="tap"
          className="w-full h-full"
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes={`(max-width: 768px) ${size === 'sm' ? '12rem' : size === 'md' ? '16rem' : '18rem'}, ${size === 'sm' ? '14rem' : size === 'md' ? '20rem' : '24rem'}`}
            className="object-cover"
            priority
          />
        </motion.div>
      </motion.div>
      
      {/* Decorative Elements */}
      {!prefersReducedMotion && decorativeElements.map((element, index) => (
        <motion.div 
          key={index}
          className={element.position}
          animate={element.animation}
          transition={element.transition}
          aria-hidden="true"
        />
      ))}
    </motion.div>
  );
};

export default memo(AnimatedAvatar);
