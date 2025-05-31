'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useHeroMotion } from '@/hooks/useHeroMotion';

interface FloatingIcon {
  icon: string;
  top: string;
  left: string;
  delay: number;
  ariaLabel: string;
}

const iconData: FloatingIcon[] = [
  { icon: '⚛️', top: '20%', left: '10%', delay: 0, ariaLabel: 'React technology' },
  { icon: '🔷', top: '70%', left: '15%', delay: 0.3, ariaLabel: 'TypeScript technology' },
  { icon: '🚀', top: '30%', left: '85%', delay: 0.6, ariaLabel: 'Performance optimization' },
  { icon: '💻', top: '80%', left: '80%', delay: 0.9, ariaLabel: 'Web development' },
  { icon: '🌐', top: '15%', left: '60%', delay: 1.2, ariaLabel: 'Global web presence' },
];

interface FloatingIconsProps {
  className?: string;
}

const FloatingIcons = memo(({ className = '' }: FloatingIconsProps) => {
  const { variants, floatingAnimation, prefersReducedMotion } = useHeroMotion();

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {iconData.map((item, index) => (
        <motion.div
          key={`floating-icon-${index}`}
          className="absolute text-2xl sm:text-3xl select-none"
          style={{ 
            top: item.top, 
            left: item.left,
            willChange: prefersReducedMotion ? 'auto' : 'transform'
          }}
          variants={variants.floatingIcon}
          initial="hidden"
          animate="visible"
          transition={{ delay: item.delay }}
          aria-label={item.ariaLabel}
        >
          <motion.div
            animate={floatingAnimation}
            style={{ 
              willChange: prefersReducedMotion ? 'auto' : 'transform'
            }}
          >
            <span
              className="block filter drop-shadow-lg text-shadow-sm"
            >
              {item.icon}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
});

FloatingIcons.displayName = 'FloatingIcons';

export default FloatingIcons;

