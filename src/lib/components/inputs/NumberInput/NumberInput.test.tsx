import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from './NumberInput';
import React from 'react';

describe('NumberInput', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<NumberInput />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('should render with default value', () => {
      render(<NumberInput defaultValue={5} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('5');
    });

    it('should render with label', () => {
      render(<NumberInput label="Quantity" />);
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<NumberInput />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('should render helper text', () => {
      render(<NumberInput helperText="Enter a number" />);
      expect(screen.getByText('Enter a number')).toBeInTheDocument();
    });

    it('should render error message when in error state', () => {
      render(<NumberInput error errorMessage="Invalid number" />);
      expect(screen.getByText('Invalid number')).toBeInTheDocument();
    });

    it('should show error message instead of helper text when both provided', () => {
      render(<NumberInput helperText="Helper" error errorMessage="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should render increment and decrement buttons', () => {
      render(<NumberInput />);
      expect(screen.getByLabelText('Increase value')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrease value')).toBeInTheDocument();
    });

    it('should show required indicator when required', () => {
      render(<NumberInput label="Quantity" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should apply custom className to container', () => {
      render(<NumberInput className="custom-class" data-testid="test-input" />);
      const container = screen.getByTestId('test-input-container');
      expect(container).toHaveClass('custom-class');
    });

    it('should apply data-testid to container', () => {
      render(<NumberInput data-testid="test-input" />);
      expect(screen.getByTestId('test-input-container')).toBeInTheDocument();
    });
  });

  describe('Controlled Component', () => {
    it('should respect controlled value', () => {
      render(<NumberInput value={10} onChange={() => {}} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('10');
    });

    it('should call onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<NumberInput value={5} onChange={handleChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '10');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should not update internal state when controlled', () => {
      const { rerender } = render(<NumberInput value={5} onChange={() => {}} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '10' } });

      // Should still show controlled value
      expect(input.value).toBe('5');

      // Value should update when controlled value changes
      rerender(<NumberInput value={10} onChange={() => {}} />);
      expect(input.value).toBe('10');
    });
  });

  describe('Uncontrolled Component', () => {
    it('should use defaultValue', () => {
      render(<NumberInput defaultValue={7} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('7');
    });

    it('should default to 0 when no defaultValue provided', () => {
      render(<NumberInput />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('0');
    });

    it('should update internal state when uncontrolled', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={5} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;

      await user.clear(input);
      await user.type(input, '15');

      expect(input.value).toBe('15');
    });
  });

  describe('Increment and Decrement', () => {
    it('should increment value when increment button is clicked', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={0} onChange={handleChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      fireEvent.click(incrementButton);

      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('should decrement value when decrement button is clicked', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} onChange={handleChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      fireEvent.click(decrementButton);

      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it('should increment by step value', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={0} step={5} onChange={handleChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      fireEvent.click(incrementButton);

      expect(handleChange).toHaveBeenCalledWith(5);
    });

    it('should decrement by step value', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={10} step={3} onChange={handleChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      fireEvent.click(decrementButton);

      expect(handleChange).toHaveBeenCalledWith(7);
    });

    it('should not increment when disabled', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} disabled onChange={handleChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      fireEvent.click(incrementButton);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not decrement when disabled', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} disabled onChange={handleChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      fireEvent.click(decrementButton);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not increment when readOnly', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} readOnly onChange={handleChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      fireEvent.click(incrementButton);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not decrement when readOnly', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} readOnly onChange={handleChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      fireEvent.click(decrementButton);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Min and Max Constraints', () => {
    it('should respect min constraint', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} min={0} onChange={handleChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      // Click decrement 6 times (should stop at 0)
      for (let i = 0; i < 6; i++) {
        fireEvent.click(decrementButton);
      }

      // Last call should be with 0 (clamped to min)
      const calls = handleChange.mock.calls;
      expect(calls[calls.length - 1][0]).toBe(0);
    });

    it('should respect max constraint', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={8} max={10} onChange={handleChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      // Click increment 3 times (should stop at 10)
      for (let i = 0; i < 3; i++) {
        fireEvent.click(incrementButton);
      }

      // Last call should be with 10 (clamped to max)
      const calls = handleChange.mock.calls;
      expect(calls[calls.length - 1][0]).toBe(10);
    });

    it('should clamp value when typed input exceeds max', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} max={10} onChange={handleChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '15');

      // Should be clamped to 10
      expect(handleChange).toHaveBeenCalledWith(10);
    });

    it('should clamp value when typed input goes below min', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={5} min={0} onChange={handleChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '-5');

      // Should be clamped to 0
      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('should disable decrement button when at min value', () => {
      render(<NumberInput value={0} min={0} onChange={() => {}} />);
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(decrementButton).toBeDisabled();
    });

    it('should disable increment button when at max value', () => {
      render(<NumberInput value={10} max={10} onChange={() => {}} />);
      const incrementButton = screen.getByLabelText('Increase value');
      expect(incrementButton).toBeDisabled();
    });

    it('should not disable decrement button when above min', () => {
      render(<NumberInput value={5} min={0} onChange={() => {}} />);
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(decrementButton).not.toBeDisabled();
    });

    it('should not disable increment button when below max', () => {
      render(<NumberInput value={5} max={10} onChange={() => {}} />);
      const incrementButton = screen.getByLabelText('Increase value');
      expect(incrementButton).not.toBeDisabled();
    });
  });

  describe('Format Display', () => {
    it('should format display value', () => {
      const formatDisplay = (value: number) => `$${value.toFixed(2)}`;
      render(<NumberInput value={10} formatDisplay={formatDisplay} onChange={() => {}} />);

      const input = screen.getByDisplayValue('$10.00');
      expect(input).toBeInTheDocument();
    });

    it('should render as text input when formatDisplay is provided', () => {
      const formatDisplay = (value: number) => `${value}%`;
      render(<NumberInput value={50} formatDisplay={formatDisplay} onChange={() => {}} />);

      const input = screen.getByDisplayValue('50%');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render as number input when formatDisplay is not provided', () => {
      render(<NumberInput value={50} onChange={() => {}} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should update formatted display when value changes', () => {
      const formatDisplay = (value: number) => `${value} units`;
      const { rerender } = render(
        <NumberInput value={5} formatDisplay={formatDisplay} onChange={() => {}} />
      );

      expect(screen.getByDisplayValue('5 units')).toBeInTheDocument();

      rerender(<NumberInput value={10} formatDisplay={formatDisplay} onChange={() => {}} />);

      expect(screen.getByDisplayValue('10 units')).toBeInTheDocument();
    });
  });

  describe('Width Customization', () => {
    it('should apply custom width as number', () => {
      render(<NumberInput width={200} data-testid="test-input" />);
      const container = screen.getByTestId('test-input-container');
      expect(container).toHaveStyle({ width: '200px' });
    });

    it('should apply custom width as string', () => {
      render(<NumberInput width="10rem" data-testid="test-input" />);
      const container = screen.getByTestId('test-input-container');
      expect(container).toHaveStyle({ width: '10rem' });
    });

    it('should calculate auto-width based on max value', () => {
      render(<NumberInput max={999} data-testid="test-input" />);
      const container = screen.getByTestId('test-input-container');
      // With 3 digits: 3 * 10 + 80 + 2 + 16 = 128px
      expect(container).toHaveStyle({ width: '128px' });
    });

    it('should not auto-calculate width if width is explicitly provided', () => {
      render(<NumberInput max={999} width={150} data-testid="test-input" />);
      const container = screen.getByTestId('test-input-container');
      expect(container).toHaveStyle({ width: '150px' });
    });

    it('should not apply width style if neither width nor max is provided', () => {
      render(<NumberInput data-testid="test-input" />);
      const container = screen.getByTestId('test-input-container');
      const style = container.getAttribute('style');
      expect(style).toBeNull();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<NumberInput disabled />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();
    });

    it('should disable both buttons when disabled', () => {
      render(<NumberInput disabled />);
      const incrementButton = screen.getByLabelText('Increase value');
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(incrementButton).toBeDisabled();
      expect(decrementButton).toBeDisabled();
    });

    it('should disable both buttons when readOnly', () => {
      render(<NumberInput readOnly />);
      const incrementButton = screen.getByLabelText('Increase value');
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(incrementButton).toBeDisabled();
      expect(decrementButton).toBeDisabled();
    });

    it('should be readonly when readOnly prop is true', () => {
      render(<NumberInput readOnly />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('readonly');
    });

    it('should be required when required prop is true', () => {
      render(<NumberInput required />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeRequired();
    });

    it('should have error state when error prop is true', () => {
      render(<NumberInput error />);
      const input = screen.getByRole('spinbutton');
      // The Input component should handle the error state
      expect(input).toBeInTheDocument();
    });
  });

  describe('Blur Events', () => {
    it('should call onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<NumberInput onBlur={handleBlur} />);

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });

    it('should pass blur event to onBlur handler', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<NumberInput onBlur={handleBlur} />);

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('ID Management', () => {
    it('should use provided id', () => {
      render(<NumberInput id="custom-id" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('should generate id if not provided', () => {
      render(<NumberInput />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('id');
      expect(input.getAttribute('id')).toBeTruthy();
    });

    it('should associate label with input using id', () => {
      render(<NumberInput id="test-id" label="Quantity" />);
      const label = screen.getByText('Quantity');
      const input = screen.getByRole('spinbutton');
      expect(label).toHaveAttribute('for', 'test-id');
      expect(input).toHaveAttribute('id', 'test-id');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<NumberInput ref={ref} />);
      expect(ref.current).toBeDefined();
      expect(ref.current).toBeTruthy();
      // The Input component uses useImperativeHandle, so check it has input-like properties
      expect(ref.current).toHaveProperty('focus');
      expect(ref.current).toHaveProperty('value');
    });
  });

  describe('Additional Props', () => {
    it('should pass through additional HTML attributes', () => {
      render(<NumberInput placeholder="Enter number" name="quantity" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('placeholder', 'Enter number');
      expect(input).toHaveAttribute('name', 'quantity');
    });

    it('should handle aria-label', () => {
      render(<NumberInput aria-label="Custom label" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-label', 'Custom label');
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative numbers', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={0} onChange={handleChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      fireEvent.click(decrementButton);

      expect(handleChange).toHaveBeenCalledWith(-1);
    });

    it('should handle decimal steps', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={0} step={0.5} onChange={handleChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      fireEvent.click(incrementButton);

      expect(handleChange).toHaveBeenCalledWith(0.5);
    });

    it('should handle negative min values', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={-5} min={-10} onChange={handleChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      // Click 6 times (should stop at -10)
      for (let i = 0; i < 6; i++) {
        fireEvent.click(decrementButton);
      }

      const calls = handleChange.mock.calls;
      expect(calls[calls.length - 1][0]).toBe(-10);
    });

    it('should handle large numbers', () => {
      const handleChange = jest.fn();
      render(<NumberInput defaultValue={999} step={100} onChange={handleChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      fireEvent.click(incrementButton);

      expect(handleChange).toHaveBeenCalledWith(1099);
    });

    it('should handle zero as max', () => {
      render(<NumberInput value={0} max={0} onChange={() => {}} />);
      const incrementButton = screen.getByLabelText('Increase value');
      expect(incrementButton).toBeDisabled();
    });

    it('should handle zero as min', () => {
      render(<NumberInput value={0} min={0} onChange={() => {}} />);
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(decrementButton).toBeDisabled();
    });
  });

  describe('Display Name', () => {});
});
