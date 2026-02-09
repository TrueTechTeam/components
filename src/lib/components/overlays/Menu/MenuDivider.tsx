/**
 * MenuDivider component - Visual separator for menu items
 */

import type { BaseComponentProps } from '../../../types';
import styles from './MenuDivider.module.scss';

/**
 * MenuDivider component props
 */
export type MenuDividerProps = BaseComponentProps;

/**
 * MenuDivider component
 * Visual separator between menu items
 */
export const MenuDivider: React.FC<MenuDividerProps> = ({
  className,
  'data-testid': testId,
  ...restProps
}) => {
  const classes = [styles.menuDivider, className].filter(Boolean).join(' ');

  return (
    <li
      role="separator"
      className={classes}
      data-component="menu-divider"
      data-testid={testId || 'menu-divider'}
      {...restProps}
    />
  );
};
