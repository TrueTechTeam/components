import React, { forwardRef, useState, useCallback, useId } from 'react';
import type { BaseComponentProps, ComponentSize, ComponentVariant } from '../../../types';
import {
  CheckboxGroupContext,
  type CheckboxGroupContextValue,
} from './CheckboxGroupContext';
import styles from './CheckboxGroup.module.scss';

export interface CheckboxGroupProps extends Omit<BaseComponentProps, 'onChange'> {
  /**
   * Array of selected values (controlled)
   */
  value?: string[];

  /**
   * Default selected values (uncontrolled)
   * @default []
   */
  defaultValue?: string[];

  /**
   * Callback when selection changes
   * @param values - Array of currently selected values
   */
  onChange?: (values: string[]) => void;

  /**
   * Variant style for all checkboxes
   * @default 'primary'
   */
  variant?: ComponentVariant;

  /**
   * Size for all checkboxes
   * @default 'md'
   */
  size?: ComponentSize;

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
   * Helper text below the group
   */
  helperText?: string;

  /**
   * Error message when in error state
   */
  errorMessage?: string;

  /**
   * Whether the group is in error state
   * @default false
   */
  error?: boolean;

  /**
   * Whether all checkboxes are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether all checkboxes are read-only
   * @default false
   */
  readOnly?: boolean;

  /**
   * Whether at least one selection is required
   * @default false
   */
  required?: boolean;

  /**
   * Minimum number of selections required
   */
  min?: number;

  /**
   * Maximum number of selections allowed
   */
  max?: number;

  /**
   * Gap between checkboxes (in spacing units)
   * @default 2
   */
  gap?: number;

  /**
   * Name attribute for form submission
   */
  name?: string;

  /**
   * ID for the fieldset element
   */
  id?: string;

  /**
   * CheckboxGroupItem children
   */
  children: React.ReactNode;
}

/**
 * CheckboxGroup component - container for multiple checkboxes with multi-select
 *
 * A group component that manages multiple checkbox selections with support
 * for min/max constraints, validation, and accessibility.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CheckboxGroup value={selected} onChange={setSelected} label="Select options">
 *   <CheckboxGroupItem value="option1" label="Option 1" />
 *   <CheckboxGroupItem value="option2" label="Option 2" />
 *   <CheckboxGroupItem value="option3" label="Option 3" />
 * </CheckboxGroup>
 *
 * // With constraints
 * <CheckboxGroup
 *   value={selected}
 *   onChange={setSelected}
 *   label="Select 1-3 options"
 *   min={1}
 *   max={3}
 * >
 *   <CheckboxGroupItem value="a" label="Option A" />
 *   <CheckboxGroupItem value="b" label="Option B" />
 *   <CheckboxGroupItem value="c" label="Option C" />
 *   <CheckboxGroupItem value="d" label="Option D" />
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  (
    {
      value,
      defaultValue = [],
      onChange,
      variant = 'primary',
      size = 'md',
      orientation = 'vertical',
      label,
      helperText,
      errorMessage,
      error = false,
      disabled = false,
      readOnly = false,
      required = false,
      min,
      max,
      gap = 2,
      name: providedName,
      id: providedId,
      children,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    const autoId = useId();
    const autoName = useId();
    const id = providedId || autoId;
    const name = providedName || autoName;

    // Internal state for uncontrolled component
    const [internalValues, setInternalValues] = useState<string[]>(defaultValue);

    // Use controlled value if provided, otherwise use internal state
    const selectedValues = value !== undefined ? value : internalValues;

    const handleChange = useCallback(
      (itemValue: string, checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
        let newValues: string[];

        if (checked) {
          // Check max constraint before adding
          if (max !== undefined && selectedValues.length >= max) {
            return;
          }
          newValues = [...selectedValues, itemValue];
        } else {
          // Check min constraint before removing
          if (min !== undefined && selectedValues.length <= min) {
            return;
          }
          newValues = selectedValues.filter((v) => v !== itemValue);
        }

        // Update internal state if uncontrolled
        if (value === undefined) {
          setInternalValues(newValues);
        }

        onChange?.(newValues);
      },
      [value, selectedValues, min, max, onChange]
    );

    const contextValue: CheckboxGroupContextValue = {
      name,
      values: selectedValues,
      onChange: handleChange,
      disabled,
      readOnly,
      size,
      variant,
    };

    const gapStyle = {
      '--checkbox-group-gap': `var(--spacing-${['xs', 'sm', 'md', 'lg', 'xl', 'xxl'][gap] || 'sm'})`,
      ...style,
    } as React.CSSProperties;

    const groupClasses = [styles.checkboxGroup, className].filter(Boolean).join(' ');

    return (
      <fieldset
        ref={ref}
        id={id}
        className={groupClasses}
        data-orientation={orientation}
        data-error={error || undefined}
        data-component="checkbox-group"
        data-testid={testId || 'checkbox-group'}
        disabled={disabled}
        aria-invalid={error}
        aria-required={required}
        style={gapStyle}
        {...restProps}
      >
        {label && (
          <legend className={styles.legend} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </legend>
        )}

        <CheckboxGroupContext.Provider value={contextValue}>
          <div className={styles.checkboxList} data-orientation={orientation}>
            {children}
          </div>
        </CheckboxGroupContext.Provider>

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

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
