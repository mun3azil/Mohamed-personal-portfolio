import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { jest, expect } from '@jest/globals';

// Import your locale messages
import enMessages from '../locales/en/common.json';
import arMessages from '../locales/ar/common.json';

// Define the wrapper props interface
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: 'en' | 'ar';
  theme?: 'light' | 'dark' | 'system';
}

/**
 * Custom render function that wraps components with necessary providers
 *
 * @param ui Component to render
 * @param options Render options including locale and theme
 * @returns Rendered component with testing-library utilities
 */
function customRender(
  ui: ReactElement,
  {
    locale = 'en',
    theme = 'light',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Select the appropriate messages based on locale
  const messages = locale === 'en' ? enMessages : arMessages;

  // Create a wrapper with all providers
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

/**
 * Helper function to wait for a specified time
 *
 * @param ms Time to wait in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock the window.matchMedia function for tests
 */
export function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: unknown): MediaQueryList => ({
      matches,
      media: query as string,
      onchange: null,
      addListener: jest.fn() as any,
      removeListener: jest.fn() as any,
      addEventListener: jest.fn() as any,
      removeEventListener: jest.fn() as any,
      dispatchEvent: jest.fn() as any,
    })),
  });
}

/**
 * Mock the IntersectionObserver for tests
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
  return mockIntersectionObserver;
}

/**
 * Mock the ResizeObserver for tests
 */
export function mockResizeObserver() {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  window.ResizeObserver = mockResizeObserver as unknown as typeof ResizeObserver;
  return mockResizeObserver;
}

/**
 * Mock the window.localStorage for tests
 */
export function mockLocalStorage() {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  return localStorageMock;
}