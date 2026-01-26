import { createContext, useContext } from 'react';
import type { ComponentSize } from '../../../types';

export type StepperVariant = 'numbered' | 'dot' | 'icon';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepperContextValue {
  /**
   * Unique ID for this stepper instance
   */
  stepperId: string;

  /**
   * Current active step (0-indexed)
   */
  currentStep: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Orientation
   */
  orientation: StepperOrientation;

  /**
   * Visual variant
   */
  variant: StepperVariant;

  /**
   * Size
   */
  size: ComponentSize;

  /**
   * Set of completed step indices
   */
  completedSteps: Set<number>;

  /**
   * Click handler for steps
   */
  onStepClick?: (step: number) => void;

  /**
   * Whether step clicking is allowed
   */
  allowStepClick: boolean;

  /**
   * Only allow clicking previous steps
   */
  onlyPreviousClickable: boolean;

  /**
   * Register a step and get its index
   */
  registerStep: () => number;
}

export const StepperContext = createContext<StepperContextValue | null>(null);

/**
 * Hook to access Stepper context (returns null if outside Stepper)
 */
export function useStepperContext(): StepperContextValue | null {
  return useContext(StepperContext);
}

/**
 * Hook to access Stepper context (throws if outside Stepper)
 */
export function useStepperContextStrict(): StepperContextValue {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepperContextStrict must be used within a Stepper component');
  }
  return context;
}
