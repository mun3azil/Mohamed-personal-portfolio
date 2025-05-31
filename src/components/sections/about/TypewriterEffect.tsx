'use client';

import { useState, useEffect, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TypewriterEffectProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterEffect = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = '', 
  onComplete 
}: TypewriterEffectProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, show the full text immediately
    if (prefersReducedMotion) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Initial delay before starting to type
    const initialTimeout = setTimeout(() => {
      // Start typing
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(text.substring(0, currentIndex + 1));
          setCurrentIndex(prevIndex => prevIndex + 1);
        }, speed);

        return () => clearTimeout(timeout);
      } else if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    }, currentIndex === 0 ? delay : 0);

    return () => clearTimeout(initialTimeout);
  }, [currentIndex, delay, isComplete, onComplete, prefersReducedMotion, speed, text]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[2px] h-[1em] ml-[2px] bg-current align-middle"
          aria-hidden="true"
        />
      )}
    </span>
  );
};

export default memo(TypewriterEffect);
