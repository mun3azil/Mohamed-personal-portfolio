import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import Form, { validationRules } from '../Form';

describe('Form Component', () => {
  // Define a simple contact form for testing
  const contactFormFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text' as const,
      placeholder: 'Enter your full name',
      validation: [
        validationRules.required('Name is required'),
        validationRules.minLength(2, 'Name must be at least 2 characters'),
      ],
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'Enter your email address',
      validation: [
        validationRules.required('Email is required'),
        validationRules.email('Please enter a valid email address'),
      ],
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea' as const,
      placeholder: 'Enter your message',
      validation: [
        validationRules.required('Message is required'),
        validationRules.minLength(10, 'Message must be at least 10 characters'),
      ],
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'select' as const,
      placeholder: 'Select a subject',
      options: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'feedback', label: 'Feedback' },
      ],
      validation: [
        validationRules.required('Please select a subject'),
      ],
    },
    {
      name: 'subscribe',
      label: 'Subscribe to newsletter',
      type: 'checkbox' as const,
    },
  ];

  const initialValues = {
    name: '',
    email: '',
    message: '',
    subject: '',
    subscribe: false,
  };

  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with title and description', () => {
    render(
      <Form
        title="Contact Us"
        description="Fill out the form below to get in touch with us."
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={mockSubmit}
      />
    );

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Fill out the form below to get in touch with us.')).toBeInTheDocument();
    
    // Check if all fields are rendered
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subscribe to newsletter/i)).toBeInTheDocument();
    
    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders cancel button when cancelText and onCancel are provided', () => {
    render(
      <Form
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={mockSubmit}
        cancelText="Cancel"
        onCancel={mockCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    
    // Test cancel button click
    fireEvent.click(cancelButton);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors when form is submitted with empty required fields', async () => {
    render(
      <Form
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={mockSubmit}
      />
    );

    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
      expect(screen.getByText('Please select a subject')).toBeInTheDocument();
    });

    // Ensure onSubmit was not called
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates fields on blur', async () => {
    render(
      <Form
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={mockSubmit}
      />
    );

    // Focus and blur the name field without entering a value
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);

    // Check if validation error is displayed
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    // Enter an invalid email and blur
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    // Check if email validation error is displayed
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(
      <Form
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={mockSubmit}
      />
    );

    // Fill out the form with valid data
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const subjectSelect = screen.getByLabelText(/subject/i);
    const subscribeCheckbox = screen.getByLabelText(/subscribe to newsletter/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message that is long enough.' } });
    fireEvent.change(subjectSelect, { target: { value: 'feedback' } });
    fireEvent.click(subscribeCheckbox);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct values
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
        subject: 'feedback',
        subscribe: true,
      });
    });
  });

  it('renders radio buttons correctly', () => {
    const radioFormFields = [
      {
        name: 'gender',
        label: 'Gender',
        type: 'radio' as const,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ],
        validation: [
          validationRules.required('Please select a gender'),
        ],
      },
    ];

    render(
      <Form
        fields={radioFormFields}
        initialValues={{ gender: '' }}
        onSubmit={mockSubmit}
      />
    );

    // Check if radio buttons are rendered
    expect(screen.getByLabelText(/male/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/female/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other/i)).toBeInTheDocument();

    // Select a radio option
    const maleRadio = screen.getByLabelText(/male/i);
    fireEvent.click(maleRadio);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct value
    expect(mockSubmit).toHaveBeenCalledWith({ gender: 'male' });
  });

  it('renders custom footer content when provided', () => {
    render(
      <Form
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={mockSubmit}
        footer={<p>By submitting this form, you agree to our terms and conditions.</p>}
      />
    );

    expect(screen.getByText(/by submitting this form, you agree to our terms and conditions/i)).toBeInTheDocument();
  });

  it('applies custom className to the form container', () => {
    const { container } = render(
      <Form
        fields={contactFormFields}
        initialValues={initialValues}
        onSubmit={mockSubmit}
        className="custom-form-class"
      />
    );

    // Check if the custom class is applied
    expect(container.firstChild).toHaveClass('custom-form-class');
  });
});