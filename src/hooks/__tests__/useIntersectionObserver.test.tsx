import { renderHook } from '@testing-library/react-hooks';
import useIntersectionObserver from '../useIntersectionObserver';

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;
  options: IntersectionObserverInit;

  constructor(
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ) {
    this.callback = callback;
    this.elements = new Set();
    this.options = options;
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Helper to simulate an intersection
  simulateIntersection(isIntersecting: boolean) {
    const entries: IntersectionObserverEntry[] = Array.from(this.elements).map(
      (element) => ({
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: isIntersecting
          ? element.getBoundingClientRect()
          : new DOMRectReadOnly(0, 0, 0, 0),
        isIntersecting,
        rootBounds: null,
        target: element,
        time: Date.now(),
      } as IntersectionObserverEntry)
    );

    this.callback(entries, this);
  }
}

// Replace the global IntersectionObserver with our mock
global.IntersectionObserver = MockIntersectionObserver as any;

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with isVisible as false', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const [, isVisible] = result.current;

    expect(isVisible).toBe(false);
  });

  it('should update isVisible when intersection changes', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const [ref] = result.current;

    // Create a mock element
    const mockElement = document.createElement('div');
    Object.defineProperty(ref, 'current', {
      writable: true,
      value: mockElement,
    });

    // Fast-forward timers to trigger the observer creation
    jest.runAllTimers();

    // Get the observer instance
    const observer = (global.IntersectionObserver as any).mock.instances[0];
    
    // Simulate intersection
    observer.simulateIntersection(true);
    expect(result.current[1]).toBe(true);

    // Simulate leaving the viewport
    observer.simulateIntersection(false);
    expect(result.current[1]).toBe(false);
  });

  it('should respect the delay option', () => {
    const delay = 500;
    const { result } = renderHook(() => useIntersectionObserver({ delay }));
    const [ref] = result.current;

    // Create a mock element
    const mockElement = document.createElement('div');
    Object.defineProperty(ref, 'current', {
      writable: true,
      value: mockElement,
    });

    // Observer should not be created yet
    expect(global.IntersectionObserver).not.toHaveBeenCalled();

    // Fast-forward timers to just before the delay
    jest.advanceTimersByTime(delay - 1);
    expect(global.IntersectionObserver).not.toHaveBeenCalled();

    // Fast-forward to the delay time
    jest.advanceTimersByTime(1);
    expect(global.IntersectionObserver).toHaveBeenCalled();
  });

  it('should freeze observation once visible when freezeOnceVisible is true', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ freezeOnceVisible: true })
    );
    const [ref] = result.current;

    // Create a mock element
    const mockElement = document.createElement('div');
    Object.defineProperty(ref, 'current', {
      writable: true,
      value: mockElement,
    });

    // Fast-forward timers
    jest.runAllTimers();

    // Get the observer instance
    const observer = (global.IntersectionObserver as any).mock.instances[0];
    
    // Simulate intersection
    observer.simulateIntersection(true);
    expect(result.current[1]).toBe(true);

    // Simulate leaving the viewport - should still be visible due to freezing
    observer.simulateIntersection(false);
    expect(result.current[1]).toBe(true);
  });

  it('should disconnect observer when triggerOnce is true and element becomes visible', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true })
    );
    const [ref] = result.current;

    // Create a mock element
    const mockElement = document.createElement('div');
    Object.defineProperty(ref, 'current', {
      writable: true,
      value: mockElement,
    });

    // Fast-forward timers
    jest.runAllTimers();

    // Get the observer instance
    const observer = (global.IntersectionObserver as any).mock.instances[0];
    const disconnectSpy = jest.spyOn(observer, 'disconnect');
    
    // Simulate intersection
    observer.simulateIntersection(true);
    expect(result.current[1]).toBe(true);
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should cleanup observer on unmount', () => {
    const { result, unmount } = renderHook(() => useIntersectionObserver());
    const [ref] = result.current;

    // Create a mock element
    const mockElement = document.createElement('div');
    Object.defineProperty(ref, 'current', {
      writable: true,
      value: mockElement,
    });

    // Fast-forward timers
    jest.runAllTimers();

    // Get the observer instance
    const observer = (global.IntersectionObserver as any).mock.instances[0];
    const disconnectSpy = jest.spyOn(observer, 'disconnect');
    
    // Unmount the hook
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});