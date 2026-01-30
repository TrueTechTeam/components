import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  Children,
  isValidElement,
  cloneElement,
} from 'react';
import { useResizeObserver } from '../../../hooks';
import { PanesContext, type PaneConfig } from './PanesContext';
import type { PaneProps, PaneInternalProps } from './Pane';
import type { BaseComponentProps } from '../../../types';
import styles from './Panes.module.scss';

/**
 * Props for the Panes container component
 */
export interface PanesProps extends BaseComponentProps {
  /**
   * Gap between panes in pixels
   * @default 16
   */
  gap?: number;

  /**
   * Animation duration for pane transitions (ms)
   * @default 250
   */
  animationDuration?: number;

  /**
   * Animation easing function
   * @default 'ease-in-out'
   */
  animationEasing?: string;

  /**
   * Minimum container width to show any panes
   * @default 200
   */
  minContainerWidth?: number;

  /**
   * Callback when visible panes change
   * @param visibleIds - Array of visible pane IDs
   * @param visibleIndices - Array of visible pane indices
   */
  onVisiblePanesChange?: (visibleIds: string[], visibleIndices: number[]) => void;

  /**
   * Callback when a pane is hidden due to space constraints
   * @param id - The ID of the hidden pane
   * @param index - The index of the hidden pane
   */
  onPaneHidden?: (id: string, index: number) => void;

  /**
   * Pane children
   */
  children: React.ReactNode;
}

/**
 * Calculate which panes should be visible based on available width
 */
function calculateVisiblePanes(
  containerWidth: number,
  paneConfigs: Map<string, PaneConfig>,
  gap: number
): string[] {
  if (containerWidth <= 0 || paneConfigs.size === 0) {
    return [];
  }

  // Convert panes to array with priority
  // Higher priority = shown first when space is limited
  const panesWithPriority = Array.from(paneConfigs.entries())
    .map(([id, config]) => ({
      id,
      config,
    }))
    .sort((a, b) => b.config.priority - a.config.priority);

  // Greedily add panes until we run out of space
  let usedWidth = 0;
  const visible: string[] = [];

  for (const pane of panesWithPriority) {
    const paneMinWidth = pane.config.minWidth;
    const gapWidth = visible.length > 0 ? gap : 0;

    if (usedWidth + paneMinWidth + gapWidth <= containerWidth) {
      visible.push(pane.id);
      usedWidth += paneMinWidth + gapWidth;
    }
  }

  // Sort by original index for consistent rendering order
  return visible.sort((a, b) => {
    const aConfig = paneConfigs.get(a);
    const bConfig = paneConfigs.get(b);
    return (aConfig?.index ?? 0) - (bConfig?.index ?? 0);
  });
}

/**
 * Panes - A container that manages responsive pane visibility
 *
 * @example
 * Basic usage:
 * ```tsx
 * <Panes gap={16}>
 *   <Pane minWidth={200}>Sidebar</Pane>
 *   <Pane minWidth={400} grow={2}>Main Content</Pane>
 *   <Pane minWidth={200}>Details</Pane>
 * </Panes>
 * ```
 *
 * @example
 * With callbacks:
 * ```tsx
 * <Panes
 *   onVisiblePanesChange={(ids, indices) => {
 *     console.log('Visible panes:', ids);
 *   }}
 *   onPaneHidden={(id, index) => {
 *     console.log('Pane hidden:', id, 'at index', index);
 *   }}
 * >
 *   <Pane minWidth={200}>First</Pane>
 *   <Pane minWidth={300}>Second</Pane>
 *   <Pane minWidth={200}>Third (highest priority)</Pane>
 * </Panes>
 * ```
 */
