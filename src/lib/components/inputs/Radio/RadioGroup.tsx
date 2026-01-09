import React, { forwardRef, createContext, useContext, useState, useCallback, useId } from 'react';
import type { ComponentSize, ComponentVariant, InputBaseProps } from '../../../types';
import styles from './RadioGroup.module.scss';

export interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  size?: ComponentSize;
  variant?: ComponentVariant;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within RadioGroup');
  }
  return context;
};

export interface RadioGroupProps extends Omit<InputBaseProps, 'value' | 'onChange' | 'placeholder'> {
  /**
   * RadioGroup variant style
   * @default 'primary'
   */
  variant?: ComponentVariant;

  /**
   * Radio button size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Currently selected value
   */
  value?: string;

  /**
   * Default selected value for uncontrolled component
   */
  defaultValue?: string;

  /**
   * Callback fired when selection changes
   * @param value - The selected value
   * @param event - The change event
   */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Layout orientation
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Group label
   */
  label?: string;

  /**
   * Helper text to display below the group
   */
  helperText?: string;

  /**
   * Error message to display when group is in error state
   */
  errorMessage?: string;

  /**
   * Whether the group is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * Radio button children
   */
  children: React.ReactNode;

  /**
   * Gap between radio buttons (in spacing units)
   * @default 2 (8px)
   */
  gap?: number;

  /**
   * ID for the fieldset element
   */
  id?: string;
}

/**
 * RadioGroup component
 * Container for Radio buttons that manages selection state
 *
 * @example
 * ```tsx
 * <RadioGroup value={size} onChange={setSize} label="Select size">
 *   <Radio value="small" label="Small" />
 *   <Radio value="medium" label="Medium" />
 *   <Radio value="large" label="Large" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      value,
      defaultValue,
      onChange,
      orientation = 'vertical',
      label,
      helperText,
      errorMessage,
      error = false,
      children,
      gap = 2,
      disabled = false,
      readOnly = false,
      required = false,
      name: providedName,
      id: providedId,
      className,
      'data-testid': dataTestId,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const autoName = useId();
    const id = providedId || autoId;
    const name = providedName || autoName;

    // Internal state for uncontrolled component
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Use controlled value if provided, otherwise use internal state
    const selectedValue = value !== undefined ? value : internalValue;

    const handleChange = useCallback(
      (newValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
        // Update internal state if uncontrolled
        if (value === undefined) {
          setInternalValue(newValue);
        }

        // Call onChange callback
        onChange?.(newValue, event);
      },
      [value, onChange]
    );

    const contextValue: RadioGroupContextValue = {
      name,
      value: selectedValue,
      onChange: handleChange,
      disabled,
      readOnly,
      size,
      variant,
    };

    const gapStyle = {
      '--radio-group-gap': `var(--spacing-${['xs', 'sm', 'md', 'lg', 'xl', 'xxl'][gap] || 'sm'})`,
    } as React.CSSProperties;

    return (
      <fieldset
        ref={ref}
        id={id}
        className={`${styles.radioGroup} ${className || ''}`}
        data-orientation={orientation}
        data-error={error || undefined}
        data-component="radio-group"
        data-testid={dataTestId}
        disabled={disabled}
        aria-invalid={error}
        aria-required={required}
        style={gapStyle}
        {...rest}
      >
        {label && (
          <legend className={styles.legend} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </legend>
        )}

        <RadioGroupContext.Provider value={contextValue}>
          <div className={styles.radioList} data-orientation={orientation}>
            {children}
          </div>
        </RadioGroupContext.Provider>

        {(helperText || (error && errorMessage)) && (
          <div
            className={styles.helperText}
            data-error={error || undefined}
            role={error ? 'alert' : undefined}
            aria-live={error ? 'polite' : undefined}
          >
            {error && errorMessage ? errorMessage : helperText}
          </div>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
