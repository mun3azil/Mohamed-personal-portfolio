'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface TypewriterEffectProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  startDelay?: number;
}

const TypewriterEffect = memo(({
  texts,
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
  startDelay = 0,
}: TypewriterEffectProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Start the typewriter effect after delay
  useEffect(() => {
    if (startDelay > 0) {
      const startTimer = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);

      return () => clearTimeout(startTimer);
    } else {
      setHasStarted(true);
    }
  }, [startDelay]);

  // Memoized typewriter logic
  const updateText = useCallback(() => {
    if (!hasStarted || texts.length === 0) return;

    const currentText = texts[currentIndex];

    if (isPaused) {
      setIsPaused(false);
      setIsTyping(false);
      return;
    }

    if (isTyping) {
      if (displayText.length < currentText.length) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      } else {
        setIsPaused(true);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.substring(0, displayText.length - 1));
      } else {
        setIsTyping(true);
        setCurrentIndex((currentIndex + 1) % texts.length);
      }
    }
  }, [displayText, currentIndex, isTyping, isPaused, texts, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(updateText, pauseTime);
    } else {
      const speed = isTyping ? typingSpeed : deletingSpeed;
      timeout = setTimeout(updateText, speed);
    }

    return () => clearTimeout(timeout);
  }, [updateText, isPaused, isTyping, typingSpeed, deletingSpeed, pauseTime, hasStarted]);

  // For reduced motion, just show the first text without animation
  if (prefersReducedMotion) {
    return (
      <span className={className} aria-label={`Dynamic text: ${texts.join(', ')}`}>
        {texts[0] || ''}
      </span>
    );
  }

  return (
    <span className={className} aria-live="polite" aria-label="Dynamic typing text">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${currentIndex}-${displayText.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {displayText}
        </motion.span>
      </AnimatePresence>

      {/* Cursor */}
      <motion.span
        className="inline-block w-0.5 h-6 bg-current ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
        aria-hidden="true"
      />
    </span>
  );
});

TypewriterEffect.displayName = 'TypewriterEffect';

export default TypewriterEffect;
