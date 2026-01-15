import React, { forwardRef } from 'react';
import styles from './{{ComponentName}}.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the {{ComponentName}} component
 */
export interface {{ComponentName}}Props extends BaseComponentProps {
  /**
   * Visual variant of the component
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

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
 * {{ComponentName}} - {{description}}
 *
 * @example
 * ```tsx
 * <{{ComponentName}} variant="primary" size="md">
 *   Content
 * </{{ComponentName}}>
 * ```
 *
 * @example
 * ```tsx
 * <{{ComponentName}} variant="success" size="sm" disabled>
 *   Disabled
 * </{{ComponentName}}>
 * ```
 */
export const {{ComponentName}} = forwardRef<HTML{{Element}}Element, {{ComponentName}}Props>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      className,
      children,
      ...restProps
    },
    ref
  ) => {
    // Merge className with component styles
    const componentClasses = [styles.{{componentName}}, className].filter(Boolean).join(' ');

    return (
      <{{element}}
        ref={ref}
        className={componentClasses}
        data-component="{{componentName}}"
        data-variant={variant}
        data-size={size}
        data-disabled={disabled || undefined}
        {...restProps}
      >
        {children}
      </{{element}}>
    );
  }
);

{{ComponentName}}.displayName = '{{ComponentName}}';
