import { useState, useCallback, type KeyboardEvent } from 'react';
import type { UseListKeyboardNavOptions, UseListKeyboardNavReturn } from '../types';

/**
 * Hook for keyboard navigation in lists
 * Supports vertical, horizontal, and grid navigation patterns
 */
export function useListKeyboardNav({
  itemCount,
  onItemAction,
  onEscape,
  loop = true,
  orientation = 'vertical',
  columns = 1,
  disabled = false,
}: UseListKeyboardNavOptions): UseListKeyboardNavReturn {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled || itemCount === 0) {
        return;
      }

      const { key } = event;
      let newIndex = focusedIndex;
      let handled = false;

      switch (key) {
        case 'ArrowDown': {
          if (orientation === 'vertical' || orientation === 'grid') {
            const step = orientation === 'grid' ? columns : 1;
            newIndex = focusedIndex + step;
            if (newIndex >= itemCount) {
              newIndex = loop ? newIndex % itemCount : itemCount - 1;
            }
            handled = true;
          }
          break;
        }

        case 'ArrowUp': {
          if (orientation === 'vertical' || orientation === 'grid') {
            const step = orientation === 'grid' ? columns : 1;
            newIndex = focusedIndex - step;
            if (newIndex < 0) {
              newIndex = loop ? itemCount + newIndex : 0;
            }
            handled = true;
          }
          break;
        }

        case 'ArrowRight': {
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = focusedIndex + 1;
            if (newIndex >= itemCount) {
              newIndex = loop ? 0 : itemCount - 1;
            }
            handled = true;
          }
          break;
        }

        case 'ArrowLeft': {
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = focusedIndex - 1;
            if (newIndex < 0) {
              newIndex = loop ? itemCount - 1 : 0;
            }
            handled = true;
          }
          break;
        }

        case 'Home': {
          newIndex = 0;
          handled = true;
          break;
        }

        case 'End': {
          newIndex = itemCount - 1;
          handled = true;
          break;
        }

        case 'Enter':
        case ' ': {
          if (focusedIndex >= 0 && focusedIndex < itemCount) {
            event.preventDefault();
            onItemAction?.(focusedIndex);
          }
          handled = true;
          break;
        }

        case 'Escape': {
          onEscape?.();
          newIndex = -1;
          handled = true;
          break;
        }
      }

      if (handled) {
        event.preventDefault();
        if (newIndex !== focusedIndex && newIndex >= 0 && newIndex < itemCount) {
          setFocusedIndex(newIndex);
        }
      }
    },
    [disabled, itemCount, focusedIndex, orientation, columns, loop, onItemAction, onEscape]
  );

  const getItemTabIndex = useCallback(
    (index: number): 0 | -1 => {
      // If no item is focused, make the first item tabbable
      if (focusedIndex === -1 && index === 0) {
        return 0;
      }
      return index === focusedIndex ? 0 : -1;
    },
    [focusedIndex]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    getItemTabIndex,
  };
}
