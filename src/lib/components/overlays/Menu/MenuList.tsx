/**
 * MenuList component - Container for menu items
 */

import { type ReactNode } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './MenuList.module.scss';

/**
 * MenuList component props
 */
export interface MenuListProps extends BaseComponentProps {
  /**
   * Menu items
   */
  children: ReactNode;
}

/**
 * MenuList component
 * Container for menu items with scrolling support
 */
export const MenuList: React.FC<MenuListProps> = ({
  children,
  className,
  'data-testid': testId,
  ...restProps
}) => {
  const classes = [styles.menuList, className].filter(Boolean).join(' ');

  return (
    <ul
      className={classes}
      role="menu"
      data-component="menu-list"
      data-testid={testId || 'menu-list'}
      {...restProps}
    >
      {children}
    </ul>
  );
};

MenuList.displayName = 'MenuList';
