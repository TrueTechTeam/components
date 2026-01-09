/**
 * Menu context for sharing state across menu components
 */

import { createContext, useContext } from 'react';

/**
 * Selection mode for menu
 */
export type SelectionMode = 'none' | 'single' | 'multi';

/**
 * Menu context value
 */
export interface MenuContextValue {
  /**
   * Set of selected item keys
   */
  selectedKeys: Set<string>;

  /**
   * Toggle selection for an item
   */
  toggleSelection: (key: string) => void;

  /**
   * Selection mode
   */
  selectionMode: SelectionMode;

  /**
   * Close the menu
   */
  closeMenu: () => void;

  /**
   * Currently focused item index (-1 means no item is focused)
   */
  focusedIndex: number;

  /**
   * Set focused item index
   */
  setFocusedIndex: (index: number) => void;

  /**
   * Total number of items
   */
  itemsCount: number;

  /**
   * Register a menu item and get assigned index
   */
  registerItem: () => number;

  /**
   * Callback when item is clicked
   */
  onItemAction?: (key: string) => void;

  /**
   * Whether to scroll to selected item when menu opens
   */
  scrollToSelected?: boolean;

  /**
   * Whether type-ahead keyboard navigation is enabled
   */
  enableTypeAhead?: boolean;

  /**
   * Register item label for type-ahead search
   */
  registerItemLabel: (index: number, label: string) => void;
}

/**
 * Menu context
 */
export const MenuContext = createContext<MenuContextValue | null>(null);

/**
 * Hook to access menu context
 */
export function useMenuContext(): MenuContextValue {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenuContext must be used within a Menu component');
  }

  return context;
}
