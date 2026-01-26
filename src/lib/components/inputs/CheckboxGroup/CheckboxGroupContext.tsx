import { createContext, useContext } from 'react';
import type { ComponentSize, ComponentVariant } from '../../../types';

export interface CheckboxGroupContextValue {
  /**
   * Group name for form submission
   */
  name: string;

  /**
   * Array of currently selected values
   */
  values: string[];

  /**
   * Callback when selection changes
   */
  onChange: (value: string, checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Whether the group is disabled
   */
  disabled?: boolean;

  /**
   * Whether the group is read-only
   */
  readOnly?: boolean;

  /**
   * Size for all checkboxes
   */
  size?: ComponentSize;

  /**
   * Variant style for all checkboxes
   */
  variant?: ComponentVariant;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

/**
 * Hook to optionally access CheckboxGroup context
 * Returns null if not within a CheckboxGroup (allows standalone Checkbox usage)
 */
export const useCheckboxGroup = () => {
  return useContext(CheckboxGroupContext);
};

/**
 * Hook to access CheckboxGroup context
 * @throws Error if used outside of CheckboxGroup
 */
export const useCheckboxGroupStrict = () => {
  const context = useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error('CheckboxGroupItem must be used within CheckboxGroup');
  }
  return context;
};
