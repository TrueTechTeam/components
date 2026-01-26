import { createContext, useContext } from 'react';

/**
 * Configuration for a registered pane
 */
export interface PaneConfig {
  id: string;
  minWidth: number;
  maxWidth?: number;
  preferredWidth: number | string;
  grow: number;
  shrink: number;
  priority: number;
  index: number;
}

/**
 * Context value for Panes component
 */
export interface PanesContextValue {
  /**
   * Register a pane with the container
   */
  registerPane: (config: PaneConfig) => void;

  /**
   * Unregister a pane
   */
  unregisterPane: (id: string) => void;

  /**
   * Update a pane's configuration
   */
  updatePane: (id: string, config: Partial<PaneConfig>) => void;

  /**
   * Set of currently visible pane IDs
   */
  visiblePanes: Set<string>;

  /**
   * Set of pane IDs currently entering (animating in)
   */
  enteringPanes: Set<string>;

  /**
   * Set of pane IDs currently exiting (animating out)
   */
  exitingPanes: Set<string>;

  /**
   * Animation duration (ms)
   */
  animationDuration: number;

  /**
   * Animation easing function
   */
  animationEasing: string;

  /**
   * Gap between panes (px)
   */
  gap: number;
}

const PanesContext = createContext<PanesContextValue | null>(null);

/**
 * Hook to access Panes context
 */
export function usePanesContext(): PanesContextValue {
  const context = useContext(PanesContext);
  if (!context) {
    throw new Error('Pane must be used within a Panes component');
  }
  return context;
}

export { PanesContext };
