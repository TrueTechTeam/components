import { createContext, useContext } from 'react';

export interface SideNavContextValue {
  /**
   * Unique ID for this SideNav instance
   */
  sideNavId: string;

  /**
   * Whether the sidebar is collapsed (icon-only mode)
   */
  collapsed: boolean;

  /**
   * Currently selected item value
   */
  selectedValue: string | null;

  /**
   * Select an item
   */
  onSelect: (value: string) => void;

  /**
   * Position of the sidebar
   */
  position: 'left' | 'right';

  /**
   * Set of expanded group IDs
   */
  expandedGroups: Set<string>;

  /**
   * Toggle a group's expanded state
   */
  toggleGroup: (groupId: string) => void;

  /**
   * Register a group as expanded by default
   */
  registerDefaultExpanded: (groupId: string) => void;
}

export const SideNavContext = createContext<SideNavContextValue | null>(null);

/**
 * Hook to access SideNav context (returns null if outside SideNav)
 */
export function useSideNavContext(): SideNavContextValue | null {
  return useContext(SideNavContext);
}

/**
 * Hook to access SideNav context (throws if outside SideNav)
 */
export function useSideNavContextStrict(): SideNavContextValue {
  const context = useContext(SideNavContext);
  if (!context) {
    throw new Error('useSideNavContextStrict must be used within a SideNav component');
  }
  return context;
}
