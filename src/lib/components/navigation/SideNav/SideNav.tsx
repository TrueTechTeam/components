import React, { forwardRef, useState, useCallback, useMemo, useId } from 'react';
import type { BaseComponentProps } from '../../../types';
import { SideNavContext, type SideNavContextValue } from './SideNavContext';
import styles from './SideNav.module.scss';

export interface SideNavProps extends BaseComponentProps {
  /**
   * Position of the sidebar
   * @default 'left'
   */
  position?: 'left' | 'right';

  /**
   * Controlled collapsed state (icon-only mode)
   */
  collapsed?: boolean;

  /**
   * Default collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Callback when collapse state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Width when expanded (px)
   * @default 240
   */
  expandedWidth?: number;

  /**
   * Width when collapsed (px)
   * @default 64
   */
  collapsedWidth?: number;

  /**
   * Currently selected item value (controlled)
   */
  selectedValue?: string;

  /**
   * Default selected item value
   */
  defaultSelectedValue?: string;

  /**
   * Callback when selection changes
   */
  onSelect?: (value: string) => void;

  /**
   * Header content
   */
  header?: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Navigation items
   */
  children: React.ReactNode;
}

/**
 * SideNav - Side navigation panel with icons, labels, and nesting support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SideNav>
 *   <SideNavItem value="home" icon="Home" label="Home" />
 *   <SideNavItem value="settings" icon="Settings" label="Settings" />
 * </SideNav>
 *
 * // With groups
 * <SideNav selectedValue="profile" onSelect={handleSelect}>
 *   <SideNavItem value="dashboard" icon="Home" label="Dashboard" />
 *   <SideNavGroup groupId="settings" label="Settings" icon="Settings">
 *     <SideNavItem value="profile" label="Profile" />
 *     <SideNavItem value="security" label="Security" />
 *   </SideNavGroup>
 *   <SideNavDivider label="Other" />
 *   <SideNavItem value="help" icon="HelpCircle" label="Help" />
 * </SideNav>
 *
 * // With header and footer
 * <SideNav
 *   header={<Logo />}
 *   footer={<UserProfile />}
 * >
 *   {navItems}
 * </SideNav>
 * ```
 */
export const SideNav = forwardRef<HTMLElement, SideNavProps>(
  (
    {
      position = 'left',
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      expandedWidth = 240,
      collapsedWidth = 64,
      selectedValue: controlledSelectedValue,
      defaultSelectedValue,
      onSelect,
      header,
      footer,
      children,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    const sideNavId = useId();

    // Collapsed state
    const isCollapsedControlled = controlledCollapsed !== undefined;
    const [internalCollapsed] = useState(defaultCollapsed);
    const collapsed = isCollapsedControlled ? controlledCollapsed : internalCollapsed;

    // Selected state
    const isSelectedControlled = controlledSelectedValue !== undefined;
    const [internalSelectedValue, setInternalSelectedValue] = useState<string | null>(
      defaultSelectedValue ?? null
    );
    const selectedValue = isSelectedControlled ? controlledSelectedValue : internalSelectedValue;

    // Expanded groups
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());

    const handleSelect = useCallback(
      (value: string) => {
        if (!isSelectedControlled) {
          setInternalSelectedValue(value);
        }
        onSelect?.(value);
      },
      [isSelectedControlled, onSelect]
    );

    const toggleGroup = useCallback((groupId: string) => {
      setExpandedGroups((prev) => {
        const next = new Set(prev);
        if (next.has(groupId)) {
          next.delete(groupId);
        } else {
          next.add(groupId);
        }
        return next;
      });
    }, []);

    const registerDefaultExpanded = useCallback((groupId: string) => {
      setExpandedGroups((prev) => {
        if (prev.has(groupId)) {
          return prev;
        }
        const next = new Set(prev);
        next.add(groupId);
        return next;
      });
    }, []);

    const contextValue: SideNavContextValue = useMemo(
      () => ({
        sideNavId,
        collapsed,
        selectedValue,
        onSelect: handleSelect,
        position,
        expandedGroups,
        toggleGroup,
        registerDefaultExpanded,
      }),
      [
        sideNavId,
        collapsed,
        selectedValue,
        handleSelect,
        position,
        expandedGroups,
        toggleGroup,
        registerDefaultExpanded,
      ]
    );

    const currentWidth = collapsed ? collapsedWidth : expandedWidth;

    const cssVariables = {
      '--sidenav-width': `${currentWidth}px`,
      '--sidenav-expanded-width': `${expandedWidth}px`,
      '--sidenav-collapsed-width': `${collapsedWidth}px`,
      ...style,
    } as React.CSSProperties;

    const componentClasses = [styles.sideNav, className].filter(Boolean).join(' ');

    return (
      <nav
        ref={ref}
        className={componentClasses}
        style={cssVariables}
        data-component="side-nav"
        data-position={position}
        data-collapsed={collapsed || undefined}
        data-testid={testId}
        aria-label={ariaLabel || 'Side navigation'}
        {...restProps}
      >
        <SideNavContext.Provider value={contextValue}>
          {header && (
            <div className={styles.header} data-collapsed={collapsed || undefined}>
              {header}
            </div>
          )}

          <div className={styles.content}>{children}</div>

          {footer && (
            <div className={styles.footer} data-collapsed={collapsed || undefined}>
              {footer}
            </div>
          )}
        </SideNavContext.Provider>
      </nav>
    );
  }
);

SideNav.displayName = 'SideNav';

export default SideNav;
