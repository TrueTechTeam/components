import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Options for clipboard hook
 */
export interface UseClipboardOptions {
  /**
   * Duration to show success state (ms)
   * @default 2000
   */
  successDuration?: number;

  /**
   * Callback on successful copy
   */
  onSuccess?: (text: string) => void;

  /**
   * Callback on copy error
   */
  onError?: (error: Error) => void;
}

/**
 * Return type for clipboard hook
 */
export interface UseClipboardReturn {
  /**
   * Copy text to clipboard
   */
  copy: (text: string) => Promise<boolean>;

  /**
   * Whether copy was recently successful
   */
  copied: boolean;

  /**
   * Error if copy failed
   */
  error: Error | null;

  /**
   * Reset copied state
   */
  reset: () => void;
}

/**
 * Hook for copying text to clipboard with feedback
 *
 * @example
 * ```tsx
 * function CopyButton({ text }: { text: string }) {
 *   const { copy, copied } = useClipboard();
 *
 *   return (
 *     <Button onClick={() => copy(text)}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </Button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const { copy, copied, error } = useClipboard({
 *   successDuration: 3000,
 *   onSuccess: () => toast.success('Copied!'),
 *   onError: (err) => toast.error(err.message),
 * });
 * ```
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { successDuration = 2000, onSuccess, onError } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Keep refs up to date
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Clear any existing timeout
      clearTimeout(timeoutRef.current);
      setError(null);

      try {
        // Modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (!successful) {
            throw new Error('Copy command failed');
          }
        }

        setCopied(true);
        onSuccessRef.current?.(text);

        // Auto-reset after duration
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, successDuration);

        return true;
      } catch (err) {
        const copyError = err instanceof Error ? err : new Error('Failed to copy to clipboard');
        setError(copyError);
        onErrorRef.current?.(copyError);
        return false;
      }
    },
    [successDuration]
  );

  const reset = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setCopied(false);
    setError(null);
  }, []);

  return {
    copy,
    copied,
    error,
    reset,
  };
}

export default useClipboard;
