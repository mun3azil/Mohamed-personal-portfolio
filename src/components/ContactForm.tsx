'use client';

import React, { useState } from 'react';
import Form, { validationRules, FormField } from '@/components/common/Form';


interface ContactFormProps {
  /**
   * Function to call when the form is submitted successfully
   */
  onSuccess?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Contact form component with validation
 * 
 * @param props Component props
 * @returns Contact form component
 */
const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, className = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Define form fields
  const contactFormFields: FormField[] = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      validation: [
        validationRules.required('Name is required'),
        validationRules.minLength(2, 'Name must be at least 2 characters'),
      ],
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      validation: [
        validationRules.required('Email is required'),
        validationRules.email('Please enter a valid email address'),
      ],
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'select',
      placeholder: 'Select a subject',
      options: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'project', label: 'Project Discussion' },
        { value: 'job', label: 'Job Opportunity' },
        { value: 'feedback', label: 'Feedback' },
      ],
      validation: [
        validationRules.required('Please select a subject'),
      ],
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Enter your message',
      validation: [
        validationRules.required('Message is required'),
        validationRules.minLength(10, 'Message must be at least 10 characters'),
      ],
    },
    {
      name: 'subscribe',
      label: 'Subscribe to newsletter',
      type: 'checkbox',
    },
  ];

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
    subscribe: false,
  };

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log form values (in a real app, you would send this to an API)
      console.log('Form submitted:', values);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If form was submitted successfully, show success message
  if (submitSuccess) {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 p-6 rounded-lg ${className}`}>
        <h2 className="text-xl font-bold mb-2 text-green-800 dark:text-green-400">
          Message Sent Successfully!
        </h2>
        <p className="text-green-700 dark:text-green-300">
          Thank you for contacting us. We&apos;ll get back to you as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
          {submitError}
        </div>
      )}
      
      <Form
        title="Get in Touch"
        description="Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible."
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitText={isSubmitting ? 'Sending...' : 'Send Message'}
        footer={
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By submitting this form, you agree to our{' '}
            <a href="/privacy-policy" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>.
          </p>
        }
      />
    </div>
  );
};

export default ContactForm;