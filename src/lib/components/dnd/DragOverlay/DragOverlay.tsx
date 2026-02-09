/**
 * DragOverlay component - Visual overlay that follows cursor during drag
 */

import React, { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDndContext } from '../DndProvider';
import type { BaseComponentProps } from '../../../types/component.types';
import styles from './DragOverlay.module.scss';

export interface DragOverlayProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Content to render in the overlay
   * Can be a render function that receives the active drag data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode | ((activeId: string, activeData: Record<string, any>) => ReactNode);

  /**
   * Whether to adjust position with scroll
   * @default true
   */
  adjustScale?: boolean;

  /**
   * Drop animation duration in ms (0 to disable)
   * @default 200
   */
  dropAnimationDuration?: number;

  /**
   * Z-index for the overlay
   * @default 9999
   */
  zIndex?: number;
}

/**
 * DragOverlay component that renders a visual clone during drag operations
 *
 * @example
 * ```tsx
 * <DndProvider>
 *   <SortableList items={items} />
 *   <DragOverlay>
 *     {(activeId, data) => <Card>{data.title}</Card>}
 *   </DragOverlay>
 * </DndProvider>
 * ```
 */
export const DragOverlay: React.FC<DragOverlayProps> = ({
  children,
  adjustScale = true,
  dropAnimationDuration = 200,
  zIndex = 9999,
  className,
  'data-testid': dataTestId,
  style,
}) => {
  const { active } = useDndContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Track mouse position
  useEffect(() => {
    if (!active) {
      setIsAnimating(false);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('dragover', handleDragOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('dragover', handleDragOver);
    };
  }, [active]);

  // Handle drop animation
  useEffect(() => {
    if (!active && dropAnimationDuration > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, dropAnimationDuration);
      return () => clearTimeout(timer);
    }
  }, [active, dropAnimationDuration]);

  // Don't render if nothing is being dragged
  if (!active && !isAnimating) {
    return null;
  }

  // Render children
  const renderContent = () => {
    if (!active) {
      return null;
    }

    if (typeof children === 'function') {
      return children(active.id, active.data);
    }

    // If no children provided, try to clone the dragged element
    if (!children && active.element) {
      return (
        <div
          className={styles.clonedElement}
          dangerouslySetInnerHTML={{ __html: active.element.outerHTML }}
        />
      );
    }

    return children;
  };

  const overlayStyle: React.CSSProperties = {
    ...style,
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -50%)',
    zIndex,
    pointerEvents: 'none',
    ...(adjustScale && {
      transition: isAnimating ? `all ${dropAnimationDuration}ms ease` : undefined,
    }),
  };

  const containerClasses = [styles.dragOverlay, className].filter(Boolean).join(' ');

  const content = (
    <div
      className={containerClasses}
      style={overlayStyle}
      data-testid={dataTestId}
      data-animating={isAnimating || undefined}
      aria-hidden="true"
    >
      {renderContent()}
    </div>
  );

  // Render in a portal to avoid z-index issues
  return createPortal(content, document.body);
};

export default DragOverlay;
