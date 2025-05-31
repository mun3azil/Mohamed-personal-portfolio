import { useState, useCallback, useMemo } from 'react';

type ValidationRule<T> = {
  validate: (value: T, formValues?: Record<string, any>) => boolean;
  message: string;
};

type FieldValidation<T> = ValidationRule<T>[];

type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]?: FieldValidation<T[K]>;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

type UseFormValidationReturn<T extends Record<string, any>> = {
  values: T;
  errors: FormErrors<T>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldTouched: (name: keyof T, isTouched?: boolean) => void;
  validateField: (name: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  setValues: (values: Partial<T>) => void;
};

/**
 * Custom hook for form validation
 * 
 * @param initialValues Initial form values
 * @param validationSchema Schema defining validation rules for each field
 * @returns Form state and handlers
 */
const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
): UseFormValidationReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>)
  );

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T): boolean => {
      if (!validationSchema || !validationSchema[name]) {
        return true;
      }

      const fieldValidation = validationSchema[name] as FieldValidation<any>;
      const value = values[name];

      for (const rule of fieldValidation) {
        if (!rule.validate(value, values)) {
          setErrors((prev) => ({ ...prev, [name]: rule.message }));
          return false;
        }
      }

      // Clear error if validation passes
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      return true;
    },
    [values, validationSchema]
  );

  // Validate the entire form
  const validateForm = useCallback((): boolean => {
    if (!validationSchema) {
      return true;
    }

    let isValid = true;
    const newErrors: FormErrors<T> = {};

    // Mark all fields as touched during form validation
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    
    setTouched(allTouched);

    // Validate each field
    Object.keys(validationSchema).forEach((fieldName) => {
      const name = fieldName as keyof T;
      const fieldValidation = validationSchema[name] as FieldValidation<any>;
      const value = values[name];

      for (const rule of fieldValidation) {
        if (!rule.validate(value, values)) {
          newErrors[name] = rule.message;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema]);

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;
      
      // Handle different input types
      let fieldValue: any = value;
      if (type === 'checkbox') {
        fieldValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'number') {
        fieldValue = value === '' ? '' : Number(value);
      }

      setValues((prev) => ({ ...prev, [fieldName]: fieldValue }));
      
      // Validate field if it's been touched
      if (touched[fieldName]) {
        validateField(fieldName);
      }
    },
    [touched, validateField]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      const fieldName = name as keyof T;
      
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      validateField(fieldName);
    },
    [validateField]
  );

  // Set a field value programmatically
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      
      // Validate field if it's been touched
      if (touched[name]) {
        validateField(name);
      }
    },
    [touched, validateField]
  );

  // Set a field's touched state programmatically
  const setFieldTouched = useCallback(
    (name: keyof T, isTouched = true) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));
      
      if (isTouched) {
        validateField(name);
      }
    },
    [validateField]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      }, {} as Record<keyof T, boolean>)
    );
  }, [initialValues]);

  // Update multiple values at once
  const updateValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Compute if the form is valid (no errors)
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // Compute if the form is dirty (values different from initial)
  const isDirty = useMemo(() => {
    return Object.keys(initialValues).some(key => {
      const k = key as keyof T;
      return values[k] !== initialValues[k];
    });
  }, [values, initialValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    setValues: updateValues,
  };
};

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule<any> => ({
    validate: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      return true;
    },
    message,
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true; // Skip if empty (use required rule for required fields)
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(value);
    },
    message,
  }),
  
  minLength: (length: number, message = `Must be at least ${length} characters`): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true; // Skip if empty
      return value.length >= length;
    },
    message,
  }),
  
  maxLength: (length: number, message = `Must be at most ${length} characters`): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true; // Skip if empty
      return value.length <= length;
    },
    message,
  }),
  
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true; // Skip if empty
      return regex.test(value);
    },
    message,
  }),
  
  match: (fieldName: string, message = 'Fields do not match'): ValidationRule<any> => ({
    validate: (value, formValues) => {
      if (!formValues) return true;
      return value === formValues[fieldName];
    },
    message,
  }),
};

export default useFormValidation;