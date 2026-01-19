/**
 * Alert context for programmatic alert management
 */

import { createContext, useContext } from 'react';
import type { AlertProps } from './Alert';

/**
 * Alert queue item representing a pending alert
 */
export interface AlertQueueItem {
  /**
   * Unique alert ID
   */
  id: string;

  /**
   * Alert props (excluding isOpen which is managed by context)
   */
  props: Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel'>;

  /**
   * Resolve function for promise-based alert
   * Resolves with true if confirmed, false if cancelled
   */
  resolve: (confirmed: boolean) => void;
}

/**
 * Alert context value
 */
export interface AlertContextValue {
  /**
   * Current alert queue
   */
  alerts: AlertQueueItem[];

  /**
   * Show an alert and wait for user response
   * @returns Promise<boolean> - true if confirmed, false if cancelled
   */
  alert: (props: Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel'>) => Promise<boolean>;

  /**
   * Show a confirmation alert
   * @param title - Alert title
   * @param description - Alert description
   * @param options - Additional alert options
   * @returns Promise<boolean> - true if confirmed, false if cancelled
   */
  confirm: (
    title: string,
    description?: string,
    options?: Partial<Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'title' | 'description'>>
  ) => Promise<boolean>;

  /**
   * Show an error alert
   * @param title - Alert title
   * @param description - Alert description
   * @param options - Additional alert options
   * @returns Promise<boolean> - true when dismissed
   */
  error: (
    title: string,
    description?: string,
    options?: Partial<Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'title' | 'description'>>
  ) => Promise<boolean>;

  /**
   * Show a success alert
   * @param title - Alert title
   * @param description - Alert description
   * @param options - Additional alert options
   * @returns Promise<boolean> - true when dismissed
   */
  success: (
    title: string,
    description?: string,
    options?: Partial<Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'title' | 'description'>>
  ) => Promise<boolean>;

  /**
   * Show a warning alert
   * @param title - Alert title
   * @param description - Alert description
   * @param options - Additional alert options
   * @returns Promise<boolean> - true when dismissed
   */
  warning: (
    title: string,
    description?: string,
    options?: Partial<Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'title' | 'description'>>
  ) => Promise<boolean>;

  /**
   * Show an info alert
   * @param title - Alert title
   * @param description - Alert description
   * @param options - Additional alert options
   * @returns Promise<boolean> - true when dismissed
   */
  info: (
    title: string,
    description?: string,
    options?: Partial<Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'title' | 'description'>>
  ) => Promise<boolean>;

  /**
   * Dismiss current alert (resolves with false)
   */
  dismiss: () => void;

  /**
   * Dismiss all alerts
   */
  dismissAll: () => void;
}

/**
 * Alert context
 */
export const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * Hook to access alert context (returns null if not in provider)
 */
export function useAlertContext(): AlertContextValue | null {
  return useContext(AlertContext);
}

/**
 * Hook to access alert context (throws if not in provider)
 * @throws Error if used outside of AlertProvider
 */
export function useAlertContextStrict(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContextStrict must be used within an AlertProvider');
  }
  return context;
}
