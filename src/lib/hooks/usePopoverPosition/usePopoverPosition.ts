/**
 * Hook for calculating and managing popover position
 */

import { useRef, useState, useEffect, type CSSProperties, type RefObject } from 'react';
import {
  calculatePopoverPosition,
  getElementBounds,
  getViewportSize,
  type PopoverPosition,
  type PopoverWidth,
} from '../../utils';

/**
 * Options for popover positioning
 */
export interface UsePopoverPositionOptions {
  /**
   * Whether the popover is open
   */
  isOpen: boolean;

  /**
   * Preferred position for the popover
   * @default 'bottom'
   */
  position?: PopoverPosition;

  /**
   * Gap between trigger and popover in pixels
   * @default 8
   */
  offset?: number;

  /**
   * Allow position to flip if would overflow viewport
   * @default true
   */
  allowFlip?: boolean;

  /**
   * Width configuration for popover
   * @default 'auto'
   */
  width?: PopoverWidth;
}

/**
 * Return value from usePopoverPosition
 */
export interface UsePopoverPositionReturn {
  /**
   * Ref to attach to popover element
   */
  popoverRef: RefObject<HTMLDivElement>;

  /**
   * Ref to attach to trigger element
   */
  triggerRef: RefObject<HTMLElement>;

  /**
   * Style object to apply to popover
   */
  style: CSSProperties;

  /**
   * Actual position used (may differ from preferred if flipped)
   */
  actualPosition: PopoverPosition;
}

/**
 * Calculate and manage popover position
 * @param options - Positioning options
 * @returns Refs and styles for positioning
 */
export function usePopoverPosition(options: UsePopoverPositionOptions): UsePopoverPositionReturn {
  const {
    isOpen,
    position = 'bottom',
    offset = 8,
    allowFlip = true,
    width: widthConfig = 'auto',
  } = options;

  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [positionState, setPositionState] = useState<{
    top: number;
    left: number;
    actualPosition: PopoverPosition;
    width?: number;
    widthValue?: string | number;
    isPositioned?: boolean;
  }>(() => ({
    top: 0,
    left: 0,
    actualPosition: position,
    isPositioned: false,
  }));

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current || !popoverRef.current) {
        return;
      }

      // Double RAF: Portal render needs two frames for guaranteed layout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!triggerRef.current || !popoverRef.current) {
            return;
          }

          const triggerBounds = getElementBounds(triggerRef.current);
          const popoverBounds = getElementBounds(popoverRef.current);
          const viewportSize = getViewportSize();

          const coordinates = calculatePopoverPosition(
            triggerBounds,
            { width: popoverBounds.width, height: popoverBounds.height },
            viewportSize,
            { preferredPosition: position, offset, allowFlip, width: widthConfig }
          );

          // Set position and make visible in one update
          setPositionState({
            top: coordinates.top,
            left: coordinates.left,
            actualPosition: coordinates.actualPosition,
            width: coordinates.width,
            widthValue: coordinates.widthValue,
            isPositioned: true,
          });
        });
      });
    };

    // Initial position calculation
    updatePosition();

    // Update on scroll or resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, position, offset, allowFlip, widthConfig]);

  const style: CSSProperties = {
    position: 'fixed',
    top: `${positionState.top}px`,
    left: `${positionState.left}px`,
    visibility: positionState.isPositioned ? 'visible' : 'hidden',
    ...(positionState.widthValue !== undefined && {
      width:
        typeof positionState.widthValue === 'number'
          ? `${positionState.widthValue}px`
          : positionState.widthValue,
    }),
  };

  return {
    popoverRef,
    triggerRef,
    style,
    actualPosition: positionState.actualPosition,
  };
}
