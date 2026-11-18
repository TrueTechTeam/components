import React, { useState, useMemo, useCallback } from 'react';
import { Select, type SelectOption } from '../Select/Select';
import { Input } from '../Input';
import styles from './PhoneInput.module.scss';
import type { InputBaseProps } from '../../../types/component.types';
import { useLabels } from '../../../contexts/LabelsContext';

/**
 * Country data for phone input
 */
export interface Country {
  code: string; // ISO 3166-1 alpha-2 code
  name: string;
  dialCode: string;
  flag: string; // Unicode flag emoji
  format?: string; // Phone number format mask (e.g., "(###) ###-####")
}

export interface PhoneInputProps
  extends Omit<InputBaseProps, 'value' | 'onChange' | 'type' | 'onBlur'> {
  /**
   * Controlled phone number value (full number with country code)
   */
  value?: string;

  /**
   * Default phone number value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Default country code (ISO 3166-1 alpha-2)
   */
  defaultCountry?: string;

  /**
   * Callback when phone number changes
   */
  onChange?: (phone: string, country: Country) => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Input label text
   */
  label?: string;

  /**
   * Label placement
   */
  labelPlacement?: 'top' | 'left';

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message (shows when error is true)
   */
  errorMessage?: string;

  /**
   * Whether the input is in an error state
   */
  error?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Whether to show the country search dropdown
   */
  showCountrySearch?: boolean;

  /**
   * Placeholder for country search
   */
  countrySearchPlaceholder?: string;

  /**
   * Custom country list (defaults to common countries)
   */
  countries?: Country[];

  /**
   * Whether to format the phone number based on country format
   */
  autoFormat?: boolean;
}

/**
 * Common countries with dial codes and formats
 */
const DEFAULT_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', format: '(###) ###-####' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: '(###) ###-####' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', format: '#### ### ####' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', format: '#### ### ###' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', format: '#### #######' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: '# ## ## ## ##' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', format: '### ## ## ##' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', format: '### ### ####' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', format: '##-####-####' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', format: '### #### ####' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', format: '##### #####' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', format: '(##) #####-####' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', format: '### ### ####' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', format: '(###) ###-##-##' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', format: '## ### ####' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', format: '##-####-####' },
];

/**
 * Format phone number based on country format mask
 */
const formatPhoneNumber = (value: string, format?: string): string => {
  if (!format) {
    return value;
  }

  const digits = value.replace(/\D/g, '');
  let formatted = '';
  let digitIndex = 0;

  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    if (format[i] === '#') {
      formatted += digits[digitIndex];
      digitIndex++;
    } else {
      formatted += format[i];
    }
  }

  // Add remaining digits if they don't fit the format
  if (digitIndex < digits.length) {
    formatted += digits.slice(digitIndex);
  }

  return formatted;
};

/**
 * PhoneInput component with country code selector and auto-formatting
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   label="Phone Number"
 *   defaultCountry="US"
 *   onChange={(phone, country) => console.log(phone, country)}
 * />
 * ```
 */
export const PhoneInput = ({
  ref,
  value: controlledValue,
  defaultValue = '',
  defaultCountry = 'US',
  onChange,
  onBlur,
  label,
  labelPlacement = 'top',
  helperText,
  errorMessage,
  error = false,
  required = false,
  disabled = false,
  showCountrySearch = true,
  countrySearchPlaceholder: countrySearchPlaceholderProp,
  countries = DEFAULT_COUNTRIES,
  autoFormat = true,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
  ...rest
}: PhoneInputProps & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  const t = useLabels();
  const countrySearchPlaceholder =
    countrySearchPlaceholderProp === undefined
      ? t('phoneInput.searchCountries')
      : countrySearchPlaceholderProp;
  // Find default country from list
  const defaultCountryData = countries.find((c) => c.code === defaultCountry) || countries[0];

  // State
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountryData);

  // Controlled vs uncontrolled
  const phoneValue = controlledValue !== undefined ? controlledValue : internalValue;

  // Convert countries to Select options
  const countryOptions = useMemo<SelectOption[]>(() => {
    return countries.map((country) => ({
      value: country.code,
      label: (
        <div className={styles.countryOption}>
          <span className={styles.flag}>{country.flag}</span>
          <span className={styles.dialCode}>{country.dialCode}</span>
        </div>
      ),
    }));
  }, [countries]);

  // Handle phone number change
  const handlePhoneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value;

      // Apply formatting if enabled
      if (autoFormat && selectedCountry.format) {
        newValue = formatPhoneNumber(newValue, selectedCountry.format);
      }

      // Update internal state if uncontrolled
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      // Build full phone number with country code
      const fullPhone = `${selectedCountry.dialCode}${newValue.replace(/\D/g, '')}`;

      // Call onChange callback
      onChange?.(fullPhone, selectedCountry);
    },
    [controlledValue, onChange, selectedCountry, autoFormat]
  );

  // Handle country selection
  const handleCountrySelect = useCallback(
    (countryCode: string) => {
      const country = countries.find((c) => c.code === countryCode);
      if (!country) {
        return;
      }

      setSelectedCountry(country);

      // Reformat existing phone number with new country format
      if (phoneValue && autoFormat && country.format) {
        const formatted = formatPhoneNumber(phoneValue, country.format);
        if (controlledValue === undefined) {
          setInternalValue(formatted);
        }
        const fullPhone = `${country.dialCode}${formatted.replace(/\D/g, '')}`;
        onChange?.(fullPhone, country);
      }
    },
    [countries, phoneValue, autoFormat, controlledValue, onChange]
  );

  // Placeholder text based on country format
  const placeholder = selectedCountry.format
    ? selectedCountry.format.replace(/#/g, '0')
    : t('phoneInput.placeholder');

  // Container classes
  const containerClasses = [
    styles.container,
    labelPlacement === 'left' && styles.horizontal,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} style={style} data-testid={dataTestId}>
      {label && (
        <label className={styles.label} data-required={required || undefined}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputContainer}>
        {/* Phone number input with country code in startIcon */}
        <Input
          {...rest}
          ref={ref}
          type="tel"
          value={phoneValue}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-label={ariaLabel || label || t('phoneInput.label')}
          error={error}
          helperText={helperText}
          errorMessage={errorMessage}
          startIcon={
            <div className={styles.countrySelectWrapper}>
              <Select
                options={countryOptions}
                value={selectedCountry.code}
                onChange={handleCountrySelect}
                disabled={disabled}
                searchable={showCountrySearch}
                searchPlaceholder={countrySearchPlaceholder}
                aria-label={t('phoneInput.selectCountry')}
                className={styles.countrySelect}
              />
            </div>
          }
          className={styles.phoneNumberInput}
        />
      </div>
    </div>
  );
};
