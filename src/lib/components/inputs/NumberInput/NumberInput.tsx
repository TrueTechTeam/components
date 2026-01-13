import React, { forwardRef, useState, useId, useCallback } from 'react';
import { IconButton } from '../../buttons/IconButton';
import { Input } from '../Input';
import styles from './NumberInput.module.scss';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'onBlur'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  error?: boolean;
  formatDisplay?: (value: number) => string;
  id?: string;
  'data-testid'?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      onBlur,
      min,
      max,
      step = 1,
      label,
      helperText,
      errorMessage,
      error = false,
      formatDisplay,
      disabled = false,
      readOnly = false,
      required = false,
      id: providedId,
      className,
      'data-testid': dataTestId,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;
    const [internalValue, setInternalValue] = useState(defaultValue);

    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = useCallback(
      (newValue: number) => {
        let clampedValue = newValue;
        if (min !== undefined) {clampedValue = Math.max(min, clampedValue);}
        if (max !== undefined) {clampedValue = Math.min(max, clampedValue);}

        if (controlledValue === undefined) {
          setInternalValue(clampedValue);
        }
        onChange?.(clampedValue);
      },
      [controlledValue, min, max, onChange]
    );

    const increment = () => {
      if (disabled || readOnly) {return;}
      handleChange(value + step);
    };

    const decrement = () => {
      if (disabled || readOnly) {return;}
      handleChange(value - step);
    };

    const displayValue = formatDisplay ? formatDisplay(value) : value;

    // Icon button components for increment/decrement
    const decrementButton = (
      <IconButton
        variant="ghost"
        icon="minus"
        onClick={decrement}
        disabled={disabled || readOnly || (min !== undefined && value <= min)}
        aria-label="Decrease value"
        type="button"
        className={styles.iconButton}
      />
    );

    const incrementButton = (
      <IconButton
        variant="ghost"
        icon="plus"
        onClick={increment}
        disabled={disabled || readOnly || (max !== undefined && value >= max)}
        aria-label="Increase value"
        type="button"
        className={styles.iconButton}
      />
    );

    return (
      <div
        className={`${styles.container} ${className || ''}`}
        data-testid={dataTestId && `${dataTestId}-container`}
      >
        {label && (
          <label htmlFor={id} className={styles.label} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <Input
          ref={ref}
          id={id}
          type={formatDisplay ? 'text' : 'number'}
          value={displayValue.toString()}
          onChange={(e) => handleChange(Number(e.target.value))}
          onBlur={onBlur}
          error={error}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          helperText={helperText}
          errorMessage={errorMessage}
          startIcon={decrementButton}
          endIcon={incrementButton}
          className={styles.input}
          {...rest}
        />
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