export const Panes = forwardRef<HTMLDivElement, PanesProps>(
  (
    {
      gap = 16,
      animationDuration = 250,
      animationEasing = 'ease-in-out',
      minContainerWidth = 200,
      onVisiblePanesChange,
      onPaneHidden,
      children,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    // Track registered panes
    const [paneConfigs, setPaneConfigs] = useState<Map<string, PaneConfig>>(new Map());

    // Track visibility states
    const [visiblePanes, setVisiblePanes] = useState<Set<string>>(new Set());
    const [enteringPanes, setEnteringPanes] = useState<Set<string>>(new Set());
    const [exitingPanes, setExitingPanes] = useState<Set<string>>(new Set());

    // Refs for callbacks
    const onVisiblePanesChangeRef = useRef(onVisiblePanesChange);
    const onPaneHiddenRef = useRef(onPaneHidden);

    useEffect(() => {
      onVisiblePanesChangeRef.current = onVisiblePanesChange;
      onPaneHiddenRef.current = onPaneHidden;
    }, [onVisiblePanesChange, onPaneHidden]);

    // Track animation timeouts
    const animationTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    // Container size tracking
    const { ref: containerRef, width: containerWidth } = useResizeObserver();

    // Combined ref
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

    // Pane registration functions
    const registerPane = useCallback((config: PaneConfig) => {
      setPaneConfigs((prev) => {
        const next = new Map(prev);
        next.set(config.id, config);
        return next;
      });
    }, []);

    const unregisterPane = useCallback((id: string) => {
      setPaneConfigs((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });

      // Clean up any pending animation timeouts
      const timeout = animationTimeoutsRef.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        animationTimeoutsRef.current.delete(id);
      }

      // Remove from all state sets
      setVisiblePanes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setEnteringPanes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setExitingPanes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, []);

    const updatePane = useCallback((id: string, updates: Partial<PaneConfig>) => {
      setPaneConfigs((prev) => {
        const existing = prev.get(id);
        if (!existing) {
          return prev;
        }
        const next = new Map(prev);
        next.set(id, { ...existing, ...updates });
        return next;
      });
    }, []);

    // Track the target visible panes (what should be visible based on current width)
    const targetVisibleRef = useRef<Set<string>>(new Set());

    // Calculate which panes should be visible
    useEffect(() => {
      // Clear all pending timeouts when recalculating - this prevents stale state
      animationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      animationTimeoutsRef.current.clear();

      if (containerWidth < minContainerWidth) {
        // Hide all panes if container is too small
        targetVisibleRef.current = new Set();

        setVisiblePanes((currentVisible) => {
          if (currentVisible.size > 0) {
            // Start exit animations for all visible panes
            setExitingPanes(new Set(currentVisible));
            setEnteringPanes(new Set());

            currentVisible.forEach((id) => {
              const timeout = setTimeout(() => {
                setVisiblePanes((prev) => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
                setExitingPanes((prev) => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
                animationTimeoutsRef.current.delete(id);
              }, animationDuration);

              animationTimeoutsRef.current.set(id, timeout);
            });
          }
          return currentVisible;
        });
        return;
      }

      const newVisibleIds = calculateVisiblePanes(containerWidth, paneConfigs, gap);
      const newVisibleSet = new Set(newVisibleIds);
      targetVisibleRef.current = newVisibleSet;

      setVisiblePanes((currentVisible) => {
        // Find panes that are entering (newly visible)
        const entering = newVisibleIds.filter((id) => !currentVisible.has(id));

        // Find panes that are exiting (no longer visible) - exclude those already exiting
        const exiting = Array.from(currentVisible).filter((id) => !newVisibleSet.has(id));

        // Notify about hidden panes
        exiting.forEach((id) => {
          const config = paneConfigs.get(id);
          if (config) {
            onPaneHiddenRef.current?.(id, config.index);
          }
        });

        // Start entering animations
        if (entering.length > 0) {
          setEnteringPanes((prev) => {
            const next = new Set(prev);
            entering.forEach((id) => next.add(id));
            return next;
          });

          // Remove entering state after animation
          entering.forEach((id) => {
            // Use requestAnimationFrame to ensure the entering class is applied before removing
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setEnteringPanes((prev) => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
              });
            });
          });
        }

        // Start exiting animations
        if (exiting.length > 0) {
          setExitingPanes((prev) => {
            const next = new Set(prev);
            exiting.forEach((id) => next.add(id));
            return next;
          });

          // Remove from visible after animation completes
          exiting.forEach((id) => {
            const timeout = setTimeout(() => {
              setVisiblePanes((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
              setExitingPanes((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
              animationTimeoutsRef.current.delete(id);
            }, animationDuration);

            animationTimeoutsRef.current.set(id, timeout);
          });
        }

        // Notify about visible panes change
        if (entering.length > 0 || exiting.length > 0) {
          const finalIndices = newVisibleIds.map((id) => paneConfigs.get(id)?.index ?? 0);
          onVisiblePanesChangeRef.current?.(newVisibleIds, finalIndices);
        }

        // Return updated visible set (add entering panes immediately)
        if (entering.length > 0) {
          const next = new Set(currentVisible);
          entering.forEach((id) => next.add(id));
          return next;
        }
        return currentVisible;
      });
    }, [containerWidth, paneConfigs, gap, minContainerWidth, animationDuration]);

    // Clean up timeouts on unmount
    useEffect(() => {
      return () => {
        animationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        animationTimeoutsRef.current.clear();
      };
    }, []);

    // Context value
    const contextValue = useMemo(
      () => ({
        registerPane,
        unregisterPane,
        updatePane,
        visiblePanes,
        enteringPanes,
        exitingPanes,
        animationDuration,
        animationEasing,
        gap,
      }),
      [
        registerPane,
        unregisterPane,
        updatePane,
        visiblePanes,
        enteringPanes,
        exitingPanes,
        animationDuration,
        animationEasing,
        gap,
      ]
    );

    // Clone children to inject index
    const childrenWithIndex = Children.map(children, (child, index) => {
      if (isValidElement<PaneProps & PaneInternalProps>(child)) {
        return cloneElement(child, { _index: index });
      }
      return child;
    });

    const componentClasses = [styles.panes, className].filter(Boolean).join(' ');

    const cssVariables = {
      '--panes-gap': `${gap}px`,
      '--panes-animation-duration': `${animationDuration}ms`,
      '--panes-animation-easing': animationEasing,
      ...style,
    } as React.CSSProperties;

    return (
      <PanesContext.Provider value={contextValue}>
        <div
          ref={setRefs}
          className={componentClasses}
          style={cssVariables}
          data-component="panes"
          data-testid={testId}
          aria-label={ariaLabel}
          role="group"
          {...restProps}
        >
          {childrenWithIndex}
        </div>
      </PanesContext.Provider>
    );
  }
);

Panes.displayName = 'Panes';

export default Panes;
