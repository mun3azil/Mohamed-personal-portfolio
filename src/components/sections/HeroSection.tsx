import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const { theme } = useTheme();
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[60vh] md:min-h-[80vh] px-4 py-12 text-center overflow-hidden"
      aria-label="Hero Section"
    >
      {/* Background Illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full -z-10"
        aria-hidden="true"
      >
        <Image
          src={
            theme === 'dark'
              ? '/images/optimized/hero/hero-bg.svg'
              : '/images/hero/hero-bg.svg'
          }
          alt="Futuristic code background"
          fill
          style={{ objectFit: 'cover', opacity: 0.7 }}
          priority
        />
      </motion.div>

      {/* Developer Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6"
      >
        <Image
          src="/images/optimized/hero/hero-avatar.svg"
          alt="Developer avatar with hoodie and glasses"
          width={180}
          height={180}
          className="rounded-full shadow-lg border-4 border-primary/60 dark:border-primary/80 bg-white/10"
          priority
        />
      </motion.div>

      {/* Headline and Description */}
      <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
        Mohamed – Creative Developer
      </h1>
      <p className="max-w-xl mx-auto text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground/80 mb-6">
        Building futuristic, accessible, and performant web experiences. <span className="font-semibold">[EN/AR]</span>
      </p>

      {/* Theme Toggle (example, replace with your actual toggle) */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs">Light</span>
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="w-10 h-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-700 dark:from-gray-700 dark:to-gray-900 flex items-center px-1 transition-colors"
        >
          <span
            className={`block w-4 h-4 rounded-full bg-primary shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-4' : ''}`}
          />
        </button>
        <span className="text-xs">Dark</span>
      </div>

      {/* Language Switch UI (example, replace with your actual switch) */}
      <div className="flex items-center justify-center gap-2">
        <span className="font-bold">EN</span>
        <span className="w-8 h-5 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-between px-1">
          <span className="w-3 h-3 bg-white rounded-full shadow" />
        </span>
        <span className="font-bold">AR</span>
      </div>
    </section>
  );
}
