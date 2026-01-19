/**
 * Alert component - Dialog variant with preset configurations
 */

import React, { forwardRef, useCallback, type ReactNode } from 'react';
import { Dialog, type DialogProps, type DialogSize } from '../Dialog';
import { Button } from '../../buttons/Button';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import { ALERT_PRESETS, type AlertVariant } from './AlertPresets';
import styles from './Alert.module.scss';

/**
 * Alert props - extends Dialog with preset configurations
 */
export interface AlertProps extends Omit<DialogProps, 'actions' | 'renderHeader' | 'renderFooter'> {
  /**
   * Alert variant (determines icon, colors, default buttons)
   * @default 'info'
   */
  variant?: AlertVariant;

  /**
   * Alert icon (overrides variant default)
   */
  icon?: IconName | ReactNode;

  /**
   * Hide the icon
   * @default false
   */
  hideIcon?: boolean;

  /**
   * Description/message content
   */
  description?: ReactNode;

  /**
   * Confirm button text
   * @default 'OK' (or 'Confirm' for confirm variant)
   */
  confirmText?: string;

  /**
   * Cancel button text (only shown for confirm variant or when explicitly provided)
   */
  cancelText?: string;

  /**
   * Callback when confirm is clicked
   */
  onConfirm?: () => void | Promise<void>;

  /**
   * Callback when cancel is clicked
   */
  onCancel?: () => void;

  /**
   * Whether confirm button is loading
   * @default false
   */
  loading?: boolean;

  /**
   * Whether confirm button is disabled
   * @default false
   */
  confirmDisabled?: boolean;

  /**
   * Confirm button variant
   */
  confirmVariant?: 'primary' | 'danger' | 'success' | 'warning';

  /**
   * Additional actions to render
   */
  extraActions?: ReactNode;

  /**
   * Override default size for alerts
   * @default 'sm'
   */
  size?: DialogSize;

  /**
   * Show cancel button
   * @default true for confirm variant, false for others
   */
  showCancel?: boolean;
}

/**
 * Alert component
 * A dialog variant with preset configurations for common alert types
 *
 * @example
 * ```tsx
 * // Simple info alert
 * <Alert
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   variant="info"
 *   title="Information"
 *   description="This is an informational message."
 * />
 *
 * // Confirmation alert
 * <Alert
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   variant="confirm"
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item?"
 *   onConfirm={handleDelete}
 *   onCancel={() => setIsOpen(false)}
 *   confirmVariant="danger"
 * />
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      icon,
      hideIcon = false,
      title,
      description,
      children,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      loading = false,
      confirmDisabled = false,
      confirmVariant,
      extraActions,
      size = 'sm',
      showCancel,
      onClose,
      className,
      'data-testid': testId,
      ...restProps
    },
    ref
  ) => {
    // Get preset configuration
    const preset = ALERT_PRESETS[variant];

    // Determine if we should show cancel button
    const shouldShowCancel = showCancel ?? (variant === 'confirm' || !!cancelText);

    // Handle confirm click
    const handleConfirm = useCallback(async () => {
      if (onConfirm) {
        await onConfirm();
      }
      onClose?.();
    }, [onConfirm, onClose]);

    // Handle cancel click
    const handleCancel = useCallback(() => {
      onCancel?.();
      onClose?.();
    }, [onCancel, onClose]);

    // Render icon
    const renderIcon = () => {
      if (hideIcon) return null;

      const iconToRender = icon ?? preset.icon;

      if (typeof iconToRender === 'string') {
        return (
          <div className={styles.alertIcon} data-variant={variant}>
            <Icon name={iconToRender as IconName} size="lg" />
          </div>
        );
      }

      return (
        <div className={styles.alertIcon} data-variant={variant}>
          {iconToRender}
        </div>
      );
    };

    // Render actions
    const renderActions = () => (
      <div className={styles.alertActions}>
        {extraActions}
        {shouldShowCancel && (
          <Button
            variant="ghost"
            onClick={handleCancel}
            data-testid="alert-cancel-button"
          >
            {cancelText ?? preset.cancelText ?? 'Cancel'}
          </Button>
        )}
        <Button
          variant={confirmVariant ?? preset.confirmVariant}
          onClick={handleConfirm}
          loading={loading}
          disabled={confirmDisabled}
          data-testid="alert-confirm-button"
        >
          {confirmText ?? preset.confirmText}
        </Button>
      </div>
    );

    // Custom header renderer
    const renderHeader = ({ onClose: closeHandler }: { onClose: () => void }) => (
      <div className={styles.alertHeader}>
        {renderIcon()}
        <div className={styles.alertHeaderContent}>
          {title && <h2 className={styles.alertTitle}>{title ?? preset.title}</h2>}
        </div>
      </div>
    );

    // Custom footer renderer
    const renderFooter = () => renderActions();

    const classes = [styles.alert, className].filter(Boolean).join(' ');

    return (
      <Dialog
        ref={ref}
        size={size}
        title={undefined}
        onClose={onClose}
        className={classes}
        data-testid={testId || 'alert'}
        data-variant={variant}
        role="alertdialog"
        showCloseButton={false}
        renderHeader={renderHeader}
        renderFooter={renderFooter}
        {...restProps}
      >
        {description && <div className={styles.alertDescription}>{description}</div>}
        {children}
      </Dialog>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
