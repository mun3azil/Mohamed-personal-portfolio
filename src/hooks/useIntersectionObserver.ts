import { useState, useEffect, useRef, useCallback, RefObject } from 'react';


interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * Hook that tracks when an element enters or exits the viewport using the Intersection Observer API
 * 
 * @param options Configuration options for the Intersection Observer
 * @param options.root The element that is used as the viewport for checking visibility
 * @param options.rootMargin Margin around the root element
 * @param options.threshold Percentage of the target's visibility the observer's callback should be executed
 * @param options.freezeOnceVisible Once the element is visible, stop observing
 * @param options.triggerOnce Only trigger the callback once
 * @param options.delay Delay in ms before starting to observe
 * @returns [ref, isVisible, entry] - ref to attach to the target element, visibility state, and the full IntersectionObserverEntry
 */
function useIntersectionObserverBase<T extends Element>(
  options: IntersectionObserverOptions = {}
): [RefObject<T | null>, boolean, IntersectionObserverEntry | null] {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    freezeOnceVisible = false,
    triggerOnce = false,
    delay = 0
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);
  const frozen = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const updateEntry = useCallback(([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
    setIsVisible(entry.isIntersecting);

    if (entry.isIntersecting && triggerOnce) {
      cleanup();
    }

    if (freezeOnceVisible && entry.isIntersecting) {
      frozen.current = true;
    }
  }, [triggerOnce, freezeOnceVisible]);

  const cleanup = (): void => {
    if (observer.current && elementRef.current) {
      observer.current.unobserve(elementRef.current);
      observer.current.disconnect();
      observer.current = null;
    }
  };

  useEffect(() => {
    // If we already have a frozen state, don't re-observe
    if (frozen.current) return;

    // Cleanup any existing observer
    cleanup();

    const delayedObserver = setTimeout(() => {
      if (!elementRef.current) return;

      observer.current = new IntersectionObserver(
        updateEntry,
        { root, rootMargin, threshold }
      );

      observer.current.observe(elementRef.current);
    }, delay);

    return () => {
      clearTimeout(delayedObserver);
      cleanup();
    };
  }, [root, rootMargin, threshold, delay, updateEntry]);

  return [elementRef, isVisible, entry];
}

export default useIntersectionObserverBase;