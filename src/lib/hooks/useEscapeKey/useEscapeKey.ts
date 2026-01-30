/**
 * Hook for handling Escape key press
 */

import { useEffect } from 'react';

/**
 * Handle Escape key press
 * @param handler - Callback to execute when Escape is pressed
 * @param enabled - Whether the hook is active
 */
export function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handler, enabled]);
}
