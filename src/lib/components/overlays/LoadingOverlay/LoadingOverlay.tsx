import React, { forwardRef, type ReactNode } from 'react';
import type { BaseComponentProps, ExtendedComponentSize } from '../../../types/component.types';
import {
  Spinner,
  type SpinnerSpeed,
  type SpinnerStyle,
  type SpinnerVariant,
} from '../../display/Spinner';
import { Portal } from '../Portal';
import styles from './LoadingOverlay.module.scss';

/**
 * Loading overlay mode
 */
export type LoadingOverlayMode = 'container' | 'fullscreen';

/**
 * Props for the LoadingOverlay component
 */
export interface LoadingOverlayProps extends BaseComponentProps {
  /**
   * Whether the overlay is visible
   * @default true
   */
  visible?: boolean;

  /**
   * Mode: cover parent container or full screen
   * @default 'container'
   */
  mode?: LoadingOverlayMode;

  /**
   * Spinner style to use
   * @default 'circular'
   */
  spinnerStyle?: SpinnerStyle;

  /**
   * Spinner size
   * @default 'lg'
   */
  spinnerSize?: ExtendedComponentSize;

  /**
   * Spinner color variant
   * @default 'primary'
   */
  spinnerVariant?: SpinnerVariant;

  /**
   * Spinner animation speed
   * @default 'normal'
   */
  spinnerSpeed?: SpinnerSpeed;

  /**
   * Optional message to display below spinner
   */
  message?: ReactNode;

  /**
   * Enable backdrop blur effect
   * @default false
   */
  blur?: boolean;

  /**
   * Backdrop opacity (0-1)
   * @default 0.7
   */
  backdropOpacity?: number;

  /**
   * Custom z-index for the overlay
   */
  zIndex?: number;

  /**
   * Transition duration in milliseconds
   * @default 200
   */
  transitionDuration?: number;

  /**
   * Custom spinner element (overrides spinnerStyle, spinnerSize, spinnerVariant)
   */
  customSpinner?: ReactNode;

  /**
   * Border radius for the overlay to match child content
   * Accepts any valid CSS border-radius value
   */
  borderRadius?: string | number;
}

/**
 * LoadingOverlay - Overlay component for showing loading state over content
 *
 * @example
 * ```tsx
 * // Container mode - wraps content
 * <LoadingOverlay visible={isLoading}>
 *   <div>Content to overlay</div>
 * </LoadingOverlay>
 * ```
 *
 * @example
 * ```tsx
 * // Fullscreen mode
 * <LoadingOverlay visible={isLoading} mode="fullscreen" message="Loading..." />
 * ```
 *
 * @example
 * ```tsx
 * // With blur effect
 * <LoadingOverlay visible={isLoading} blur backdropOpacity={0.5}>
 *   <div>Blurred content</div>
 * </LoadingOverlay>
 * ```
 */
export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      children,
      visible = true,
      mode = 'container',
      spinnerStyle = 'circular',
      spinnerSize = 'lg',
      spinnerVariant = 'primary',
      spinnerSpeed = 'normal',
      message,
      blur = false,
      backdropOpacity = 0.7,
      zIndex,
      transitionDuration = 200,
      customSpinner,
      borderRadius,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    const borderRadiusValue =
      typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    const componentClasses = [styles.loadingOverlay, className].filter(Boolean).join(' ');

    const spinnerElement = customSpinner || (
      <Spinner
        spinnerStyle={spinnerStyle}
        size={spinnerSize}
        variant={spinnerVariant}
        speed={spinnerSpeed}
      />
    );

    const overlayContent = (
      <div
        className={styles.loadingOverlayBackdrop}
        data-visible={visible}
        data-blur={blur || undefined}
        style={
          {
            '--backdrop-opacity': backdropOpacity,
            '--transition-duration': `${transitionDuration}ms`,
            ...(zIndex !== undefined && { zIndex }),
            ...(borderRadiusValue && { borderRadius: borderRadiusValue }),
          } as React.CSSProperties
        }
      >
        <div className={styles.loadingOverlayContent}>
          {spinnerElement}
          {message && <div className={styles.loadingOverlayMessage}>{message}</div>}
        </div>
      </div>
    );

    // Fullscreen mode - render in portal
    if (mode === 'fullscreen') {
      if (!visible) {
        return null;
      }

      return (
        <Portal zIndex={zIndex}>
          <div
            ref={ref}
            className={componentClasses}
            data-component="loading-overlay"
            data-mode={mode}
            data-testid={testId || 'loading-overlay'}
            style={style}
            {...restProps}
          >
            {overlayContent}
          </div>
        </Portal>
      );
    }

    // Container mode - wrap children
    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="loading-overlay"
        data-mode={mode}
        data-testid={testId || 'loading-overlay'}
        style={style}
        aria-busy={visible}
        {...restProps}
      >
        {children}
        {overlayContent}
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;

