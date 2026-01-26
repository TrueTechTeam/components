import React, { forwardRef, useEffect, useId, useMemo } from 'react';
import { usePanesContext } from './PanesContext';
import type { BaseComponentProps } from '../../../types';
import styles from './Panes.module.scss';

/**
 * Props for the Pane component
 */
export interface PaneProps extends BaseComponentProps {
  /**
   * Minimum width of the pane in pixels
   * @default 200
   */
  minWidth?: number;

  /**
   * Maximum width of the pane in pixels
   */
  maxWidth?: number;

  /**
   * Preferred width of the pane (flex-basis)
   * Can be pixels, percentage, or 'auto'
   * @default 'auto'
   */
  preferredWidth?: number | string;

  /**
   * Flex grow factor
   * @default 1
   */
  grow?: number;

  /**
   * Flex shrink factor
   * @default 1
   */
  shrink?: number;

  /**
   * Priority for visibility (higher = shown first when space is limited)
   * By default, uses the index (later children = higher priority)
   */
  priority?: number;

  /**
   * Unique identifier for the pane
   */
  id?: string;

  /**
   * Content of the pane
   */
  children: React.ReactNode;
}

/**
 * Internal props passed from Panes to Pane
 */
export interface PaneInternalProps {
  /** Index of this pane within Panes children */
  _index?: number;
}

/**
 * Pane - A child component of Panes that represents a single pane
 *
 * @example
 * ```tsx
 * <Panes>
 *   <Pane minWidth={200} maxWidth={400}>
 *     Left sidebar
 *   </Pane>
 *   <Pane minWidth={400} grow={2}>
 *     Main content
 *   </Pane>
 *   <Pane minWidth={200}>
 *     Right sidebar
 *   </Pane>
 * </Panes>
 * ```
 */
export const Pane = forwardRef<HTMLDivElement, PaneProps & PaneInternalProps>(
  (
    {
      minWidth = 200,
      maxWidth,
      preferredWidth = 'auto',
      grow = 1,
      shrink = 1,
      priority,
      id: providedId,
      children,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      _index = 0,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    const {
      registerPane,
      unregisterPane,
      updatePane,
      visiblePanes,
      enteringPanes,
      exitingPanes,
      animationDuration,
      animationEasing,
      gap,
    } = usePanesContext();

    // Calculate effective priority (higher index = higher priority by default)
    const effectivePriority = priority ?? _index;

    // Register/unregister pane
    useEffect(() => {
      registerPane({
        id,
        minWidth,
        maxWidth,
        preferredWidth,
        grow,
        shrink,
        priority: effectivePriority,
        index: _index,
      });

      return () => {
        unregisterPane(id);
      };
    }, [id, registerPane, unregisterPane]);

    // Update pane config when props change
    useEffect(() => {
      updatePane(id, {
        minWidth,
        maxWidth,
        preferredWidth,
        grow,
        shrink,
        priority: effectivePriority,
        index: _index,
      });
    }, [id, minWidth, maxWidth, preferredWidth, grow, shrink, effectivePriority, _index, updatePane]);

    const isVisible = visiblePanes.has(id);
    const isEntering = enteringPanes.has(id);
    const isExiting = exitingPanes.has(id);

    const componentClasses = [styles.pane, className].filter(Boolean).join(' ');

    // useMemo must be called before any early returns to comply with React's Rules of Hooks
    const cssVariables = useMemo(
      () =>
        ({
          '--pane-min-width': typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
          '--pane-max-width': maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : 'none',
          '--pane-preferred-width':
            typeof preferredWidth === 'number' ? `${preferredWidth}px` : preferredWidth,
          '--pane-grow': grow,
          '--pane-shrink': shrink,
          '--pane-animation-duration': `${animationDuration}ms`,
          '--pane-animation-easing': animationEasing,
          ...style,
        }) as React.CSSProperties,
      [minWidth, maxWidth, preferredWidth, grow, shrink, animationDuration, animationEasing, style]
    );

    // Don't render if not visible and not animating
    if (!isVisible && !isEntering && !isExiting) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={componentClasses}
        style={cssVariables}
        data-component="pane"
        data-pane-id={id}
        data-visible={isVisible || undefined}
        data-entering={isEntering || undefined}
        data-exiting={isExiting || undefined}
        data-testid={testId}
        aria-label={ariaLabel}
        aria-hidden={!isVisible && !isEntering}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

Pane.displayName = 'Pane';

export default Pane;
