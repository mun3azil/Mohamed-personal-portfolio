import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorage from '../useLocalStorage';

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (fn: any) => fn,
}));

describe('useLocalStorage', () => {
  // Mock localStorage
  let mockStorage: Record<string, string> = {};
  
  beforeEach(() => {
    // Clear mock storage before each test
    mockStorage = {};
    
    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockStorage[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
          delete mockStorage[key];
        }),
      },
      writable: true,
    });
    
    // Mock StorageEvent
    window.dispatchEvent = jest.fn();
  });

  it('should use the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    expect(result.current[0]).toBe('initial value');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should use the value from localStorage if it exists', () => {
    mockStorage['test-key'] = JSON.stringify('stored value');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    expect(result.current[0]).toBe('stored value');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(result.current[0]).toBe('new value');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new value'));
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('should accept a function to update the value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    act(() => {
      result.current[1]((prev) => prev + ' updated');
    });
    
    expect(result.current[0]).toBe('initial value updated');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('initial value updated'));
  });

  it('should remove the value from localStorage when removeValue is called', () => {
    mockStorage['test-key'] = JSON.stringify('stored value');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    act(() => {
      result.current[2]();
    });
    
    expect(result.current[0]).toBe('initial value');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('test-key');
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('should accept a function as initialValue', () => {
    const initialValueFn = jest.fn(() => 'function initial value');
    
    const { result } = renderHook(() => useLocalStorage('test-key', initialValueFn));
    
    expect(result.current[0]).toBe('function initial value');
    expect(initialValueFn).toHaveBeenCalled();
  });

  it('should handle objects correctly', () => {
    const initialObject = { name: 'John', age: 30 };
    
    const { result } = renderHook(() => useLocalStorage('test-object', initialObject));
    
    expect(result.current[0]).toEqual(initialObject);
    
    const updatedObject = { name: 'Jane', age: 25 };
    
    act(() => {
      result.current[1](updatedObject);
    });
    
    expect(result.current[0]).toEqual(updatedObject);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test-object', JSON.stringify(updatedObject));
  });

  it('should handle arrays correctly', () => {
    const initialArray = [1, 2, 3];
    
    const { result } = renderHook(() => useLocalStorage('test-array', initialArray));
    
    expect(result.current[0]).toEqual(initialArray);
    
    act(() => {
      result.current[1]((prev) => [...prev, 4]);
    });
    
    expect(result.current[0]).toEqual([1, 2, 3, 4]);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test-array', JSON.stringify([1, 2, 3, 4]));
  });

  it('should use custom serialization and deserialization functions', () => {
    const serialize = jest.fn((value) => `serialized:${JSON.stringify(value)}`);
    const deserialize = jest.fn((value) => {
      const [, jsonValue] = value.split(':');
      return JSON.parse(jsonValue);
    });
    
    mockStorage['test-custom'] = 'serialized:"stored value"';
    
    const { result } = renderHook(() =>
      useLocalStorage('test-custom', 'initial value', { serialize, deserialize })
    );
    
    expect(result.current[0]).toBe('stored value');
    expect(deserialize).toHaveBeenCalledWith('serialized:"stored value"');
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(serialize).toHaveBeenCalledWith('new value');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test-custom', 'serialized:"new value"');
  });

  it('should handle storage events from other tabs when syncTabs is true', () => {
    const { result } = renderHook(() => useLocalStorage('test-sync', 'initial value'));
    
    // Simulate storage event from another tab
    const storageEvent = new StorageEvent('storage', {
      key: 'test-sync',
      newValue: JSON.stringify('value from another tab'),
    });
    
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('value from another tab');
  });

  it('should not sync tabs when syncTabs is false', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-no-sync', 'initial value', { syncTabs: false })
    );
    
    act(() => {
      result.current[1]('new value');
    });
    
    // Should not dispatch storage event
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });

  it('should handle errors when localStorage is not available', () => {
    // Mock console.warn to prevent warnings in test output
    const originalWarn = console.warn;
    console.warn = jest.fn();
    
    // Make localStorage.getItem throw an error
    (window.localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error('localStorage not available');
    });
    
    const { result } = renderHook(() => useLocalStorage('test-error', 'fallback value'));
    
    // Should use the initial value when localStorage throws an error
    expect(result.current[0]).toBe('fallback value');
    expect(console.warn).toHaveBeenCalled();
    
    // Make localStorage.setItem throw an error
    (window.localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error('localStorage not available');
    });
    
    act(() => {
      result.current[1]('new value');
    });
    
    // Value should not change when localStorage throws an error
    expect(result.current[0]).toBe('fallback value');
    expect(console.warn).toHaveBeenCalledTimes(2);
    
    // Restore console.warn
    console.warn = originalWarn;
  });
});