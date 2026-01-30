import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Serializer/deserializer for URL state values
 */
export interface UrlStateSerializer<T> {
  /**
   * Serialize value to URL string
   */
  serialize: (value: T) => string;

  /**
   * Deserialize URL string to value
   */
  deserialize: (value: string | null, defaultValue: T) => T;
}

/**
 * Options for URL state hook
 */
export interface UseUrlStateOptions<T> {
  /**
   * Default value when parameter is not present in URL
   */
  defaultValue: T;

  /**
   * Custom serializer/deserializer for the value
   * @default Inferred from defaultValue type
   */
  serializer?: UrlStateSerializer<T>;

  /**
   * Whether to replace history entry instead of push
   * @default false
   */
  replace?: boolean;

  /**
   * Debounce delay for URL updates (ms)
   * @default 0
   */
  debounce?: number;
}

/**
 * Return type for URL state hook
 */
export type UseUrlStateReturn<T> = [
  /** Current value */
  T,
  /** Setter function (like useState) */
  (value: T | ((prev: T) => T)) => void,
  /** Clear the parameter from URL */
  () => void,
];

/**
 * Built-in serializers for common types
 */
export const urlStateSerializers = {
  string: {
    serialize: (v: string) => v,
    deserialize: (v: string | null, defaultValue: string) => v ?? defaultValue,
  } as UrlStateSerializer<string>,

  number: {
    serialize: (v: number) => String(v),
    deserialize: (v: string | null, defaultValue: number) => {
      if (v === null) {
        return defaultValue;
      }
      const parsed = Number(v);
      return Number.isNaN(parsed) ? defaultValue : parsed;
    },
  } as UrlStateSerializer<number>,

  boolean: {
    serialize: (v: boolean) => (v ? 'true' : 'false'),
    deserialize: (v: string | null, defaultValue: boolean) => {
      if (v === null) {
        return defaultValue;
      }
      return v === 'true';
    },
  } as UrlStateSerializer<boolean>,

  json: <T>(): UrlStateSerializer<T> => ({
    serialize: (v: T) => JSON.stringify(v),
    deserialize: (v: string | null, defaultValue: T) => {
      if (v === null) {
        return defaultValue;
      }
      try {
        return JSON.parse(v) as T;
      } catch {
        return defaultValue;
      }
    },
  }),

  array: <T extends string>(): UrlStateSerializer<T[]> => ({
    serialize: (v: T[]) => v.join(','),
    deserialize: (v: string | null, defaultValue: T[]) => {
      if (v === null || v === '') {
        return defaultValue;
      }
      return v.split(',') as T[];
    },
  }),

  numberArray: (): UrlStateSerializer<number[]> => ({
    serialize: (v: number[]) => v.join(','),
    deserialize: (v: string | null, defaultValue: number[]) => {
      if (v === null || v === '') {
        return defaultValue;
      }
      return v
        .split(',')
        .map(Number)
        .filter((n) => !Number.isNaN(n));
    },
  }),
};

/**
 * Infer serializer from default value type
 */
function inferSerializer<T>(defaultValue: T): UrlStateSerializer<T> {
  if (typeof defaultValue === 'string') {
    return urlStateSerializers.string as unknown as UrlStateSerializer<T>;
  }
  if (typeof defaultValue === 'number') {
    return urlStateSerializers.number as unknown as UrlStateSerializer<T>;
  }
  if (typeof defaultValue === 'boolean') {
    return urlStateSerializers.boolean as unknown as UrlStateSerializer<T>;
  }
  if (Array.isArray(defaultValue)) {
    if (defaultValue.length === 0 || typeof defaultValue[0] === 'string') {
      return urlStateSerializers.array() as unknown as UrlStateSerializer<T>;
    }
    if (typeof defaultValue[0] === 'number') {
      return urlStateSerializers.numberArray() as unknown as UrlStateSerializer<T>;
    }
  }
  return urlStateSerializers.json<T>();
}

/**
 * Hook that synchronizes React state with URL search parameters
 *
 * @example
 * ```tsx
 * // Basic string parameter
 * const [search, setSearch] = useUrlState('q', { defaultValue: '' });
 *
 * // Number parameter with debounce
 * const [page, setPage] = useUrlState('page', {
 *   defaultValue: 1,
 *   serializer: urlStateSerializers.number,
 *   debounce: 300,
 * });
 *
 * // Array parameter
 * const [tags, setTags] = useUrlState('tags', {
 *   defaultValue: [],
 *   serializer: urlStateSerializers.array(),
 * });
 * ```
 */
export function useUrlState<T>(
  paramName: string,
  options: UseUrlStateOptions<T>
): UseUrlStateReturn<T> {
  const { defaultValue, serializer, replace = false, debounce = 0 } = options;

  const resolvedSerializer = serializer ?? inferSerializer(defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const defaultValueRef = useRef(defaultValue);

  // Keep defaultValue ref up to date
  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  // Get value from URL
  const getUrlValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    const params = new URLSearchParams(window.location.search);
    const urlValue = params.get(paramName);
    return resolvedSerializer.deserialize(urlValue, defaultValue);
  }, [paramName, defaultValue, resolvedSerializer]);

  const [value, setValueInternal] = useState<T>(getUrlValue);

  // Update URL
  const updateUrl = useCallback(
    (newValue: T) => {
      if (typeof window === 'undefined') {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const serialized = resolvedSerializer.serialize(newValue);
      const defaultSerialized = resolvedSerializer.serialize(defaultValueRef.current);

      if (serialized === defaultSerialized) {
        params.delete(paramName);
      } else {
        params.set(paramName, serialized);
      }

      const search = params.toString();
      const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;

      if (replace) {
        window.history.replaceState(null, '', newUrl);
      } else {
        window.history.pushState(null, '', newUrl);
      }
    },
    [paramName, resolvedSerializer, replace]
  );

  // Setter function
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValueInternal((prev) => {
        const resolved =
          typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;

        if (debounce > 0) {
          clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => updateUrl(resolved), debounce);
        } else {
          updateUrl(resolved);
        }

        return resolved;
      });
    },
    [debounce, updateUrl]
  );

  // Clear parameter
  const clear = useCallback(() => {
    setValue(defaultValueRef.current);
  }, [setValue]);

  // Listen for popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setValueInternal(getUrlValue());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getUrlValue]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, []);

  return [value, setValue, clear];
}

export default useUrlState;
