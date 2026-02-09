import React from 'react';
import styles from './Spinner.module.scss';
import type { BaseComponentProps, ExtendedComponentSize } from '../../../types/component.types';

/**
 * Visual style of the spinner animation
 */
export type SpinnerStyle = 'circular' | 'dots' | 'bars' | 'pulse';

/**
 * Color variant of the spinner
 */
export type SpinnerVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'currentColor';

/**
 * Animation speed of the spinner
 */
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

/**
 * Props for the Spinner component
 */
export interface SpinnerProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Visual style of the spinner animation
   * @default 'circular'
   */
  spinnerStyle?: SpinnerStyle;

  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: ExtendedComponentSize;

  /**
   * Color variant of the spinner
   * @default 'primary'
   */
  variant?: SpinnerVariant;

  /**
   * Animation speed
   * @default 'normal'
   */
  speed?: SpinnerSpeed;

  /**
   * Stroke width for circular spinner style
   * @default 3
   */
  strokeWidth?: number;

  /**
   * Screen reader text
   * @default 'Loading...'
   */
  srText?: string;

  /**
   * Whether to show the screen reader text visually
   * @default false
   */
  showSrText?: boolean;
}

/**
 * Spinner - Animated loading indicator with multiple configurable styles
 *
 * @example
 * ```tsx
 * <Spinner />
 * ```
 *
 * @example
 * ```tsx
 * <Spinner spinnerStyle="dots" size="lg" variant="primary" />
 * ```
 *
 * @example
 * ```tsx
 * <Spinner spinnerStyle="bars" speed="fast" variant="success" />
 * ```
 *
 * @example
 * ```tsx
 * <Spinner spinnerStyle="pulse" size="xl" />
 * ```
 */
export const Spinner = ({
  ref,
  spinnerStyle = 'circular',
  size = 'md',
  variant = 'primary',
  speed = 'normal',
  strokeWidth = 3,
  srText = 'Loading...',
  showSrText = false,
  className,
  'aria-label': ariaLabel,
  'data-testid': testId,
  style,
  ...restProps
}: SpinnerProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const componentClasses = [styles.spinner, className].filter(Boolean).join(' ');

  const renderCircular = () => (
    <svg className={styles.spinnerCircular} viewBox="0 0 50 50">
      <circle
        className={styles.spinnerCircularTrack}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth={strokeWidth}
      />
      <circle
        className={styles.spinnerCircularPath}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );

  const renderDots = () => (
    <div className={styles.spinnerDots}>
      <span className={styles.spinnerDot} />
      <span className={styles.spinnerDot} />
      <span className={styles.spinnerDot} />
    </div>
  );

  const renderBars = () => (
    <div className={styles.spinnerBars}>
      <span className={styles.spinnerBar} />
      <span className={styles.spinnerBar} />
      <span className={styles.spinnerBar} />
      <span className={styles.spinnerBar} />
    </div>
  );

  const renderPulse = () => <div className={styles.spinnerPulse} />;

  const renderSpinner = () => {
    switch (spinnerStyle) {
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'pulse':
        return renderPulse();
      case 'circular':
      default:
        return renderCircular();
    }
  };

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-component="spinner"
      data-style={spinnerStyle}
      data-size={size}
      data-variant={variant}
      data-speed={speed}
      data-show-text={showSrText ? 'true' : undefined}
      data-testid={testId || 'spinner'}
      role="status"
      aria-label={ariaLabel || srText}
      style={style}
      {...restProps}
    >
      {showSrText ? (
        <span className={styles.spinnerGraphic}>{renderSpinner()}</span>
      ) : (
        renderSpinner()
      )}
      <span className={showSrText ? styles.spinnerText : styles.srOnly}>{srText}</span>
    </div>
  );
};

export default Spinner;
