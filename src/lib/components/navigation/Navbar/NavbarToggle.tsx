import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import { useNavbarContextStrict } from './NavbarContext';
import styles from './Navbar.module.scss';

export interface NavbarToggleProps extends BaseComponentProps {
  /**
   * Custom toggle icon
   */
  icon?: React.ReactNode;
}

/**
 * NavbarToggle - Mobile hamburger menu button
 *
 * @example
 * ```tsx
 * <NavbarToggle />
 *
 * // With custom icon
 * <NavbarToggle icon={<CustomIcon />} />
 * ```
 */
export const NavbarToggle = forwardRef<HTMLButtonElement, NavbarToggleProps>(
  ({ icon, className, 'data-testid': testId, 'aria-label': ariaLabel, style, ...restProps }, ref) => {
    const { navbarId, isExpanded, toggle } = useNavbarContextStrict();

    const componentClasses = [styles.toggle, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        type="button"
        className={componentClasses}
        onClick={toggle}
        data-component="navbar-toggle"
        data-expanded={isExpanded || undefined}
        data-testid={testId}
        aria-label={ariaLabel || (isExpanded ? 'Close menu' : 'Open menu')}
        aria-expanded={isExpanded}
        aria-controls={`${navbarId}-collapse`}
        style={style}
        {...restProps}
      >
        {icon || (
          <span className={styles.hamburger} data-expanded={isExpanded || undefined}>
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </span>
        )}
      </button>
    );
  }
);

NavbarToggle.displayName = 'NavbarToggle';

export default NavbarToggle;
