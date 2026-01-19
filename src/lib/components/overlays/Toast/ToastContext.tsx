/**
 * Toast context for programmatic toast management
 */

import { createContext, useContext } from 'react';
import type { ToastProps, ToastPosition } from './Toast';

/**
 * Toast data for creating new toasts
 */
export interface ToastData extends Omit<ToastProps, 'id' | 'animationState' | 'onDismiss'> {
  /**
   * Optional ID (auto-generated if not provided)
   */
  id?: string;
}

/**
 * Toast instance with full props and internal state
 */
export interface ToastInstance extends ToastProps {
  /**
   * Timestamp when toast was created
   */
  createdAt: number;

  /**
   * Timestamp when toast was paused (if paused)
   */
  pausedAt?: number;

  /**
   * Remaining duration when paused
   */
  remainingDuration?: number;
}

/**
 * Promise toast options
 */
export interface PromiseToastOptions<T> {
  /**
   * Message or data to show while loading
   */
  loading: string | Partial<ToastData>;

  /**
   * Message or data to show on success
   * Can be a function that receives the result
   */
  success: string | Partial<ToastData> | ((data: T) => string | Partial<ToastData>);

  /**
   * Message or data to show on error
   * Can be a function that receives the error
   */
  error: string | Partial<ToastData> | ((error: Error) => string | Partial<ToastData>);
}

/**
 * Toast context value
 */
export interface ToastContextValue {
  /**
   * Current toast instances
   */
  toasts: ToastInstance[];

  /**
   * Add a new toast
   * @returns Toast ID
   */
  addToast: (data: ToastData) => string;

  /**
   * Remove a toast by ID
   */
  removeToast: (id: string) => void;

  /**
   * Update a toast
   */
  updateToast: (id: string, data: Partial<ToastData>) => void;

  /**
   * Remove all toasts
   */
  removeAllToasts: () => void;

  /**
   * Pause a toast's timer
   */
  pauseToast: (id: string) => void;

  /**
   * Resume a toast's timer
   */
  resumeToast: (id: string) => void;

  /**
   * Show a success toast
   */
  success: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show an error toast
   */
  error: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show a warning toast
   */
  warning: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show an info toast
   */
  info: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Show a loading toast
   */
  loading: (message: string, options?: Partial<ToastData>) => string;

  /**
   * Promise-based toast that shows loading, then success/error
   * @returns Original promise result
   */
  promise: <T>(
    promise: Promise<T>,
    options: PromiseToastOptions<T>
  ) => Promise<T>;

  /**
   * Container position
   */
  position: ToastPosition;

  /**
   * Maximum visible toasts
   */
  maxVisible: number;
}

/**
 * Toast context
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook to access toast context (returns null if not in provider)
 */
export function useToastContext(): ToastContextValue | null {
  return useContext(ToastContext);
}

/**
 * Hook to access toast context (throws if not in provider)
 * @throws Error if used outside of ToastProvider
 */
export function useToastContextStrict(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContextStrict must be used within a ToastProvider');
  }
  return context;
}
