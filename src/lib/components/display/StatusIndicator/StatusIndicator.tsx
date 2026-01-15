import React, { forwardRef } from 'react';
import styles from './StatusIndicator.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the StatusIndicator component
 */
export interface StatusIndicatorProps extends BaseComponentProps {
  /**
   * Status variant of the indicator
   * @default 'neutral'
   */
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'processing';

  /**
   * Size of the indicator
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether to show pulse animation
   * @default false
   */
  pulse?: boolean;

  /**
   * Whether to display text alongside the indicator
   * @default false
   */
  withText?: boolean;
}

/**
 * StatusIndicator - Visual colored dot indicator for status with optional text and pulse animation
 *
 * @example
 * ```tsx
 * <StatusIndicator status="success" />
 * ```
 *
 * @example
 * ```tsx
 * <StatusIndicator status="error" pulse size="lg" />
 * ```
 *
 * @example
 * ```tsx
 * <StatusIndicator status="processing" pulse withText>
 *   Processing
 * </StatusIndicator>
 * ```
 *
 * @example
 * ```tsx
 * <StatusIndicator status="warning" withText size="sm">
 *   Warning
 * </StatusIndicator>
 * ```
 */
export const StatusIndicator = forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  (
    {
      status = 'neutral',
      size = 'md',
      pulse = false,
      withText = false,
      className,
      children,
      ...restProps
    },
    ref
  ) => {
    // Merge className with component styles
    const componentClasses = [styles.statusIndicator, className].filter(Boolean).join(' ');

    return (
      <span
        ref={ref}
        className={componentClasses}
        data-component="statusIndicator"
        data-status={status}
        data-size={size}
        data-pulse={pulse || undefined}
        data-with-text={withText || undefined}
        {...restProps}
      >
        <span className={styles.dot} aria-hidden="true" />
        {withText && children && <span className={styles.text}>{children}</span>}
      </span>
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';

export default StatusIndicator;
