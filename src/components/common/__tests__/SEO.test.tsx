import React from 'react';
import { render } from '@testing-library/react';
import SEO from '../SEO';

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <div data-testid="next-head">{children}</div>;
    },
  };
});

describe('SEO Component', () => {
  it('renders basic metadata correctly', () => {
    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
      />
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML('<title>Test Title</title>');
    expect(head).toContainHTML('<meta name="description" content="Test description" />');
  });

  it('renders keywords when provided', () => {
    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
        keywords={['react', 'nextjs', 'portfolio']}
      />
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML('<meta name="keywords" content="react, nextjs, portfolio" />');
  });

  it('renders Open Graph tags correctly', () => {
    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
        ogImage="https://example.com/image.jpg"
        ogType="article"
        canonicalUrl="https://example.com/page"
      />
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML('<meta property="og:title" content="Test Title" />');
    expect(head).toContainHTML('<meta property="og:description" content="Test description" />');
    expect(head).toContainHTML('<meta property="og:type" content="article" />');
    expect(head).toContainHTML('<meta property="og:image" content="https://example.com/image.jpg" />');
    expect(head).toContainHTML('<meta property="og:url" content="https://example.com/page" />');
  });

  it('renders Twitter Card tags correctly', () => {
    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
        ogImage="https://example.com/image.jpg"
        twitterCard="summary"
      />
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML('<meta name="twitter:card" content="summary" />');
    expect(head).toContainHTML('<meta name="twitter:title" content="Test Title" />');
    expect(head).toContainHTML('<meta name="twitter:description" content="Test description" />');
    expect(head).toContainHTML('<meta name="twitter:image" content="https://example.com/image.jpg" />');
  });

  it('renders canonical URL when provided', () => {
    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
        canonicalUrl="https://example.com/page"
      />
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML('<link rel="canonical" href="https://example.com/page" />');
  });

  it('renders noindex directive when specified', () => {
    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
        noIndex={true}
      />
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML('<meta name="robots" content="noindex, nofollow" />');
  });

  it('renders structured data when provided', () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "John Doe",
      "url": "https://example.com"
    };

    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
        structuredData={structuredData}
      />
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML(
      `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`
    );
  });

  it('renders additional children when provided', () => {
    const { getByTestId } = render(
      <SEO 
        title="Test Title" 
        description="Test description"
      >
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </SEO>
    );
    
    const head = getByTestId('next-head');
    expect(head).toContainHTML('<meta name="viewport" content="width=device-width, initial-scale=1" />');
  });
});