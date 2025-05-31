/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import LazyLoad from '../LazyLoad';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

// Mock the useIntersectionObserver hook
jest.mock('@/hooks/useIntersectionObserver');

const mockUseIntersectionObserver = useIntersectionObserver as jest.MockedFunction<typeof useIntersectionObserver>;

describe('LazyLoad Component', () => {
  const mockRef = { current: null };
  
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
    
    // Default mock implementation - not visible
    mockUseIntersectionObserver.mockReturnValue([mockRef as unknown as React.MutableRefObject<HTMLElement | null>, false, null]);
  });

  it('renders placeholder when not visible', () => {
    render(
      <LazyLoad placeholder={<div data-testid="placeholder">Loading...</div>}>
        <div data-testid="content">Actual Content</div>
      </LazyLoad>
    );

    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('renders children when visible', () => {
    // Mock the hook to return isVisible as true
    mockUseIntersectionObserver.mockReturnValue([mockRef as unknown as React.MutableRefObject<HTMLElement | null>, true, null]);

    render(
      <LazyLoad placeholder={<div data-testid="placeholder">Loading...</div>}>
        <div data-testid="content">Actual Content</div>
      </LazyLoad>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('placeholder')).not.toBeInTheDocument();
  });

  it('renders children immediately when skip is true', () => {
    // Even with isVisible as false, skip should override
    mockUseIntersectionObserver.mockReturnValue([mockRef as unknown as React.MutableRefObject<HTMLElement | null>, false, null]);

    render(
      <LazyLoad 
        skip={true}
        placeholder={<div data-testid="placeholder">Loading...</div>}
      >
        <div data-testid="content">Actual Content</div>
      </LazyLoad>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('placeholder')).not.toBeInTheDocument();
  });

  it('passes correct options to useIntersectionObserver', () => {
    const options = {
      rootMargin: '10px',
      threshold: 0.5,
      freezeOnceVisible: false,
      triggerOnce: false,
      delay: 200
    };

    render(
      <LazyLoad 
        {...options}
        placeholder={<div>Loading...</div>}
      >
        <div>Actual Content</div>
      </LazyLoad>
    );

    expect(mockUseIntersectionObserver).toHaveBeenCalledWith(expect.objectContaining(options));
  });

  it('applies className and style to wrapper div', () => {
    const className = 'test-class';
    const style = { backgroundColor: 'red' };

    const { container } = render(
      <LazyLoad 
        className={className}
        style={style}
        placeholder={<div>Loading...</div>}
      >
        <div>Actual Content</div>
      </LazyLoad>
    );

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv).toHaveClass(className);
    expect(wrapperDiv.style.backgroundColor).toBe('red');
  });

  it('renders without placeholder when none is provided', () => {
    mockUseIntersectionObserver.mockReturnValue([mockRef as unknown as React.MutableRefObject<HTMLElement | null>, false, null]);

    const { container } = render(
      <LazyLoad>
        <div data-testid="content">Actual Content</div>
      </LazyLoad>
    );

    // The wrapper div should be empty
    expect(container.firstChild).toBeEmptyDOMElement();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });
});