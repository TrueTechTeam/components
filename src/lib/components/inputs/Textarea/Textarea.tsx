import React, { forwardRef, useState, useId, useCallback, useEffect, useRef } from 'react';
import type { ValidationResult, ValidationTiming } from '../../Input/Input';
import styles from './Textarea.module.scss';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * Label text to display above textarea
   */
  label?: string;

  /**
   * Helper text to display below textarea
   */
  helperText?: string;

  /**
   * Error message to display when in error state
   */
  errorMessage?: string;

  /**
   * Whether the textarea is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * Number of visible text rows
   * @default 3
   */
  rows?: number;

  /**
   * Minimum number of rows (for auto-resize)
   */
  minRows?: number;

  /**
   * Maximum number of rows (for auto-resize)
   */
  maxRows?: number;

  /**
   * Auto-resize textarea based on content
   * @default false
   */
  autoResize?: boolean;

  /**
   * Maximum character length
   */
  maxLength?: number;

  /**
   * Show character counter
   * @default false
   */
  showCounter?: boolean;

  /**
   * Validation regex pattern
   */
  validationRegex?: RegExp;

  /**
   * Callback fired when validation completes
   */
  onValidate?: (result: ValidationResult) => void;

  /**
   * When to perform validation
   * @default 'blur'
   */
  validateOn?: ValidationTiming;

  /**
   * Control resize behavior
   * @default 'vertical'
   */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';

  /**
   * ID for the textarea element
   * Auto-generated if not provided
   */
  id?: string;
}

/**
 * Textarea component
 * Multi-line text input with auto-resize and character counting
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   placeholder="Enter description..."
 *   maxLength={200}
 *   showCounter
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      error = false,
      rows = 3,
      minRows,
      maxRows,
      autoResize = false,
      maxLength,
      showCounter = false,
      validationRegex,
      onValidate,
      validateOn = 'blur',
      resize = 'vertical',
      disabled = false,
      readOnly = false,
      required = false,
      value: controlledValue,
      defaultValue,
      onChange,
      onBlur,
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [internalValue, setInternalValue] = useState((defaultValue as string) || '');
    const [validationError, setValidationError] = useState<string | null>(null);

    const value = controlledValue !== undefined ? String(controlledValue) : internalValue;
    const hasError = error || !!validationError;
    const displayError = validationError || errorMessage;

    // Merge refs
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(textareaRef.current);
      } else if (ref) {
        ref.current = textareaRef.current;
      }
    }, [ref]);

    // Auto-resize logic
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';

        const scrollHeight = textarea.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);

        let newHeight = scrollHeight;

        if (minRows) {
          const minHeight = lineHeight * minRows;
          newHeight = Math.max(newHeight, minHeight);
        }

        if (maxRows) {
          const maxHeight = lineHeight * maxRows;
          newHeight = Math.min(newHeight, maxHeight);
        }

        textarea.style.height = `${newHeight}px`;
      }
    }, [value, autoResize, minRows, maxRows]);

    const validate = useCallback((valueToValidate: string) => {
      if (!validationRegex) {return;}

      const isValid = validationRegex.test(valueToValidate);
      const result: ValidationResult = {
        isValid,
        value: valueToValidate,
        pattern: validationRegex,
      };

      setValidationError(isValid ? null : 'Invalid input');
      onValidate?.(result);
    }, [validationRegex, onValidate]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;

        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }

        onChange?.(event);

        if (validateOn === 'change') {
          validate(newValue);
        }
      },
      [controlledValue, onChange, validateOn, validate]
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        onBlur?.(event);

        if (validateOn === 'blur') {
          validate(event.target.value);
        }
      },
      [onBlur, validateOn, validate]
    );

    const characterCount = value.length;
    const showCounterElement = showCounter || (maxLength && showCounter !== false);
    const isNearLimit = maxLength && characterCount >= maxLength * 0.9;
    const isAtLimit = maxLength && characterCount >= maxLength;

    return (
      <div className={`${styles.container} ${className || ''}`} data-testid={dataTestId && `${dataTestId}-container`}>
        {label && (
          <label htmlFor={id} className={styles.label} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.textareaWrapper}>
          <textarea
            ref={textareaRef}
            id={id}
            className={styles.textarea}
            data-error={hasError || undefined}
            data-resize={resize}
            data-component="textarea"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            rows={autoResize ? undefined : rows}
            maxLength={maxLength}
            aria-label={ariaLabel || label}
            aria-invalid={hasError}
            aria-describedby={
              (helperText || displayError) ? `${id}-helper-text` : undefined
            }
            {...rest}
          />

          {showCounterElement && (
            <div
              className={styles.counter}
              data-warning={isNearLimit && !isAtLimit ? true : undefined}
              data-error={isAtLimit ? true : undefined}
            >
              {characterCount}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>

        {(helperText || hasError) && (
          <div
            id={`${id}-helper-text`}
            className={styles.helperText}
            data-error={hasError || undefined}
            role={hasError ? 'alert' : undefined}
            aria-live={hasError ? 'polite' : undefined}
          >
            {hasError && displayError ? displayError : helperText}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
