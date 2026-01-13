import React, {
  forwardRef,
  useState,
  useId,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import type { InputBaseProps } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../../assets/icons';
import styles from './Input.module.scss';

/**
 * Validation timing options
 */
export type ValidationTiming = 'blur' | 'change' | 'submit' | 'manual';

/**
 * HTML input types supported
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local';

/**
 * Format mask configuration for auto-formatting input
 */
export interface FormatMask {
  /**
   * The pattern to format (e.g., "(###) ###-####" for phone)
   */
  pattern: string;
  /**
   * Character used as placeholder in pattern (default: '#')
   */
  placeholder?: string;
}

/**
 * Validation result passed to onValidate callback
 */
export interface ValidationResult {
  /**
   * Whether the input is valid
   */
  isValid: boolean;
  /**
   * The value that was validated
   */
  value: string;
  /**
   * The validation regex pattern used
   */
  pattern?: RegExp;
}

export interface InputProps extends Omit<InputBaseProps, 'children'> {
  /**
   * HTML input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Label text to display above input
   */
  label?: string;

  /**
   * ID for the input element (also used for label[for])
   * Auto-generated if not provided
   */
  id?: string;

  /**
   * Icon to display at start of input
   * Can be icon name (string) or React component
   */
  startIcon?: React.ReactNode | IconName;

  /**
   * Icon to display at end of input
   * Can be icon name (string) or React component
   */
  endIcon?: React.ReactNode | IconName;

  /**
   * Helper text to display below input
   */
  helperText?: string;

  /**
   * Error message to display (overrides helperText when present)
   */
  errorMessage?: string;

  /**
   * Whether the input is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * Maximum character length (enables character counter)
   */
  maxLength?: number;

  /**
   * Show character counter when maxLength is set
   * @default true
   */
  showCounter?: boolean;

  /**
   * Regex pattern to filter what characters can be entered
   * Prevents invalid characters from being typed
   * @example /^[0-9]*$/ - only allow numbers
   */
  inputFilter?: RegExp;

  /**
   * Auto-formatting mask to apply as user types
   * Formats the input value according to a pattern
   * @example { pattern: "(###) ###-####" } - formats phone number
   */
  formatMask?: FormatMask | string;

  /**
   * Regex pattern for validation
   */
  validationRegex?: RegExp;

  /**
   * Validation callback - called when validation is triggered
   */
  onValidate?: (result: ValidationResult) => void;

  /**
   * When to trigger validation
   * @default 'blur'
   */
  validateOn?: ValidationTiming;

  /**
   * Show clear button (X icon) when input has value
   * @default false
   */
  showClearButton?: boolean;

  /**
   * Show password visibility toggle for password inputs
   * @default true
   */
  showPasswordToggle?: boolean;

  /**
   * Prefix text or component to display before input value
   */
  prefix?: React.ReactNode | string;

  /**
   * Suffix text or component to display after input value
   */
  suffix?: React.ReactNode | string;

  /**
   * Loading state - shows spinner
   * @default false
   */
  loading?: boolean;

  /**
   * Auto-focus the input on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Auto-complete attribute
   */
  autoComplete?: string;

  /**
   * Default value for uncontrolled component
   */
  defaultValue?: string;

  /**
   * Callback when input is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;

  /**
   * Callback when Enter key is pressed
   */
  onEnterPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Helper to render icon from IconName or ReactNode
const renderIcon = (
  icon: React.ReactNode | IconName | undefined,
  size = 16
): React.ReactNode => {
  if (!icon) {return null;}
  if (typeof icon === 'string') {
    return <Icon name={icon as IconName} size={size} />;
  }
  return icon;
};

// Loading spinner component
const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg
    className={styles.spinner}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

/**
 * Input component with comprehensive features
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      id: providedId,
      startIcon,
      endIcon,
      prefix,
      suffix,
      helperText,
      errorMessage,
      error = false,
      maxLength,
      showCounter = true,
      inputFilter,
      formatMask,
      validationRegex,
      onValidate,
      validateOn = 'blur',
      showClearButton = false,
      showPasswordToggle = true,
      loading = false,
      autoFocus = false,
      autoComplete,
      defaultValue,
      value: controlledValue,
      onChange,
      onFocus,
      onBlur,
      onClear,
      onEnterPress,
      disabled = false,
      readOnly = false,
      required = false,
      name,
      placeholder,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const generatedId = useId();
    const inputId = providedId || generatedId;

    // Controlled vs Uncontrolled handling
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // UI state
    const [isFocused, setIsFocused] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Ref for actual input element
    const inputRef = useRef<HTMLInputElement>(null);

    // Character count
    const characterCount = value?.toString().length || 0;

    // Determine actual input type (for password visibility)
    const currentInputType = type === 'password' && showPassword ? 'text' : type;

    /**
     * Apply input filter to restrict characters
     */
    const applyInputFilter = useCallback(
      (newValue: string): string => {
        if (!inputFilter) {return newValue;}
        if (!inputFilter.test(newValue)) {
          return value?.toString() || '';
        }
        return newValue;
      },
      [inputFilter, value]
    );

    /**
     * Apply format mask to auto-format input value
     */
    const applyFormatMask = useCallback(
      (rawValue: string): string => {
        if (!formatMask) {return rawValue;}

        const pattern = typeof formatMask === 'string' ? formatMask : formatMask.pattern;
        const placeholderChar =
          typeof formatMask === 'string' ? '#' : formatMask.placeholder || '#';

        // Remove all non-digit characters from input
        const digits = rawValue.replace(/\D/g, '');

        let formattedValue = '';
        let digitIndex = 0;

        // Iterate through pattern and build formatted value
        for (let i = 0; i < pattern.length && digitIndex < digits.length; i++) {
          if (pattern[i] === placeholderChar) {
            formattedValue += digits[digitIndex];
            digitIndex++;
          } else {
            formattedValue += pattern[i];
          }
        }

        return formattedValue;
      },
      [formatMask]
    );

    /**
     * Perform validation against validationRegex
     */
    const performValidation = useCallback(
      (valueToValidate: string): boolean => {
        if (!validationRegex) {return true;}

        const isValid = validationRegex.test(valueToValidate);
        setIsInvalid(!isValid);

        if (onValidate) {
          onValidate({
            isValid,
            value: valueToValidate,
            pattern: validationRegex,
          });
        }

        return isValid;
      },
      [validationRegex, onValidate]
    );

    /**
     * Change handler
     */
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;

        // 1. Enforce maxLength hard limit FIRST
        if (maxLength && newValue.length > maxLength) {
          return; // Prevent input beyond maxLength
        }

        // 2. Apply input filter (character restriction)
        if (inputFilter) {
          newValue = applyInputFilter(newValue);
          if (newValue === value) {return;} // No change, don't update
        }

        // 3. Apply format mask (auto-formatting)
        if (formatMask) {
          newValue = applyFormatMask(newValue);
        }

        // 4. Update value
        if (!isControlled) {
          setInternalValue(newValue);
        }

        // 5. Trigger validation if validateOn is 'change'
        if (validateOn === 'change' && validationRegex) {
          performValidation(newValue);
        }

        // 6. Call onChange callback
        if (onChange) {
          // Create a new event with the modified value
          const modifiedEvent = {
            ...event,
            target: {
              ...event.target,
              value: newValue,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(modifiedEvent);
        }
      },
      [
        maxLength,
        inputFilter,
        formatMask,
        isControlled,
        validateOn,
        validationRegex,
        onChange,
        applyInputFilter,
        applyFormatMask,
        performValidation,
        value,
      ]
    );

    /**
     * Focus handler
     */
    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (onFocus) {
          onFocus(event);
        }
      },
      [onFocus]
    );

    /**
     * Blur handler - triggers validation if validateOn is 'blur'
     */
    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        if (validateOn === 'blur' && validationRegex) {
          performValidation(event.target.value);
        }

        if (onBlur) {
          onBlur(event);
        }
      },
      [validateOn, validationRegex, performValidation, onBlur]
    );

    /**
     * Key down handler
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onEnterPress) {
          onEnterPress(event);
        }
      },
      [onEnterPress]
    );

    /**
     * Clear button handler
     */
    const handleClear = useCallback(() => {
      const newValue = '';

      if (!isControlled) {
        setInternalValue(newValue);
      }

      // Reset validation state
      setIsInvalid(false);

      // Call onClear callback
      if (onClear) {
        onClear();
      }

      // Call onChange with empty value
      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue, name },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      // Refocus input after clear
      inputRef.current?.focus();
    }, [isControlled, onClear, onChange, name]);

    /**
     * Password visibility toggle
     */
    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
      // Keep focus on input
      inputRef.current?.focus();
    }, []);

    /**
     * Check if near limit (>= 90%)
     */
    const isNearLimit = (): boolean => {
      if (!maxLength) {return false;}
      return characterCount >= maxLength * 0.9;
    };

    /**
     * Check if at limit
     */
    const isAtLimit = (): boolean => {
      if (!maxLength) {return false;}
      return characterCount >= maxLength;
    };

    /**
     * Determine input state for styling
     */
    const getInputState = (): string => {
      if (disabled) {return 'disabled';}
      if (readOnly) {return 'readonly';}
      if (error || isInvalid || errorMessage) {return 'error';}
      if (isFocused) {return 'focused';}
      return 'default';
    };

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        ...(inputRef.current as HTMLInputElement),
        validate: () => performValidation(value?.toString() || ''),
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
      }),
      [performValidation, value]
    );

    // Build class names
    const wrapperClasses = [styles.inputWrapper, className].filter(Boolean).join(' ');

    const hasError = error || isInvalid || !!errorMessage;
    const showHelperOrError = helperText || errorMessage;
    const showPasswordToggleBtn = type === 'password' && showPasswordToggle;
    const showClearBtn = showClearButton && value && !disabled && !readOnly;

    return (
      <div className={wrapperClasses} data-component="input" style={style}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={styles.inputLabel} data-required={required}>
            {label}
            {required && (
              <span className={styles.requiredIndicator} aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div
          className={styles.inputContainer}
          data-state={getInputState()}
        >
          {/* Start Icon / Prefix */}
          {(startIcon || prefix) && (
            <div className={styles.inputPrefix}>
              {startIcon && renderIcon(startIcon, 16)}
              {prefix && <span className={styles.prefixText}>{prefix}</span>}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={inputRef}
            id={inputId}
            type={currentInputType}
            className={styles.inputField}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            aria-invalid={hasError}
            aria-describedby={showHelperOrError ? `${inputId}-description` : undefined}
            aria-label={ariaLabel}
            data-testid={testId || 'input'}
            {...restProps}
          />

          {/* End Icons / Suffix / Loading / Clear / Password Toggle */}
          {(endIcon || suffix || loading || showClearBtn || showPasswordToggleBtn) && (
            <div className={styles.inputSuffix}>
              {loading && <Spinner size={16} />}
              {suffix && !loading && <span className={styles.suffixText}>{suffix}</span>}
              {endIcon &&
                !loading &&
                renderIcon(endIcon, 16)}
              {showClearBtn && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={handleClear}
                  aria-label="Clear input"
                  tabIndex={-1}
                >
                  <Icon name="close" size={16} />
                </button>
              )}
              {showPasswordToggleBtn && (
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer: Helper Text / Error Message / Character Counter */}
        {(showHelperOrError || (maxLength && showCounter)) && (
          <div className={styles.inputFooter}>
            {/* Helper or Error Message */}
            {showHelperOrError && (
              <div
                id={`${inputId}-description`}
                className={errorMessage || hasError ? styles.errorMessage : styles.helperText}
                role={errorMessage || hasError ? 'alert' : undefined}
              >
                {errorMessage || helperText}
              </div>
            )}

            {/* Character Counter */}
            {maxLength && showCounter && (
              <div
                className={[
                  styles.characterCounter,
                  isNearLimit() && !isAtLimit() && styles.atWarning,
                  isAtLimit() && styles.atLimit,
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-live="polite"
                aria-atomic="true"
              >
                <span className={styles.currentCount}>{characterCount}</span>
                <span className={styles.separator}> / </span>
                <span className={styles.maxCount}>{maxLength}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

