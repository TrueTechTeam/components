/**
 * Type definitions for FormBuilder component
 *
 * Note: `any` types are used intentionally for form values since form fields
 * can contain values of any type (string, number, boolean, array, object, etc.)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export type FormFieldType =
  | 'input'
  | 'textarea'
  | 'toggle'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'slider'
  | 'rating'
  | 'number'
  | 'phone'
  | 'tag'
  | 'file'
  | 'color'
  | 'date'
  | 'daterange';

export interface FormFieldValidation {
  /**
   * Field is required
   */
  required?: boolean;

  /**
   * Pattern validation (regex)
   */
  pattern?: RegExp;

  /**
   * Minimum length (for strings)
   */
  minLength?: number;

  /**
   * Maximum length (for strings)
   */
  maxLength?: number;

  /**
   * Minimum value (for numbers)
   */
  min?: number;

  /**
   * Maximum value (for numbers)
   */
  max?: number;

  /**
   * Custom validation function
   */
  custom?: (value: any, allValues: Record<string, any>) => string | null;

  /**
   * Custom error messages
   */
  messages?: {
    required?: string;
    pattern?: string;
    minLength?: string;
    maxLength?: string;
    min?: string;
    max?: string;
  };
}

export interface FormFieldDependency {
  /**
   * Field name to depend on
   */
  field: string;

  /**
   * Condition to check
   */
  condition: (value: any) => boolean;

  /**
   * Action to take when condition is met
   */
  action: 'show' | 'hide' | 'enable' | 'disable';
}

export interface FormFieldConfig {
  /**
   * Unique field name (used as key in form values)
   */
  name: string;

  /**
   * Field type
   */
  type: FormFieldType;

  /**
   * Field label
   */
  label?: string;

  /**
   * Default value
   */
  defaultValue?: any;

  /**
   * Validation rules
   */
  validation?: FormFieldValidation;

  /**
   * Additional props to pass to the field component
   */
  props?: Record<string, any>;

  /**
   * Field dependencies
   */
  dependencies?: FormFieldDependency[];

  /**
   * Helper text
   */
  helperText?: string;
}

export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface FormState {
  /**
   * Current form values
   */
  values: FormValues;

  /**
   * Form errors
   */
  errors: FormErrors;

  /**
   * Touched fields
   */
  touched: FormTouched;

  /**
   * Whether the form is dirty (has unsaved changes)
   */
  isDirty: boolean;

  /**
   * Whether the form is submitting
   */
  isSubmitting: boolean;

  /**
   * Whether the form is valid
   */
  isValid: boolean;
}

export interface FormActions {
  /**
   * Set a field value
   */
  setFieldValue: (name: string, value: any) => void;

  /**
   * Set a field error
   */
  setFieldError: (name: string, error: string) => void;

  /**
   * Set a field touched state
   */
  setFieldTouched: (name: string, touched: boolean) => void;

  /**
   * Validate a single field
   */
  validateField: (name: string) => string | null;

  /**
   * Validate all fields
   */
  validateForm: () => FormErrors;

  /**
   * Submit the form
   */
  submitForm: () => Promise<void>;

  /**
   * Reset the form
   */
  resetForm: () => void;

  /**
   * Register a field
   */
  registerField: (name: string, config?: FormFieldConfig) => void;

  /**
   * Unregister a field
   */
  unregisterField: (name: string) => void;
}

export type FormContext = FormState & FormActions;

export interface UseFormStateOptions {
  /**
   * Initial form values
   */
  initialValues?: FormValues;

  /**
   * Field configurations (for config mode)
   */
  fields?: FormFieldConfig[];

  /**
   * When to validate fields
   */
  validateOn?: 'change' | 'blur' | 'submit';

  /**
   * Callback when form is submitted
   */
  onSubmit?: (values: FormValues) => void | Promise<void>;

  /**
   * Callback when form values change
   */
  onChange?: (values: FormValues) => void;

  /**
   * Callback when form validation state changes
   */
  onValidate?: (errors: FormErrors) => void;
}
