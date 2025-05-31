import { renderHook, act } from '@testing-library/react-hooks';
import useMediaQuery, { breakpoints } from '../useMediaQuery';

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (fn: any) => fn,
}));

describe('useMediaQuery', () => {
  // Mock matchMedia
  let mockMatchMedia: jest.Mock;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;
  let mockAddListener: jest.Mock;
  let mockRemoveListener: jest.Mock;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create mock functions
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();
    mockAddListener = jest.fn();
    mockRemoveListener = jest.fn();
    
    // Mock matchMedia
    mockMatchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
    });
    
    // Apply the mock to window
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  it('should return false initially', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(result.current).toBe(false);
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('should add event listener on mount', () => {
    renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should update matches when media query changes', () => {
    // Mock matchMedia to return true
    mockMatchMedia.mockImplementationOnce((query) => {
      return {
        matches: true,
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
    });
    
    const { result, rerender } = renderHook((query) => useMediaQuery(query), {
      initialProps: '(min-width: 768px)',
    });
    
    // Initial render should match the mock (true)
    expect(result.current).toBe(true);
    
    // Change the query
    rerender('(min-width: 1024px)');
    
    // Should call matchMedia with new query
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('should handle change events', () => {
    // Initial mock returns false
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(result.current).toBe(false);
    
    // Capture the change handler
    const changeHandler = mockAddEventListener.mock.calls[0][1];
    
    // Mock matchMedia to return true for the next call
    mockMatchMedia.mockImplementationOnce((query) => {
      return {
        matches: true,
        media: query,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
    });
    
    // Simulate a change event
    act(() => {
      changeHandler();
    });
    
    // Value should now be true
    expect(result.current).toBe(true);
  });

  it('should use addListener for older browsers', () => {
    // Mock matchMedia without addEventListener
    mockMatchMedia.mockImplementationOnce((query) => {
      return {
        matches: false,
        media: query,
        // No addEventListener
        removeEventListener: mockRemoveEventListener,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
    });
    
    renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    // Should use addListener instead
    expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should use removeListener for older browsers on unmount', () => {
    // Mock matchMedia without removeEventListener
    mockMatchMedia.mockImplementationOnce((query) => {
      return {
        matches: false,
        media: query,
        addEventListener: mockAddEventListener,
        // No removeEventListener
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
      };
    });
    
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    unmount();
    
    // Should use removeListener instead
    expect(mockRemoveListener).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should export common breakpoints', () => {
    expect(breakpoints).toBeDefined();
    expect(breakpoints.sm).toBe('(min-width: 640px)');
    expect(breakpoints.md).toBe('(min-width: 768px)');
    expect(breakpoints.lg).toBe('(min-width: 1024px)');
    expect(breakpoints.xl).toBe('(min-width: 1280px)');
    expect(breakpoints['2xl']).toBe('(min-width: 1536px)');
    expect(breakpoints.dark).toBe('(prefers-color-scheme: dark)');
    expect(breakpoints.portrait).toBe('(orientation: portrait)');
    expect(breakpoints.landscape).toBe('(orientation: landscape)');
  });
});