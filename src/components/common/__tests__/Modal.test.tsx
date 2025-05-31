import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import Modal from '../Modal';

// Mock the Portal component
jest.mock('../Portal', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="portal">{children}</div>,
  };
});

// Mock the framer-motion module
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: any) => (
      <div onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div data-testid="test-content">Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('portal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-title')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
  });

  it('does not render close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} showCloseButton={false}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-close-button'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the modal content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-overlay'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div data-testid="test-content">Modal Content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('test-content'));
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when clicking outside if closeOnOutsideClick is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOutsideClick={false}>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-overlay'));
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        footer={
          <button data-testid="footer-button">Footer Button</button>
        }
      >
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    expect(screen.getByTestId('footer-button')).toBeInTheDocument();
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        className="custom-overlay-class"
        contentClassName="custom-content-class"
      >
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-overlay')).toHaveClass('custom-overlay-class');
    expect(screen.getByTestId('modal-content')).toHaveClass('custom-content-class');
  });

  it('applies correct size class based on size prop', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="sm">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-sm');
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="md">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-md');
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="lg">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-lg');
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="xl">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-xl');
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="full">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-full');
  });

  it('renders without portal when disablePortal is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} disablePortal={true}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.queryByTestId('portal')).not.toBeInTheDocument();
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Simulate Escape key press
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape key is pressed if closeOnEsc is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnEsc={false}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Simulate Escape key press
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});