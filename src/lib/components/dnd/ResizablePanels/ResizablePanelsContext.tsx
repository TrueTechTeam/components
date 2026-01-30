/**
 * ResizablePanels context for sharing state across resizable components
 */

import { createContext, useContext } from 'react';

/**
 * ResizablePanels context value
 */
export interface ResizablePanelsContextValue {
  /**
   * Direction of panels
   */
  direction: 'horizontal' | 'vertical';

  /**
   * Current panel sizes (percentages)
   */
  sizes: number[];

  /**
   * Update panel sizes
   */
  setSizes: (sizes: number[]) => void;

  /**
   * Start resizing at a specific handle index
   */
  startResize: (handleIndex: number) => void;

  /**
   * Stop resizing
   */
  stopResize: () => void;

  /**
   * Currently active handle index (-1 if not resizing)
   */
  activeHandle: number;

  /**
   * Register a panel and return its index
   */
  registerPanel: (config: { minSize: number; maxSize: number; collapsible: boolean }) => number;

  /**
   * Get panel config by index
   */
  getPanelConfig: (
    index: number
  ) => { minSize: number; maxSize: number; collapsible: boolean } | undefined;

  /**
   * Total number of panels
   */
  panelCount: number;
}

/**
 * ResizablePanels context
 */
export const ResizablePanelsContext = createContext<ResizablePanelsContextValue | null>(null);

/**
 * Hook to access ResizablePanels context (throws if not in provider)
 */
export function useResizablePanelsContext(): ResizablePanelsContextValue {
  const context = useContext(ResizablePanelsContext);

  if (!context) {
    throw new Error('useResizablePanelsContext must be used within a ResizablePanels');
  }

  return context;
}

/**
 * Hook to access ResizablePanels context (returns null if not in provider)
 */
export function useResizablePanelsContextOptional(): ResizablePanelsContextValue | null {
  return useContext(ResizablePanelsContext);
}
