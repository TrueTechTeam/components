/**
 * Toast component - Notification toast for temporary messages
 */

import React, { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { Icon } from '../../display/Icon';
import { IconButton } from '../../buttons/IconButton';
import { Spinner } from '../../display/Spinner';
import type { IconName } from '../../display/Icon/icons';
import type { BaseComponentProps } from '../../../types';
import styles from './Toast.module.scss';

/**
 * Toast position options
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Toast variant types
 */
export type ToastVariant = 'info' | 'success' | 'warning' | 'error' | 'loading';

/**
 * Toast animation state
 */
export type ToastAnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

/**
 * Single toast props
 */
export interface ToastProps extends BaseComponentProps {
  /**
   * Unique toast ID
   */
  id: string;

  /**
   * Toast variant
   * @default 'info'
   */
  variant?: ToastVariant;

  /**
   * Toast title
   */
  title?: ReactNode;

  /**
   * Toast message/description
   */
  message?: ReactNode;

  /**
   * Custom icon (overrides variant default)
   */
  icon?: IconName | ReactNode;

  /**
   * Hide the icon
   * @default false
   */
  hideIcon?: boolean;

  /**
   * Duration in milliseconds (0 for persistent)
   * @default 5000
   */
  duration?: number;

  /**
   * Whether toast can be dismissed by user
   * @default true
   */
  dismissible?: boolean;

  /**
   * Action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;

  /**
   * Whether to show progress bar for duration
   * @default false
   */
  showProgress?: boolean;

  /**
   * Whether to pause duration on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Custom render function for toast content
   */
  render?: (props: { toast: ToastProps; dismiss: () => void }) => ReactNode;

  /**
   * Animation state (managed by container)
   */
  animationState?: ToastAnimationState;

  /**
   * Animation duration in ms
   * @default 200
   */
  animationDuration?: number;

  /**
   * Position (for animation direction)
   */
  position?: ToastPosition;
}

/**
 * Default icons for each variant
 */
const VARIANT_ICONS: Record<ToastVariant, IconName> = {
  info: 'info',
  success: 'check',
  warning: 'warning',
  error: 'error',
  loading: 'info', // Will use Spinner instead
};

/**
 * Toast component
 * Single toast notification with auto-dismiss and actions
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  variant = 'info',
  title,
  message,
  icon,
  hideIcon = false,
  duration = 5000,
  dismissible = true,
  action,
  onDismiss,
  showProgress = false,
  pauseOnHover = true,
  render,
  animationState = 'entered',
  animationDuration = 200,
  position = 'top-right',
  className,
  'data-testid': testId,
  style,
  ...restProps
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(duration);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration === 0 || variant === 'loading' || animationState !== 'entered') {
      return;
    }

    const startTimer = () => {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, remainingTimeRef.current);
    };

    const pauseTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    };

    if (isPaused && pauseOnHover) {
      pauseTimer();
    } else {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, variant, isPaused, pauseOnHover, handleDismiss, animationState]);

  // Progress bar animation
  useEffect(() => {
    if (!showProgress || duration === 0 || variant === 'loading') {
      return;
    }

    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          const decrement = (100 / duration) * 100;
          return Math.max(0, prev - decrement);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [showProgress, duration, variant, isPaused]);

  // Handle mouse events for pause on hover
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  // Custom render
  if (render) {
    return render({
      toast: {
        id,
        variant,
        title,
        message,
        icon,
        hideIcon,
        duration,
        dismissible,
        action,
        onDismiss,
        showProgress,
        pauseOnHover,
      },
      dismiss: handleDismiss,
    });
  }

  // Render icon
  const renderIcon = () => {
    if (hideIcon) {
      return null;
    }

    if (variant === 'loading') {
      return (
        <div className={styles.toastIcon} data-variant={variant}>
          <Spinner size="sm" variant="currentColor" />
        </div>
      );
    }

    const iconToRender = icon ?? VARIANT_ICONS[variant];

    if (typeof iconToRender === 'string') {
      return (
        <div className={styles.toastIcon} data-variant={variant}>
          <Icon name={iconToRender as IconName} size="sm" />
        </div>
      );
    }

    return (
      <div className={styles.toastIcon} data-variant={variant}>
        {iconToRender}
      </div>
    );
  };

  const classes = [styles.toast, className].filter(Boolean).join(' ');

  const cssVariables = {
    '--toast-animation-duration': `${animationDuration}ms`,
    '--toast-progress': `${progress}%`,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={classes}
      data-component="toast"
      data-variant={variant}
      data-state={animationState}
      data-position={position}
      data-testid={testId || `toast-${id}`}
      role="alert"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cssVariables}
      {...restProps}
    >
      {renderIcon()}

      <div className={styles.toastContent}>
        {title && <div className={styles.toastTitle}>{title}</div>}
        {message && <div className={styles.toastMessage}>{message}</div>}
      </div>

      <div className={styles.toastActions}>
        {action && (
          <button type="button" className={styles.toastAction} onClick={action.onClick}>
            {action.label}
          </button>
        )}

        {dismissible && (
          <IconButton
            icon="close"
            variant="ghost"
            size="xs"
            onClick={handleDismiss}
            aria-label="Dismiss toast"
            className={styles.toastDismiss}
          />
        )}
      </div>

      {showProgress && duration > 0 && variant !== 'loading' && (
        <div className={styles.toastProgress} data-paused={isPaused || undefined} />
      )}
    </div>
  );
};

export default Toast;
