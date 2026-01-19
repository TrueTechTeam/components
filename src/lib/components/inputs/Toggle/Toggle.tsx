import React, { forwardRef, useState, useId, useCallback } from 'react';
import type { ComponentSize, ComponentVariant, InputBaseProps } from '../../../types';
import styles from './Toggle.module.scss';

export interface ToggleProps extends Omit<InputBaseProps, 'value' | 'onChange' | 'placeholder'> {
  /**
   * Toggle variant style
   * @default 'primary'
   */
  variant?: ComponentVariant;

  /**
   * Toggle size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Whether the toggle is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the toggle is checked
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled component
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the toggle state changes
   * @param checked - The new checked state
   * @param event - The change event
   */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Label text to display next to toggle
   */
  label?: string;

  /**
   * Label placement relative to toggle
   * @default 'end'
   */
  labelPlacement?: 'start' | 'end';

  /**
   * Helper text to display below the toggle
   */
  helperText?: string;

  /**
   * Error message to display when toggle is in error state
   */
  errorMessage?: string;

  /**
   * Whether the toggle is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * ID for the input element (also used for label[for])
   * Auto-generated if not provided
   */
  id?: string;
}

/**
 * Toggle (Switch) component
 * A toggle switch for boolean input with smooth animations
 *
 * @example
 * ```tsx
 * <Toggle
 *   label="Enable notifications"
 *   checked={enabled}
 *   onChange={(checked) => setEnabled(checked)}
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      checked,
      defaultChecked = false,
      onChange,
      label,
      labelPlacement = 'end',
      helperText,
      errorMessage,
      error = false,
      disabled = false,
      readOnly = false,
      required = false,
      name,
      id: providedId,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;

    // Internal state for uncontrolled component
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // Use controlled value if provided, otherwise use internal state
    const isChecked = checked !== undefined ? checked : internalChecked;

    const isDisabled = disabled || loading;

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isDisabled || readOnly) {
          return;
        }

        const newChecked = event.target.checked;

        // Update internal state if uncontrolled
        if (checked === undefined) {
          setInternalChecked(newChecked);
        }

        // Call onChange callback
        onChange?.(newChecked, event);
      },
      [checked, isDisabled, readOnly, onChange]
    );

    const toggleSwitch = (
      <label
        htmlFor={id}
        className={styles.toggle}
        data-variant={variant}
        data-size={size}
        data-checked={isChecked || undefined}
        data-error={error || undefined}
        data-disabled={isDisabled || undefined}
        data-loading={loading || undefined}
        data-readonly={readOnly || undefined}
        data-component="toggle"
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          disabled={isDisabled}
          readOnly={readOnly}
          required={required}
          className={styles.input}
          data-testid={dataTestId}
          aria-label={ariaLabel || label}
          aria-checked={isChecked}
          aria-disabled={isDisabled}
          aria-readonly={readOnly}
          aria-invalid={error}
          {...rest}
        />

        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </label>
    );

    if (!label) {
      return (
        <div className={className} data-testid={dataTestId && `${dataTestId}-container`}>
          <div className={styles.toggleWrapper}>
            {toggleSwitch}
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
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${styles.container} ${className || ''}`}
        data-label-placement={labelPlacement}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-testid={dataTestId && `${dataTestId}-container`}
      >
        <div className={styles.toggleWithLabel}>
          {toggleSwitch}
          <label htmlFor={id} className={styles.labelText} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        </div>
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
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

