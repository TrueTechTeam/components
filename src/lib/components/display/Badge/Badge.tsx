import React from 'react';
import styles from './Badge.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the Badge component
 */
export interface BadgeProps extends BaseComponentProps {
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
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Badge - Small status or count indicator for displaying numerical information or brief status text
 *
 * @example
 * ```tsx
 * <Badge variant="primary" size="md">
 *   5
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="danger" size="sm">
 *   New
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="success">
 *   Active
 * </Badge>
 * ```
 */
export const Badge = ({
  ref,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  children,
  ...restProps
}: BadgeProps & {
  ref?: React.Ref<HTMLSpanElement>;
}) => {
  // Merge className with component styles
  const componentClasses = [styles.badge, className].filter(Boolean).join(' ');

  return (
    <span
      ref={ref}
      className={componentClasses}
      data-component="badge"
      data-variant={variant}
      data-size={size}
      data-disabled={disabled || undefined}
      {...restProps}
    >
      {children}
    </span>
  );
};

export default Badge;
