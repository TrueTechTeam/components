import React, { forwardRef, useState, useId, useCallback, useMemo } from 'react';
import { IconButton } from '../../buttons/IconButton';
import { Input } from '../Input';
import styles from './NumberInput.module.scss';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'onBlur' | 'width'> {
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
  /** Width of the input (e.g., '100px', '6rem', 120) */
  width?: number | string;
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
      width,
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

    // Calculate auto-width based on max value if no width is provided
    const calculatedWidth = useMemo(() => {
      if (width !== undefined || max === undefined) {
        return undefined;
      }

      // Calculate number of digits in max value
      const numDigits = Math.abs(max).toString().length;

      // Constants for width calculation:
      // - Each digit is approximately 10px wide
      // - Two icon buttons at 40px each = 80px
      // - Border: 2px (1px each side)
      // - Extra spacing: 16px
      const digitWidth = 10;
      const buttonsWidth = 80;
      const borderWidth = 2;
      const extraSpacing = 16;

      return numDigits * digitWidth + buttonsWidth + borderWidth + extraSpacing;
    }, [width, max]);

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

    const containerStyle = width
      ? { width: typeof width === 'number' ? `${width}px` : width }
      : calculatedWidth
        ? { width: `${calculatedWidth}px` }
        : undefined;

    return (
      <div
        className={`${styles.container} ${className || ''}`}
        style={containerStyle}
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

