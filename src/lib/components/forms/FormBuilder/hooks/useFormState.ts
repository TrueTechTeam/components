/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef } from 'react';
import type {
  FormValues,
  FormErrors,
  FormTouched,
  FormFieldConfig,
  UseFormStateOptions,
  FormContext,
} from '../types';
import { validateField as validateFieldUtil } from './useFormValidation';

/**
 * Hook for managing form state
 */
export const useFormState = (options: UseFormStateOptions = {}): FormContext => {
  const {
    initialValues = {},
    fields = [],
    validateOn = 'blur',
    onSubmit,
    onChange,
    onValidate,
  } = options;

  // State
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const fieldsRef = useRef<Map<string, FormFieldConfig>>(new Map());
  const initialValuesRef = useRef(initialValues);

  // Register fields from config
  fields.forEach((field) => {
    fieldsRef.current.set(field.name, field);
  });

  // Check if form is dirty
  const isDirty = Object.keys(values).some((key) => values[key] !== initialValuesRef.current[key]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Register a field
  const registerField = useCallback(
    (name: string, config?: FormFieldConfig) => {
      if (config) {
        fieldsRef.current.set(name, config);

        // Set initial value if provided
        if (config.defaultValue !== undefined && values[name] === undefined) {
          setValues((prev) => ({ ...prev, [name]: config.defaultValue }));
        }
      }
    },
    [values]
  );

  // Unregister a field
  const unregisterField = useCallback((name: string) => {
    fieldsRef.current.delete(name);

    setValues((prev) => {
      const newValues = { ...prev };
      delete newValues[name];
      return newValues;
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    setTouched((prev) => {
      const newTouched = { ...prev };
      delete newTouched[name];
      return newTouched;
    });
  }, []);

  // Validate a single field
  const validateField = useCallback(
    (name: string): string | null => {
      const fieldConfig = fieldsRef.current.get(name);
      if (!fieldConfig?.validation) {
        return null;
      }

      const error = validateFieldUtil(values[name], fieldConfig.validation, values);

      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });

      return error;
    },
    [values]
  );

  // Validate all fields
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    fieldsRef.current.forEach((fieldConfig, name) => {
      if (fieldConfig.validation) {
        const error = validateFieldUtil(values[name], fieldConfig.validation, values);
        if (error) {
          newErrors[name] = error;
        }
      }
    });

    setErrors(newErrors);
    onValidate?.(newErrors);

    return newErrors;
  }, [values, onValidate]);

  // Set field value
  const setFieldValue = useCallback(
    (name: string, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [name]: value };
        onChange?.(newValues);
        return newValues;
      });

      // Validate on change if configured
      if (validateOn === 'change') {
        setTimeout(() => validateField(name), 0);
      }
    },
    [onChange, validateOn, validateField]
  );

  // Set field error
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback(
    (name: string, isTouched: boolean) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));

      // Validate on blur if configured
      if (isTouched && validateOn === 'blur') {
        setTimeout(() => validateField(name), 0);
      }
    },
    [validateOn, validateField]
  );

  // Submit form
  const submitForm = useCallback(async () => {
    setIsSubmitting(true);

    // Validate all fields
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit?.(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  return {
    // State
    values,
    errors,
    touched,
    isDirty,
    isSubmitting,
    isValid,

    // Actions
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    submitForm,
    resetForm,
    registerField,
    unregisterField,
  };
};
