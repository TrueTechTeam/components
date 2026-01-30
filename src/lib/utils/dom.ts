/**
 * DOM utility functions for element measurements and viewport calculations
 */

/**
 * Element boundary information
 */
export interface ElementBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Viewport size information
 */
export interface ViewportSize {
  width: number;
  height: number;
}

/**
 * Scroll position information
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Get the bounding rectangle of an element
 * @param element - The HTML element to measure
 * @returns Element bounds including position and dimensions
 */
export function getElementBounds(element: HTMLElement): ElementBounds {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Get the current viewport size
 * @returns Viewport width and height
 */
export function getViewportSize(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Get the current scroll position
 * @returns Scroll x and y coordinates
 */
export function getScrollPosition(): ScrollPosition {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * Check if an element is within the viewport
 * @param element - The HTML element to check
 * @returns True if element is at least partially visible in viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const bounds = getElementBounds(element);
  const viewport = getViewportSize();

  return (
    bounds.top < viewport.height &&
    bounds.bottom > 0 &&
    bounds.left < viewport.width &&
    bounds.right > 0
  );
}
