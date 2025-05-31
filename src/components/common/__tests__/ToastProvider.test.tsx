import React from 'react';
import { render, screen, fireEvent, act } from '@/lib/test-utils';
import ToastProvider, { useToast } from '../ToastProvider';

// Mock the Toast component
jest.mock('../Toast', () => {
  return {
    __esModule: true,
    default: ({ message, type, onClose }: any) => (
      <div data-testid={`toast-${type}`} onClick={onClose}>
        {message}
        <button data-testid="toast-close-button" onClick={onClose}>Close</button>
      </div>
    ),
    ToastType: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info',
    },
  };
});

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

// Test component that uses the useToast hook
const TestComponent = () => {
  const { showToast, hideAllToasts, success, error, warning, info } = useToast();
  
  return (
    <div>
      <button
        data-testid="show-toast-button"
        onClick={() => showToast('Test message')}
      >
        Show Toast
      </button>
      <button
        data-testid="show-success-button"
        onClick={() => success('Success message')}
      >
        Show Success
      </button>
      <button
        data-testid="show-error-button"
        onClick={() => error('Error message')}
      >
        Show Error
      </button>
      <button
        data-testid="show-warning-button"
        onClick={() => warning('Warning message')}
      >
        Show Warning
      </button>
      <button
        data-testid="show-info-button"
        onClick={() => info('Info message')}
      >
        Show Info
      </button>
      <button
        data-testid="hide-all-button"
        onClick={() => hideAllToasts()}
      >
        Hide All
      </button>
    </div>
  );
};

describe('ToastProvider Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders children correctly', () => {
    render(
      <ToastProvider>
        <div data-testid="test-child">Test Child</div>
      </ToastProvider>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('shows a toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByTestId('show-toast-button'));
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('shows a success toast when success is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByTestId('show-success-button'));
    
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('shows an error toast when error is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByTestId('show-error-button'));
    
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('shows a warning toast when warning is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByTestId('show-warning-button'));
    
    expect(screen.getByTestId('toast-warning')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('shows an info toast when info is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByTestId('show-info-button'));
    
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('removes a toast when its close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByTestId('show-toast-button'));
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('toast-close-button'));
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('removes all toasts when hideAllToasts is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    // Show multiple toasts
    fireEvent.click(screen.getByTestId('show-success-button'));
    fireEvent.click(screen.getByTestId('show-error-button'));
    fireEvent.click(screen.getByTestId('show-warning-button'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    
    // Hide all toasts
    fireEvent.click(screen.getByTestId('hide-all-button'));
    
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
  });

  it('limits the number of toasts based on maxToasts prop', () => {
    render(
      <ToastProvider maxToasts={2}>
        <TestComponent />
      </ToastProvider>
    );
    
    // Show more toasts than the limit
    fireEvent.click(screen.getByTestId('show-success-button')); // This one should be removed
    fireEvent.click(screen.getByTestId('show-error-button'));
    fireEvent.click(screen.getByTestId('show-warning-button'));
    
    // The oldest toast (success) should be removed
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('throws an error when useToast is used outside of ToastProvider', () => {
    // Suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});