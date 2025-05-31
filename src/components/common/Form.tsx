'use client';

import React, { ReactNode } from 'react';
import useFormValidation, { validationRules } from '@/hooks/useFormValidation';
import Button from './Button';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any[];
  className?: string;
}

export interface FormProps {
  /**
   * Form title
   */
  title?: string;
  
  /**
   * Form description
   */
  description?: string;
  
  /**
   * Form fields configuration
   */
  fields: FormField[];
  
  /**
   * Initial values for the form
   */
  initialValues: Record<string, any>;
  
  /**
   * Function to handle form submission
   */
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  
  /**
   * Submit button text
   */
  submitText?: string;
  
  /**
   * Cancel button text (if provided, a cancel button will be shown)
   */
  cancelText?: string;
  
  /**
   * Function to handle cancel button click
   */
  onCancel?: () => void;
  
  /**
   * Additional content to render at the bottom of the form
   */
  footer?: ReactNode;
  
  /**
   * Additional CSS classes for the form container
   */
  className?: string;
}

/**
 * Reusable form component with validation
 * 
 * @param props Form props
 * @returns Form component
 */
const Form: React.FC<FormProps> = ({
  title,
  description,
  fields,
  initialValues,
  onSubmit,
  submitText = 'Submit',
  cancelText,
  onCancel,
  footer,
  className = '',
}) => {
  // Create validation schema from field configurations
  const validationSchema = React.useMemo(() => {
    return fields.reduce((schema, field) => {
      if (field.validation && field.validation.length > 0) {
        schema[field.name] = field.validation;
      }
      return schema;
    }, {} as Record<string, any[]>);
  }, [fields]);

  // Initialize form validation
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
  } = useFormValidation(initialValues, validationSchema);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isValid = validateForm();
    
    if (isValid) {
      await onSubmit(values);
    }
  };

  // Render a form field based on its type
  const renderField = (field: FormField) => {
    const { name, label, type, placeholder, options, className = '' } = field;
    const error = touched[name] && errors[name];
    const fieldClassName = `mb-4 ${className}`;
    const inputClassName = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? 'border-red-500' : 'border-gray-300'}`;
    
    switch (type) {
      case 'textarea':
        return (
          <div className={fieldClassName} key={name}>
            <label htmlFor={name} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <textarea
              id={name}
              name={name}
              value={values[name] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`${inputClassName} min-h-[100px]`}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            />
            {error && (
              <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div className={fieldClassName} key={name}>
            <label htmlFor={name} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <select
              id={name}
              name={name}
              value={values[name] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClassName}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            >
              <option value="">{placeholder || 'Select an option'}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className={fieldClassName} key={name}>
            <div className="flex items-center">
              <input
                id={name}
                name={name}
                type="checkbox"
                checked={!!values[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
              />
              <label htmlFor={name} className="ml-2 block text-gray-700 dark:text-gray-300">
                {label}
              </label>
            </div>
            {error && (
              <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        );
        
      case 'radio':
        return (
          <div className={fieldClassName} key={name}>
            <fieldset>
              <legend className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                {label}
              </legend>
              <div className="space-y-2">
                {options?.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`${name}-${option.value}`}
                      name={name}
                      type="radio"
                      value={option.value}
                      checked={values[name] === option.value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      aria-describedby={error ? `${name}-error` : undefined}
                    />
                    <label
                      htmlFor={`${name}-${option.value}`}
                      className="ml-2 block text-gray-700 dark:text-gray-300"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
            {error && (
              <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        );
        
      default: // text, email, password, number
        return (
          <div className={fieldClassName} key={name}>
            <label htmlFor={name} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={values[name] || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={inputClassName}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            />
            {error && (
              <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          {title}
        </h2>
      )}
      
      {description && (
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        {fields.map(renderField)}
        
        <div className="mt-6 flex items-center justify-end space-x-4">
          {cancelText && onCancel && (
            <Button
              type="button"
              variant="tertiary"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
          >
            {submitText}
          </Button>
        </div>
        
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </form>
    </div>
  );
};

// Export the Form component and validation rules for easy access
export { validationRules };
export default Form;