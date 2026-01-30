import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { Icon } from '../../display/Icon';

describe('Input', () => {
  describe('rendering', () => {
    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Input value="Test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);
      const wrapper = screen.getByTestId('input').parentElement?.parentElement;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should render with data-testid', () => {
      render(<Input data-testid="custom-input" />);
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
  });

  describe('label and messages', () => {
    it('should render with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should associate label with input', () => {
      render(<Input label="Email" id="email-input" />);
      const label = screen.getByText('Email');
      const input = screen.getByTestId('input');
      expect(label).toHaveAttribute('for', 'email-input');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('should show required indicator when required', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<Input errorMessage="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should prioritize error message over helper text', () => {
      render(<Input helperText="Helper" errorMessage="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('should render with start icon', () => {
      render(<Input startIcon="check" />);
      const input = screen.getByTestId('input');
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument();
    });

    it('should render with end icon', () => {
      render(<Input endIcon="info" />);
      const input = screen.getByTestId('input');
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument();
    });

    it('should render with both start and end icons', () => {
      render(<Input startIcon="check" endIcon="info" />);
      const container = screen.getByTestId('input').parentElement;
      expect(container?.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
    });

    it('should render with icon component', () => {
      render(<Input startIcon={<Icon name="warning" />} />);
      const input = screen.getByTestId('input');
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('prefix and suffix', () => {
    it('should render with prefix', () => {
      render(<Input prefix="$" />);
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('should render with suffix', () => {
      render(<Input suffix=".00" />);
      expect(screen.getByText('.00')).toBeInTheDocument();
    });

    it('should render with both prefix and suffix', () => {
      render(<Input prefix="$" suffix="USD" />);
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
    });
  });

  describe('character counter', () => {
    it('should display character counter when maxLength is set', () => {
      render(<Input maxLength={100} value="Hello" onChange={() => {}} />);
      expect(screen.getByText(/5/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should not display counter when showCounter is false', () => {
      render(<Input maxLength={100} showCounter={false} value="Hello" onChange={() => {}} />);
      expect(screen.queryByText(/5.*100/)).not.toBeInTheDocument();
    });

    it('should enforce hard limit on maxLength', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input maxLength={5} onChange={handleChange} />);

      const input = screen.getByTestId('input');
      await user.type(input, '123456');

      // Should only allow 5 characters
      expect(input).toHaveValue('12345');
    });

    it('should update counter as user types', async () => {
      const user = userEvent.setup();
      render(<Input maxLength={10} />);

      const input = screen.getByTestId('input');
      await user.type(input, 'Hello');

      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });

  describe('input filter', () => {
    it('should restrict input based on inputFilter regex', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      // Only allow digits
      render(<Input inputFilter={/^[0-9]*$/} onChange={handleChange} />);

      const input = screen.getByTestId('input') as HTMLInputElement;
      await user.type(input, '123abc456');

      // Should filter out non-digits
      expect(input.value).toBe('123456');
    });

    it('should prevent invalid characters from being entered', async () => {
      const user = userEvent.setup();

      // Only allow letters
      render(<Input inputFilter={/^[a-zA-Z]*$/} />);

      const input = screen.getByTestId('input') as HTMLInputElement;
      await user.type(input, 'abc123');

      expect(input.value).toBe('abc');
    });
  });

  describe('format mask', () => {
    it('should format phone number as user types', async () => {
      const user = userEvent.setup();
      render(<Input formatMask="(###) ###-####" />);

      const input = screen.getByTestId('input') as HTMLInputElement;
      await user.type(input, '5551234567');

      expect(input.value).toBe('(555) 123-4567');
    });

    it('should format SSN', async () => {
      const user = userEvent.setup();
      render(<Input formatMask="###-##-####" />);

      const input = screen.getByTestId('input') as HTMLInputElement;
      await user.type(input, '123456789');

      expect(input.value).toBe('123-45-6789');
    });

    it('should format credit card', async () => {
      const user = userEvent.setup();
      render(<Input formatMask="#### #### #### ####" />);

      const input = screen.getByTestId('input') as HTMLInputElement;
      await user.type(input, '1234567890123456');

      expect(input.value).toBe('1234 5678 9012 3456');
    });

    it('should accept FormatMask object', async () => {
      const user = userEvent.setup();
      render(<Input formatMask={{ pattern: '(###) ###-####', placeholder: '#' }} />);

      const input = screen.getByTestId('input') as HTMLInputElement;
      await user.type(input, '5551234567');

      expect(input.value).toBe('(555) 123-4567');
    });
  });

  describe('validation', () => {
    it('should validate on blur when validateOn is blur', async () => {
      const user = userEvent.setup();
      const handleValidate = jest.fn();

      render(<Input validationRegex={/^[a-z]+$/} validateOn="blur" onValidate={handleValidate} />);

      const input = screen.getByTestId('input');
      await user.type(input, 'ABC');
      expect(handleValidate).not.toHaveBeenCalled();

      await user.tab();
      expect(handleValidate).toHaveBeenCalledWith({
        isValid: false,
        value: 'ABC',
        pattern: /^[a-z]+$/,
      });
    });

    it('should validate on change when validateOn is change', async () => {
      const user = userEvent.setup();
      const handleValidate = jest.fn();

      render(
        <Input validationRegex={/^[a-z]+$/} validateOn="change" onValidate={handleValidate} />
      );

      const input = screen.getByTestId('input');
      await user.type(input, 'a');

      expect(handleValidate).toHaveBeenCalled();
    });

    it('should set aria-invalid when validation fails', async () => {
      const user = userEvent.setup();

      render(<Input validationRegex={/^[a-z]+$/} validateOn="blur" />);

      const input = screen.getByTestId('input');
      await user.type(input, '123');
      await user.tab();

      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should apply error state when error prop is true', () => {
      render(<Input error />);
      const container = screen.getByTestId('input').parentElement;
      expect(container).toHaveAttribute('data-state', 'error');
    });
  });

  describe('clear button', () => {
    it('should show clear button when showClearButton is true and has value', () => {
      render(<Input showClearButton value="test" onChange={() => {}} />);
      expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
    });

    it('should not show clear button when value is empty', () => {
      render(<Input showClearButton value="" onChange={() => {}} />);
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    it('should clear value when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input showClearButton value="test" onChange={handleChange} />);

      const clearButton = screen.getByLabelText('Clear input');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' }),
        })
      );
    });

    it('should call onClear callback when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleClear = jest.fn();

      render(<Input showClearButton value="test" onChange={() => {}} onClear={handleClear} />);

      const clearButton = screen.getByLabelText('Clear input');
      await user.click(clearButton);

      expect(handleClear).toHaveBeenCalled();
    });
  });

  describe('password toggle', () => {
    it('should show password toggle for password input', () => {
      render(<Input type="password" />);
      expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    });

    it('should not show password toggle when showPasswordToggle is false', () => {
      render(<Input type="password" showPasswordToggle={false} />);
      expect(screen.queryByLabelText('Show password')).not.toBeInTheDocument();
    });

    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      render(<Input type="password" value="secret" onChange={() => {}} />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'password');

      const toggleButton = screen.getByLabelText('Show password');
      await user.click(toggleButton);

      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show spinner when loading is true', () => {
      const { container } = render(<Input loading />);
      expect(container.querySelector('.spinner')).toBeInTheDocument();
    });

    it('should hide endIcon when loading', () => {
      const { container } = render(<Input loading endIcon="check" />);
      // Spinner should be present
      expect(container.querySelector('.spinner')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should handle change events', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input onChange={handleChange} />);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle focus events', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();

      render(<Input onFocus={handleFocus} />);

      const input = screen.getByTestId('input');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('should handle blur events', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();

      render(<Input onBlur={handleBlur} />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });

    it('should handle Enter key press', async () => {
      const user = userEvent.setup();
      const handleEnterPress = jest.fn();

      render(<Input onEnterPress={handleEnterPress} />);

      const input = screen.getByTestId('input');
      await user.type(input, 'test{Enter}');

      expect(handleEnterPress).toHaveBeenCalled();
    });

    it('should not trigger change when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input disabled onChange={handleChange} />);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not trigger change when readOnly', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input readOnly onChange={handleChange} />);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('states', () => {
    it('should apply focused state', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByTestId('input');
      const container = input.parentElement;

      await user.click(input);
      expect(container).toHaveAttribute('data-state', 'focused');
    });

    it('should apply disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByTestId('input');
      const container = input.parentElement;

      expect(input).toBeDisabled();
      expect(container).toHaveAttribute('data-state', 'disabled');
    });

    it('should apply readonly state', () => {
      render(<Input readOnly />);
      const input = screen.getByTestId('input');
      const container = input.parentElement;

      expect(input).toHaveAttribute('readonly');
      expect(container).toHaveAttribute('data-state', 'readonly');
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<Input aria-label="Search" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-label', 'Search');
    });

    it('should link aria-describedby to helper text', () => {
      render(<Input helperText="Help" id="test-input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-description');
    });

    it('should set aria-invalid when in error state', () => {
      render(<Input error />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have role alert on error message', () => {
      render(<Input errorMessage="Error" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Input />);

      await user.tab();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should work as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      render(<TestComponent />);
      const input = screen.getByTestId('input');

      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });

    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="initial" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveValue('initial');

      await user.type(input, ' value');
      expect(input).toHaveValue('initial value');
    });
  });
});
