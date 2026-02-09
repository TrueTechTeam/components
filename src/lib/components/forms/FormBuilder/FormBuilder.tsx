/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useCallback,
  isValidElement,
  Children,
  cloneElement,
} from 'react';
import type { ComponentVariant, ComponentSize, BaseComponentProps } from '../../../types';
import type { FormFieldConfig, FormContext as FormContextType, UseFormStateOptions } from './types';
import { useFormState } from './hooks/useFormState';
import { Button } from '../../buttons/Button';
import styles from './FormBuilder.module.scss';

// Import all form components
import { Input } from '../../inputs/Input';
import { Textarea } from '../../inputs/Textarea';
import { Toggle } from '../../inputs/Toggle';
import { Checkbox } from '../../inputs/Checkbox';
import { RadioGroup, Radio } from '../../inputs/Radio';
import { Select } from '../../inputs/Select';
import { Slider } from '../../inputs/Slider';
import { Rating } from '../../inputs/Rating';
import { NumberInput } from '../../inputs/NumberInput';
import { PhoneInput } from '../../inputs/PhoneInput';
import { TagInput } from '../../inputs/TagInput';
import { FilePicker } from '../../inputs/FilePicker';
import { ColorPicker } from '../../inputs/ColorPicker';
import { DatePicker } from '../../inputs/DatePicker';
import { DateRangePicker } from '../../inputs/DateRangePicker';

/**
 * Form context
 */
const FormContext = createContext<FormContextType | null>(null);

/**
 * Hook to access form context
 */
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormBuilder');
  }
  return context;
};

export interface FormBuilderProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Visual style variant
   */
  variant?: ComponentVariant;

  /**
   * Size of form components
   */
  size?: ComponentSize;

  /**
   * Field configurations (config mode)
   */
  fields?: FormFieldConfig[];

  /**
   * Form children (children mode)
   */
  children?: React.ReactNode;

  /**
   * Initial form values
   */
  defaultValues?: Record<string, any>;

  /**
   * Callback when form is submitted
   */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;

  /**
   * Callback when form values change
   */
  onChange?: (values: Record<string, any>) => void;

  /**
   * Callback when validation changes
   */
  onValidate?: (errors: Record<string, string>) => void;

  /**
   * When to validate fields
   */
  validateOn?: 'change' | 'blur' | 'submit';

  /**
   * Show submit button
   */
  showSubmitButton?: boolean;

  /**
   * Submit button text
   */
  submitButtonText?: string;

  /**
   * Submit button variant
   */
  submitButtonVariant?: ComponentVariant;

  /**
   * Show reset button
   */
  showResetButton?: boolean;

  /**
   * Reset button text
   */
  resetButtonText?: string;

  /**
   * Form layout
   */
  layout?: 'vertical' | 'horizontal' | 'grid';

  /**
   * Number of columns (for grid layout)
   */
  columns?: number;

  /**
   * Gap between fields
   */
  gap?: number;

  /**
   * Loading state (disables form)
   */
  loading?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

/**
 * Render a field based on config
 */
const renderField = (
  config: FormFieldConfig,
  formContext: FormContextType,
  variant: ComponentVariant,
  size: ComponentSize,
  disabled: boolean
) => {
  const { name, type, label, helperText, props = {} } = config;
  const value = formContext.values[name];
  const error = formContext.errors[name];
  const touched = formContext.touched[name];

  const commonProps = {
    ...props,
    variant,
    size,
    label,
    helperText,
    error: touched && !!error,
    errorMessage: error,
    disabled,
    required: config.validation?.required,
  };

  const handleChange = (newValue: any) => {
    formContext.setFieldValue(name, newValue);
  };

  const handleBlur = () => {
    formContext.setFieldTouched(name, true);
  };

  switch (type) {
    case 'input':
      return (
        <Input
          {...commonProps}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      );

    case 'textarea':
      return (
        <Textarea
          {...commonProps}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      );

    case 'toggle':
      return (
        <Toggle
          {...commonProps}
          checked={value || false}
          onChange={(checked) => handleChange(checked)}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          {...commonProps}
          checked={value || false}
          onChange={(checked) => handleChange(checked)}
        />
      );

    case 'radio':
      return (
        <RadioGroup {...commonProps} value={value} onChange={(val) => handleChange(val)}>
          {props.options?.map((option: any) => (
            <Radio key={option.value} value={option.value} label={option.label} />
          ))}
        </RadioGroup>
      );

    case 'select':
      return (
        <Select
          {...commonProps}
          value={value}
          onChange={(val) => handleChange(val)}
          onBlur={handleBlur}
          options={props.options || []}
        />
      );

    case 'slider':
      return (
        <Slider {...commonProps} value={value ?? props.defaultValue ?? 0} onChange={handleChange} />
      );

    case 'rating':
      return <Rating {...commonProps} value={value ?? 0} onChange={handleChange} />;

    case 'number':
      return <NumberInput {...commonProps} value={value} onChange={handleChange} />;

    case 'phone':
      return (
        <PhoneInput
          {...commonProps}
          value={value || ''}
          onChange={(phone) => handleChange(phone)}
        />
      );

    case 'tag':
      return <TagInput {...commonProps} value={value || []} onChange={handleChange} />;

    case 'file':
      return <FilePicker {...commonProps} onChange={handleChange} />;

    case 'color':
      return <ColorPicker {...commonProps} value={value || '#000000'} onChange={handleChange} />;

    case 'date':
      return <DatePicker {...commonProps} value={value} onChange={handleChange} />;

    case 'daterange':
      return (
        <DateRangePicker
          {...commonProps}
          startDate={value?.startDate}
          endDate={value?.endDate}
          onChange={(start, end) => handleChange({ startDate: start, endDate: end })}
        />
      );

    default:
      return null;
  }
};

