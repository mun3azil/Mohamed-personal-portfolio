import { useEffect, RefObject } from 'react';


/**
 * Hook that alerts when you click outside of the passed ref
 * 
 * @param ref - React ref object to detect clicks outside of
 * @param callback - Function to call when a click outside is detected
 * @param enabled - Whether the hook is enabled (default: true)
 * @param exceptionalRefs - Array of refs to exclude from outside click detection
 */
function useClickOutsideBase<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  enabled: boolean = true,
  exceptionalRefs: RefObject<HTMLElement>[] = []
): void {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent): void {
      // Check if the click was outside the ref element
      const isOutside = ref.current && !ref.current.contains(event.target as Node);
      
      // Check if the click was inside any of the exceptional refs
      const isInsideExceptional = exceptionalRefs.some(
        (exceptionalRef) => exceptionalRef.current && exceptionalRef.current.contains(event.target as Node)
      );
      
      if (isOutside && !isInsideExceptional) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, enabled, exceptionalRefs]);
}

export default useClickOutsideBase;