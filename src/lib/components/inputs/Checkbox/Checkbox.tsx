import React, { forwardRef, useState, useId, useCallback, useEffect, useRef } from 'react';
import type { ComponentSize, ComponentVariant, InputBaseProps } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import styles from './Checkbox.module.scss';

export interface CheckboxProps extends Omit<InputBaseProps, 'value' | 'onChange' | 'placeholder'> {
  /**
   * Checkbox variant style
   * @default 'primary'
   */
  variant?: ComponentVariant;

  /**
   * Checkbox size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled component
   */
  defaultChecked?: boolean;

  /**
   * Whether the checkbox is in an indeterminate state
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Callback fired when the checkbox state changes
   * @param checked - The new checked state
   * @param event - The change event
   */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Label text to display next to checkbox
   */
  label?: string;

  /**
   * Label placement relative to checkbox
   * @default 'end'
   */
  labelPlacement?: 'start' | 'end';

  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;

  /**
   * Error message to display when checkbox is in error state
   */
  errorMessage?: string;

  /**
   * Whether the checkbox is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * Custom check icon
   * Can be icon name (string) or React component
   */
  checkIcon?: React.ReactNode | IconName;

  /**
   * Custom indeterminate icon
   * Can be icon name (string) or React component
   */
  indeterminateIcon?: React.ReactNode | IconName;

  /**
   * ID for the input element (also used for label[for])
   * Auto-generated if not provided
   */
  id?: string;
}

/**
 * Checkbox component
 * A checkbox input with support for checked, unchecked, and indeterminate states
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={(checked) => setAccepted(checked)}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      checked,
      defaultChecked = false,
      indeterminate = false,
      onChange,
      label,
      labelPlacement = 'end',
      helperText,
      errorMessage,
      error = false,
      checkIcon = 'check',
      indeterminateIcon,
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
    const internalRef = useRef<HTMLInputElement>(null);

    // Internal state for uncontrolled component
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // Use controlled value if provided, otherwise use internal state
    const isChecked = checked !== undefined ? checked : internalChecked;

    // Merge refs
    useEffect(() => {
      const inputElement = internalRef.current;
      if (inputElement) {
        inputElement.indeterminate = indeterminate;
      }

      // Forward ref
      if (typeof ref === 'function') {
        ref(inputElement);
      } else if (ref) {
        ref.current = inputElement;
      }
    }, [indeterminate, ref]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled || readOnly) {
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
      [checked, disabled, readOnly, onChange]
    );

    const getIconSize = () => {
      switch (size) {
        case 'sm':
          return 12;
        case 'md':
          return 16;
        case 'lg':
          return 20;
        default:
          return 16;
      }
    };

    const renderIcon = (icon: React.ReactNode | IconName | undefined, defaultIcon?: IconName) => {
      const iconToRender = icon || defaultIcon;
      if (!iconToRender) {return null;}

      if (typeof iconToRender === 'string') {
        return (
          <Icon name={iconToRender as IconName} size={getIconSize()} className={styles.icon} />
        );
      }

      return <span className={styles.icon}>{iconToRender}</span>;
    };

    const checkboxBox = (
      <label
        htmlFor={id}
        className={styles.checkbox}
        data-variant={variant}
        data-size={size}
        data-checked={isChecked || undefined}
        data-indeterminate={indeterminate || undefined}
        data-error={error || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-component="checkbox"
      >
        <input
          ref={internalRef}
          type="checkbox"
          id={id}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={styles.input}
          data-testid={dataTestId}
          aria-label={ariaLabel || label}
          aria-checked={indeterminate ? 'mixed' : isChecked}
          aria-disabled={disabled}
          aria-readonly={readOnly}
          aria-invalid={error}
          {...rest}
        />

        <span className={styles.box}>
          {indeterminate
            ? renderIcon(indeterminateIcon, 'minus')
            : isChecked && renderIcon(checkIcon, 'check')}
        </span>
      </label>
    );

    if (!label) {
      return (
        <div
          className={`${styles.wrapper} ${className || ''}`}
          data-testid={dataTestId && `${dataTestId}-container`}
        >
          {checkboxBox}
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

    return (
      <div
        className={`${styles.wrapper} ${className || ''}`}
        data-testid={dataTestId && `${dataTestId}-container`}
      >
        <div className={styles.container} data-label-placement={labelPlacement}>
          {checkboxBox}
          <span className={styles.labelText} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </span>
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

Checkbox.displayName = 'Checkbox';

