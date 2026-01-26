import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './Navbar.module.scss';

export interface NavbarActionsProps extends BaseComponentProps {
  /**
   * Action elements (buttons, menu, etc.)
   */
  children: React.ReactNode;
}

/**
 * NavbarActions - Actions slot for buttons, user menu, etc.
 *
 * @example
 * ```tsx
 * <NavbarActions>
 *   <Button variant="ghost">Sign In</Button>
 *   <Button variant="primary">Sign Up</Button>
 * </NavbarActions>
 * ```
 */
export const NavbarActions = forwardRef<HTMLDivElement, NavbarActionsProps>(
  ({ children, className, 'data-testid': testId, style, ...restProps }, ref) => {
    const componentClasses = [styles.actions, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="navbar-actions"
        data-testid={testId}
        style={style}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

NavbarActions.displayName = 'NavbarActions';

export default NavbarActions;
