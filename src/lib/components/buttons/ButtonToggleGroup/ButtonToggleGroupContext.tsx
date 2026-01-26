import { createContext, useContext } from 'react';
import type { ComponentSize, ComponentVariant } from '../../../types';

export interface ButtonToggleGroupContextValue {
  /**
   * Group name for form submission
   */
  name: string;

  /**
   * Currently selected value
   */
  value?: string;

  /**
   * Callback when selection changes
   */
  onChange?: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Whether the group is disabled
   */
  disabled?: boolean;

  /**
   * Size for all items
   */
  size?: ComponentSize;

  /**
   * Variant style for all items
   */
  variant?: ComponentVariant;
}

export const ButtonToggleGroupContext = createContext<ButtonToggleGroupContextValue | null>(null);

/**
 * Hook to access ButtonToggleGroup context
 * @throws Error if used outside of ButtonToggleGroup
 */
export const useButtonToggleGroup = () => {
  const context = useContext(ButtonToggleGroupContext);
  if (!context) {
    throw new Error('ButtonToggleGroupItem must be used within ButtonToggleGroup');
  }
  return context;
};

/**
 * Hook to optionally access ButtonToggleGroup context
 * Returns null if not within a ButtonToggleGroup
 */
export const useButtonToggleGroupOptional = () => {
  return useContext(ButtonToggleGroupContext);
};
