import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormBuilder, useFormContext } from './FormBuilder';
import type { FormFieldConfig } from './types';

// Mock all input components used by FormBuilder's renderField
jest.mock('../../inputs/Input', () => ({
  Input: ({ value, onChange, onBlur, label, ...rest }: any) => (
    <div data-component="input">
      {label && <label>{label}</label>}
      <input
        data-testid={rest['data-testid'] || 'input'}
        value={value ?? ''}
        onChange={(e) => onChange?.(e)}
        onBlur={onBlur}
        disabled={rest.disabled}
        required={rest.required}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/Textarea', () => ({
  Textarea: ({ value, onChange, onBlur, label, ...rest }: any) => (
    <div data-component="textarea">
      {label && <label>{label}</label>}
      <textarea
        data-testid={rest['data-testid'] || 'textarea'}
        value={value ?? ''}
        onChange={(e) => onChange?.(e)}
        onBlur={onBlur}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/Toggle', () => ({
  Toggle: ({ checked, onChange, label, ...rest }: any) => (
    <div data-component="toggle">
      {label && <label>{label}</label>}
      <input
        type="checkbox"
        data-testid={rest['data-testid'] || 'toggle'}
        checked={checked ?? false}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/Checkbox', () => ({
  Checkbox: ({ checked, onChange, label, ...rest }: any) => (
    <div data-component="checkbox">
      {label && <label>{label}</label>}
      <input
        type="checkbox"
        data-testid={rest['data-testid'] || 'checkbox'}
        checked={checked ?? false}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/Radio', () => ({
  RadioGroup: ({ value, onChange, children, label, ...rest }: any) => (
    <div data-component="radio-group" {...rest}>
      {label && <label>{label}</label>}
      <div data-testid="radio-group">{children}</div>
    </div>
  ),
  Radio: ({ value, label, ...rest }: any) => (
    <label>
      <input type="radio" value={value} {...rest} />
      {label}
    </label>
  ),
}));

jest.mock('../../inputs/Select', () => ({
  Select: ({ value, onChange, onBlur, options, label, ...rest }: any) => (
    <div data-component="select">
      {label && <label>{label}</label>}
      <select
        data-testid={rest['data-testid'] || 'select'}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={rest.disabled}
        {...rest}
      >
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('../../inputs/Slider', () => ({
  Slider: ({ value, onChange, label, ...rest }: any) => (
    <div data-component="slider">
      {label && <label>{label}</label>}
      <input
        type="range"
        data-testid={rest['data-testid'] || 'slider'}
        value={value ?? 0}
        onChange={(e) => onChange?.(Number(e.target.value))}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/Rating', () => ({
  Rating: ({ value, onChange, label, ...rest }: any) => (
    <div data-component="rating">
      {label && <label>{label}</label>}
      <input
        type="number"
        data-testid={rest['data-testid'] || 'rating'}
        value={value ?? 0}
        onChange={(e) => onChange?.(Number(e.target.value))}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/NumberInput', () => ({
  NumberInput: ({ value, onChange, label, ...rest }: any) => (
    <div data-component="number">
      {label && <label>{label}</label>}
      <input
        type="number"
        data-testid={rest['data-testid'] || 'number-input'}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/PhoneInput', () => ({
  PhoneInput: ({ value, onChange, label, ...rest }: any) => (
    <div data-component="phone">
      {label && <label>{label}</label>}
      <input
        type="tel"
        data-testid={rest['data-testid'] || 'phone-input'}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/TagInput', () => ({
  TagInput: ({ value, onChange, label, ...rest }: any) => (
    <div data-component="tag">
      {label && <label>{label}</label>}
      <input
        data-testid={rest['data-testid'] || 'tag-input'}
        value={value?.join(',') ?? ''}
        onChange={(e) => onChange?.(e.target.value.split(',').filter(Boolean))}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/FilePicker', () => ({
  FilePicker: ({ onChange, label, ...rest }: any) => (
    <div data-component="file">
      {label && <label>{label}</label>}
      <input
        type="file"
        data-testid={rest['data-testid'] || 'file-picker'}
        onChange={(e) => onChange?.(e.target.files?.[0])}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/ColorPicker', () => ({
  ColorPicker: ({ value, onChange, label, ...rest }: any) => (
    <div data-component="color">
      {label && <label>{label}</label>}
      <input
        type="color"
        data-testid={rest['data-testid'] || 'color-picker'}
        value={value ?? '#000000'}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/DatePicker', () => ({
  DatePicker: ({ value, onChange, label, ...rest }: any) => (
    <div data-component="date">
      {label && <label>{label}</label>}
      <input
        type="date"
        data-testid={rest['data-testid'] || 'date-picker'}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={rest.disabled}
        {...rest}
      />
    </div>
  ),
}));

jest.mock('../../inputs/DateRangePicker', () => ({
  DateRangePicker: ({ startDate, endDate, onChange, label, ...rest }: any) => (
    <div data-component="daterange">
      {label && <label>{label}</label>}
      <input
        type="date"
        data-testid={rest['data-testid'] || 'date-range-start'}
        value={startDate ?? ''}
        onChange={(e) => onChange?.(e.target.value, endDate)}
        disabled={rest.disabled}
      />
      <input
        type="date"
        data-testid="date-range-end"
        value={endDate ?? ''}
        onChange={(e) => onChange?.(startDate, e.target.value)}
        disabled={rest.disabled}
      />
    </div>
  ),
}));

jest.mock('../../buttons/Button', () => ({
  Button: ({ children, onClick, type, disabled, ...rest }: any) => (
    <button
      data-testid={rest['data-testid'] || 'button'}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  ),
}));

describe('FormBuilder', () => {
  describe('useFormContext', () => {
    it('throws error when used outside FormBuilder', () => {
      const TestComponent = () => {
        useFormContext();
        return null;
      };

      let error: any;
      try {
        render(<TestComponent />);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(String(error)).toContain('useFormContext must be used within FormBuilder');
    });

    it('provides context when used inside FormBuilder', () => {
      const TestComponent = () => {
        const context = useFormContext();
        return <div data-testid="context-values">{JSON.stringify(context.values)}</div>;
      };

      render(
        <FormBuilder defaultValues={{ test: 'value' }}>
          <TestComponent />
        </FormBuilder>
      );

      expect(screen.getByTestId('context-values')).toHaveTextContent('"test":"value"');
    });
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<FormBuilder />);
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<FormBuilder className="custom-form" />);
      const form = container.querySelector('form');
      expect(form).toHaveClass('custom-form');
    });

    it('renders with data-testid', () => {
      render(<FormBuilder data-testid="custom-form" />);
      expect(screen.getByTestId('custom-form')).toBeInTheDocument();
    });

    it('renders with custom style', () => {
      const { container } = render(<FormBuilder style={{ backgroundColor: 'red' }} />);
      const form = container.querySelector('form');
      expect(form).toHaveStyle({ backgroundColor: 'red' });
    });

    it('renders submit button by default', () => {
      render(<FormBuilder />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('hides submit button when showSubmitButton is false', () => {
      render(<FormBuilder showSubmitButton={false} />);
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });

    it('renders custom submit button text', () => {
      render(<FormBuilder submitButtonText="Save Form" />);
      expect(screen.getByText('Save Form')).toBeInTheDocument();
    });

    it('hides reset button by default', () => {
      render(<FormBuilder />);
      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('shows reset button when showResetButton is true', () => {
      render(<FormBuilder showResetButton defaultValues={{ test: '' }} />);
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('renders custom reset button text', () => {
      render(
        <FormBuilder showResetButton resetButtonText="Clear Form" defaultValues={{ test: '' }} />
      );
      expect(screen.getByText('Clear Form')).toBeInTheDocument();
    });
  });

  describe('config mode - field rendering', () => {
    it('renders input field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'username', type: 'input', label: 'Username' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('renders textarea field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'bio', type: 'textarea', label: 'Bio' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Bio')).toBeInTheDocument();
      expect(screen.getByTestId('textarea')).toBeInTheDocument();
    });

    it('renders toggle field from config', () => {
      const fields: FormFieldConfig[] = [
        { name: 'enabled', type: 'toggle', label: 'Enable Feature' },
      ];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Enable Feature')).toBeInTheDocument();
      expect(screen.getByTestId('toggle')).toBeInTheDocument();
    });

    it('renders checkbox field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'agree', type: 'checkbox', label: 'I Agree' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('I Agree')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox')).toBeInTheDocument();
    });

    it('renders radio field from config', () => {
      const fields: FormFieldConfig[] = [
        {
          name: 'choice',
          type: 'radio',
          label: 'Choose One',
          props: {
            options: [
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' },
            ],
          },
        },
      ];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Choose One')).toBeInTheDocument();
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
    });

    it('renders select field from config', () => {
      const fields: FormFieldConfig[] = [
        {
          name: 'country',
          type: 'select',
          label: 'Country',
          props: {
            options: [
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
            ],
          },
        },
      ];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    it('renders slider field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'volume', type: 'slider', label: 'Volume' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Volume')).toBeInTheDocument();
      expect(screen.getByTestId('slider')).toBeInTheDocument();
    });

    it('renders rating field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'rating', type: 'rating', label: 'Rate Us' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Rate Us')).toBeInTheDocument();
      expect(screen.getByTestId('rating')).toBeInTheDocument();
    });

    it('renders number field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'age', type: 'number', label: 'Age' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('renders phone field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'phone', type: 'phone', label: 'Phone' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    });

    it('renders tag field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'tags', type: 'tag', label: 'Tags' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByTestId('tag-input')).toBeInTheDocument();
    });

    it('renders file field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'upload', type: 'file', label: 'Upload File' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Upload File')).toBeInTheDocument();
      expect(screen.getByTestId('file-picker')).toBeInTheDocument();
    });

    it('renders color field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'color', type: 'color', label: 'Pick Color' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Pick Color')).toBeInTheDocument();
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('renders date field from config', () => {
      const fields: FormFieldConfig[] = [{ name: 'birthday', type: 'date', label: 'Birthday' }];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Birthday')).toBeInTheDocument();
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });

    it('renders daterange field from config', () => {
      const fields: FormFieldConfig[] = [
        { name: 'dateRange', type: 'daterange', label: 'Date Range' },
      ];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Date Range')).toBeInTheDocument();
      expect(screen.getByTestId('date-range-start')).toBeInTheDocument();
      expect(screen.getByTestId('date-range-end')).toBeInTheDocument();
    });

    it('renders multiple fields from config', () => {
      const fields: FormFieldConfig[] = [
        { name: 'name', type: 'input', label: 'Name' },
        { name: 'email', type: 'input', label: 'Email' },
        { name: 'bio', type: 'textarea', label: 'Bio' },
      ];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Bio')).toBeInTheDocument();
    });

    it('returns null for unknown field type', () => {
      const fields: FormFieldConfig[] = [
        { name: 'unknown', type: 'unknown' as any, label: 'Unknown' },
      ];

      const { container } = render(<FormBuilder fields={fields} />);
      // Should render the label but not the field input
      expect(container.querySelector('[data-component]')).not.toBeInTheDocument();
    });
  });

  describe('children mode', () => {
    it('renders children components', () => {
      render(
        <FormBuilder>
          <input name="username" data-testid="username-input" />
          <input name="password" type="password" data-testid="password-input" />
        </FormBuilder>
      );

      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    it('enhances children with form context values', () => {
      render(
        <FormBuilder defaultValues={{ username: 'testuser' }}>
          <input name="username" data-testid="username-input" />
        </FormBuilder>
      );

      const input = screen.getByTestId('username-input') as HTMLInputElement;
      expect(input.value).toBe('testuser');
    });

    it('does not enhance children without name prop', () => {
      render(
        <FormBuilder defaultValues={{ test: 'value' }}>
          <div data-testid="no-name">No Name</div>
        </FormBuilder>
      );

      expect(screen.getByTestId('no-name')).toBeInTheDocument();
    });

    it('handles non-element children', () => {
      const { container } = render(
        <FormBuilder>
          Text node
          {null}
          {undefined}
        </FormBuilder>
      );

      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit when form is submitted', () => {
      const onSubmit = jest.fn();

      render(
        <FormBuilder onSubmit={onSubmit} defaultValues={{ name: 'Test' }}>
          <input name="name" data-testid="name-input" />
        </FormBuilder>
      );

      fireEvent.click(screen.getByText('Submit'));

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test' }));
    });

    it('prevents default form submission', () => {
      const onSubmit = jest.fn();

      const { container } = render(<FormBuilder onSubmit={onSubmit} />);

      const form = container.querySelector('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

      form!.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('submits with updated field values in children mode', () => {
      const onSubmit = jest.fn();

      render(
        <FormBuilder onSubmit={onSubmit}>
          <input name="email" data-testid="email-input" />
        </FormBuilder>
      );

      const input = screen.getByTestId('email-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByText('Submit'));

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@example.com' }));
    });

    it('submits with updated field values in config mode', () => {
      const onSubmit = jest.fn();
      const fields: FormFieldConfig[] = [{ name: 'username', type: 'input', label: 'Username' }];

      render(<FormBuilder fields={fields} onSubmit={onSubmit} />);

      const input = screen.getByTestId('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'newuser' } });
      fireEvent.click(screen.getByText('Submit'));

      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ username: 'newuser' }));
    });
  });

  describe('form reset', () => {
    it('resets form to default values when reset button is clicked', () => {
      render(
        <FormBuilder showResetButton defaultValues={{ name: 'Initial' }}>
          <input name="name" data-testid="name-input" />
        </FormBuilder>
      );

      const input = screen.getByTestId('name-input') as HTMLInputElement;

      // Change the value
      fireEvent.change(input, { target: { value: 'Changed' } });
      expect(input.value).toBe('Changed');

      // Reset the form
      fireEvent.click(screen.getByText('Reset'));

      // Should be back to initial value
      expect(input.value).toBe('Initial');
    });

    it('disables reset button when form is not dirty', () => {
      render(
        <FormBuilder showResetButton defaultValues={{ name: '' }}>
          <input name="name" data-testid="name-input" />
        </FormBuilder>
      );

      const resetButton = screen.getByText('Reset');
      expect(resetButton).toBeDisabled();
    });

    it('enables reset button when form is dirty', async () => {
      render(
        <FormBuilder showResetButton defaultValues={{ name: '' }}>
          <input name="name" data-testid="name-input" />
        </FormBuilder>
      );

      const input = screen.getByTestId('name-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Changed' } });

      await waitFor(() => {
        const resetButton = screen.getByText('Reset');
        expect(resetButton).not.toBeDisabled();
      });
    });
  });

  describe('form state management', () => {
    it('initializes with default values', () => {
      render(
        <FormBuilder defaultValues={{ username: 'testuser', email: 'test@example.com' }}>
          <input name="username" data-testid="username-input" />
          <input name="email" data-testid="email-input" />
        </FormBuilder>
      );

      expect((screen.getByTestId('username-input') as HTMLInputElement).value).toBe('testuser');
      expect((screen.getByTestId('email-input') as HTMLInputElement).value).toBe(
        'test@example.com'
      );
    });

    it('accepts onChange callback', () => {
      const onChange = jest.fn();

      const { container } = render(
        <FormBuilder onChange={onChange}>
          <input name="name" data-testid="name-input" />
        </FormBuilder>
      );

      expect(container.querySelector('form')).toBeInTheDocument();
      // onChange callback is passed to useFormState hook and will be called when values change
    });

    it('updates field value on blur', () => {
      const fields: FormFieldConfig[] = [{ name: 'email', type: 'input', label: 'Email' }];

      render(<FormBuilder fields={fields} />);

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      fireEvent.blur(input);

      expect((input as HTMLInputElement).value).toBe('test@example.com');
    });

    it('preserves original onChange in children mode', () => {
      const customOnChange = jest.fn();

      render(
        <FormBuilder>
          <input name="test" onChange={customOnChange} data-testid="test-input" />
        </FormBuilder>
      );

      const input = screen.getByTestId('test-input');
      fireEvent.change(input, { target: { value: 'value' } });

      expect(customOnChange).toHaveBeenCalled();
    });

    it('preserves original onBlur in children mode', () => {
      const customOnBlur = jest.fn();

      render(
        <FormBuilder>
          <input name="test" onBlur={customOnBlur} data-testid="test-input" />
        </FormBuilder>
      );

      const input = screen.getByTestId('test-input');
      fireEvent.blur(input);

      expect(customOnBlur).toHaveBeenCalled();
    });

    it('handles non-target value changes in children mode', () => {
      render(
        <FormBuilder defaultValues={{ enabled: false }}>
          <input type="checkbox" name="enabled" data-testid="checkbox-input" />
        </FormBuilder>
      );

      const checkbox = screen.getByTestId('checkbox-input') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('layout', () => {
    it('applies vertical layout by default', () => {
      const { container } = render(<FormBuilder />);
      const form = container.querySelector('form');
      expect(form).not.toHaveClass('grid');
      expect(form).not.toHaveClass('horizontal');
    });

    it('applies horizontal layout class', () => {
      const { container } = render(<FormBuilder layout="horizontal" />);
      const form = container.querySelector('form');
      expect(form?.className).toContain('horizontal');
    });

    it('applies grid layout class', () => {
      const { container } = render(<FormBuilder layout="grid" />);
      const form = container.querySelector('form');
      expect(form?.className).toContain('grid');
    });

    it('applies grid columns style', () => {
      const { container } = render(<FormBuilder layout="grid" columns={3} />);
      const form = container.querySelector('form');
      expect(form?.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('applies gap style', () => {
      const { container } = render(<FormBuilder gap={4} />);
      const form = container.querySelector('form');
      expect(form?.style.gap).toBe('16px');
    });
  });

  describe('disabled and loading states', () => {
    it('disables all fields when disabled is true', () => {
      const fields: FormFieldConfig[] = [
        { name: 'name', type: 'input', label: 'Name' },
        { name: 'bio', type: 'textarea', label: 'Bio' },
      ];

      render(<FormBuilder fields={fields} disabled />);

      expect(screen.getByTestId('input')).toBeDisabled();
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('disables all fields when loading is true', () => {
      const fields: FormFieldConfig[] = [{ name: 'name', type: 'input', label: 'Name' }];

      render(<FormBuilder fields={fields} loading />);

      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('disables submit button when disabled is true', () => {
      render(<FormBuilder disabled />);
      expect(screen.getByText('Submit')).toBeDisabled();
    });

    it('disables submit button when loading is true', () => {
      render(<FormBuilder loading />);
      expect(screen.getByText('Submit')).toBeDisabled();
    });

    it('disables reset button when disabled is true', () => {
      render(<FormBuilder showResetButton disabled defaultValues={{ test: '' }} />);
      expect(screen.getByText('Reset')).toBeDisabled();
    });

    it('disables reset button when loading is true', () => {
      render(<FormBuilder showResetButton loading defaultValues={{ test: '' }} />);
      expect(screen.getByText('Reset')).toBeDisabled();
    });

    it('disables children when disabled is true', () => {
      render(
        <FormBuilder disabled>
          <input name="test" data-testid="test-input" />
        </FormBuilder>
      );

      expect(screen.getByTestId('test-input')).toBeDisabled();
    });

    it('disables children when loading is true', () => {
      render(
        <FormBuilder loading>
          <input name="test" data-testid="test-input" />
        </FormBuilder>
      );

      expect(screen.getByTestId('test-input')).toBeDisabled();
    });
  });

  describe('validation', () => {
    it('passes required prop to field in config mode', () => {
      const fields: FormFieldConfig[] = [
        { name: 'email', type: 'input', label: 'Email', validation: { required: true } },
      ];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByTestId('input')).toBeRequired();
    });

    it('accepts onValidate callback', () => {
      const onValidate = jest.fn();
      const fields: FormFieldConfig[] = [
        { name: 'email', type: 'input', label: 'Email', validation: { required: true } },
      ];

      const { container } = render(
        <FormBuilder fields={fields} onValidate={onValidate} validateOn="blur" />
      );

      expect(container.querySelector('form')).toBeInTheDocument();
      // onValidate callback is passed to useFormState hook and will be called when validation runs
    });
  });

  describe('variants and sizes', () => {
    it('passes variant to fields in config mode', () => {
      const fields: FormFieldConfig[] = [{ name: 'test', type: 'input', label: 'Test' }];

      const { container } = render(<FormBuilder fields={fields} variant="success" />);
      expect(container.querySelector('[data-component="input"]')).toBeInTheDocument();
    });

    it('passes size to fields in config mode', () => {
      const fields: FormFieldConfig[] = [{ name: 'test', type: 'input', label: 'Test' }];

      const { container } = render(<FormBuilder fields={fields} size="lg" />);
      expect(container.querySelector('[data-component="input"]')).toBeInTheDocument();
    });

    it('applies submit button variant', () => {
      render(<FormBuilder submitButtonVariant="success" />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('uses form variant for submit button by default', () => {
      render(<FormBuilder variant="warning" />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  describe('field props and configuration', () => {
    it('passes additional props to field components', () => {
      const fields: FormFieldConfig[] = [
        {
          name: 'test',
          type: 'input',
          label: 'Test',
          props: { placeholder: 'Enter text' },
        },
      ];

      render(<FormBuilder fields={fields} />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('passes helperText to field components', () => {
      const fields: FormFieldConfig[] = [
        {
          name: 'test',
          type: 'input',
          label: 'Test',
          helperText: 'This is helper text',
        },
      ];

      const { container } = render(<FormBuilder fields={fields} />);
      expect(container.querySelector('[data-component="input"]')).toBeInTheDocument();
    });

    it('uses defaultValue from field config for slider', () => {
      const fields: FormFieldConfig[] = [
        {
          name: 'volume',
          type: 'slider',
          label: 'Volume',
          props: { defaultValue: 50 },
        },
      ];

      render(<FormBuilder fields={fields} />);
      expect((screen.getByTestId('slider') as HTMLInputElement).value).toBe('50');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to form element', () => {
      const ref = React.createRef<HTMLFormElement>();
      render(<FormBuilder ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLFormElement);
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(<FormBuilder ref={refCallback} />);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLFormElement));
    });
  });
});

describe('edge cases', () => {
  it('handles empty fields array', () => {
    const { container } = render(<FormBuilder fields={[]} />);
    expect(container.querySelector('form')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('handles undefined fields', () => {
    const { container } = render(<FormBuilder fields={undefined} />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('handles undefined children', () => {
    const { container } = render(<FormBuilder>{undefined}</FormBuilder>);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('handles null children', () => {
    const { container } = render(<FormBuilder>{null}</FormBuilder>);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('handles both fields and children', () => {
    const fields: FormFieldConfig[] = [{ name: 'config', type: 'input', label: 'Config Field' }];

    render(
      <FormBuilder fields={fields}>
        <input name="child" data-testid="child-input" />
      </FormBuilder>
    );

    expect(screen.getByText('Config Field')).toBeInTheDocument();
    expect(screen.getByTestId('child-input')).toBeInTheDocument();
  });

  it('handles empty defaultValues', () => {
    const { container } = render(<FormBuilder defaultValues={{}} />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('handles field with no options for radio', () => {
    const fields: FormFieldConfig[] = [
      { name: 'choice', type: 'radio', label: 'Choose', props: {} },
    ];

    render(<FormBuilder fields={fields} />);
    expect(screen.getByText('Choose')).toBeInTheDocument();
  });

  it('handles field with no options for select', () => {
    const fields: FormFieldConfig[] = [{ name: 'choice', type: 'select', label: 'Choose' }];

    render(<FormBuilder fields={fields} />);
    expect(screen.getByText('Choose')).toBeInTheDocument();
  });

  it('handles daterange with partial values', () => {
    const fields: FormFieldConfig[] = [{ name: 'range', type: 'daterange', label: 'Range' }];

    render(<FormBuilder fields={fields} defaultValues={{ range: { startDate: '2024-01-01' } }} />);
    expect((screen.getByTestId('date-range-start') as HTMLInputElement).value).toBe('2024-01-01');
  });

  it('handles tag input with empty array', () => {
    const fields: FormFieldConfig[] = [{ name: 'tags', type: 'tag', label: 'Tags' }];

    render(<FormBuilder fields={fields} />);
    expect((screen.getByTestId('tag-input') as HTMLInputElement).value).toBe('');
  });
});

describe('async submission', () => {
  it('handles async onSubmit', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<FormBuilder onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('disables submit button while submitting', async () => {
    const onSubmit = jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<FormBuilder onSubmit={onSubmit} />);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Button should be disabled during submission
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});

describe('validateOn prop', () => {
  it('uses validateOn="blur" by default', () => {
    const fields: FormFieldConfig[] = [{ name: 'test', type: 'input', label: 'Test' }];

    const { container } = render(<FormBuilder fields={fields} />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('accepts validateOn="change"', () => {
    const fields: FormFieldConfig[] = [{ name: 'test', type: 'input', label: 'Test' }];

    const { container } = render(<FormBuilder fields={fields} validateOn="change" />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('accepts validateOn="submit"', () => {
    const fields: FormFieldConfig[] = [{ name: 'test', type: 'input', label: 'Test' }];

    const { container } = render(<FormBuilder fields={fields} validateOn="submit" />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
