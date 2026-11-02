/**
 * Hook for detecting clicks outside an element
 */

import { useEffect, type RefObject } from 'react';

/**
 * Currently-open overlay elements (Popovers, and anything built on Popover - Menu,
 * DatePicker/DateRangePicker, ColorPicker, Tooltip, ...). Each renders into a portal, so
 * a nested overlay (e.g. a Select's own dropdown opened from inside a FilterPopover) isn't
 * a DOM descendant of the outer overlay it visually lives inside - plain `element.contains`
 * can't see it, and would otherwise treat a click inside the nested overlay as "outside"
 * the outer one and close it before the nested selection is even made.
 */
const openOverlayElements = new Set<HTMLElement>();

/**
 * Registers an element as a currently-open overlay so nested overlays' outside-click
 * detection can recognize clicks inside it as "inside". Call when the overlay opens; call
 * the returned function when it closes (or unmounts while open).
 */
export function registerOpenOverlay(element: HTMLElement): () => void {
  openOverlayElements.add(element);
  return () => {
    openOverlayElements.delete(element);
  };
}

function isInsideAnotherOpenOverlay(target: Node, self: HTMLElement | null): boolean {
  for (const element of openOverlayElements) {
    if (element !== self && element.contains(target)) {
      return true;
    }
  }
  return false;
}

/**
 * Detect clicks outside a referenced element
 * @param ref - Reference to the element
 * @param handler - Callback to execute when clicking outside
 * @param enabled - Whether the hook is active
 * @param excludeRefs - Additional refs to exclude from outside click detection (e.g., trigger elements)
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
  excludeRefs?: Array<RefObject<HTMLElement | null>>
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      const target = event.target as Node;

      // Do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(target)) {
        return;
      }

      // Do nothing if clicking any excluded refs or their descendants
      if (excludeRefs) {
        for (const excludeRef of excludeRefs) {
          if (excludeRef.current?.contains(target)) {
            return;
          }
        }
      }

      // Do nothing if clicking inside another currently-open overlay - see
      // `openOverlayElements` above for why plain containment can't detect this itself
      if (isInsideAnotherOpenOverlay(target, element)) {
        return;
      }

      handler(event);
    };

    // Use mousedown instead of click to catch the event before it bubbles
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled, excludeRefs]);
}
