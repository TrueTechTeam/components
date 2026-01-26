import { createContext, useContext } from 'react';
import type { ComponentSize } from '../../../types';

export type TabsVariant = 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';

export interface TabsContextValue {
  /**
   * Unique ID for this tabs instance (used to generate deterministic IDs)
   */
  tabsId: string;

  /**
   * Currently selected tab value
   */
  selectedValue: string;

  /**
   * Callback when tab selection changes
   */
  onChange: (value: string) => void;

  /**
   * Orientation of the tabs
   */
  orientation: 'horizontal' | 'vertical';

  /**
   * Visual variant of the tabs
   */
  variant: TabsVariant;

  /**
   * Size of the tabs
   */
  size: ComponentSize;

  /**
   * Whether all tabs are disabled
   */
  disabled: boolean;

  /**
   * Whether tabs should fill container width
   */
  fitted: boolean;

  /**
   * Whether panels should be lazy mounted
   */
  lazyMount: boolean;

  /**
   * Whether to keep inactive panels mounted
   */
  keepMounted: boolean;

  /**
   * Set of panel values that have been activated at least once
   */
  activatedPanels: Set<string>;

  /**
   * Mark a panel as having been activated
   */
  markPanelActivated: (value: string) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Hook to optionally access Tabs context
 * Returns null if not within a Tabs component
 */
export const useTabsContext = () => {
  return useContext(TabsContext);
};

/**
 * Hook to access Tabs context
 * @throws Error if used outside of Tabs
 */
export const useTabsContextStrict = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within Tabs');
  }
  return context;
};
