/**
 * Validation utilities for form components
 * Provides common validation functions and composition utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export type Validator = (value: any) => string | null;

/**
 * Common validators for form inputs
 */
export const validators = {
  /**
   * Validates that a value is not empty
   * @param message Custom error message
   */
  required:
    (message = 'This field is required'): Validator =>
    (value: any): string | null => {
      if (value === null || value === undefined) {
        return message;
      }
      if (typeof value === 'string' && value.trim() === '') {
        return message;
      }
      if (Array.isArray(value) && value.length === 0) {
        return message;
      }
      return null;
    },

  /**
   * Validates email format
   * @param message Custom error message
   */
  email:
    (message = 'Please enter a valid email address'): Validator =>
    (value: string): string | null => {
      if (!value) {
        return null;
      } // Use required() for required validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : message;
    },

  /**
   * Validates minimum string length
   * @param min Minimum length
   * @param message Custom error message
   */
  minLength:
    (min: number, message?: string): Validator =>
    (value: string): string | null => {
      if (!value) {
        return null;
      } // Use required() for required validation
      const errorMessage = message || `Minimum ${min} characters required`;
      return value.length >= min ? null : errorMessage;
    },

  /**
   * Validates maximum string length
   * @param max Maximum length
   * @param message Custom error message
   */
  maxLength:
    (max: number, message?: string): Validator =>
    (value: string): string | null => {
      if (!value) {
        return null;
      }
      const errorMessage = message || `Maximum ${max} characters allowed`;
      return value.length <= max ? null : errorMessage;
    },

  /**
   * Validates against a regex pattern
   * @param regex Regular expression pattern
   * @param message Error message
   */
  pattern:
    (regex: RegExp, message = 'Invalid format'): Validator =>
    (value: string): string | null => {
      if (!value) {
        return null;
      } // Use required() for required validation
      return regex.test(value) ? null : message;
    },

  /**
   * Validates minimum numeric value
   * @param min Minimum value
   * @param message Custom error message
   */
  min:
    (min: number, message?: string): Validator =>
    (value: number): string | null => {
      if (value === null || value === undefined) {
        return null;
      }
      const errorMessage = message || `Value must be at least ${min}`;
      return value >= min ? null : errorMessage;
    },

  /**
   * Validates maximum numeric value
   * @param max Maximum value
   * @param message Custom error message
   */
  max:
    (max: number, message?: string): Validator =>
    (value: number): string | null => {
      if (value === null || value === undefined) {
        return null;
      }
      const errorMessage = message || `Value must be at most ${max}`;
      return value <= max ? null : errorMessage;
    },

  /**
   * Validates numeric range
   * @param min Minimum value
   * @param max Maximum value
   * @param message Custom error message
   */
  range:
    (min: number, max: number, message?: string): Validator =>
    (value: number): string | null => {
      if (value === null || value === undefined) {
        return null;
      }
      const errorMessage = message || `Value must be between ${min} and ${max}`;
      return value >= min && value <= max ? null : errorMessage;
    },

  /**
   * Validates URL format
   * @param message Custom error message
   */
  url:
    (message = 'Please enter a valid URL'): Validator =>
    (value: string): string | null => {
      if (!value) {
        return null;
      }
      try {
        new URL(value);
        return null;
      } catch {
        return message;
      }
    },

  /**
   * Validates phone number format (basic)
   * @param message Custom error message
   */
  phone:
    (message = 'Please enter a valid phone number'): Validator =>
    (value: string): string | null => {
      if (!value) {
        return null;
      }
      // Basic phone validation - accepts various formats
      const phoneRegex = /^[\d\s\-()+.]+$/;
      const digitsOnly = value.replace(/\D/g, '');
      if (!phoneRegex.test(value) || digitsOnly.length < 10) {
        return message;
      }
      return null;
    },

  /**
   * Validates that value matches another field
   * @param otherValue Value to match against
   * @param message Custom error message
   */
  matches:
    (otherValue: any, message = 'Values do not match'): Validator =>
    (value: any): string | null => {
      return value === otherValue ? null : message;
    },

  /**
   * Validates file size
   * @param maxSize Maximum size in bytes
   * @param message Custom error message
   */
  fileSize:
    (maxSize: number, message?: string): Validator =>
    (file: File): string | null => {
      if (!file) {
        return null;
      }
      const errorMessage = message || `File size must be less than ${formatBytes(maxSize)}`;
      return file.size <= maxSize ? null : errorMessage;
    },

  /**
   * Validates file type
   * @param allowedTypes Array of allowed MIME types or extensions
   * @param message Custom error message
   */
  fileType:
    (allowedTypes: string[], message?: string): Validator =>
    (file: File): string | null => {
      if (!file) {
        return null;
      }
      const errorMessage = message || `File type must be one of: ${allowedTypes.join(', ')}`;

      const isAllowed = allowedTypes.some((type) => {
        if (type.startsWith('.')) {
          // Extension check
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else {
          // MIME type check
          return file.type === type || file.type.startsWith(`${type}/`);
        }
      });

      return isAllowed ? null : errorMessage;
    },
};

/**
 * Combines multiple validators into a single validator
 * Returns the first error encountered
 * @param validators Array of validator functions
 */
export const combineValidators =
  (...validators: Validator[]): Validator =>
  (value: any): string | null => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return null;
  };

/**
 * Validates a value against a single validator or array of validators
 * @param value Value to validate
 * @param validator Single validator or array of validators
 * @returns ValidationResult object
 */
export const validate = (value: any, validator: Validator | Validator[]): ValidationResult => {
  const validatorFn = Array.isArray(validator) ? combineValidators(...validator) : validator;

  const errorMessage = validatorFn(value);

  return {
    isValid: errorMessage === null,
    errorMessage,
  };
};

/**
 * Validates multiple fields
 * @param values Object with field values
 * @param validators Object with field validators
 * @returns Object with validation results
 */
export const validateForm = (
  values: Record<string, any>,
  validators: Record<string, Validator | Validator[]>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [field, validator] of Object.entries(validators)) {
    results[field] = validate(values[field], validator);
  }

  return results;
};

/**
 * Checks if all validation results are valid
 * @param results Validation results object
 */
export const isFormValid = (results: Record<string, ValidationResult>): boolean => {
  return Object.values(results).every((result) => result.isValid);
};

/**
 * Extracts error messages from validation results
 * @param results Validation results object
 * @returns Object with error messages (only for invalid fields)
 */
export const getErrorMessages = (
  results: Record<string, ValidationResult>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, result] of Object.entries(results)) {
    if (!result.isValid && result.errorMessage) {
      errors[field] = result.errorMessage;
    }
  }

  return errors;
};

/**
 * Helper function to format bytes to human-readable string
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
