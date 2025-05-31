'use client';

import { useState, FormEvent, ChangeEvent, useRef, useEffect, memo } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FormFieldProps {
  id: string;
  name: keyof FormData;
  label: string;
  type?: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
  index?: number;
}

// Form Field Component
const FormField = memo(({
  id,
  name,
  label,
  type = 'text',
  value,
  error,
  disabled,
  onChange,
  onFocus,
  onBlur,
  rows,
  placeholder,
  required = true,
  className = '',
  index = 0
}: FormFieldProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);

  // Animation variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const isTextarea = type === 'textarea';

  return (
    <motion.div
      className={`relative ${className}`}
      variants={prefersReducedMotion ? {} : fieldVariants}
    >
      <label
        htmlFor={id}
        className={`block text-dark-100 dark:text-light-100 mb-2 transition-all duration-300 ${
          isFocused ? 'text-primary-600 dark:text-primary-400' : ''
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows || 5}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg bg-light-300 dark:bg-dark-200 text-dark-100 dark:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
            error ? 'border-2 border-red-500 dark:border-red-400' : isFocused ? 'border-2 border-primary-500 dark:border-primary-400' : 'border border-transparent'
          }`}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg bg-light-300 dark:bg-dark-200 text-dark-100 dark:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
            error ? 'border-2 border-red-500 dark:border-red-400' : isFocused ? 'border-2 border-primary-500 dark:border-primary-400' : 'border border-transparent'
          }`}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FormField.displayName = 'FormField';

// Main Contact Form Component
const ContactForm = () => {
  const t = useTranslations('contact.form');
  const contactT = useTranslations('contact');
  const formRef = useRef<HTMLFormElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<keyof FormData | null>(null);

  // Reset form focus when status changes
  useEffect(() => {
    if (submitStatus !== 'idle') {
      setFocusedField(null);
    }
  }, [submitStatus]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('errors.subjectRequired');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('errors.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('errors.messageShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (field: keyof FormData) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Replace with your EmailJS service ID, template ID, and public key
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'YOUR_PUBLIC_KEY'
      );

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const statusVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.4
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98
    },
    disabled: {
      opacity: 0.7,
      scale: 1
    }
  };

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-light-200 dark:bg-dark-100 rounded-2xl p-6 md:p-8 shadow-md"
      variants={prefersReducedMotion ? {} : formVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      aria-label="Contact form"
    >
      <AnimatePresence mode="wait">
        {submitStatus === 'success' && (
          <motion.div
            className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 flex items-start"
            variants={prefersReducedMotion ? {} : statusVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">{contactT('successTitle')}</p>
              <p>{contactT('success')}</p>
            </div>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400 flex items-start"
            variants={prefersReducedMotion ? {} : statusVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium">{contactT('errorTitle')}</p>
              <p>{contactT('error')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          id="name"
          name="name"
          label={t('name')}
          value={formData.name}
          error={errors.name}
          disabled={isSubmitting}
          onChange={handleChange}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
          placeholder={t('namePlaceholder')}
          index={0}
        />

        <FormField
          id="email"
          name="email"
          label={t('email')}
          type="email"
          value={formData.email}
          error={errors.email}
          disabled={isSubmitting}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
          placeholder={t('emailPlaceholder')}
          index={1}
        />
      </div>

      <FormField
        id="subject"
        name="subject"
        label={t('subject')}
        value={formData.subject}
        error={errors.subject}
        disabled={isSubmitting}
        onChange={handleChange}
        onFocus={() => handleFocus('subject')}
        onBlur={handleBlur}
        placeholder={t('subjectPlaceholder')}
        className="mb-6"
        index={2}
      />

      <FormField
        id="message"
        name="message"
        label={t('message')}
        type="textarea"
        value={formData.message}
        error={errors.message}
        disabled={isSubmitting}
        onChange={handleChange}
        onFocus={() => handleFocus('message')}
        onBlur={handleBlur}
        rows={5}
        placeholder={t('messagePlaceholder')}
        className="mb-6"
        index={3}
      />

      <motion.button
        type="submit"
        className="w-full px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        variants={prefersReducedMotion ? {} : buttonVariants}
        whileHover={isSubmitting ? undefined : "hover"}
        whileTap={isSubmitting ? undefined : "tap"}
        animate={isSubmitting ? "disabled" : "visible"}
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('sending')}
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('send')}
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default memo(ContactForm);
