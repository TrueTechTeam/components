import { createContext, useContext } from 'react';

export interface BottomNavigationContextValue {
  /**
   * Currently selected item value
   */
  selectedValue: string | null;

  /**
   * Select an item
   */
  onSelect: (value: string) => void;

  /**
   * Whether to show labels
   */
  showLabels: boolean;

  /**
   * Whether to only show label for selected item
   */
  showSelectedLabel: boolean;
}

export const BottomNavigationContext = createContext<BottomNavigationContextValue | null>(null);

/**
 * Hook to access BottomNavigation context (returns null if outside BottomNavigation)
 */
export function useBottomNavigationContext(): BottomNavigationContextValue | null {
  return useContext(BottomNavigationContext);
}

/**
 * Hook to access BottomNavigation context (throws if outside BottomNavigation)
 */
export function useBottomNavigationContextStrict(): BottomNavigationContextValue {
  const context = useContext(BottomNavigationContext);
  if (!context) {
    throw new Error(
      'useBottomNavigationContextStrict must be used within a BottomNavigation component'
    );
  }
  return context;
}
