import React from 'react';
import { render, screen } from '@/lib/test-utils';
import Responsive, { Mobile, Tablet, Desktop, TabletAndAbove, TabletAndBelow } from '../Responsive';
import useMediaQuery from '@/hooks/useMediaQuery';

// Mock the useMediaQuery hook
jest.mock('@/hooks/useMediaQuery');

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

describe('Responsive Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    (useMediaQuery as jest.Mock).mockReturnValue(false);
  });

  it('renders children when media query matches', () => {
    // Mock useMediaQuery to return true
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    
    render(
      <Responsive query="(min-width: 768px)">
        <div data-testid="content">Content</div>
      </Responsive>
    );
    
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('renders fallback when media query does not match', () => {
    // Mock useMediaQuery to return false
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    
    render(
      <Responsive query="(min-width: 768px)" fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="content">Content</div>
      </Responsive>
    );
    
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('uses the correct media query for above prop', () => {
    render(
      <Responsive above="md">
        <div>Content</div>
      </Responsive>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('uses the correct media query for below prop', () => {
    render(
      <Responsive below="md">
        <div>Content</div>
      </Responsive>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('uses the correct media query for at prop', () => {
    render(
      <Responsive at="md">
        <div>Content</div>
      </Responsive>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('uses the correct media query for above and below props', () => {
    render(
      <Responsive above="sm" below="lg">
        <div>Content</div>
      </Responsive>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 640px) and (max-width: 1024px)');
  });

  it('always renders children when no media query is specified', () => {
    render(
      <Responsive>
        <div data-testid="content">Content</div>
      </Responsive>
    );
    
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(useMediaQuery).not.toHaveBeenCalled();
  });

  it('renders Mobile component correctly', () => {
    render(
      <Mobile>
        <div data-testid="mobile-content">Mobile Content</div>
      </Mobile>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('renders Tablet component correctly', () => {
    render(
      <Tablet>
        <div data-testid="tablet-content">Tablet Content</div>
      </Tablet>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('renders Desktop component correctly', () => {
    render(
      <Desktop>
        <div data-testid="desktop-content">Desktop Content</div>
      </Desktop>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('renders TabletAndAbove component correctly', () => {
    render(
      <TabletAndAbove>
        <div data-testid="tablet-and-above-content">Tablet and Above Content</div>
      </TabletAndAbove>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('renders TabletAndBelow component correctly', () => {
    render(
      <TabletAndBelow>
        <div data-testid="tablet-and-below-content">Tablet and Below Content</div>
      </TabletAndBelow>
    );
    
    expect(useMediaQuery).toHaveBeenCalledWith('(max-width: 1024px)');
  });

  it('respects the ssr prop during server-side rendering', () => {
    // Mock window to be undefined to simulate SSR
    const originalWindow = global.window;
    // @ts-expect-error - Intentionally deleting window for SSR simulation
    delete global.window;
    
    const { rerender } = render(
      <Responsive query="(min-width: 768px)" ssr={false}>
        <div data-testid="content">Content</div>
      </Responsive>
    );
    
    // Should not render content when ssr is false
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    
    // Rerender with ssr=true
    rerender(
      <Responsive query="(min-width: 768px)" ssr={true}>
        <div data-testid="content">Content</div>
      </Responsive>
    );
    
    // Should render content when ssr is true
    expect(screen.getByTestId('content')).toBeInTheDocument();
    
    // Restore window
    global.window = originalWindow;
  });
});