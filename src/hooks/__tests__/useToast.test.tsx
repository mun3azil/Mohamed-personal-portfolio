import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import useToast from '../useToast';
import { useToast as useToastProvider } from '@/components/common/ToastProvider';

// Mock the ToastProvider hook
jest.mock('@/components/common/ToastProvider', () => ({
  useToast: jest.fn(),
}));

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: any) => Component,
}));

// Test component that uses the useToast hook
const TestComponent = () => {
  const { show, success, error, warning, info, hide, hideAll } = useToast();
  
  return (
    <div>
      <button data-testid="show-toast" onClick={() => show('Test message')}>Show Toast</button>
      <button data-testid="show-success" onClick={() => success('Success message')}>Show Success</button>
      <button data-testid="show-error" onClick={() => error('Error message')}>Show Error</button>
      <button data-testid="show-warning" onClick={() => warning('Warning message')}>Show Warning</button>
      <button data-testid="show-info" onClick={() => info('Info message')}>Show Info</button>
      <button data-testid="hide-toast" onClick={() => hide('toast-id')}>Hide Toast</button>
      <button data-testid="hide-all" onClick={() => hideAll()}>Hide All</button>
    </div>
  );
};

describe('useToast Hook', () => {
  // Mock implementation of the toast provider methods
  const mockShowToast = jest.fn().mockReturnValue('toast-id');
  const mockSuccess = jest.fn().mockReturnValue('success-id');
  const mockError = jest.fn().mockReturnValue('error-id');
  const mockWarning = jest.fn().mockReturnValue('warning-id');
  const mockInfo = jest.fn().mockReturnValue('info-id');
  const mockHideToast = jest.fn();
  const mockHideAllToasts = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up the mock implementation
    (useToastProvider as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
      success: mockSuccess,
      error: mockError,
      warning: mockWarning,
      info: mockInfo,
      hideToast: mockHideToast,
      hideAllToasts: mockHideAllToasts,
    });
  });
  
  it('calls showToast when show is called', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('show-toast'));
    
    expect(mockShowToast).toHaveBeenCalledWith('Test message');
  });
  
  it('calls success when success is called', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('show-success'));
    
    expect(mockSuccess).toHaveBeenCalledWith('Success message');
  });
  
  it('calls error when error is called', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('show-error'));
    
    expect(mockError).toHaveBeenCalledWith('Error message');
  });
  
  it('calls warning when warning is called', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('show-warning'));
    
    expect(mockWarning).toHaveBeenCalledWith('Warning message');
  });
  
  it('calls info when info is called', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('show-info'));
    
    expect(mockInfo).toHaveBeenCalledWith('Info message');
  });
  
  it('calls hideToast when hide is called', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('hide-toast'));
    
    expect(mockHideToast).toHaveBeenCalledWith('toast-id');
  });
  
  it('calls hideAllToasts when hideAll is called', () => {
    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('hide-all'));
    
    expect(mockHideAllToasts).toHaveBeenCalled();
  });
});