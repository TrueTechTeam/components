/**
 * Hook for programmatic alert management
 */

import { useCallback } from 'react';
import { useAlertContextStrict, type AlertProps } from '../../components/overlays/Alert';

/**
 * Hook options
 */
export interface UseAlertOptions {
  /**
   * Default props to apply to all alerts
   */
  defaultProps?: Partial<AlertProps>;
}

/**
 * Hook return type
 */
export interface UseAlertReturn {
  /**
   * Show a custom alert
   * @returns Promise<boolean> - true if confirmed, false if cancelled
   */
  alert: (
    props: Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel'>
  ) => Promise<boolean>;

  /**
   * Show a confirmation dialog
   * @param title - Alert title
   * @param description - Alert description
   * @param options - Additional alert options
   * @returns Promise<boolean> - true if confirmed, false if cancelled
   */
  confirm: (
    title: string,
    description?: string,
    options?: Partial<AlertProps>
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
    options?: Partial<AlertProps>
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
    options?: Partial<AlertProps>
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
    options?: Partial<AlertProps>
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
    options?: Partial<AlertProps>
  ) => Promise<boolean>;

  /**
   * Dismiss current alert
   */
  dismiss: () => void;
}

/**
 * Hook for programmatically creating alerts
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const alert = useAlert();
 *
 *   const handleDelete = async () => {
 *     const confirmed = await alert.confirm(
 *       'Delete Item',
 *       'Are you sure you want to delete this item? This action cannot be undone.',
 *       { confirmVariant: 'danger' }
 *     );
 *
 *     if (confirmed) {
 *       // Perform deletion
 *       await deleteItem();
 *       alert.success('Deleted', 'Item has been deleted successfully.');
 *     }
 *   };
 *
 *   const handleError = () => {
 *     alert.error('Operation Failed', 'Something went wrong. Please try again.');
 *   };
 *
 *   return (
 *     <Button onClick={handleDelete} variant="danger">
 *       Delete
 *     </Button>
 *   );
 * }
 * ```
 */
export function useAlert(options: UseAlertOptions = {}): UseAlertReturn {
  const context = useAlertContextStrict();
  const { defaultProps } = options;

  // Wrap methods to apply default props
  const alert = useCallback(
    (props: Omit<AlertProps, 'isOpen' | 'onConfirm' | 'onCancel'>) => {
      return context.alert({ ...defaultProps, ...props });
    },
    [context, defaultProps]
  );

  const confirm = useCallback(
    (title: string, description?: string, opts?: Partial<AlertProps>) => {
      return context.confirm(title, description, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const error = useCallback(
    (title: string, description?: string, opts?: Partial<AlertProps>) => {
      return context.error(title, description, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const success = useCallback(
    (title: string, description?: string, opts?: Partial<AlertProps>) => {
      return context.success(title, description, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const warning = useCallback(
    (title: string, description?: string, opts?: Partial<AlertProps>) => {
      return context.warning(title, description, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  const info = useCallback(
    (title: string, description?: string, opts?: Partial<AlertProps>) => {
      return context.info(title, description, { ...defaultProps, ...opts });
    },
    [context, defaultProps]
  );

  return {
    alert,
    confirm,
    error,
    success,
    warning,
    info,
    dismiss: context.dismiss,
  };
}
