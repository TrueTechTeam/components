import { createContext } from 'react';

/** Loading state of the nearest Page or Section that owns queries, read by `Loadable`. */
export interface LoadingContextValue {
  /** The owner's queries are pending (no data yet). */
  pending: boolean;
  /** Some enclosing region is already busy and announced loading. */
  busyAncestor: boolean;
}

export const LoadingContext = createContext<LoadingContextValue>({
  pending: false,
  busyAncestor: false,
});
LoadingContext.displayName = 'LoadingContext';
