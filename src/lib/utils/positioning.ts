/**
 * Positioning utilities for popover components
 */

import type { ElementBounds, ViewportSize } from './dom';

/**
 * Supported popover positions relative to trigger element
 */
export type PopoverPosition =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right';

/**
 * Calculated position coordinates
 */
export interface PositionCoordinates {
  top: number;
  left: number;
  actualPosition: PopoverPosition;
  width?: number;
  widthValue?: string | number;
}

/**
 * Width configuration options
 * - 'trigger': Match trigger element width
 * - 'auto': Use natural content width with no constraints
 * - 'content': Use content width (fit-content)
 * - 'max-content': Use maximum content width
 * - number: Fixed width in pixels
 */
export type PopoverWidth = 'trigger' | 'auto' | 'content' | 'max-content' | number;

/**
 * Options for position calculation
 */
export interface PositionOptions {
  preferredPosition: PopoverPosition;
  offset: number;
  allowFlip: boolean;
  width?: PopoverWidth;
}

/**
 * Popover size information
 */
export interface PopoverSize {
  width: number;
  height: number;
}

/**
 * Overflow information for each edge
 */
interface OverflowInfo {
  top: number;
  bottom: number;
  left: number;
  right: number;
  total: number;
}

/**
 * Calculate coordinates for a specific position
 * Aligns corners/edges of popover to trigger element
 */
function getCoordinatesForPosition(
  triggerBounds: ElementBounds,
  popoverSize: PopoverSize,
  position: PopoverPosition,
  offset: number,
  viewportSize: ViewportSize
): { top: number; left: number } {
  const { top, left, right, bottom, width } = triggerBounds;

  switch (position) {
    case 'top':
      // Align bottom center of content to top center of trigger
      return {
        top: top - popoverSize.height - offset,
        left: left + width / 2 - popoverSize.width / 2,
      };

    case 'top-left':
      // Align bottom left corner of content to top left of trigger
      return {
        top: top - popoverSize.height - offset,
        left: left,
      };

    case 'top-right':
      // Align bottom right corner of content to top right corner of trigger
      return {
        top: top - popoverSize.height - offset,
        left: right - popoverSize.width,
      };

    case 'bottom':
      // Align top center of content to bottom center of trigger
      return {
        top: bottom + offset,
        left: left + width / 2 - popoverSize.width / 2,
      };

    case 'bottom-left':
      // Align top left corner of content to bottom left corner of trigger
      return {
        top: bottom + offset,
        left: left,
      };

    case 'bottom-right':
      // Align top right corner of content to bottom right corner of trigger
      return {
        top: bottom + offset,
        left: right - popoverSize.width,
      };

    case 'left': {
      // Align top right corner of content to top left corner of trigger
      // Check if popover extends beyond bottom of viewport
      let topPosition = top;
      const popoverBottom = topPosition + popoverSize.height;

      if (popoverBottom > viewportSize.height) {
        // Align bottom of popover with bottom of viewport
        topPosition = viewportSize.height - popoverSize.height;
        // Ensure we don't push above viewport top
        topPosition = Math.max(0, topPosition);
      }

      return {
        top: topPosition,
        left: left - popoverSize.width - offset,
      };
    }

    case 'right': {
      // Align top left corner of content to top right corner of trigger
      // Check if popover extends beyond bottom of viewport
      let topPosition = top;
      const popoverBottom = topPosition + popoverSize.height;

      if (popoverBottom > viewportSize.height) {
        // Align bottom of popover with bottom of viewport
        topPosition = viewportSize.height - popoverSize.height;
        // Ensure we don't push above viewport top
        topPosition = Math.max(0, topPosition);
      }

      return {
        top: topPosition,
        left: right + offset,
      };
    }
  }
}

/**
 * Calculate overflow for a position
 */
function calculateOverflow(
  coordinates: { top: number; left: number },
  popoverSize: PopoverSize,
  viewportSize: ViewportSize
): OverflowInfo {
  const topOverflow = Math.max(0, -coordinates.top);
  const bottomOverflow = Math.max(0, coordinates.top + popoverSize.height - viewportSize.height);
  const leftOverflow = Math.max(0, -coordinates.left);
  const rightOverflow = Math.max(0, coordinates.left + popoverSize.width - viewportSize.width);

  return {
    top: topOverflow,
    bottom: bottomOverflow,
    left: leftOverflow,
    right: rightOverflow,
    total: topOverflow + bottomOverflow + leftOverflow + rightOverflow,
  };
}

/**
 * Get opposite position for flipping
 */
function getOppositePosition(position: PopoverPosition): PopoverPosition {
  const opposites: Record<PopoverPosition, PopoverPosition> = {
    top: 'bottom',
    'top-left': 'bottom-left',
    'top-right': 'bottom-right',
    bottom: 'top',
    'bottom-left': 'top-left',
    'bottom-right': 'top-right',
    left: 'right',
    right: 'left',
  };

  return opposites[position];
}

/**
 * Get adjacent positions to try when flipping
 */
