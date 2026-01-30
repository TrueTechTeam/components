import { useEffect, useRef, useCallback } from 'react';

/**
 * Options for interval hook
 */
export interface UseIntervalOptions {
  /**
   * Callback to execute on each interval
   */
  callback: () => void;

  /**
   * Interval in milliseconds (null to pause/disable)
   */
  delay: number | null;

  /**
   * Whether to run callback immediately on start
   * @default false
   */
  immediate?: boolean;
}

/**
 * Return type for interval hook
 */
export interface UseIntervalReturn {
  /**
   * Reset the interval (restart timing)
   */
  reset: () => void;

  /**
   * Clear the interval (stop)
   */
  clear: () => void;
}

/**
 * Declarative interval hook with cleanup
 *
 * @example
 * ```tsx
 * // Auto-refresh data
 * function Dashboard() {
 *   const [data, setData] = useState(null);
 *
 *   useInterval({
 *     callback: async () => {
 *       const fresh = await fetchData();
 *       setData(fresh);
 *     },
 *     delay: 30000, // Every 30 seconds
 *     immediate: true, // Fetch immediately on mount
 *   });
 *
 *   return <DataDisplay data={data} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Countdown timer
 * function Countdown({ seconds }: { seconds: number }) {
 *   const [remaining, setRemaining] = useState(seconds);
 *
 *   useInterval({
 *     callback: () => setRemaining(r => r - 1),
 *     delay: remaining > 0 ? 1000 : null, // Stop at 0
 *   });
 *
 *   return <span>{remaining}s</span>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Pausable animation
 * const [isPaused, setIsPaused] = useState(false);
 * const [frame, setFrame] = useState(0);
 *
 * const { reset } = useInterval({
 *   callback: () => setFrame(f => f + 1),
 *   delay: isPaused ? null : 16, // ~60fps when not paused
 * });
 * ```
 */
export function useInterval(options: UseIntervalOptions): UseIntervalReturn {
  const { callback, delay, immediate = false } = options;

  const callbackRef = useRef(callback);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const hasRunImmediate = useRef(false);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    hasRunImmediate.current = false;

    if (delay !== null) {
      if (immediate) {
        callbackRef.current();
        hasRunImmediate.current = true;
      }

      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, delay);
    }
  }, [delay, immediate, clear]);

  // Set up interval
  useEffect(() => {
    if (delay === null) {
      return;
    }

    // Run immediately if requested and haven't already
    if (immediate && !hasRunImmediate.current) {
      callbackRef.current();
      hasRunImmediate.current = true;
    }

    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, delay);

    return clear;
  }, [delay, immediate, clear]);

  // Reset hasRunImmediate when delay changes to null
  useEffect(() => {
    if (delay === null) {
      hasRunImmediate.current = false;
    }
  }, [delay]);

  return { reset, clear };
}

export default useInterval;
