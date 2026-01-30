import React, { forwardRef, useCallback, useMemo, useEffect, useRef } from 'react';
import { useResizeObserver } from '../../../hooks';
import type { BaseComponentProps } from '../../../types';
import styles from './ResponsiveStack.module.scss';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type FlexJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

/**
 * Props for the ResponsiveStack component
 */
export interface ResponsiveStackProps extends BaseComponentProps {
  /**
   * Breakpoint width to switch from horizontal to vertical layout (px)
   * @default 768
   */
  breakpoint?: number;

  /**
   * Direction when at/above breakpoint
   * @default 'row'
   */
  direction?: FlexDirection;

  /**
   * Direction when below breakpoint
   * @default 'column'
   */
  collapseDirection?: FlexDirection;

  /**
   * Gap between items (px)
   * @default 16
   */
  gap?: number;

  /**
   * Gap when collapsed (defaults to gap)
   */
  collapseGap?: number;

  /**
   * Item alignment
   * @default 'stretch'
   */
  align?: FlexAlign;

  /**
   * Alignment when collapsed (defaults to align)
   */
  collapseAlign?: FlexAlign;

  /**
   * Content justification
   * @default 'start'
   */
  justify?: FlexJustify;

  /**
   * Justification when collapsed (defaults to justify)
   */
  collapseJustify?: FlexJustify;

  /**
   * Whether items should wrap
   * @default false
   */
  wrap?: boolean;

  /**
   * Callback when layout direction changes
   * @param isCollapsed - Whether the layout is in collapsed state
   * @param direction - Current direction
   */
  onLayoutChange?: (isCollapsed: boolean, direction: FlexDirection) => void;

  /**
   * Content to render
   */
  children: React.ReactNode;
}

/**
 * ResponsiveStack - A flex container that switches direction based on container width
 *
 * @example
 * Basic usage (row -> column on narrow screens):
 * ```tsx
 * <ResponsiveStack breakpoint={600}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ResponsiveStack>
 * ```
 *
 * @example
 * Custom alignment:
 * ```tsx
 * <ResponsiveStack
 *   breakpoint={768}
 *   align="center"
 *   justify="space-between"
 *   collapseAlign="stretch"
 *   collapseJustify="start"
 *   gap={24}
 *   collapseGap={16}
 * >
 *   <Button>Save</Button>
 *   <Button>Cancel</Button>
 * </ResponsiveStack>
 * ```
 */
export const ResponsiveStack = forwardRef<HTMLDivElement, ResponsiveStackProps>(
  (
    {
      breakpoint = 768,
      direction = 'row',
      collapseDirection = 'column',
      gap = 16,
      collapseGap,
      align = 'stretch',
      collapseAlign,
      justify = 'start',
      collapseJustify,
      wrap = false,
      onLayoutChange,
      children,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const onLayoutChangeRef = useRef(onLayoutChange);
    useEffect(() => {
      onLayoutChangeRef.current = onLayoutChange;
    }, [onLayoutChange]);

    const { ref: containerRef, width } = useResizeObserver();

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [containerRef, ref]
    );

    const isCollapsed = width > 0 && width < breakpoint;
    const currentDirection = isCollapsed ? collapseDirection : direction;
    const currentGap = isCollapsed ? (collapseGap ?? gap) : gap;
    const currentAlign = isCollapsed ? (collapseAlign ?? align) : align;
    const currentJustify = isCollapsed ? (collapseJustify ?? justify) : justify;

    // Track previous collapsed state to trigger callback
    const prevCollapsedRef = useRef<boolean | null>(null);
    useEffect(() => {
      if (width > 0 && prevCollapsedRef.current !== isCollapsed) {
        prevCollapsedRef.current = isCollapsed;
        onLayoutChangeRef.current?.(isCollapsed, currentDirection);
      }
    }, [isCollapsed, currentDirection, width]);

    const componentClasses = [styles.responsiveStack, className].filter(Boolean).join(' ');

    const cssVariables = useMemo(
      () =>
        ({
          '--stack-direction': currentDirection,
          '--stack-gap': `${currentGap}px`,
          '--stack-align':
            currentAlign === 'start' || currentAlign === 'end'
              ? `flex-${currentAlign}`
              : currentAlign,
          '--stack-justify':
            currentJustify === 'start' || currentJustify === 'end'
              ? `flex-${currentJustify}`
              : currentJustify,
          '--stack-wrap': wrap ? 'wrap' : 'nowrap',
          ...style,
        }) as React.CSSProperties,
      [currentDirection, currentGap, currentAlign, currentJustify, wrap, style]
    );

    return (
      <div
        ref={setRefs}
        className={componentClasses}
        style={cssVariables}
        data-component="responsive-stack"
        data-direction={currentDirection}
        data-collapsed={isCollapsed || undefined}
        data-testid={testId}
        aria-label={ariaLabel}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

ResponsiveStack.displayName = 'ResponsiveStack';

export default ResponsiveStack;
