import { useEffect, useRef, useCallback } from 'react';

/**
 * Options for timeout hook
 */
export interface UseTimeoutOptions {
  /**
   * Callback to execute after delay
   */
  callback: () => void;

  /**
   * Delay in milliseconds (null to pause/disable)
   */
  delay: number | null;
}

/**
 * Return type for timeout hook
 */
export interface UseTimeoutReturn {
  /**
   * Reset the timeout (restart from beginning)
   */
  reset: () => void;

  /**
   * Clear the timeout (stop without executing)
   */
  clear: () => void;
}

/**
 * Declarative timeout hook with cleanup
 *
 * @example
 * ```tsx
 * // Auto-hide notification
 * function Notification({ message, onClose }: Props) {
 *   useTimeout({
 *     callback: onClose,
 *     delay: 5000,
 *   });
 *
 *   return <div>{message}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional timeout
 * const [showHint, setShowHint] = useState(false);
 *
 * useTimeout({
 *   callback: () => setShowHint(true),
 *   delay: isNewUser ? 3000 : null, // null disables
 * });
 * ```
 *
 * @example
 * ```tsx
 * // With controls
 * const { reset, clear } = useTimeout({
 *   callback: () => setIdle(true),
 *   delay: 30000,
 * });
 *
 * // Reset on user activity
 * useEffect(() => {
 *   window.addEventListener('mousemove', reset);
 *   return () => window.removeEventListener('mousemove', reset);
 * }, [reset]);
 * ```
 */
export function useTimeout(options: UseTimeoutOptions): UseTimeoutReturn {
  const { callback, delay } = options;

  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => {
        callbackRef.current();
      }, delay);
    }
  }, [delay, clear]);

  // Set up timeout
  useEffect(() => {
    if (delay === null) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return clear;
  }, [delay, clear]);

  return { reset, clear };
}

export default useTimeout;
