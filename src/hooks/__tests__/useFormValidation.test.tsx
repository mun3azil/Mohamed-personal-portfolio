import { renderHook, act } from '@testing-library/react-hooks';
import useFormValidation, { validationRules } from '../useFormValidation';

describe('useFormValidation', () => {
  // Define a simple form for testing
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = {
    name: [
      validationRules.required('Name is required'),
      validationRules.minLength(2, 'Name must be at least 2 characters'),
    ],
    email: [
      validationRules.required('Email is required'),
      validationRules.email('Invalid email format'),
    ],
    password: [
      validationRules.required('Password is required'),
      validationRules.minLength(8, 'Password must be at least 8 characters'),
    ],
    confirmPassword: [
      validationRules.required('Please confirm your password'),
      validationRules.match('password', 'Passwords do not match'),
    ],
  };

  it('should initialize with initial values and no errors', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
    
    // All fields should start as untouched
    Object.keys(initialValues).forEach(key => {
      expect(result.current.touched[key]).toBe(false);
    });
  });

  it('should update values when handleChange is called', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    // Create a mock event
    const mockEvent = {
      target: {
        name: 'name',
        value: 'John Doe',
        type: 'text',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.isDirty).toBe(true);
  });

  it('should mark field as touched when handleBlur is called', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    // Create a mock event
    const mockEvent = {
      target: {
        name: 'name',
        value: '',
      },
    } as React.FocusEvent<HTMLInputElement>;

    act(() => {
      result.current.handleBlur(mockEvent);
    });

    expect(result.current.touched.name).toBe(true);
    // Should validate on blur
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('should validate a field correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    // Set a valid name
    act(() => {
      result.current.setFieldValue('name', 'John');
      result.current.validateField('name');
    });

    expect(result.current.errors.name).toBeUndefined();

    // Set an invalid name
    act(() => {
      result.current.setFieldValue('name', '');
      result.current.validateField('name');
    });

    expect(result.current.errors.name).toBe('Name is required');

    // Set a name that's too short
    act(() => {
      result.current.setFieldValue('name', 'J');
      result.current.validateField('name');
    });

    expect(result.current.errors.name).toBe('Name must be at least 2 characters');
  });

  it('should validate the entire form correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    // Initially the form should be invalid but no errors shown
    expect(result.current.isValid).toBe(true); // No visible errors yet

    // Validate the entire form
    let isValid;
    act(() => {
      isValid = result.current.validateForm();
    });

    // Form should be invalid and errors should be shown
    expect(isValid).toBe(false);
    expect(result.current.isValid).toBe(false);
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    
    // All fields should be marked as touched
    Object.keys(initialValues).forEach(key => {
      expect(result.current.touched[key]).toBe(true);
    });

    // Fill in valid data
    act(() => {
      result.current.setValues({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    // Validate again
    act(() => {
      isValid = result.current.validateForm();
    });

    // Form should now be valid
    expect(isValid).toBe(true);
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('should reset the form correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    // Change some values and touch some fields
    act(() => {
      result.current.setFieldValue('name', 'John');
      result.current.setFieldTouched('name');
      result.current.validateField('name');
    });

    expect(result.current.values.name).toBe('John');
    expect(result.current.touched.name).toBe(true);
    expect(result.current.isDirty).toBe(true);

    // Reset the form
    act(() => {
      result.current.resetForm();
    });

    // Form should be back to initial state
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isDirty).toBe(false);
    
    // All fields should be untouched again
    Object.keys(initialValues).forEach(key => {
      expect(result.current.touched[key]).toBe(false);
    });
  });

  it('should handle checkbox inputs correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation({ ...initialValues, acceptTerms: false })
    );

    // Create a mock checkbox event
    const mockEvent = {
      target: {
        name: 'acceptTerms',
        type: 'checkbox',
        checked: true,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.acceptTerms).toBe(true);
  });

  it('should handle number inputs correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation({ ...initialValues, age: 0 })
    );

    // Create a mock number event
    const mockEvent = {
      target: {
        name: 'age',
        type: 'number',
        value: '25',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.age).toBe(25);
  });

  it('should validate email format correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    // Set an invalid email
    act(() => {
      result.current.setFieldValue('email', 'invalid-email');
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBe('Invalid email format');

    // Set a valid email
    act(() => {
      result.current.setFieldValue('email', 'valid@example.com');
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('should validate matching fields correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, validationSchema)
    );

    // Set non-matching passwords
    act(() => {
      result.current.setFieldValue('password', 'password123');
      result.current.setFieldValue('confirmPassword', 'different');
      result.current.validateField('confirmPassword');
    });

    expect(result.current.errors.confirmPassword).toBe('Passwords do not match');

    // Set matching passwords
    act(() => {
      result.current.setFieldValue('confirmPassword', 'password123');
      result.current.validateField('confirmPassword');
    });

    expect(result.current.errors.confirmPassword).toBeUndefined();
  });
});