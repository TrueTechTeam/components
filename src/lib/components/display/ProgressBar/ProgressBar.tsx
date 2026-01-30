import React, { forwardRef } from 'react';
import styles from './ProgressBar.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the ProgressBar component
 */
export interface ProgressBarProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Visual variant of the component
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  /**
   * Size of the component
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Current progress value (0-100)
   * @default 0
   */
  value?: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Whether to show the value label
   * @default false
   */
  showValue?: boolean;

  /**
   * Custom label to display
   */
  label?: string;

  /**
   * Whether to animate the progress
   * @default true
   */
  animated?: boolean;

  /**
   * Whether to show striped pattern
   * @default false
   */
  striped?: boolean;

  /**
   * Custom format function for the value display
   */
  formatValue?: (value: number, max: number) => string;

  /**
   * Indeterminate mode - shows infinite loading animation
   * When true, value prop is ignored
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Buffer/secondary progress value (0-100)
   * Shows a secondary progress track for buffering states
   */
  bufferValue?: number;
}

/**
 * ProgressBar - Linear progress indicator for showing task completion or loading states
 *
 * @example
 * ```tsx
 * <ProgressBar variant="primary" value={50} showValue />
 * ```
 *
 * @example
 * ```tsx
 * <ProgressBar variant="success" value={75} label="Uploading..." />
 * ```
 *
 * @example
 * ```tsx
 * <ProgressBar variant="warning" value={30} size="lg" striped animated />
 * ```
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      value = 0,
      max = 100,
      showValue = false,
      label,
      animated = true,
      striped = false,
      formatValue,
      indeterminate = false,
      bufferValue,
      className,
      ...restProps
    },
    ref
  ) => {
    // Ensure value is between 0 and max
    const normalizedValue = Math.min(Math.max(value, 0), max);
    const percentage = max > 0 ? (normalizedValue / max) * 100 : 0;

    // Calculate buffer percentage if provided
    const bufferPercentage =
      bufferValue !== undefined ? (Math.min(Math.max(bufferValue, 0), max) / max) * 100 : undefined;

    // Format the display value
    const displayValue = formatValue
      ? formatValue(normalizedValue, max)
      : `${Math.round(percentage)}%`;

    // Merge className with component styles
    const componentClasses = [styles.progressBar, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="progress-bar"
        data-variant={variant}
        data-size={size}
        data-indeterminate={indeterminate || undefined}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : normalizedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        {...restProps}
      >
        {(label || (showValue && !indeterminate)) && (
          <div className={styles.progressBarHeader}>
            {label && <span className={styles.progressBarLabel}>{label}</span>}
            {showValue && !indeterminate && (
              <span className={styles.progressBarValue}>{displayValue}</span>
            )}
          </div>
        )}
        <div className={styles.progressBarTrack}>
          {/* Buffer track (behind main fill) */}
          {bufferPercentage !== undefined && !indeterminate && (
            <div className={styles.progressBarBuffer} style={{ width: `${bufferPercentage}%` }} />
          )}
          {/* Main progress fill */}
          <div
            className={styles.progressBarFill}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
            data-animated={animated || undefined}
            data-striped={striped || undefined}
            data-indeterminate={indeterminate || undefined}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
