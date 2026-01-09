import type { FormFieldValidation, FormValues } from '../types';

/**
 * Validate a field value against validation rules
 */
export const validateField = (
  value: any,
  validation: FormFieldValidation,
  allValues: FormValues = {}
): string | null => {
  // Required validation
  if (validation.required) {
    if (value === null || value === undefined || value === '') {
      return validation.messages?.required || 'This field is required';
    }

    // For arrays (multi-select, tags, etc.)
    if (Array.isArray(value) && value.length === 0) {
      return validation.messages?.required || 'This field is required';
    }
  }

  // Skip other validations if value is empty and not required
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Pattern validation
  if (validation.pattern && typeof value === 'string') {
    if (!validation.pattern.test(value)) {
      return validation.messages?.pattern || 'Invalid format';
    }
  }

  // Min length validation
  if (validation.minLength !== undefined && typeof value === 'string') {
    if (value.length < validation.minLength) {
      return (
        validation.messages?.minLength ||
        `Minimum length is ${validation.minLength} characters`
      );
    }
  }

  // Max length validation
  if (validation.maxLength !== undefined && typeof value === 'string') {
    if (value.length > validation.maxLength) {
      return (
        validation.messages?.maxLength ||
        `Maximum length is ${validation.maxLength} characters`
      );
    }
  }

  // Min value validation
  if (validation.min !== undefined && typeof value === 'number') {
    if (value < validation.min) {
      return (
        validation.messages?.min || `Minimum value is ${validation.min}`
      );
    }
  }

  // Max value validation
  if (validation.max !== undefined && typeof value === 'number') {
    if (value > validation.max) {
      return (
        validation.messages?.max || `Maximum value is ${validation.max}`
      );
    }
  }

  // Custom validation
  if (validation.custom) {
    const customError = validation.custom(value, allValues);
    if (customError) {
      return customError;
    }
  }

  return null;
};

/**
 * Hook for form validation utilities
 */
export const useFormValidation = () => {
  return {
    validateField,
  };
};
