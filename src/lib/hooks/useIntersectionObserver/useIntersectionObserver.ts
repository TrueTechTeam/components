import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Options for intersection observer hook
 */
export interface UseIntersectionObserverOptions {
  /**
   * Element that is used as the viewport for checking visibility
   * @default null (browser viewport)
   */
  root?: Element | null;

  /**
   * Margin around the root element
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Threshold(s) at which to trigger callback (0-1)
   * @default 0
   */
  threshold?: number | number[];

  /**
   * Callback when intersection changes
   */
  onChange?: (entry: IntersectionObserverEntry) => void;

  /**
   * Whether to disconnect after first intersection
   * Useful for lazy loading
   * @default false
   */
  triggerOnce?: boolean;

  /**
   * Whether the observer is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Initial value for isIntersecting before observation starts
   * @default false
   */
  initialIsIntersecting?: boolean;
}

/**
 * Return type for intersection observer hook
 */
export interface UseIntersectionObserverReturn {
  /**
   * Ref callback to attach to observed element
   */
  ref: (node: Element | null) => void;

  /**
   * Whether element is currently intersecting
   */
  isIntersecting: boolean;

  /**
   * The full IntersectionObserverEntry (null before first observation)
   */
  entry: IntersectionObserverEntry | null;

  /**
   * The observed element
   */
  element: Element | null;
}

/**
 * Hook that observes element intersection using IntersectionObserver
 *
 * @example
 * ```tsx
 * // Basic visibility detection
 * const { ref, isIntersecting } = useIntersectionObserver();
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? 'Visible!' : 'Not visible'}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Lazy loading with triggerOnce
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   triggerOnce: true,
 *   rootMargin: '100px',
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? <img src={src} /> : <Skeleton />}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Multiple thresholds for scroll animations
 * const { ref, entry } = useIntersectionObserver({
 *   threshold: [0, 0.25, 0.5, 0.75, 1],
 * });
 *
 * const opacity = entry?.intersectionRatio ?? 0;
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    onChange,
    triggerOnce = false,
    disabled = false,
    initialIsIntersecting = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [element, setElement] = useState<Element | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const onChangeRef = useRef(onChange);
  const hasTriggeredRef = useRef(false);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Ref callback
  const ref = useCallback((node: Element | null) => {
    setElement(node);
  }, []);

  // Set up IntersectionObserver
  useEffect(() => {
    // SSR check
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    if (!element || disabled) {
      return;
    }

    // Skip if triggerOnce already fired
    if (triggerOnce && hasTriggeredRef.current) {
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const observerEntry = entries[0];
      if (!observerEntry) {
        return;
      }

      setEntry(observerEntry);
      setIsIntersecting(observerEntry.isIntersecting);
      onChangeRef.current?.(observerEntry);

      // Handle triggerOnce
      if (triggerOnce && observerEntry.isIntersecting) {
        hasTriggeredRef.current = true;
        observerRef.current?.disconnect();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    });

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [element, root, rootMargin, threshold, triggerOnce, disabled]);

  return {
    ref,
    isIntersecting,
    entry,
    element,
  };
}

export default useIntersectionObserver;
