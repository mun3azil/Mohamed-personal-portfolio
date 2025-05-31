// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
  // Increase the timeout for async utilities
  asyncUtilTimeout: 5000,
});

// Add custom jest matchers
expect.extend({
  toHaveBeenCalledBefore: (firstMock, secondMock) => {
    if (!firstMock.mock || !secondMock.mock) {
      return {
        pass: false,
        message: () => 'Both arguments must be mocks',
      };
    }
    
    const firstCall = firstMock.mock.invocationCallOrder[0];
    const secondCall = secondMock.mock.invocationCallOrder[0];
    
    return {
      pass: firstCall < secondCall,
      message: () => `Expected ${firstMock.getMockName()} to have been called before ${secondMock.getMockName()}`,
    };
  },
});

// Set up console error/warning mocks to make tests fail on warnings
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = function(message) {
  // Don't fail on React internal warnings or testing-library warnings
  if (
    message && 
    typeof message === 'string' && 
    (
      message.includes('Warning: ReactDOM.render') ||
      message.includes('Warning: React.createFactory') ||
      message.includes('Warning: The current testing environment') ||
      message.includes('Warning: An update to') ||
      message.includes('Warning: You seem to have overlapping act() calls')
    )
  ) {
    originalConsoleError.apply(console, arguments);
    return;
  }
  
  originalConsoleError.apply(console, arguments);
  // Uncomment to make tests fail on console.error
  // throw new Error(message);
};

console.warn = function(message) {
  // Don't fail on specific warnings
  if (
    message && 
    typeof message === 'string' && 
    (
      message.includes('Warning: ReactDOM.render') ||
      message.includes('Warning: React.createFactory')
    )
  ) {
    originalConsoleWarn.apply(console, arguments);
    return;
  }
  
  originalConsoleWarn.apply(console, arguments);
  // Uncomment to make tests fail on console.warn
  // throw new Error(message);
};

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock localStorage and sessionStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  key(index) {
    return Object.keys(this.store)[index] || null;
  }

  get length() {
    return Object.keys(this.store).length;
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

Object.defineProperty(window, 'sessionStorage', {
  value: new LocalStorageMock(),
});

// Mock ResizeObserver
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.observables = [];
  }

  observe(element) {
    this.observables.push(element);
  }

  unobserve(element) {
    this.observables = this.observables.filter(el => el !== element);
  }

  disconnect() {
    this.observables = [];
  }

  // Helper method to trigger resize events in tests
  triggerResize(entries) {
    if (!entries) {
      entries = this.observables.map(element => ({
        target: element,
        contentRect: {
          width: 100,
          height: 100,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
      }));
    }
    this.callback(entries, this);
  }
}

global.ResizeObserver = ResizeObserverMock;

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    input: (props) => <input {...props} />,
    textarea: ({ children, ...props }) => <textarea {...props}>{children}</textarea>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: { on: jest.fn() } }),
  useSpring: () => ({}),
  useTransform: () => ({}),
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useInView: () => [null, false],
}));