import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/lib/test-utils';
import ContactForm from '../ContactForm';

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

describe('ContactForm Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock console.log to prevent form submission logs
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renders the contact form with title and description', () => {
    render(<ContactForm />);

    // Check if title and description are rendered
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText(/have a question or want to work together/i)).toBeInTheDocument();
    
    // Check if all form fields are rendered
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subscribe to newsletter/i)).toBeInTheDocument();
    
    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    
    // Check if footer text is rendered
    expect(screen.getByText(/by submitting this form, you agree to our/i)).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    render(<ContactForm />);

    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Please select a subject')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data and shows success message', async () => {
    const mockOnSuccess = jest.fn();
    render(<ContactForm onSuccess={mockOnSuccess} />);

    // Fill out the form with valid data
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const subjectSelect = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);
    const subscribeCheckbox = screen.getByLabelText(/subscribe to newsletter/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectSelect, { target: { value: 'project' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message that is long enough.' } });
    fireEvent.click(subscribeCheckbox);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    // Check if button text changes to "Sending..."
    expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText('Message Sent Successfully!')).toBeInTheDocument();
      expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument();
    });

    // Check if onSuccess callback was called
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);

    // Check if "Send Another Message" button is rendered
    const sendAnotherButton = screen.getByRole('button', { name: /send another message/i });
    expect(sendAnotherButton).toBeInTheDocument();

    // Click "Send Another Message" button
    fireEvent.click(sendAnotherButton);

    // Check if form is rendered again
    await waitFor(() => {
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });
  });

  it('handles form submission error', async () => {
    // Mock console.error to prevent error logs
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock Promise.prototype.then to simulate an error
    const originalThen = Promise.prototype.then;
    Promise.prototype.then = function(onFulfilled, onRejected) {
      return originalThen.call(
        this,
        onFulfilled,
        () => {
          throw new Error('Simulated error');
        }
      );
    };

    render(<ContactForm />);

    // Fill out the form with valid data
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const subjectSelect = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectSelect, { target: { value: 'project' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message that is long enough.' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/an error occurred while submitting the form/i)).toBeInTheDocument();
    });

    // Restore Promise.prototype.then
    Promise.prototype.then = originalThen;
  });

  it('applies custom className to the form container', () => {
    const { container } = render(<ContactForm className="custom-contact-form" />);

    // Check if the custom class is applied
    expect(container.firstChild).toHaveClass('custom-contact-form');
  });
});