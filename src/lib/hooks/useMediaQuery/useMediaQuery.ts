import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Options for media query hook
 */
export interface UseMediaQueryOptions {
  /**
   * Default value for SSR or when media query can't be evaluated
   * @default false
   */
  defaultValue?: boolean;

  /**
   * Callback when media query match changes
   */
  onChange?: (matches: boolean) => void;
}

/**
 * Return type for media query hook
 */
export interface UseMediaQueryReturn {
  /**
   * Whether the media query currently matches
   */
  matches: boolean;
}

/**
 * Hook that reacts to CSS media query changes
 *
 * @example
 * ```tsx
 * // Responsive breakpoints
 * const { matches: isMobile } = useMediaQuery('(max-width: 768px)');
 * const { matches: isTablet } = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 * const { matches: isDesktop } = useMediaQuery('(min-width: 1025px)');
 *
 * // User preferences
 * const { matches: prefersDark } = useMediaQuery('(prefers-color-scheme: dark)');
 * const { matches: prefersReducedMotion } = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * // With callback
 * const { matches } = useMediaQuery('(max-width: 768px)', {
 *   onChange: (isMobile) => console.log('Mobile:', isMobile),
 * });
 * ```
 */
export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
): UseMediaQueryReturn {
  const { defaultValue = false, onChange } = options;

  const onChangeRef = useRef(onChange);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Get initial match state
  const getMatches = useCallback((): boolean => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      return window.matchMedia(query).matches;
    } catch {
      return defaultValue;
    }
  }, [query, defaultValue]);

  const [matches, setMatches] = useState<boolean>(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let mediaQueryList: MediaQueryList;

    try {
      mediaQueryList = window.matchMedia(query);
    } catch {
      return;
    }

    // Set initial value
    const initialMatch = mediaQueryList.matches;
    setMatches(initialMatch);

    // Handler for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
      onChangeRef.current?.(event.matches);
    };

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    }

    // Legacy browsers (Safari < 14)
    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [query]);

  return { matches };
}

export default useMediaQuery;
