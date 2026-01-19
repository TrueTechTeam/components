/**
 * Accordion context for coordinating multiple accordions within a container
 */

import { createContext, useContext } from 'react';
import type { ComponentSize } from '../../../types';

/**
 * Accordion expansion mode
 * - 'single': Only one accordion can be open at a time
 * - 'multiple': Multiple accordions can be open simultaneously
 */
export type AccordionMode = 'single' | 'multiple';

/**
 * Context value for AccordionContainer
 */
export interface AccordionContextValue {
  /**
   * Set of expanded accordion IDs
   */
  expandedIds: Set<string>;

  /**
   * Toggle expansion state of an accordion
   * @param id - The accordion ID to toggle
   */
  toggleAccordion: (id: string) => void;

  /**
   * Expansion mode
   */
  mode: AccordionMode;

  /**
   * Whether all accordions in the container are disabled
   */
  disabled: boolean;

  /**
   * Size variant from container (can be overridden per accordion)
   */
  size?: ComponentSize;

  /**
   * Whether accordions should show borders
   */
  bordered?: boolean;
}

/**
 * Accordion context
 * Provides state coordination for AccordionContainer
 */
export const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Hook to access accordion container context
 * Returns null if not within AccordionContainer (allowing standalone usage)
 *
 * @returns AccordionContextValue or null if outside container
 */
export function useAccordionContext(): AccordionContextValue | null {
  return useContext(AccordionContext);
}

/**
 * Hook that throws if not within AccordionContainer
 * Use this when accordion must be within a container
 *
 * @throws Error if used outside AccordionContainer
 * @returns AccordionContextValue
 */
export function useAccordionContextStrict(): AccordionContextValue {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      'useAccordionContextStrict must be used within an AccordionContainer. ' +
        'If you want to use Accordion standalone, use useAccordionContext instead.'
    );
  }

  return context;
}