function getAdjacentPositions(position: PopoverPosition): PopoverPosition[] {
  const adjacents: Record<PopoverPosition, PopoverPosition[]> = {
    top: ['top-left', 'top-right', 'left', 'right'],
    'top-left': ['top', 'left', 'top-right'],
    'top-right': ['top', 'right', 'top-left'],
    bottom: ['bottom-left', 'bottom-right', 'left', 'right'],
    'bottom-left': ['bottom', 'left', 'bottom-right'],
    'bottom-right': ['bottom', 'right', 'bottom-left'],
    left: ['top-left', 'bottom-left', 'top', 'bottom'],
    right: ['top-right', 'bottom-right', 'top', 'bottom'],
  };

  return adjacents[position];
}

/**
 * Find the best position that minimizes viewport overflow
 * @param triggerBounds - Trigger element boundaries
 * @param popoverSize - Popover dimensions
 * @param viewportSize - Viewport dimensions
 * @param preferredPosition - Desired position
 * @param offset - Gap between trigger and popover
 * @returns Best position that fits in viewport
 */
export function findBestPosition(
  triggerBounds: ElementBounds,
  popoverSize: PopoverSize,
  viewportSize: ViewportSize,
  preferredPosition: PopoverPosition,
  offset: number
): PopoverPosition {
  // Try preferred position first
  const preferredCoords = getCoordinatesForPosition(
    triggerBounds,
    popoverSize,
    preferredPosition,
    offset,
    viewportSize
  );
  const preferredOverflow = calculateOverflow(preferredCoords, popoverSize, viewportSize);

  // If no overflow, use preferred position
  if (preferredOverflow.total === 0) {
    return preferredPosition;
  }

  // Try opposite position
  const oppositePosition = getOppositePosition(preferredPosition);
  const oppositeCoords = getCoordinatesForPosition(
    triggerBounds,
    popoverSize,
    oppositePosition,
    offset,
    viewportSize
  );
  const oppositeOverflow = calculateOverflow(oppositeCoords, popoverSize, viewportSize);

  let bestPosition = preferredPosition;
  let minOverflow = preferredOverflow.total;

  if (oppositeOverflow.total < minOverflow) {
    bestPosition = oppositePosition;
    minOverflow = oppositeOverflow.total;
  }

  // If still overflow, try adjacent positions
  if (minOverflow > 0) {
    const adjacentPositions = getAdjacentPositions(preferredPosition);

    for (const position of adjacentPositions) {
      const coords = getCoordinatesForPosition(
        triggerBounds,
        popoverSize,
        position,
        offset,
        viewportSize
      );
      const overflow = calculateOverflow(coords, popoverSize, viewportSize);

      if (overflow.total < minOverflow) {
        bestPosition = position;
        minOverflow = overflow.total;

        // If found position with no overflow, stop searching
        if (minOverflow === 0) {
          break;
        }
      }
    }
  }

  return bestPosition;
}

/**
 * Calculate popover width based on configuration
 * Returns both numeric width for positioning calculations and CSS width value
 */
function calculatePopoverWidth(
  triggerBounds: ElementBounds,
  widthConfig?: PopoverWidth
): { width?: number; widthValue?: string | number } {
  if (!widthConfig || widthConfig === 'auto') {
    return { width: undefined, widthValue: undefined };
  }

  if (widthConfig === 'trigger') {
    return { width: triggerBounds.width, widthValue: triggerBounds.width };
  }

  if (widthConfig === 'content') {
    return { width: undefined, widthValue: 'fit-content' };
  }

  if (widthConfig === 'max-content') {
    return { width: undefined, widthValue: 'max-content' };
  }

  if (typeof widthConfig === 'number') {
    return { width: widthConfig, widthValue: widthConfig };
  }

  return { width: undefined, widthValue: undefined };
}

/**
 * Calculate popover position coordinates
 * @param triggerBounds - Trigger element boundaries
 * @param popoverSize - Popover dimensions
 * @param viewportSize - Viewport dimensions
 * @param options - Position calculation options
 * @returns Position coordinates and actual position used
 */
export function calculatePopoverPosition(
  triggerBounds: ElementBounds,
  popoverSize: PopoverSize,
  viewportSize: ViewportSize,
  options: PositionOptions
): PositionCoordinates {
  const { preferredPosition, offset, allowFlip, width: widthConfig } = options;

  // Calculate width
  const { width, widthValue } = calculatePopoverWidth(triggerBounds, widthConfig);

  // Determine actual position to use
  const actualPosition = allowFlip
    ? findBestPosition(triggerBounds, popoverSize, viewportSize, preferredPosition, offset)
    : preferredPosition;

  // Calculate coordinates for the chosen position
  const coordinates = getCoordinatesForPosition(
    triggerBounds,
    popoverSize,
    actualPosition,
    offset,
    viewportSize
  );

  return {
    top: coordinates.top,
    left: coordinates.left,
    actualPosition,
    width,
    widthValue,
  };
}
