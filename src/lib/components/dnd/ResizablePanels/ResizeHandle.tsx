/**
 * ResizeHandle component - Draggable divider between panels
 */

import React, { useCallback, useRef, useEffect, useState } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { useResizablePanelsContext } from './ResizablePanelsContext';
import styles from './ResizablePanels.module.scss';

export interface ResizeHandleProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Visual style
   * @default 'line'
   */
  variant?: 'line' | 'dots' | 'hidden';

  /**
   * Whether to show on hover only
   * @default false
   */
  showOnHover?: boolean;
}

/**
 * ResizeHandle component for use within ResizablePanels
 *
 * @example
 * ```tsx
 * <ResizablePanels>
 *   <ResizablePanel>Content 1</ResizablePanel>
 *   <ResizeHandle variant="dots" />
 *   <ResizablePanel>Content 2</ResizablePanel>
 * </ResizablePanels>
 * ```
 */
export const ResizeHandle = ({
  ref,
  variant = 'line',
  showOnHover = false,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
}: ResizeHandleProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const context = useResizablePanelsContext();
  const [handleIndex, setHandleIndex] = useState<number>(-1);
  const handleIndexRef = useRef<number>(-1);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSizesRef = useRef<number[]>([]);

  // Track handle index based on position in DOM
  useEffect(() => {
    if (nodeRef.current) {
      const parent = nodeRef.current.parentElement;
      if (parent) {
        const handles = parent.querySelectorAll('[data-resize-handle]');
        const index = Array.from(handles).indexOf(nodeRef.current);
        handleIndexRef.current = index;
        if (index !== handleIndex) {
          setHandleIndex(index);
        }
      }
    }
  }, [handleIndex]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      startPosRef.current = { x: event.clientX, y: event.clientY };
      startSizesRef.current = [...context.sizes];
      context.startResize(handleIndexRef.current);

      const handleMouseMove = (e: MouseEvent) => {
        const parent = nodeRef.current?.parentElement;
        if (!parent) {
          return;
        }

        const rect = parent.getBoundingClientRect();
        const delta =
          context.direction === 'horizontal'
            ? e.clientX - startPosRef.current.x
            : e.clientY - startPosRef.current.y;

        const containerSize = context.direction === 'horizontal' ? rect.width : rect.height;
        const deltaPercent = (delta / containerSize) * 100;

        const handleIndex = handleIndexRef.current;
        const leftPanelIndex = handleIndex;
        const rightPanelIndex = handleIndex + 1;

        if (leftPanelIndex < 0 || rightPanelIndex >= startSizesRef.current.length) {
          return;
        }

        const leftConfig = context.getPanelConfig(leftPanelIndex);
        const rightConfig = context.getPanelConfig(rightPanelIndex);

        let newLeftSize = startSizesRef.current[leftPanelIndex] + deltaPercent;

        // Apply constraints
        if (leftConfig) {
          newLeftSize = Math.max(leftConfig.minSize, Math.min(leftConfig.maxSize, newLeftSize));
        }

        // Recalculate based on constraints
        const totalSize =
          startSizesRef.current[leftPanelIndex] + startSizesRef.current[rightPanelIndex];
        const actualLeftSize = Math.min(newLeftSize, totalSize - (rightConfig?.minSize ?? 10));
        const actualRightSize = totalSize - actualLeftSize;

        const newSizes = [...startSizesRef.current];
        newSizes[leftPanelIndex] = actualLeftSize;
        newSizes[rightPanelIndex] = actualRightSize;

        context.setSizes(newSizes);
      };

      const handleMouseUp = () => {
        context.stopResize();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [context]
  );

  // Keyboard support
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const step = event.shiftKey ? 10 : 2; // Larger steps with shift

      if (
        (context.direction === 'horizontal' &&
          (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) ||
        (context.direction === 'vertical' && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
      ) {
        event.preventDefault();

        const handleIndex = handleIndexRef.current;
        const leftPanelIndex = handleIndex;
        const rightPanelIndex = handleIndex + 1;

        if (leftPanelIndex < 0 || rightPanelIndex >= context.sizes.length) {
          return;
        }

        const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
        const deltaPercent = step * direction;

        const leftConfig = context.getPanelConfig(leftPanelIndex);
        const rightConfig = context.getPanelConfig(rightPanelIndex);

        let newLeftSize = context.sizes[leftPanelIndex] + deltaPercent;

        // Apply constraints
        if (leftConfig) {
          newLeftSize = Math.max(leftConfig.minSize, Math.min(leftConfig.maxSize, newLeftSize));
        }

        const totalSize = context.sizes[leftPanelIndex] + context.sizes[rightPanelIndex];
        const actualLeftSize = Math.min(newLeftSize, totalSize - (rightConfig?.minSize ?? 10));
        const actualRightSize = totalSize - actualLeftSize;

        const newSizes = [...context.sizes];
        newSizes[leftPanelIndex] = actualLeftSize;
        newSizes[rightPanelIndex] = actualRightSize;

        context.setSizes(newSizes);
      }
    },
    [context]
  );

  // Combine refs
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref]
  );

  const containerClasses = [styles.resizeHandle, className].filter(Boolean).join(' ');
  const isActive = context.activeHandle === handleIndex;

  return (
    <div
      ref={combinedRef}
      className={containerClasses}
      style={style}
      data-testid={dataTestId}
      data-resize-handle
      data-variant={variant}
      data-direction={context.direction}
      data-active={isActive || undefined}
      data-show-on-hover={showOnHover || undefined}
      role="slider"
      aria-orientation={context.direction === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-label={ariaLabel || 'Resize handle'}
      aria-valuenow={context.sizes[handleIndex] ?? 50}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    >
      {variant === 'dots' && (
        <span className={styles.handleDots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
      )}
      {variant === 'line' && <span className={styles.handleLine} />}
    </div>
  );
};

export default ResizeHandle;
