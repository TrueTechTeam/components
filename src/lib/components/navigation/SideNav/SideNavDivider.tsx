import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import { useSideNavContext } from './SideNavContext';
import styles from './SideNav.module.scss';

export interface SideNavDividerProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Optional label for the divider
   */
  label?: string;
}

/**
 * SideNavDivider - Visual separator for SideNav
 *
 * @example
 * ```tsx
 * // Simple divider
 * <SideNavDivider />
 *
 * // With label
 * <SideNavDivider label="Settings" />
 * ```
 */
export const SideNavDivider = forwardRef<HTMLDivElement, SideNavDividerProps>(
  ({ label, className, 'data-testid': testId, style, ...restProps }, ref) => {
    const context = useSideNavContext();
    const collapsed = context?.collapsed ?? false;

    const componentClasses = [styles.divider, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="side-nav-divider"
        data-collapsed={collapsed || undefined}
        data-testid={testId}
        role="separator"
        style={style}
        {...restProps}
      >
        {label && !collapsed && <span className={styles.dividerLabel}>{label}</span>}
      </div>
    );
  }
);

SideNavDivider.displayName = 'SideNavDivider';

export default SideNavDivider;
