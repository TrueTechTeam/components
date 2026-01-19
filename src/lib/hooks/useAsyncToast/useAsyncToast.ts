/**
 * Hook for API endpoint toasts with loading -> success/error flow
 */

import { useCallback } from 'react';
import { useToast, type UseToastReturn } from '../useToast';
import type { ToastData } from '../../components/overlays/Toast';

/**
 * Async toast configuration
 */
export interface AsyncToastConfig<TData, TError = Error> {
  /**
   * Message or data to show while loading
   */
  loading: string | Partial<ToastData>;

  /**
   * Message or data to show on success
   * Can be a function that receives the result
   */
  success: string | Partial<ToastData> | ((data: TData) => string | Partial<ToastData>);

  /**
   * Message or data to show on error
   * Can be a function that receives the error
   */
  error: string | Partial<ToastData> | ((error: TError) => string | Partial<ToastData>);

  /**
   * Duration for success toast (default: 5000)
   */
  successDuration?: number;

  /**
   * Duration for error toast (default: 5000)
   */
  errorDuration?: number;
}

/**
 * Hook return type
 */
export interface UseAsyncToastReturn {
  /**
   * Wrap an async function with toast notifications
   * Returns a function that when called, shows loading toast,
   * then success/error based on result
   */
  wrap: <TArgs extends unknown[], TData, TError = Error>(
    fn: (...args: TArgs) => Promise<TData>,
    config: AsyncToastConfig<TData, TError>
  ) => (...args: TArgs) => Promise<TData>;

  /**
   * Execute a promise with toast notifications
   */
  execute: <TData, TError = Error>(
    promise: Promise<TData>,
    config: AsyncToastConfig<TData, TError>
  ) => Promise<TData>;

  /**
   * Access to underlying toast methods
   */
  toast: UseToastReturn;
}

/**
 * Helper to normalize toast data
 */
const normalizeToastData = (input: string | Partial<ToastData>): Partial<ToastData> => {
  return typeof input === 'string' ? { message: input } : input;
};

/**
 * Hook for API endpoint toasts with loading -> success/error flow
 *
 * @example
 * ```tsx
 * function UserForm() {
 *   const { wrap, execute } = useAsyncToast();
 *
 *   // Method 1: Wrap an existing function
 *   const saveUser = wrap(
 *     async (data: UserData) => api.saveUser(data),
 *     {
 *       loading: 'Saving user...',
 *       success: (user) => `User ${user.name} saved successfully`,
 *       error: (err) => `Failed to save: ${err.message}`,
 *     }
 *   );
 *
 *   // Method 2: Execute a one-off promise
 *   const handleFetch = async () => {
 *     try {
 *       const data = await execute(
 *         fetch('/api/data').then(r => r.json()),
 *         {
 *           loading: { message: 'Fetching data...', title: 'Loading' },
 *           success: 'Data loaded!',
 *           error: 'Failed to load data',
 *         }
 *       );
 *       // Use data...
 *     } catch (err) {
 *       // Handle error if needed
 *     }
 *   };
 *
 *   const handleSubmit = async (formData: UserData) => {
 *     const user = await saveUser(formData);
 *     // user is typed as the return value of api.saveUser
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useAsyncToast(): UseAsyncToastReturn {
  const toastMethods = useToast();

  const execute = useCallback(
    async <TData, TError = Error>(
      promise: Promise<TData>,
      config: AsyncToastConfig<TData, TError>
    ): Promise<TData> => {
      const loadingData = normalizeToastData(config.loading);
      const toastId = toastMethods.loading(loadingData.message as string || 'Loading...', {
        ...loadingData,
        duration: 0, // Loading toasts persist until updated
      });

      try {
        const result = await promise;

        // Resolve success config
        const successInput =
          typeof config.success === 'function'
            ? config.success(result)
            : config.success;
        const successData = normalizeToastData(successInput);

        // Update toast to success
        toastMethods.update(toastId, {
          ...successData,
          variant: 'success',
          duration: config.successDuration ?? successData.duration ?? 5000,
        });

        return result;
      } catch (error) {
        // Resolve error config
        const errorInput =
          typeof config.error === 'function'
            ? config.error(error as TError)
            : config.error;
        const errorData = normalizeToastData(errorInput);

        // Update toast to error
        toastMethods.update(toastId, {
          ...errorData,
          variant: 'error',
          duration: config.errorDuration ?? errorData.duration ?? 5000,
        });

        throw error;
      }
    },
    [toastMethods]
  );

  const wrap = useCallback(
    <TArgs extends unknown[], TData, TError = Error>(
      fn: (...args: TArgs) => Promise<TData>,
      config: AsyncToastConfig<TData, TError>
    ) => {
      return (...args: TArgs): Promise<TData> => {
        return execute(fn(...args), config);
      };
    },
    [execute]
  );

  return {
    wrap,
    execute,
    toast: toastMethods,
  };
}
