import { createContext, useContext } from 'react';
import type { ComponentSize } from '../../../types';

export type NavbarVariant = 'solid' | 'transparent' | 'blur';
export type NavbarPosition = 'fixed' | 'sticky' | 'static';

export interface NavbarContextValue {
  /**
   * Unique ID for this navbar instance
   */
  navbarId: string;

  /**
   * Visual variant
   */
  variant: NavbarVariant;

  /**
   * Size (height)
   */
  size: ComponentSize;

  /**
   * Position behavior
   */
  position: NavbarPosition;

  /**
   * Whether mobile menu is expanded
   */
  isExpanded: boolean;

  /**
   * Toggle mobile menu
   */
  setExpanded: (expanded: boolean) => void;

  /**
   * Toggle function for convenience
   */
  toggle: () => void;

  /**
   * Alignment of nav items
   */
  alignment: 'left' | 'center';

  /**
   * Whether navbar is in mobile mode
   */
  isMobile: boolean;
}

export const NavbarContext = createContext<NavbarContextValue | null>(null);

/**
 * Hook to access navbar context (returns null if outside Navbar)
 */
export function useNavbarContext(): NavbarContextValue | null {
  return useContext(NavbarContext);
}

/**
 * Hook to access navbar context (throws if outside Navbar)
 */
export function useNavbarContextStrict(): NavbarContextValue {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbarContextStrict must be used within a Navbar component');
  }
  return context;
}
