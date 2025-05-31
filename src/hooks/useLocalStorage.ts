import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';


type SetValue<T> = Dispatch<SetStateAction<T>>;

interface UseLocalStorageOptions {
  /**
   * Whether to sync state across browser tabs/windows
   */
  syncTabs?: boolean;
  
  /**
   * Serialization function
   */
  serialize?: (value: any) => string;
  
  /**
   * Deserialization function
   */
  deserialize?: (value: string) => any;
}

/**
 * Custom hook for persisting state in localStorage with type safety
 * 
 * @param key The localStorage key
 * @param initialValue The initial value (or function that returns it)
 * @param options Additional options
 * @returns A stateful value and a function to update it
 */
function useLocalStorageBase<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions = {}
): [T, SetValue<T>, () => void] {
  const {
    syncTabs = true,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  // Get from localStorage or use initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : (
        typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue
      );
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }
  }, [key, initialValue, deserialize]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        );
        return;
      }

      try {
        // Allow value to be a function
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Save to localStorage
        window.localStorage.setItem(key, serialize(newValue));

        // Save state
        setStoredValue(newValue);

        // Dispatch a custom event so other tabs can listen for changes
        if (syncTabs) {
          window.dispatchEvent(new StorageEvent('storage', { key, newValue: serialize(newValue) }));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue, syncTabs]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn(
        `Tried removing localStorage key "${key}" even though environment is not a client`
      );
      return;
    }

    try {
      // Remove from localStorage
      window.localStorage.removeItem(key);

      // Reset state to initial value
      setStoredValue(
        typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue
      );

      // Dispatch a custom event so other tabs can listen for changes
      if (syncTabs) {
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: null }));
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, syncTabs]);

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    if (!syncTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) {
        return;
      }

      try {
        // If null, item was removed
        if (e.newValue === null) {
          setStoredValue(
            typeof initialValue === 'function'
              ? (initialValue as () => T)()
              : initialValue
          );
          return;
        }

        // Otherwise, set to new value
        const newValue = e.newValue ? deserialize(e.newValue) : null;
        setStoredValue(newValue as T);
      } catch (error) {
        console.warn(`Error syncing localStorage key "${key}" across tabs:`, error);
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, initialValue, syncTabs]);

  // Reread from localStorage if the key changes
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorageBase;