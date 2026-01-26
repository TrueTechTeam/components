import React, { forwardRef, useState, useCallback, useEffect, useRef } from 'react';
import { useResizeObserver } from '../../../hooks';
import type { BaseComponentProps } from '../../../types';
import styles from './CollapsibleSidebar.module.scss';

/**
 * Props for the CollapsibleSidebar component
 */
export interface CollapsibleSidebarProps extends BaseComponentProps {
  /**
   * Controlled collapsed state
   */
  collapsed?: boolean;

  /**
   * Default collapsed state (uncontrolled)
   * @default false
   */
  defaultCollapsed?: boolean;

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
   * Auto-collapse below this container width (px)
   * Uses parent container width, not viewport
   */
  collapseBreakpoint?: number;

  /**
   * Auto-hide below this container width (px)
   * Uses parent container width, not viewport
   */
  hideBreakpoint?: number;

  /**
   * Position of the sidebar
   * @default 'left'
   */
  position?: 'left' | 'right';

  /**
   * Callback when collapsed state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Callback when hidden state changes (due to hideBreakpoint)
   */
  onHiddenChange?: (hidden: boolean) => void;

  /**
   * Animation duration (ms)
   * @default 250
   */
  animationDuration?: number;

  /**
   * Animation easing
   * @default 'ease-in-out'
   */
  animationEasing?: string;

  /**
   * Header content (always visible, above scrollable content)
   */
  header?: React.ReactNode;

  /**
   * Footer content (always visible, below scrollable content)
   */
  footer?: React.ReactNode;

  /**
   * Main content of the sidebar
   */
  children: React.ReactNode;
}

/**
 * CollapsibleSidebar - A sidebar that collapses based on container width or user interaction
 *
 * @example
 * Basic usage:
 * ```tsx
 * <CollapsibleSidebar
 *   header={<Logo />}
 *   footer={<UserProfile />}
 * >
 *   <NavItem icon={<HomeIcon />}>Home</NavItem>
 *   <NavItem icon={<SettingsIcon />}>Settings</NavItem>
 * </CollapsibleSidebar>
 * ```
 *
 * @example
 * Controlled collapsed state:
 * ```tsx
 * const [collapsed, setCollapsed] = useState(false);
 *
 * <CollapsibleSidebar
 *   collapsed={collapsed}
 *   onCollapsedChange={setCollapsed}
 *   collapseBreakpoint={768}
 * >
 *   {navItems}
 * </CollapsibleSidebar>
 * ```
 *
 * @example
 * Auto-hide on small screens:
 * ```tsx
 * <CollapsibleSidebar
 *   collapseBreakpoint={1024}
 *   hideBreakpoint={768}
 * >
 *   {navItems}
 * </CollapsibleSidebar>
 * ```
 */
export const CollapsibleSidebar = forwardRef<HTMLDivElement, CollapsibleSidebarProps>(
  (
    {
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      expandedWidth = 240,
      collapsedWidth = 64,
      collapseBreakpoint,
      hideBreakpoint,
      position = 'left',
      onCollapsedChange,
      onHiddenChange,
      animationDuration = 250,
      animationEasing = 'ease-in-out',
      header,
      footer,
      children,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const isControlled = controlledCollapsed !== undefined;
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const [isHidden, setIsHidden] = useState(false);
    const [autoCollapsed, setAutoCollapsed] = useState(false);

    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

    const onCollapsedChangeRef = useRef(onCollapsedChange);
    const onHiddenChangeRef = useRef(onHiddenChange);

    useEffect(() => {
      onCollapsedChangeRef.current = onCollapsedChange;
      onHiddenChangeRef.current = onHiddenChange;
    }, [onCollapsedChange, onHiddenChange]);

    // Track parent container width
    const { ref: parentRef, width: parentWidth } = useResizeObserver();

    // Combine refs - we need to observe the parent, not the sidebar itself
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Set up parent observation
    useEffect(() => {
      const sidebar = wrapperRef.current;
      if (!sidebar) {
        return;
      }

      const parent = sidebar.parentElement;
      if (parent) {
        parentRef(parent as HTMLElement);
      }

      return () => {
        parentRef(null);
      };
    }, [parentRef]);

    // Handle auto-collapse and auto-hide based on parent width
    useEffect(() => {
      if (parentWidth <= 0) {
        return;
      }

      // Check hide breakpoint first
      if (hideBreakpoint !== undefined && parentWidth < hideBreakpoint) {
        if (!isHidden) {
          setIsHidden(true);
          onHiddenChangeRef.current?.(true);
        }
        return;
      } else if (isHidden) {
        setIsHidden(false);
        onHiddenChangeRef.current?.(false);
      }

      // Check collapse breakpoint
      if (collapseBreakpoint !== undefined) {
        const shouldAutoCollapse = parentWidth < collapseBreakpoint;

        if (shouldAutoCollapse !== autoCollapsed) {
          setAutoCollapsed(shouldAutoCollapse);

          if (!isControlled) {
            setInternalCollapsed(shouldAutoCollapse);
            onCollapsedChangeRef.current?.(shouldAutoCollapse);
          } else {
            // Notify even in controlled mode so parent can decide
            onCollapsedChangeRef.current?.(shouldAutoCollapse);
          }
        }
      }
    }, [parentWidth, collapseBreakpoint, hideBreakpoint, autoCollapsed, isHidden, isControlled]);

    // Toggle function for manual collapse
    const toggle = useCallback(() => {
      const newCollapsed = !collapsed;

      if (!isControlled) {
        setInternalCollapsed(newCollapsed);
      }
      onCollapsedChangeRef.current?.(newCollapsed);
    }, [collapsed, isControlled]);

    const componentClasses = [styles.collapsibleSidebar, className].filter(Boolean).join(' ');

    const currentWidth = collapsed ? collapsedWidth : expandedWidth;

    const cssVariables = {
      '--sidebar-width': `${currentWidth}px`,
      '--sidebar-expanded-width': `${expandedWidth}px`,
      '--sidebar-collapsed-width': `${collapsedWidth}px`,
      '--sidebar-animation-duration': `${animationDuration}ms`,
      '--sidebar-animation-easing': animationEasing,
      ...style,
    } as React.CSSProperties;

    // Combine refs for the sidebar element
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    if (isHidden) {
      return null;
    }

    return (
      <div
        ref={setRefs}
        className={componentClasses}
        style={cssVariables}
        data-component="collapsible-sidebar"
        data-collapsed={collapsed || undefined}
        data-position={position}
        data-testid={testId}
        aria-label={ariaLabel || 'Sidebar navigation'}
        aria-expanded={!collapsed}
        role="navigation"
        {...restProps}
      >
        {header && (
          <div className={styles.header} data-collapsed={collapsed || undefined}>
            {header}
          </div>
        )}

        <div className={styles.content} data-collapsed={collapsed || undefined}>
          {children}
        </div>

        {footer && (
          <div className={styles.footer} data-collapsed={collapsed || undefined}>
            {footer}
          </div>
        )}

        <button
          type="button"
          className={styles.toggleButton}
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          data-position={position}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={styles.toggleIcon}
            data-collapsed={collapsed || undefined}
            data-position={position}
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  }
);

CollapsibleSidebar.displayName = 'CollapsibleSidebar';

export default CollapsibleSidebar;
