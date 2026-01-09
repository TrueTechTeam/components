/**
 * Hook for trapping focus within an element
 */

import { useEffect, type RefObject } from 'react';

/**
 * Focusable element selector
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * Trap focus within an element
 * @param ref - Reference to the container element
 * @param enabled - Whether the focus trap is active
 * @param autoFocus - Whether to automatically focus the first element on mount
 */
export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T>,
  enabled = true,
  autoFocus = true
): void {
  useEffect(() => {
    if (!enabled || !ref.current) {
      return;
    }

    const container = ref.current;
    const focusableElements = getFocusableElements(container);

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      // Shift + Tab: move focus to previous element
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: move focus to next element
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element on mount if autoFocus is enabled
    if (autoFocus) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, enabled, autoFocus]);
}
