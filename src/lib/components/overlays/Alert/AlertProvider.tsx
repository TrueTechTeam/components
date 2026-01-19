/**
 * Alert provider for programmatic alert management
 */

import React, { useState, useCallback, useMemo, type ReactNode } from 'react';
import { Alert, type AlertProps } from './Alert';
import { AlertContext, type AlertQueueItem, type AlertContextValue } from './AlertContext';
import type { AlertVariant } from './AlertPresets';

/**
 * Generate unique alert ID
 */
let alertIdCounter = 0;
const generateAlertId = () => `alert-${Date.now()}-${++alertIdCounter}`;

/**
 * Alert provider props
 */
export interface AlertProviderProps {
  /**
   * Children to render
   */
  children: ReactNode;

  /**
   * Default props to apply to all alerts
   */
  defaultAlertProps?: Partial<AlertProps>;
}

/**
 * Alert provider component
 * Manages a queue of alerts for programmatic creation
 *
 * @example
 * ```tsx
 * <AlertProvider>
 *   <App />
 * </AlertProvider>
 *
 * // In a component:
 * const { confirm, error, success } = useAlert();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm('Delete Item', 'Are you sure?');
 *   if (confirmed) {
 *     // perform delete
 *   }
 * };
 * ```
 */
export function AlertProvider({
  children,
  defaultAlertProps,
}: AlertProviderProps) {
  const [alerts, setAlerts] = useState<AlertQueueItem[]>([]);

  // Show an alert and wait for response
  const showAlert = useCallback(
    (props: Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel'>): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        const id = generateAlertId();
        const alertItem: AlertQueueItem = {
          id,
          props: {
            ...defaultAlertProps,
            ...props,
          },
          resolve,
        };

        setAlerts((prev) => [...prev, alertItem]);
      });
    },
    [defaultAlertProps]
  );

  // Helper to create variant-specific alert methods
  const createVariantMethod = useCallback(
    (variant: AlertVariant) =>
      (
        title: string,
        description?: string,
        options?: Partial<Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'title' | 'description'>>
      ): Promise<boolean> => {
        return showAlert({
          variant,
          title,
          description,
          ...options,
        });
      },
    [showAlert]
  );

  // Shorthand methods
  const confirm = useMemo(() => createVariantMethod('confirm'), [createVariantMethod]);
  const error = useMemo(() => createVariantMethod('error'), [createVariantMethod]);
  const success = useMemo(() => createVariantMethod('success'), [createVariantMethod]);
  const warning = useMemo(() => createVariantMethod('warning'), [createVariantMethod]);
  const info = useMemo(() => createVariantMethod('info'), [createVariantMethod]);

  // Dismiss current alert
  const dismiss = useCallback(() => {
    setAlerts((prev) => {
      if (prev.length === 0) return prev;
      const [current, ...rest] = prev;
      current.resolve(false);
      return rest;
    });
  }, []);

  // Dismiss all alerts
  const dismissAll = useCallback(() => {
    setAlerts((prev) => {
      prev.forEach((alert) => alert.resolve(false));
      return [];
    });
  }, []);

  // Handle alert confirm
  const handleConfirm = useCallback((alert: AlertQueueItem) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    alert.resolve(true);
  }, []);

  // Handle alert cancel/close
  const handleCancel = useCallback((alert: AlertQueueItem) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    alert.resolve(false);
  }, []);

  // Memoize context value
  const contextValue = useMemo<AlertContextValue>(
    () => ({
      alerts,
      alert: showAlert,
      confirm,
      error,
      success,
      warning,
      info,
      dismiss,
      dismissAll,
    }),
    [alerts, showAlert, confirm, error, success, warning, info, dismiss, dismissAll]
  );

  // Only show the first alert in the queue (sequential display)
  const currentAlert = alerts[0];

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {currentAlert && (
        <Alert
          key={currentAlert.id}
          {...currentAlert.props}
          isOpen={true}
          onConfirm={() => handleConfirm(currentAlert)}
          onCancel={() => handleCancel(currentAlert)}
          onClose={() => handleCancel(currentAlert)}
        />
      )}
    </AlertContext.Provider>
  );
}

AlertProvider.displayName = 'AlertProvider';
