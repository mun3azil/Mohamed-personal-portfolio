// Animation constants
export const ANIMATION = {
  DURATION: {
    FAST: 0.2,
    MEDIUM: 0.5,
    SLOW: 0.8,
    VERY_SLOW: 1.5
  },
  STIFFNESS: {
    LOW: 50,
    MEDIUM: 100,
    HIGH: 200
  },
  DAMPING: {
    LOW: 10,
    MEDIUM: 20,
    HIGH: 30
  },
  DELAY: {
    NONE: 0,
    SHORT: 0.1,
    MEDIUM: 0.3,
    LONG: 0.5
  },
  STAGGER: {
    TIGHT: 0.03,
    NORMAL: 0.1,
    LOOSE: 0.2
  }
};

// Image quality constants
export const IMAGE_QUALITY = {
  PROFILE: 90,
  HERO: 85,
  PROJECT: 80,
  BLOG: 80,
  DEFAULT: 75
};

// Performance threshold constants
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    GOOD: 2500,
    NEEDS_IMPROVEMENT: 4000
  },
  FID: {
    GOOD: 100,
    NEEDS_IMPROVEMENT: 300
  },
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25
  },
  FCP: {
    GOOD: 1800,
    NEEDS_IMPROVEMENT: 3000
  },
  TTFB: {
    GOOD: 800,
    NEEDS_IMPROVEMENT: 1800
  },
  INP: {
    GOOD: 200,
    NEEDS_IMPROVEMENT: 500
  }
};

// Breakpoints matching Tailwind's default breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
};

// Routes for navigation
export const ROUTES = {
  HOME: '#home',
  ABOUT: '#about',
  PROJECTS: '#projects',
  BLOG: '#blog',
  CONTACT: '#contact'
};

// Supported languages
export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
  // Add more languages as needed
};

// Social media links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/yourusername',
  LINKEDIN: 'https://linkedin.com/in/yourusername',
  TWITTER: 'https://twitter.com/yourusername',
  // Add more as needed
};