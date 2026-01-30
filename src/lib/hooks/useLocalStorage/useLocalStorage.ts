import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Serializer for localStorage values
 */
export interface LocalStorageSerializer<T> {
  /**
   * Serialize value to string
   */
  serialize: (value: T) => string;

  /**
   * Deserialize string to value
   */
  deserialize: (value: string) => T;
}

/**
 * Options for localStorage hook
 */
export interface UseLocalStorageOptions<T> {
  /**
   * Custom serializer/deserializer
   * @default JSON.stringify/parse
   */
  serializer?: LocalStorageSerializer<T>;

  /**
   * Sync value across browser tabs
   * @default true
   */
  syncTabs?: boolean;
}

/**
 * Return type for localStorage hook
 */
export type UseLocalStorageReturn<T> = [
  /** Current value */
  T,
  /** Setter function (like useState) */
  (value: T | ((prev: T) => T)) => void,
  /** Remove from localStorage */
  () => void,
];

/**
 * Default JSON serializer
 */
const defaultSerializer = <T>(): LocalStorageSerializer<T> => ({
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

/**
 * Hook that persists state to localStorage with cross-tab synchronization
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 *
 * // With object
 * const [user, setUser, clearUser] = useLocalStorage<User | null>('user', null);
 *
 * // Disable cross-tab sync
 * const [draft, setDraft] = useLocalStorage('draft', '', { syncTabs: false });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const { serializer = defaultSerializer<T>(), syncTabs = true } = options;

  const defaultValueRef = useRef(defaultValue);

  // Keep defaultValue ref up to date
  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  // Get initial value from localStorage
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? serializer.deserialize(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, serializer]);

  const [value, setValueInternal] = useState<T>(getStoredValue);

  // Update localStorage
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValueInternal((prev) => {
        const resolved =
          typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;

        if (typeof window === 'undefined') {
          return resolved;
        }

        try {
          window.localStorage.setItem(key, serializer.serialize(resolved));
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }

        return resolved;
      });
    },
    [key, serializer]
  );

  // Remove from localStorage
  const remove = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setValueInternal(defaultValueRef.current);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  // Sync across tabs
  useEffect(() => {
    if (typeof window === 'undefined' || !syncTabs) {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      if (event.newValue === null) {
        setValueInternal(defaultValueRef.current);
      } else {
        try {
          setValueInternal(serializer.deserialize(event.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, serializer, syncTabs]);

  return [value, setValue, remove];
}

export default useLocalStorage;
