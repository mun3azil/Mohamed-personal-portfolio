import React from 'react';
import { render, screen } from '@/lib/test-utils';
import Portal from '../Portal';

// Mock the react-dom module
jest.mock('react-dom', () => ({
  createPortal: jest.fn((children) => children),
}));

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

describe('Portal Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders children when disabled is true', () => {
    render(
      <Portal disabled>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );
    
    expect(screen.getByTestId('portal-content')).toBeInTheDocument();
    expect(screen.getByText('Portal Content')).toBeInTheDocument();
  });

  it('renders nothing on server-side', () => {
    // Mock window to be undefined to simulate SSR
    const originalWindow = global.window;
    // @ts-expect-error - Intentionally deleting window for SSR simulation
    delete global.window;
    
    const { container } = render(
      <Portal>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );
    
    expect(container.firstChild).toBeNull();
    
    // Restore window
    global.window = originalWindow;
  });

  it('renders children in a portal on client-side', () => {
    // Mock document.createElement
    const mockElement = document.createElement('div');
    const mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue(mockElement);
    
    // Mock document.body
    const mockBody = document.createElement('body');
    Object.defineProperty(document, 'body', {
      value: mockBody,
      writable: true,
    });
    
    render(
      <Portal id="test-portal" className="portal-class">
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );
    
    // Check if createElement was called with 'div'
    expect(mockCreateElement).toHaveBeenCalledWith('div');
    
    // Check if the ID and class name were set
    expect(mockElement.id).toBe('test-portal');
    expect(mockElement.className).toBe('portal-class');
    
    // Check if the content is rendered
    expect(screen.getByTestId('portal-content')).toBeInTheDocument();
    expect(screen.getByText('Portal Content')).toBeInTheDocument();
    
    // Restore document.createElement
    mockCreateElement.mockRestore();
  });

  it('uses a custom container when provided', () => {
    // Create a custom container
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-container';
    document.body.appendChild(customContainer);
    
    // Mock document.createElement
    const mockElement = document.createElement('div');
    const mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue(mockElement);
    
    render(
      <Portal container={customContainer}>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );
    
    // Check if the content is rendered
    expect(screen.getByTestId('portal-content')).toBeInTheDocument();
    expect(screen.getByText('Portal Content')).toBeInTheDocument();
    
    // Restore document.createElement
    mockCreateElement.mockRestore();
    
    // Clean up
    document.body.removeChild(customContainer);
  });
});