import React from 'react';
import { render, screen } from '@/lib/test-utils';
import Skeleton from '../Skeleton';

// Mock the framer-motion module
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

describe('Skeleton Component', () => {
  it('renders with default props', () => {
    render(<Skeleton />);
    
    const skeleton = screen.getByTestId('skeleton-rectangle');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle({
      width: '100%',
      height: '1rem',
      borderRadius: '0.25rem',
      backgroundColor: 'var(--skeleton-bg, #e2e8f0)',
      display: 'block',
    });
  });

  it('renders with custom dimensions', () => {
    render(<Skeleton width={200} height={50} />);
    
    const skeleton = screen.getByTestId('skeleton-rectangle');
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '50px',
    });
  });

  it('renders with string dimensions', () => {
    render(<Skeleton width="50%" height="2em" />);
    
    const skeleton = screen.getByTestId('skeleton-rectangle');
    expect(skeleton).toHaveStyle({
      width: '50%',
      height: '2em',
    });
  });

  it('renders with custom border radius', () => {
    render(<Skeleton borderRadius={10} />);
    
    const skeleton = screen.getByTestId('skeleton-rectangle');
    expect(skeleton).toHaveStyle({
      borderRadius: '10px',
    });
  });

  it('renders with string border radius', () => {
    render(<Skeleton borderRadius="0.5em" />);
    
    const skeleton = screen.getByTestId('skeleton-rectangle');
    expect(skeleton).toHaveStyle({
      borderRadius: '0.5em',
    });
  });

  it('renders with custom class name', () => {
    render(<Skeleton className="custom-skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton-rectangle');
    expect(skeleton).toHaveClass('custom-skeleton');
  });

  it('renders circle variant', () => {
    render(<Skeleton variant="circle" width={50} height={50} />);
    
    const skeleton = screen.getByTestId('skeleton-circle');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle({
      borderRadius: '50%',
      aspectRatio: '1 / 1',
    });
  });

  it('renders text variant with single line', () => {
    render(<Skeleton variant="text" />);
    
    const skeleton = screen.getByTestId('skeleton-text');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders text variant with multiple lines', () => {
    render(<Skeleton variant="text" lines={3} />);
    
    const skeletonContainer = screen.getByTestId('skeleton-text-multi');
    expect(skeletonContainer).toBeInTheDocument();
    
    const skeletonLines = screen.getAllByTestId(/skeleton-line-\d+/);
    expect(skeletonLines).toHaveLength(3);
    
    // Last line should be 80% width
    const lastLine = screen.getByTestId('skeleton-line-2');
    expect(lastLine).toHaveStyle({
      width: '80%',
    });
  });

  it('renders text variant with custom gap', () => {
    render(<Skeleton variant="text" lines={2} gap={10} />);
    
    const skeletonContainer = screen.getByTestId('skeleton-text-multi');
    expect(skeletonContainer).toHaveStyle({
      gap: '10px',
    });
  });

  it('renders text variant with string gap', () => {
    render(<Skeleton variant="text" lines={2} gap="1em" />);
    
    const skeletonContainer = screen.getByTestId('skeleton-text-multi');
    expect(skeletonContainer).toHaveStyle({
      gap: '1em',
    });
  });

  it('renders without animation when animate is false', () => {
    render(<Skeleton animate={false} />);
    
    const skeleton = screen.getByTestId('skeleton-rectangle');
    // We can't directly test the absence of animation props since they're handled by framer-motion
    // But we can verify the component renders correctly
    expect(skeleton).toBeInTheDocument();
  });
});