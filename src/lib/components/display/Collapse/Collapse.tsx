/**
 * Collapse component - Smooth expand/collapse animation wrapper
 */

import { useState, useEffect, useRef, type ReactNode } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './Collapse.module.scss';

export interface CollapseProps extends BaseComponentProps {
  /**
   * Whether the content is expanded
   * @default false
   */
  isOpen?: boolean;

  /**
   * Content to show/hide
   */
  children: ReactNode;

  /**
   * Animation duration in milliseconds
   * @default 250
   */
  duration?: number;

  /**
   * Easing function for animation
   * @default 'ease-in-out'
   */
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;

  /**
   * Callback when expand animation starts
   */
  onExpandStart?: () => void;

  /**
   * Callback when expand animation ends
   */
  onExpandEnd?: () => void;

  /**
   * Callback when collapse animation starts
   */
  onCollapseStart?: () => void;

  /**
   * Callback when collapse animation ends
   */
  onCollapseEnd?: () => void;

  /**
   * Whether to unmount children when collapsed
   * @default false
   */
  unmountOnCollapse?: boolean;
}

/**
 * Collapse component
 * A container that provides smooth expand/collapse animation for its children
 *
 * @example
 * ```tsx
 * <Collapse isOpen={isExpanded}>
 *   <div>Content to show/hide</div>
 * </Collapse>
 * ```
 */
export const Collapse = ({
  ref,
  isOpen = false,
  children,
  duration = 250,
  easing = 'ease-in-out',
  onExpandStart,
  onExpandEnd,
  onCollapseStart,
  onCollapseEnd,
  unmountOnCollapse = false,
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  ...restProps
}: CollapseProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Separate state for visual open - allows content to mount in collapsed state first
  const [visuallyOpen, setVisuallyOpen] = useState(isOpen && !unmountOnCollapse);
  const isFirstRender = useRef(true);
  const prevIsOpen = useRef(isOpen);

  // When opening with unmountOnCollapse, first render content then animate
  useEffect(() => {
    if (isOpen && !shouldRender) {
      setShouldRender(true);
    }
  }, [isOpen, shouldRender]);

  // Handle the visual state transition with a frame delay for animation
  useEffect(() => {
    if (shouldRender && isOpen && !visuallyOpen) {
      // Use requestAnimationFrame to ensure DOM has updated before triggering animation
      const frameId = requestAnimationFrame(() => {
        setVisuallyOpen(true);
      });
      return () => cancelAnimationFrame(frameId);
    } else if (!isOpen && visuallyOpen) {
      setVisuallyOpen(false);
    }
  }, [isOpen, shouldRender, visuallyOpen]);

  // Handle animation callbacks and unmounting
  useEffect(() => {
    // Skip callbacks on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevIsOpen.current = isOpen;
      return;
    }

    // Only fire callbacks when state actually changes
    if (prevIsOpen.current === isOpen) {
      return;
    }

    prevIsOpen.current = isOpen;

    if (isOpen) {
      onExpandStart?.();
      const timer = setTimeout(() => {
        onExpandEnd?.();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      onCollapseStart?.();
      const timer = setTimeout(() => {
        onCollapseEnd?.();
        if (unmountOnCollapse) {
          setShouldRender(false);
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    duration,
    onExpandStart,
    onExpandEnd,
    onCollapseStart,
    onCollapseEnd,
    unmountOnCollapse,
  ]);

  const classes = [styles.collapse, className].filter(Boolean).join(' ');

  const cssVariables = {
    '--collapse-duration': `${duration}ms`,
    '--collapse-easing': easing,
    ...style,
  } as React.CSSProperties;

  // Don't render if unmountOnCollapse is true and we shouldn't render
  if (unmountOnCollapse && !shouldRender) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={classes}
      data-open={visuallyOpen || undefined}
      data-component="collapse"
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={!isOpen}
      style={cssVariables}
      {...restProps}
    >
      <div className={styles.collapseInner}>{children}</div>
    </div>
  );
};

export default Collapse;
