/**
 * MenuGroup component - Labeled group of menu items
 */

import { type ReactNode } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './MenuGroup.module.scss';

/**
 * MenuGroup component props
 */
export interface MenuGroupProps extends BaseComponentProps {
  /**
   * Group label
   */
  label?: string;

  /**
   * Menu items
   */
  children: ReactNode;
}

/**
 * MenuGroup component
 * Groups related menu items with an optional label
 */
export const MenuGroup: React.FC<MenuGroupProps> = ({
  label,
  children,
  className,
  'data-testid': testId,
  ...restProps
}) => {
  const classes = [styles.menuGroup, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role="group"
      aria-label={label}
      data-component="menu-group"
      data-testid={testId || 'menu-group'}
      {...restProps}
    >
      {label && <div className={styles.menuGroupLabel}>{label}</div>}
      {children}
    </div>
  );
};

MenuGroup.displayName = 'MenuGroup';
