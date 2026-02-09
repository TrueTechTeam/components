import React from 'react';
import type { BaseComponentProps } from '../../../types';
import { useNavbarContextStrict } from './NavbarContext';
import styles from './Navbar.module.scss';

export interface NavbarCollapseProps extends BaseComponentProps {
  /**
   * Content to show in collapsed mobile menu
   */
  children: React.ReactNode;
}

/**
 * NavbarCollapse - Collapsible container for mobile menu content
 *
 * @example
 * ```tsx
 * <NavbarCollapse>
 *   <NavbarNav>
 *     <NavLink href="/home">Home</NavLink>
 *     <NavLink href="/about">About</NavLink>
 *   </NavbarNav>
 *   <NavbarActions>
 *     <Button>Sign In</Button>
 *   </NavbarActions>
 * </NavbarCollapse>
 * ```
 */
export const NavbarCollapse = ({
  ref,
  children,
  className,
  'data-testid': testId,
  style,
  ...restProps
}: NavbarCollapseProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const { navbarId, isExpanded, isMobile } = useNavbarContextStrict();

  const componentClasses = [styles.collapse, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      id={`${navbarId}-collapse`}
      className={componentClasses}
      data-component="navbar-collapse"
      data-expanded={isExpanded || undefined}
      data-mobile={isMobile || undefined}
      data-testid={testId}
      aria-hidden={isMobile && !isExpanded}
      style={style}
      {...restProps}
    >
      <div className={styles.collapseContent}>{children}</div>
    </div>
  );
};

export default NavbarCollapse;
