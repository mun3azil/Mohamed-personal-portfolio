import { renderHook, act } from '@testing-library/react';
import { useReducedMotionPreference } from '../useReducedMotionPreference';
import { useReducedMotion } from 'framer-motion';

// Mock framer-motion's useReducedMotion hook
jest.mock('framer-motion', () => ({
  useReducedMotion: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useReducedMotionPreference', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Default mock implementation for system preference
    (useReducedMotion as jest.Mock).mockReturnValue(false);
  });

  it('should use system preference when no user preference is set', () => {
    const { result } = renderHook(() => useReducedMotionPreference());
    
    expect(result.current.prefersReducedMotion).toBe(false);
    expect(result.current.isSystemPreference).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('reducedMotion');
  });

  it('should use system preference when system prefers reduced motion', () => {
    (useReducedMotion as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useReducedMotionPreference());
    
    expect(result.current.prefersReducedMotion).toBe(true);
    expect(result.current.isSystemPreference).toBe(true);
  });

  it('should use user preference when set (true)', () => {
    // Mock localStorage to return user preference
    localStorageMock.getItem.mockReturnValueOnce('true');
    
    const { result } = renderHook(() => useReducedMotionPreference());
    
    expect(result.current.prefersReducedMotion).toBe(true);
    expect(result.current.isSystemPreference).toBe(false);
  });

  it('should use user preference when set (false)', () => {
    // Mock localStorage to return user preference
    localStorageMock.getItem.mockReturnValueOnce('false');
    // Mock system preference to be true
    (useReducedMotion as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useReducedMotionPreference());
    
    // User preference should override system preference
    expect(result.current.prefersReducedMotion).toBe(false);
    expect(result.current.isSystemPreference).toBe(false);
  });

  it('should update user preference when setReducedMotion is called', () => {
    const { result } = renderHook(() => useReducedMotionPreference());
    
    act(() => {
      result.current.setReducedMotion(true);
    });
    
    expect(result.current.prefersReducedMotion).toBe(true);
    expect(result.current.isSystemPreference).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('reducedMotion', 'true');
  });

  it('should toggle user preference when toggleReducedMotion is called', () => {
    const { result } = renderHook(() => useReducedMotionPreference());
    
    // Initial state (system preference: false)
    expect(result.current.prefersReducedMotion).toBe(false);
    
    // Toggle to true
    act(() => {
      result.current.toggleReducedMotion();
    });
    
    expect(result.current.prefersReducedMotion).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('reducedMotion', 'true');
    
    // Toggle back to false
    act(() => {
      result.current.toggleReducedMotion();
    });
    
    expect(result.current.prefersReducedMotion).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('reducedMotion', 'false');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('localStorage not available');
    });
    
    const { result } = renderHook(() => useReducedMotionPreference());
    
    // Should fall back to system preference
    expect(result.current.prefersReducedMotion).toBe(false);
    expect(result.current.isSystemPreference).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Mock localStorage.setItem to throw an error
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('localStorage not available');
    });
    
    act(() => {
      result.current.setReducedMotion(true);
    });
    
    // Should still update the state even if localStorage fails
    expect(result.current.prefersReducedMotion).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    
    consoleErrorSpy.mockRestore();
  });
});