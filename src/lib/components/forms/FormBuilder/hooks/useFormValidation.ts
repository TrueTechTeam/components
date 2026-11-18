import { useCallback } from 'react';
import {
  translateDefault,
  useLabels,
  type LabelTranslator,
} from '../../../../contexts/LabelsContext';
import type { FormFieldValidation, FormValues } from '../types';

/**
 * Validate a field value against validation rules
 */
export const validateField = (
  value: unknown,
  validation: FormFieldValidation,
  allValues: FormValues = {},
  t: LabelTranslator = translateDefault
): string | null => {
  // Required validation
  if (validation.required) {
    if (value === null || value === undefined || value === '') {
      return validation.messages?.required || t('formBuilder.required');
    }

    // For arrays (multi-select, tags, etc.)
    if (Array.isArray(value) && value.length === 0) {
      return validation.messages?.required || t('formBuilder.required');
    }
  }

  // Skip other validations if value is empty and not required
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Pattern validation
  if (validation.pattern && typeof value === 'string') {
    if (!validation.pattern.test(value)) {
      return validation.messages?.pattern || t('formBuilder.invalidFormat');
    }
  }

  // Min length validation
  if (validation.minLength !== undefined && typeof value === 'string') {
    if (value.length < validation.minLength) {
      return (
        validation.messages?.minLength ||
        t('formBuilder.minLength', { count: validation.minLength })
      );
    }
  }

  // Max length validation
  if (validation.maxLength !== undefined && typeof value === 'string') {
    if (value.length > validation.maxLength) {
      return (
        validation.messages?.maxLength ||
        t('formBuilder.maxLength', { count: validation.maxLength })
      );
    }
  }

  // Min value validation
  if (validation.min !== undefined && typeof value === 'number') {
    if (value < validation.min) {
      return validation.messages?.min || t('formBuilder.min', { min: validation.min });
    }
  }

  // Max value validation
  if (validation.max !== undefined && typeof value === 'number') {
    if (value > validation.max) {
      return validation.messages?.max || t('formBuilder.max', { max: validation.max });
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
  const t = useLabels();
  const boundValidate = useCallback(
    (value: unknown, validation: FormFieldValidation, allValues: FormValues = {}) =>
      validateField(value, validation, allValues, t),
    [t]
  );
  return {
    validateField: boundValidate,
  };
};
