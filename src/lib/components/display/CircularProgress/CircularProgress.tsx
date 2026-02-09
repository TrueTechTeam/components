import React from 'react';
import styles from './CircularProgress.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the CircularProgress component
 */
export interface CircularProgressProps extends Omit<BaseComponentProps, 'children'> {
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
   * Whether to show the value label in the center
   * @default false
   */
  showValue?: boolean;

  /**
   * Custom label to display in the center
   */
  label?: string;

  /**
   * Stroke width of the circle
   * @default 4
   */
  strokeWidth?: number;

  /**
   * Custom format function for the value display
   */
  formatValue?: (value: number, max: number) => string;
}

/**
 * CircularProgress - Circular progress indicator for showing task completion or loading states
 *
 * @example
 * ```tsx
 * <CircularProgress variant="primary" value={75} showValue />
 * ```
 *
 * @example
 * ```tsx
 * <CircularProgress variant="success" value={90} label="Complete" />
 * ```
 *
 * @example
 * ```tsx
 * <CircularProgress variant="warning" value={50} size="lg" />
 * ```
 */
export const CircularProgress = ({
  ref,
  variant = 'primary',
  size = 'md',
  value = 0,
  max = 100,
  showValue = false,
  label,
  strokeWidth = 4,
  formatValue,
  className,
  ...restProps
}: CircularProgressProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  // Ensure value is between 0 and max
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? (normalizedValue / max) * 100 : 0;

  // Format the display value
  const displayValue = formatValue
    ? formatValue(normalizedValue, max)
    : `${Math.round(percentage)}%`;

  // SVG circle calculations
  const circleSize = size === 'sm' ? 64 : size === 'lg' ? 128 : 96;
  const center = circleSize / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Merge className with component styles
  const componentClasses = [styles.circularProgress, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-component="circular-progress"
      data-variant={variant}
      data-size={size}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      style={
        {
          '--circle-size': `${circleSize}px`,
        } as React.CSSProperties
      }
      {...restProps}
    >
      <svg
        className={styles.circularProgressSvg}
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        {/* Background circle */}
        <circle
          className={styles.circularProgressTrack}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          className={styles.circularProgressFill}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {(showValue || label) && (
        <div className={styles.circularProgressLabel}>{label || (showValue && displayValue)}</div>
      )}
    </div>
  );
};

export default CircularProgress;
