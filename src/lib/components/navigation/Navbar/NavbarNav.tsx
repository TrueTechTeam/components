import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './Navbar.module.scss';

export interface NavbarNavProps extends BaseComponentProps {
  /**
   * Navigation items
   */
  children: React.ReactNode;
}

/**
 * NavbarNav - Navigation links container for the Navbar
 *
 * @example
 * ```tsx
 * <NavbarNav>
 *   <NavLink href="/home">Home</NavLink>
 *   <NavLink href="/about">About</NavLink>
 *   <NavLink href="/contact">Contact</NavLink>
 * </NavbarNav>
 * ```
 */
export const NavbarNav = forwardRef<HTMLElement, NavbarNavProps>(
  ({ children, className, 'data-testid': testId, style, ...restProps }, ref) => {
    const componentClasses = [styles.nav, className].filter(Boolean).join(' ');

    return (
      <nav
        ref={ref}
        className={componentClasses}
        data-component="navbar-nav"
        data-testid={testId}
        style={style}
        {...restProps}
      >
        {children}
      </nav>
    );
  }
);

NavbarNav.displayName = 'NavbarNav';

export default NavbarNav;
