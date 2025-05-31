import React from 'react';
import { render, screen, fireEvent, act } from '@/lib/test-utils';
import Toast from '../Toast';

// Mock the framer-motion module
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    render(<Toast message="Test message" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(toast).toHaveStyle({
      backgroundColor: 'var(--toast-info-bg, #3b82f6)',
    });
  });

  it('renders with success type', () => {
    render(<Toast message="Success message" type="success" />);
    
    const toast = screen.getByTestId('toast-success');
    expect(toast).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(toast).toHaveStyle({
      backgroundColor: 'var(--toast-success-bg, #10b981)',
    });
  });

  it('renders with error type', () => {
    render(<Toast message="Error message" type="error" />);
    
    const toast = screen.getByTestId('toast-error');
    expect(toast).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(toast).toHaveStyle({
      backgroundColor: 'var(--toast-error-bg, #ef4444)',
    });
  });

  it('renders with warning type', () => {
    render(<Toast message="Warning message" type="warning" />);
    
    const toast = screen.getByTestId('toast-warning');
    expect(toast).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(toast).toHaveStyle({
      backgroundColor: 'var(--toast-warning-bg, #f59e0b)',
    });
  });

  it('renders with custom class name', () => {
    render(<Toast message="Test message" className="custom-toast" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveClass('custom-toast');
  });

  it('renders with top-left position', () => {
    render(<Toast message="Test message" position="top-left" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveStyle({
      top: '1rem',
      left: '1rem',
    });
  });

  it('renders with top-center position', () => {
    render(<Toast message="Test message" position="top-center" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveStyle({
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
    });
  });

  it('renders with top-right position', () => {
    render(<Toast message="Test message" position="top-right" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveStyle({
      top: '1rem',
      right: '1rem',
    });
  });

  it('renders with bottom-left position', () => {
    render(<Toast message="Test message" position="bottom-left" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveStyle({
      bottom: '1rem',
      left: '1rem',
    });
  });

  it('renders with bottom-right position', () => {
    render(<Toast message="Test message" position="bottom-right" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveStyle({
      bottom: '1rem',
      right: '1rem',
    });
  });

  it('renders with bottom-center position by default', () => {
    render(<Toast message="Test message" />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveStyle({
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
    });
  });

  it('closes after duration', () => {
    const onClose = jest.fn();
    render(<Toast message="Test message" duration={1000} onClose={onClose} />);
    
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Toast message="Test message" onClose={onClose} />);
    
    const closeButton = screen.getByTestId('toast-close-button');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not show close button when showCloseButton is false', () => {
    render(<Toast message="Test message" showCloseButton={false} />);
    
    expect(screen.queryByTestId('toast-close-button')).not.toBeInTheDocument();
  });

  it('does not auto-close when duration is 0', () => {
    const onClose = jest.fn();
    render(<Toast message="Test message" duration={0} onClose={onClose} />);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('is not visible when visible prop is false', () => {
    render(<Toast message="Test message" visible={false} />);
    
    expect(screen.queryByTestId('toast-info')).not.toBeInTheDocument();
  });
});