import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './Navbar.module.scss';

export interface NavbarBrandProps extends BaseComponentProps {
  /**
   * Brand content (logo, text, etc.)
   */
  children: React.ReactNode;

  /**
   * Link href
   */
  href?: string;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}

/**
 * NavbarBrand - Logo/branding slot for the Navbar
 *
 * @example
 * ```tsx
 * <NavbarBrand href="/">
 *   <Logo />
 *   <span>My App</span>
 * </NavbarBrand>
 * ```
 */
export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ children, href, onClick, className, 'data-testid': testId, style, ...restProps }, ref) => {
    const componentClasses = [styles.brand, className].filter(Boolean).join(' ');

    if (href) {
      return (
        <a
          href={href}
          className={componentClasses}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
          data-component="navbar-brand"
          data-testid={testId}
          style={style}
        >
          {children}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={componentClasses}
        onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
        data-component="navbar-brand"
        data-testid={testId}
        style={style}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

NavbarBrand.displayName = 'NavbarBrand';

export default NavbarBrand;
