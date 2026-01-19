/**
 * Toast container - Positioned container for toast stack
 */

import React, { type ReactNode } from 'react';
import { Portal } from '../Portal';
import type { BaseComponentProps } from '../../../types';
import type { ToastPosition } from './Toast';
import styles from './Toast.module.scss';

/**
 * Toast container props
 */
export interface ToastContainerProps extends BaseComponentProps {
  /**
   * Position for toasts
   * @default 'top-right'
   */
  position?: ToastPosition;

  /**
   * Gap between toasts in pixels
   * @default 12
   */
  gap?: number;

  /**
   * Offset from viewport edge
   * @default 16
   */
  offset?: number;

  /**
   * Custom z-index
   */
  zIndex?: number;

  /**
   * Children (toast elements)
   */
  children?: ReactNode;
}

/**
 * Toast container component
 * Positions and stacks toast notifications
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  gap = 12,
  offset = 16,
  zIndex,
  children,
  className,
  'data-testid': testId,
  style,
  ...restProps
}) => {
  const cssVariables = {
    '--toast-gap': `${gap}px`,
    '--toast-offset': `${offset}px`,
    ...(zIndex && { '--toast-container-z-index': zIndex }),
    ...style,
  } as React.CSSProperties;

  const classes = [styles.toastContainer, className].filter(Boolean).join(' ');

  // Don't render if no children
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  return (
    <Portal zIndex={zIndex}>
      <div
        className={classes}
        data-component="toast-container"
        data-position={position}
        data-testid={testId || 'toast-container'}
        style={cssVariables}
        aria-live="polite"
        aria-label="Notifications"
        {...restProps}
      >
        {children}
      </div>
    </Portal>
  );
};

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
