/**
 * Hook for detecting clicks outside an element
 */

import { useEffect, type RefObject } from 'react';

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

      // Do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      // Do nothing if clicking any excluded refs or their descendants
      if (excludeRefs) {
        for (const excludeRef of excludeRefs) {
          if (excludeRef.current?.contains(event.target as Node)) {
            return;
          }
        }
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