/**
 * FormBuilder component - Build forms from config or React children
 *
 * @example
 * Config mode:
 * ```tsx
 * <FormBuilder
 *   fields={[
 *     { name: 'email', type: 'input', label: 'Email', validation: { required: true } },
 *     { name: 'password', type: 'input', label: 'Password', props: { type: 'password' } }
 *   ]}
 *   onSubmit={(values) => console.log(values)}
 * />
 * ```
 *
 * Children mode:
 * ```tsx
 * <FormBuilder onSubmit={(values) => console.log(values)}>
 *   <Input name="email" label="Email" required />
 *   <Input name="password" type="password" label="Password" />
 * </FormBuilder>
 * ```
 */
export const FormBuilder = ({
  ref,
  variant = 'primary',
  size = 'md',
  fields,
  children,
  defaultValues = {},
  onSubmit,
  onChange,
  onValidate,
  validateOn = 'blur',
  showSubmitButton = true,
  submitButtonText = 'Submit',
  submitButtonVariant,
  showResetButton = false,
  resetButtonText = 'Reset',
  layout = 'vertical',
  columns = 2,
  gap,
  loading = false,
  disabled = false,
  className,
  'data-testid': dataTestId,
  style,
  ...rest
}: FormBuilderProps & {
  ref?: React.Ref<HTMLFormElement>;
}) => {
  // Initialize form state
  const formOptions: UseFormStateOptions = {
    initialValues: defaultValues,
    fields,
    validateOn,
    onSubmit,
    onChange,
    onValidate,
  };

  const formContext = useFormState(formOptions);

  // Handle form submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      formContext.submitForm();
    },
    [formContext]
  );

  // Wrap children with form context (for children mode)
  const enhancedChildren = children
    ? Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child;
        }

        const childProps = child.props as any;
        const name = childProps.name;

        // If child has a name prop, enhance it with form context
        if (name) {
          // Enhanced props
          const value = formContext.values[name];
          const error = formContext.errors[name];
          const touched = formContext.touched[name];

          return cloneElement(child, {
            ...childProps,
            value: value !== undefined ? value : childProps.value,
            checked: value !== undefined ? value : childProps.checked,
            error: touched && !!error,
            errorMessage: error,
            disabled: disabled || loading,
            onChange: (e: any) => {
              // Call original onChange
              childProps.onChange?.(e);

              // Update form state
              const newValue = e?.target?.value !== undefined ? e.target.value : e;
              formContext.setFieldValue(name, newValue);
            },
            onBlur: () => {
              childProps.onBlur?.();
              formContext.setFieldTouched(name, true);
            },
          });
        }

        return child;
      })
    : null;

  // Container classes
  const containerClasses = [
    styles.form,
    layout === 'grid' && styles.grid,
    layout === 'horizontal' && styles.horizontal,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerStyle = {
    ...style,
    ...(layout === 'grid' && columns && { gridTemplateColumns: `repeat(${columns}, 1fr)` }),
    ...(gap !== undefined && { gap: `${gap * 4}px` }),
  };

  return (
    <FormContext.Provider value={formContext}>
      <form
        {...rest}
        ref={ref}
        className={containerClasses}
        style={containerStyle}
        onSubmit={handleSubmit}
        data-testid={dataTestId}
      >
        {/* Config mode: render fields from config */}
        {fields &&
          fields.map((field) => (
            <div key={field.name} className={styles.field}>
              {renderField(field, formContext, variant, size, disabled || loading)}
            </div>
          ))}

        {/* Children mode: render enhanced children */}
        {enhancedChildren}

        {/* Form actions */}
        {(showSubmitButton || showResetButton) && (
          <div className={styles.actions}>
            {showResetButton && (
              <Button
                type="button"
                variant="secondary"
                onClick={formContext.resetForm}
                disabled={disabled || loading || !formContext.isDirty}
              >
                {resetButtonText}
              </Button>
            )}

            {showSubmitButton && (
              <Button
                type="submit"
                variant={submitButtonVariant || variant}
                disabled={disabled || loading || formContext.isSubmitting}
              >
                {submitButtonText}
              </Button>
            )}
          </div>
        )}
      </form>
    </FormContext.Provider>
  );
};
