/**
 * Hook for programmatic toast management
 */

import { useCallback } from 'react';
import {
  useToastContextStrict,
  type ToastContextValue,
  type ToastData,
} from '../../components/overlays/Toast';

/**
 * Hook options
 */
export interface UseToastOptions {
  /**
   * Default props to apply to all toasts
   */
  defaultProps?: Partial<ToastData>;
}

/**
 * Hook return type
 */
export interface UseToastReturn {
  /**
   * Add a toast with full configuration
   * @returns Toast ID
   */
  toast: (data: ToastData) => string;

  /**
   * Show a success toast
   * @returns Toast ID
   */
  success: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show an error toast
   * @returns Toast ID
   */
  error: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show a warning toast
   * @returns Toast ID
   */
  warning: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show an info toast
   * @returns Toast ID
   */
  info: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show a loading toast
   * @returns Toast ID
   */
  loading: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Update an existing toast
   */
  update: (id: string, data: Partial<ToastData>) => void;

  /**
   * Dismiss a specific toast
   */
  dismiss: (id: string) => void;

  /**
   * Dismiss all toasts
   */
  dismissAll: () => void;

  /**
   * Promise-based toast that shows loading, then success/error
   */
  promise: ToastContextValue['promise'];
}

/**
 * Hook for programmatically creating toasts
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleSave = () => {
 *     toast.success('Changes saved successfully');
 *   };
 *
 *   const handleError = () => {
 *     toast.error('Failed to save changes', {
 *       action: { label: 'Retry', onClick: handleSave }
 *     });
 *   };
 *
 *   const handleAsyncOperation = async () => {
 *     await toast.promise(
 *       fetchData(),
 *       {
 *         loading: 'Fetching data...',
 *         success: (data) => `Loaded ${data.length} items`,
 *         error: (err) => `Error: ${err.message}`,
 *       }
 *     );
 *   };
 *
 *   return (
 *     <Button onClick={handleSave}>Save</Button>
 *   );
 * }
 * ```
 */
export function useToast(options: UseToastOptions = {}): UseToastReturn {
  const context = useToastContextStrict();
  const { defaultProps } = options;

  const toast = useCallback(
    (data: ToastData) => {
      return context.addToast({ ...defaultProps, ...data });
    },
    [context, defaultProps]
  );

  const success = useCallback(
    (message: string, opts?: Partial<ToastData>) => {
      return context.success(message, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const error = useCallback(
    (message: string, opts?: Partial<ToastData>) => {
      return context.error(message, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const warning = useCallback(
    (message: string, opts?: Partial<ToastData>) => {
      return context.warning(message, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const info = useCallback(
    (message: string, opts?: Partial<ToastData>) => {
      return context.info(message, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const loading = useCallback(
    (message: string, opts?: Partial<ToastData>) => {
      return context.loading(message, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    update: context.updateToast,
    dismiss: context.removeToast,
    dismissAll: context.removeAllToasts,
    promise: context.promise,
  };
}
