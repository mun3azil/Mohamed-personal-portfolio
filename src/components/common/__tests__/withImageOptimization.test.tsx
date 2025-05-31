import React from 'react';
import { render, screen } from '@testing-library/react';
import withImageOptimization, { WithImageOptimizationProps } from '../withImageOptimization';
import Image from 'next/image';

// Mock the constants
jest.mock('@/constants', () => ({
  CONSTANTS: {
    IMAGE_QUALITY: {
      DEFAULT: 80,
      HIGH: 90,
      LOW: 60
    }
  }
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onLoad, ...props }: any) {
    // Call onLoad immediately to simulate image loading
    if (onLoad) {
      setTimeout(() => onLoad(), 0);
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="next-image" {...props} />;
  };
});

// Test component that receives the HOC props
interface TestComponentProps extends WithImageOptimizationProps {
  testProp?: string;
}

const TestComponent: React.FC<TestComponentProps> = ({ 
  optimizeImageUrl, 
  OptimizedImage,
  testProp 
}) => {
  const originalUrl = 'https://example.com/image.jpg';
  const optimizedUrl = optimizeImageUrl(originalUrl, { quality: 75, format: 'webp' });
  
  return (
    <div>
      <div data-testid="test-prop">{testProp}</div>
      <div data-testid="optimized-url">{optimizedUrl}</div>
      <OptimizedImage 
        src="https://example.com/another-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        optimizationOptions={{ quality: 85, format: 'avif' }}
        data-testid="optimized-image-component"
      />
    </div>
  );
};

// Apply the HOC to the test component
const EnhancedComponent = withImageOptimization(TestComponent);

describe('withImageOptimization HOC', () => {
  it('passes through original props to the wrapped component', () => {
    render(<EnhancedComponent testProp="test value" />);
    expect(screen.getByTestId('test-prop').textContent).toBe('test value');
  });

  it('provides optimizeImageUrl function that adds quality and format parameters', () => {
    render(<EnhancedComponent />);
    const optimizedUrl = screen.getByTestId('optimized-url').textContent;
    
    expect(optimizedUrl).toContain('https://example.com/image.jpg');
    expect(optimizedUrl).toContain('q=75');
    expect(optimizedUrl).toContain('fm=webp');
  });

  it('provides OptimizedImage component that uses next/image', () => {
    render(<EnhancedComponent />);
    
    const nextImage = screen.getByTestId('next-image');
    expect(nextImage).toBeInTheDocument();
    
    // Check that the src has been optimized
    const src = nextImage.getAttribute('src');
    expect(src).toContain('q=85');
    expect(src).toContain('fm=avif');
  });

  it('handles invalid URLs gracefully', () => {
    const InvalidUrlComponent: React.FC<WithImageOptimizationProps> = ({ optimizeImageUrl }) => {
      const invalidUrl = 'not-a-url';
      const result = optimizeImageUrl(invalidUrl);
      return <div data-testid="invalid-url-result">{result}</div>;
    };
    
    const EnhancedInvalidComponent = withImageOptimization(InvalidUrlComponent);
    render(<EnhancedInvalidComponent />);
    
    // Should return the original URL when optimization fails
    expect(screen.getByTestId('invalid-url-result').textContent).toBe('not-a-url');
  });

  it('skips optimization for data URLs', () => {
    const DataUrlComponent: React.FC<WithImageOptimizationProps> = ({ optimizeImageUrl }) => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const result = optimizeImageUrl(dataUrl);
      return <div data-testid="data-url-result">{result}</div>;
    };
    
    const EnhancedDataUrlComponent = withImageOptimization(DataUrlComponent);
    render(<EnhancedDataUrlComponent />);
    
    // Should return the original data URL without modification
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    expect(screen.getByTestId('data-url-result').textContent).toBe(dataUrl);
  });

  it('skips optimization for relative paths', () => {
    const RelativePathComponent: React.FC<WithImageOptimizationProps> = ({ optimizeImageUrl }) => {
      const relativePath = '/images/local-image.jpg';
      const result = optimizeImageUrl(relativePath);
      return <div data-testid="relative-path-result">{result}</div>;
    };
    
    const EnhancedRelativePathComponent = withImageOptimization(RelativePathComponent);
    render(<EnhancedRelativePathComponent />);
    
    // Should return the original relative path without modification
    expect(screen.getByTestId('relative-path-result').textContent).toBe('/images/local-image.jpg');
  });

  it('uses default quality when not specified', () => {
    const DefaultQualityComponent: React.FC<WithImageOptimizationProps> = ({ optimizeImageUrl }) => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImageUrl(url);
      return <div data-testid="default-quality-result">{result}</div>;
    };
    
    const EnhancedDefaultQualityComponent = withImageOptimization(DefaultQualityComponent);
    render(<EnhancedDefaultQualityComponent />);
    
    // Should use the default quality from constants (80)
    expect(screen.getByTestId('default-quality-result').textContent).toContain('q=80');
  });
});