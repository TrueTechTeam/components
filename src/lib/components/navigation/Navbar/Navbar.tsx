import React, { forwardRef, useState, useCallback, useMemo, useId, useEffect } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import {
  NavbarContext,
  type NavbarContextValue,
  type NavbarVariant,
  type NavbarPosition,
} from './NavbarContext';
import styles from './Navbar.module.scss';

export interface NavbarProps extends BaseComponentProps {
  /**
   * Visual variant
   * @default 'solid'
   */
  variant?: NavbarVariant;

  /**
   * Position behavior
   * @default 'sticky'
   */
  position?: NavbarPosition;

  /**
   * Size (height)
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Alignment of nav items
   * @default 'left'
   */
  alignment?: 'left' | 'center';

  /**
   * Controlled expanded state (mobile menu)
   */
  expanded?: boolean;

  /**
   * Default expanded state
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Callback when mobile menu toggles
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Breakpoint for mobile collapse (px)
   * @default 768
   */
  collapseBreakpoint?: number;

  /**
   * Children (NavbarBrand, NavbarNav, NavbarActions)
   */
  children: React.ReactNode;
}

/**
 * Navbar - Top navigation bar for branding and primary navigation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Navbar>
 *   <NavbarBrand href="/">
 *     <Logo />
 *     <span>My App</span>
 *   </NavbarBrand>
 *   <NavbarNav>
 *     <NavLink href="/home">Home</NavLink>
 *     <NavLink href="/about">About</NavLink>
 *   </NavbarNav>
 *   <NavbarActions>
 *     <Button>Sign In</Button>
 *   </NavbarActions>
 * </Navbar>
 *
 * // With mobile menu
 * <Navbar>
 *   <NavbarBrand href="/">Logo</NavbarBrand>
 *   <NavbarToggle />
 *   <NavbarCollapse>
 *     <NavbarNav>
 *       <NavLink href="/home">Home</NavLink>
 *     </NavbarNav>
 *   </NavbarCollapse>
 * </Navbar>
 * ```
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      variant = 'solid',
      position = 'sticky',
      size = 'md',
      alignment = 'left',
      expanded: controlledExpanded,
      defaultExpanded = false,
      onExpandedChange,
      collapseBreakpoint = 768,
      children,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    const navbarId = useId();
    const isControlled = controlledExpanded !== undefined;
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const [isMobile, setIsMobile] = useState(false);

    const isExpanded = isControlled ? controlledExpanded : internalExpanded;

    // Handle responsive breakpoint and close menu when switching to desktop
    useEffect(() => {
      const checkMobile = () => {
        const mobile = window.innerWidth < collapseBreakpoint;
        setIsMobile(mobile);

        // Close menu when switching from mobile to desktop
        if (!mobile) {
          setInternalExpanded(false);
          onExpandedChange?.(false);
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }, [collapseBreakpoint, onExpandedChange]);

    const setExpanded = useCallback(
      (expanded: boolean) => {
        if (!isControlled) {
          setInternalExpanded(expanded);
        }
        onExpandedChange?.(expanded);
      },
      [isControlled, onExpandedChange]
    );

    const toggle = useCallback(() => {
      setExpanded(!isExpanded);
    }, [isExpanded, setExpanded]);

    const contextValue: NavbarContextValue = useMemo(
      () => ({
        navbarId,
        variant,
        size,
        position,
        isExpanded,
        setExpanded,
        toggle,
        alignment,
        isMobile,
      }),
      [navbarId, variant, size, position, isExpanded, setExpanded, toggle, alignment, isMobile]
    );

    const componentClasses = [styles.navbar, className].filter(Boolean).join(' ');

    return (
      <header
        ref={ref}
        className={componentClasses}
        data-component="navbar"
        data-variant={variant}
        data-position={position}
        data-size={size}
        data-alignment={alignment}
        data-expanded={isExpanded || undefined}
        data-mobile={isMobile || undefined}
        data-testid={testId}
        aria-label={ariaLabel || 'Main navigation'}
        style={style}
        {...restProps}
      >
        <NavbarContext.Provider value={contextValue}>
          <div className={styles.container}>{children}</div>
        </NavbarContext.Provider>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';

export default Navbar;
