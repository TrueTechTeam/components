import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

export type BreakpointName = 'phone' | 'tablet' | 'laptop' | 'desktop';

/** Min-widths in px for each named breakpoint. */
export type Breakpoints = Record<BreakpointName, number>;

export const BREAKPOINT_ORDER: readonly BreakpointName[] = ['phone', 'tablet', 'laptop', 'desktop'];

export const DEFAULT_BREAKPOINTS: Breakpoints = {
  phone: 0,
  tablet: 600,
  laptop: 1024,
  desktop: 1440,
};

const BreakpointsContext = createContext<Breakpoints>(DEFAULT_BREAKPOINTS);

export interface BreakpointsProviderProps {
  /** Override any breakpoint min-width (px). Merged over outer providers; unspecified names keep theirs. */
  breakpoints?: Partial<Breakpoints>;
  children: ReactNode;
}

export function BreakpointsProvider({ breakpoints, children }: BreakpointsProviderProps) {
  const parent = useContext(BreakpointsContext);
  const { tablet, laptop, desktop } = breakpoints ?? {};
  const value = useMemo<Breakpoints>(
    () => ({
      phone: 0,
      tablet: tablet ?? parent.tablet,
      laptop: laptop ?? parent.laptop,
      desktop: desktop ?? parent.desktop,
    }),
    [parent, tablet, laptop, desktop]
  );
  return <BreakpointsContext.Provider value={value}>{children}</BreakpointsContext.Provider>;
}

export function useBreakpoints(): Breakpoints {
  return useContext(BreakpointsContext);
}
