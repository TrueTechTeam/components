/**
 * Toast provider for programmatic toast management
 */

import React, { useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { Toast, type ToastPosition, type ToastAnimationState } from './Toast';
import { ToastContainer } from './ToastContainer';
import {
  ToastContext,
  type ToastData,
  type ToastInstance,
  type ToastContextValue,
  type PromiseToastOptions,
} from './ToastContext';

/**
 * Generate unique toast ID
 */
let toastIdCounter = 0;
const generateToastId = () => `toast-${Date.now()}-${++toastIdCounter}`;

/**
 * Toast provider props
 */
export interface ToastProviderProps {
  /**
   * Children to render
   */
  children: ReactNode;

  /**
   * Position for toasts
   * @default 'top-right'
   */
  position?: ToastPosition;

  /**
   * Maximum number of visible toasts
   * @default 5
   */
  maxVisible?: number;

  /**
   * Gap between toasts in pixels
   * @default 12
   */
  gap?: number;

  /**
   * Offset from viewport edge
   * @default 16
   */
  offset?: number;

  /**
   * Default duration for toasts in milliseconds
   * @default 5000
   */
  defaultDuration?: number;

  /**
   * Animation duration in milliseconds
   * @default 200
   */
  animationDuration?: number;

  /**
   * Default props to apply to all toasts
   */
  defaultToastProps?: Partial<ToastData>;

  /**
   * Custom z-index for toast container
   */
  zIndex?: number;
}

/**
 * Internal toast state with animation
 */
interface InternalToast extends ToastInstance {
  animationState: ToastAnimationState;
}

/**
 * Toast provider component
 * Manages a stack of toasts for programmatic creation
 *
 * @example
 * ```tsx
 * <ToastProvider position="top-right" maxVisible={5}>
 *   <App />
 * </ToastProvider>
 *
 * // In a component:
 * const toast = useToast();
 *
 * toast.success('Changes saved successfully');
 * toast.error('Failed to save changes');
 * ```
 */
export function ToastProvider({
  children,
  position = 'top-right',
  maxVisible = 5,
  gap = 12,
  offset = 16,
  defaultDuration = 5000,
  animationDuration = 200,
  defaultToastProps,
  zIndex,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<InternalToast[]>([]);
  const exitingToastsRef = useRef<Set<string>>(new Set());

  // Remove a toast by ID
  const removeToast = useCallback(
    (id: string) => {
      if (exitingToastsRef.current.has(id)) {
        return;
      }

      exitingToastsRef.current.add(id);

      // Start exit animation
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, animationState: 'exiting' as ToastAnimationState } : t
        )
      );

      // Remove after animation completes
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        exitingToastsRef.current.delete(id);
      }, animationDuration);
    },
    [animationDuration]
  );

  // Add a new toast
  const addToast = useCallback(
    (data: ToastData): string => {
      const id = data.id ?? generateToastId();
      const toast: InternalToast = {
        ...defaultToastProps,
        ...data,
        id,
        duration: data.duration ?? defaultDuration,
        position,
        animationDuration,
        createdAt: Date.now(),
        animationState: 'entering',
        onDismiss: () => removeToast(id),
      };

      setToasts((prev) => {
        // Add new toast at the beginning (newest first)
        const newToasts = [toast, ...prev];

        // Remove oldest toasts if exceeding max
        if (newToasts.length > maxVisible) {
          const toRemove = newToasts.slice(maxVisible);
          toRemove.forEach((t) => {
            if (!exitingToastsRef.current.has(t.id)) {
              exitingToastsRef.current.add(t.id);
              // Schedule removal after animation
              setTimeout(() => {
                setToasts((current) => current.filter((ct) => ct.id !== t.id));
                exitingToastsRef.current.delete(t.id);
              }, animationDuration);
            }
          });
          // Mark excess toasts as exiting
          return newToasts.map((t, i) =>
            i >= maxVisible ? { ...t, animationState: 'exiting' as ToastAnimationState } : t
          );
        }

        return newToasts;
      });

      // Transition to entered state after animation
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id && t.animationState === 'entering' ? { ...t, animationState: 'entered' } : t
          )
        );
      }, animationDuration);

      return id;
    },
    [defaultToastProps, defaultDuration, position, animationDuration, removeToast, maxVisible]
  );

  // Update a toast
  const updateToast = useCallback((id: string, data: Partial<ToastData>) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              // Reset duration if updating variant from loading
              ...(t.variant === 'loading' &&
                data.variant !== 'loading' && {
                  createdAt: Date.now(),
                }),
            }
          : t
      )
    );
  }, []);

  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts((prev) =>
      prev.map((t) => ({ ...t, animationState: 'exiting' as ToastAnimationState }))
    );

    setTimeout(() => {
      setToasts([]);
      exitingToastsRef.current.clear();
    }, animationDuration);
  }, [animationDuration]);

  // Pause a toast's timer
  const pauseToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id && !t.pausedAt ? { ...t, pausedAt: Date.now() } : t))
    );
  }, []);

  // Resume a toast's timer
  const resumeToast = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((t) => {
          if (t.id === id && t.pausedAt) {
            const pausedDuration = Date.now() - t.pausedAt;
            return {
              ...t,
              pausedAt: undefined,
              remainingDuration:
                (t.remainingDuration ?? t.duration ?? defaultDuration) - pausedDuration,
            };
          }
          return t;
        })
      );
    },
    [defaultDuration]
  );

  // Helper to normalize toast data
  const normalizeToastData = (input: string | Partial<ToastData>): Partial<ToastData> => {
    return typeof input === 'string' ? { message: input } : input;
  };

  // Shorthand methods
  const success = useCallback(
    (message: string, options?: Partial<ToastData>): string => {
      return addToast({ message, variant: 'success', ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<ToastData>): string => {
      return addToast({ message, variant: 'error', ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<ToastData>): string => {
      return addToast({ message, variant: 'warning', ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<ToastData>): string => {
      return addToast({ message, variant: 'info', ...options });
    },
    [addToast]
  );

  const loading = useCallback(
    (message: string, options?: Partial<ToastData>): string => {
      return addToast({ message, variant: 'loading', duration: 0, ...options });
    },
    [addToast]
  );

  // Promise-based toast
  const promiseToast = useCallback(
    async <T,>(promise: Promise<T>, options: PromiseToastOptions<T>): Promise<T> => {
      const loadingData = normalizeToastData(options.loading);
      const toastId = addToast({
        ...loadingData,
        variant: 'loading',
        duration: 0,
      });

      try {
        const result = await promise;

        // Resolve success config
        const successInput =
          typeof options.success === 'function' ? options.success(result) : options.success;
        const successData = normalizeToastData(successInput);

        // Update toast to success
        updateToast(toastId, {
          ...successData,
          variant: 'success',
          duration: successData.duration ?? defaultDuration,
        });

        return result;
      } catch (err) {
        // Resolve error config
        const errorInput =
          typeof options.error === 'function' ? options.error(err as Error) : options.error;
        const errorData = normalizeToastData(errorInput);

        // Update toast to error
        updateToast(toastId, {
          ...errorData,
          variant: 'error',
          duration: errorData.duration ?? defaultDuration,
        });

        throw err;
      }
    },
    [addToast, updateToast, defaultDuration]
  );

  // Memoize context value
  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts: toasts.map(({ animationState, ...rest }) => rest),
      addToast,
      removeToast,
      updateToast,
      removeAllToasts,
      pauseToast,
      resumeToast,
      success,
      error,
      warning,
      info,
      loading,
      promise: promiseToast,
      position,
      maxVisible,
    }),
    [
      toasts,
      addToast,
      removeToast,
      updateToast,
      removeAllToasts,
      pauseToast,
      resumeToast,
      success,
      error,
      warning,
      info,
      loading,
      promiseToast,
      position,
      maxVisible,
    ]
  );

  // Get visible toasts (up to maxVisible, accounting for exiting toasts)
  const exitingCount = toasts.filter((t) => t.animationState === 'exiting').length;
  const visibleToasts = toasts.slice(0, maxVisible + exitingCount);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} gap={gap} offset={offset} zIndex={zIndex}>
        {visibleToasts.map((toast) => (
          <Toast key={toast.id} {...toast} position={position} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
