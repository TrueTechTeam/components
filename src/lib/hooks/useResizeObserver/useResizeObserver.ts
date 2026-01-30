import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Options for the resize observer hook
 */
export interface UseResizeObserverOptions {
  /**
   * Callback when size changes
   */
  onResize?: (entry: ResizeObserverEntry) => void;

  /**
   * Debounce delay for resize callback (ms)
   * @default 0
   */
  debounce?: number;

  /**
   * Which box model to observe
   * @default 'border-box'
   */
  box?: ResizeObserverBoxOptions;

  /**
   * Whether to disable the observer
   * @default false
   */
  disabled?: boolean;
}

/**
 * Return value from useResizeObserver
 */
export interface UseResizeObserverReturn {
  /**
   * Ref callback to attach to the observed element
   */
  ref: (node: HTMLElement | null) => void;

  /**
   * Current width of the element
   */
  width: number;

  /**
   * Current height of the element
   */
  height: number;

  /**
   * The observed element
   */
  element: HTMLElement | null;
}

/**
 * Hook that observes element resize using ResizeObserver
 *
 * @example
 * ```tsx
 * const { ref, width, height } = useResizeObserver();
 *
 * return (
 *   <div ref={ref}>
 *     Width: {width}, Height: {height}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const { ref, width } = useResizeObserver({
 *   onResize: (entry) => console.log('Resized:', entry),
 *   debounce: 100,
 * });
 * ```
 */
export function useResizeObserver(options: UseResizeObserverOptions = {}): UseResizeObserverReturn {
  const { onResize, debounce = 0, box = 'border-box', disabled = false } = options;

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [element, setElement] = useState<HTMLElement | null>(null);

  const observerRef = useRef<ResizeObserver | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const onResizeRef = useRef(onResize);

  // Keep onResize ref up to date
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  // Ref callback
  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  // Set up ResizeObserver
  useEffect(() => {
    if (typeof window === 'undefined' || !element || disabled) {
      return;
    }

    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const updateSize = () => {
        let newWidth: number;
        let newHeight: number;

        // ResizeObserverSize uses inlineSize/blockSize, not width/height
        const boxSize = box === 'border-box' ? entry.borderBoxSize?.[0] : entry.contentBoxSize?.[0];

        if (boxSize) {
          // Use inlineSize/blockSize from ResizeObserverSize
          newWidth = boxSize.inlineSize;
          newHeight = boxSize.blockSize;
        } else {
          // Fallback to contentRect (DOMRectReadOnly has width/height)
          newWidth = entry.contentRect.width;
          newHeight = entry.contentRect.height;
        }

        setSize((prev) => {
          if (prev.width === newWidth && prev.height === newHeight) {
            return prev;
          }
          return { width: newWidth, height: newHeight };
        });

        onResizeRef.current?.(entry);
      };

      if (debounce > 0) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(updateSize, debounce);
      } else {
        updateSize();
      }
    };

    observerRef.current = new ResizeObserver(handleResize);
    observerRef.current.observe(element, { box });

    return () => {
      clearTimeout(debounceTimeoutRef.current);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [element, box, debounce, disabled]);

  return {
    ref,
    width: size.width,
    height: size.height,
    element,
  };
}

export default useResizeObserver;
