/**
 * Alert preset configurations
 */

import type { IconName } from '../../display/Icon/icons';

/**
 * Alert variant types
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'confirm';

/**
 * Alert preset configuration
 */
export interface AlertPreset {
  /**
   * Variant identifier
   */
  variant: AlertVariant;

  /**
   * Default icon for the variant
   */
  icon: IconName;

  /**
   * Default title for the variant
   */
  title: string;

  /**
   * Default confirm button text
   */
  confirmText: string;

  /**
   * Default cancel button text (only for confirm variant)
   */
  cancelText?: string;

  /**
   * Confirm button variant
   */
  confirmVariant: 'primary' | 'danger' | 'success' | 'warning';
}

/**
 * Preset configurations for each alert variant
 */
export const ALERT_PRESETS: Record<AlertVariant, AlertPreset> = {
  info: {
    variant: 'info',
    icon: 'info',
    title: 'Information',
    confirmText: 'OK',
    confirmVariant: 'primary',
  },
  success: {
    variant: 'success',
    icon: 'check',
    title: 'Success',
    confirmText: 'OK',
    confirmVariant: 'success',
  },
  warning: {
    variant: 'warning',
    icon: 'warning',
    title: 'Warning',
    confirmText: 'OK',
    confirmVariant: 'warning',
  },
  error: {
    variant: 'error',
    icon: 'error',
    title: 'Error',
    confirmText: 'OK',
    confirmVariant: 'danger',
  },
  confirm: {
    variant: 'confirm',
    icon: 'help',
    title: 'Confirm',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
  },
};

/**
 * Get preset configuration for a variant
 */
export function getAlertPreset(variant: AlertVariant): AlertPreset {
  return ALERT_PRESETS[variant];
}
