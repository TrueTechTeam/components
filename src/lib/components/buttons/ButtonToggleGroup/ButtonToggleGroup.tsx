import React, { useState, useCallback, useId } from 'react';
import type { BaseComponentProps, ComponentSize, ComponentVariant } from '../../../types';
import {
  ButtonToggleGroupContext,
  type ButtonToggleGroupContextValue,
} from './ButtonToggleGroupContext';
import styles from './ButtonToggleGroup.module.scss';

export interface ButtonToggleGroupProps extends Omit<BaseComponentProps, 'onChange'> {
  /**
   * Currently selected value (controlled)
   */
  value?: string;

  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   * @param value - The newly selected value
   * @param event - The click event
   */
  onChange?: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Variant style for all buttons
   * @default 'outline'
   */
  variant?: ComponentVariant;

  /**
   * Size for all buttons
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Orientation of the button group
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether buttons should take full width (distribute equally)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Whether all buttons are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Group label for accessibility
   */
  'aria-label'?: string;

  /**
   * Name attribute for form submission
   */
  name?: string;

  /**
   * ButtonToggleGroupItem children
   */
  children: React.ReactNode;
}

/**
 * ButtonToggleGroup component - a group of buttons with single selection
 *
 * A segmented control that allows selecting one option from a group of buttons.
 * Buttons can contain icons, text, or both.
 *
 * @example
 * ```tsx
 * // Text buttons
 * <ButtonToggleGroup value={size} onChange={setSize}>
 *   <ButtonToggleGroupItem value="sm">Small</ButtonToggleGroupItem>
 *   <ButtonToggleGroupItem value="md">Medium</ButtonToggleGroupItem>
 *   <ButtonToggleGroupItem value="lg">Large</ButtonToggleGroupItem>
 * </ButtonToggleGroup>
 *
 * // Icon buttons
 * <ButtonToggleGroup value={view} onChange={setView}>
 *   <ButtonToggleGroupItem value="list" icon="list" />
 *   <ButtonToggleGroupItem value="grid" icon="grid" />
 * </ButtonToggleGroup>
 * ```
 */
export const ButtonToggleGroup = ({
  ref,
  value,
  defaultValue,
  onChange,
  variant = 'outline',
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  disabled = false,
  'aria-label': ariaLabel,
  name: providedName,
  children,
  className,
  'data-testid': testId,
  style,
  ...restProps
}: ButtonToggleGroupProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const autoName = useId();
  const name = providedName || autoName;

  // Internal state for uncontrolled component
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Use controlled value if provided, otherwise use internal state
  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = useCallback(
    (newValue: string, event: React.MouseEvent<HTMLButtonElement>) => {
      // Update internal state if uncontrolled
      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue, event);
    },
    [value, onChange]
  );

  const contextValue: ButtonToggleGroupContextValue = {
    name,
    value: selectedValue,
    onChange: handleChange,
    disabled,
    size,
    variant,
  };

  const groupClasses = [styles.buttonToggleGroup, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      role="radiogroup"
      className={groupClasses}
      data-orientation={orientation}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      data-component="button-toggle-group"
      data-testid={testId || 'button-toggle-group'}
      aria-label={ariaLabel}
      style={style}
      {...restProps}
    >
      <ButtonToggleGroupContext.Provider value={contextValue}>
        {children}
      </ButtonToggleGroupContext.Provider>
    </div>
  );
};

export default ButtonToggleGroup;
