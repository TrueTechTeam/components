import { useMemo } from 'react';
import { useMediaQuery } from '../useMediaQuery';
import {
  BREAKPOINT_ORDER,
  useBreakpoints,
  type BreakpointName,
} from '../../contexts/BreakpointsContext';

export interface UseBreakpointReturn {
  name: BreakpointName;
  isPhone: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  /** True when the viewport is at or above the named breakpoint */
  up(n: BreakpointName): boolean;
  /** True when the viewport is below the named breakpoint */
  down(n: BreakpointName): boolean;
}

/**
 * Current named breakpoint. Without a window (SSR) it reports `laptop`.
 */
export function useBreakpoint(): UseBreakpointReturn {
  const bps = useBreakpoints();
  const tablet = useMediaQuery(`(min-width: ${bps.tablet}px)`, { defaultValue: true }).matches;
  const laptop = useMediaQuery(`(min-width: ${bps.laptop}px)`, { defaultValue: true }).matches;
  const desktop = useMediaQuery(`(min-width: ${bps.desktop}px)`, { defaultValue: false }).matches;

  return useMemo(() => {
    const name: BreakpointName = desktop
      ? 'desktop'
      : laptop
        ? 'laptop'
        : tablet
          ? 'tablet'
          : 'phone';
    const rank = BREAKPOINT_ORDER.indexOf(name);
    return {
      name,
      isPhone: name === 'phone',
      isTablet: name === 'tablet',
      isLaptop: name === 'laptop',
      isDesktop: name === 'desktop',
      up: (n) => rank >= BREAKPOINT_ORDER.indexOf(n),
      down: (n) => rank < BREAKPOINT_ORDER.indexOf(n),
    };
  }, [tablet, laptop, desktop]);
}

/**
 * Pick a value per breakpoint, mobile-first: the nearest defined value at or below the
 * current breakpoint. Returns undefined when none applies.
 */
export function useBreakpointValue<T>(values: Partial<Record<BreakpointName, T>>): T | undefined {
  const { name } = useBreakpoint();
  for (let i = BREAKPOINT_ORDER.indexOf(name); i >= 0; i--) {
    const v = values[BREAKPOINT_ORDER[i]];
    if (v !== undefined) {
      return v;
    }
  }
  return undefined;
}
