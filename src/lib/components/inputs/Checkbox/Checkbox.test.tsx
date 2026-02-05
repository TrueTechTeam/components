import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import React from 'react';

describe('Checkbox', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<Checkbox aria-label="Test checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('should render helper text', () => {
      render(<Checkbox label="Test" helperText="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should render error message when in error state', () => {
      render(<Checkbox label="Test" error errorMessage="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<Checkbox aria-label="No label" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should show error message instead of helper text when both provided', () => {
      render(<Checkbox label="Test" helperText="Helper" error errorMessage="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should render helper text without label', () => {
      render(<Checkbox aria-label="Test" helperText="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should render error message without label', () => {
      render(<Checkbox aria-label="Test" error errorMessage="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('Controlled Component', () => {
    it('should respect checked prop', () => {
      render(<Checkbox label="Test" checked onChange={() => {}} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('should call onChange when clicked', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Test" checked={false} onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it('should not update checked state when controlled', () => {
      render(<Checkbox label="Test" checked={false} onChange={() => {}} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      fireEvent.click(checkbox);

      // Should still be false because it's controlled
      expect(checkbox.checked).toBe(false);
    });

    it('should call onChange with false when unchecking', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Test" checked onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
    });
  });

  describe('Uncontrolled Component', () => {
    it('should use defaultChecked', () => {
      render(<Checkbox label="Test" defaultChecked />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('should update checked state when uncontrolled', () => {
      render(<Checkbox label="Test" defaultChecked={false} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox.checked).toBe(false);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it('should call onChange when uncontrolled', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Test" defaultChecked={false} onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });
  });

  describe('Indeterminate State', () => {
    it('should set indeterminate property on input element', () => {
      render(<Checkbox label="Test" indeterminate />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('should have aria-checked="mixed" when indeterminate', () => {
      render(<Checkbox label="Test" indeterminate />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('should clear indeterminate when set to false', () => {
      const { rerender } = render(<Checkbox label="Test" indeterminate />);
      let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);

      rerender(<Checkbox label="Test" indeterminate={false} />);
      checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);
    });

    it('should render indeterminate icon when indeterminate', () => {
      const { container } = render(<Checkbox label="Test" indeterminate />);
      const icon = container.querySelector('[data-testid="icon-minus"]');
      expect(icon).toBeInTheDocument();
    });

    it('should render custom indeterminate icon', () => {
      const { container } = render(
        <Checkbox label="Test" indeterminate indeterminateIcon="star" />
      );
      const icon = container.querySelector('[data-testid="icon-star"]');
      expect(icon).toBeInTheDocument();
    });

    it('should render custom indeterminate icon as ReactNode', () => {
      const CustomIcon = () => <span data-testid="custom-indeterminate">-</span>;
      render(<Checkbox label="Test" indeterminate indeterminateIcon={<CustomIcon />} />);
      expect(screen.getByTestId('custom-indeterminate')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Checkbox label="Test" disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Test" disabled onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when readOnly', () => {
      const handleChange = jest.fn();
      render(<Checkbox label="Test" readOnly onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should have required attribute when required', () => {
      render(<Checkbox label="Test" required />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeRequired();
    });

    it('should show required asterisk when required', () => {
      const { container } = render(<Checkbox label="Test" required />);
      const required = container.querySelector('.required');
      expect(required).toBeInTheDocument();
      expect(required).toHaveTextContent('*');
    });
  });

  describe('Label Placement', () => {
    it('should place label at end by default', () => {
      const { container } = render(<Checkbox label="Test" />);
      const wrapper = container.querySelector('[data-label-placement="end"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should place label at start when specified', () => {
      const { container } = render(<Checkbox label="Test" labelPlacement="start" />);
      const wrapper = container.querySelector('[data-label-placement="start"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Checkbox label="Test" checked onChange={() => {}} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(checkbox).toHaveAttribute('aria-label', 'Test');
    });

    it('should use aria-label when provided', () => {
      render(<Checkbox aria-label="Custom label" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should have aria-invalid when in error state', () => {
      render(<Checkbox label="Test" error />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-disabled when disabled', () => {
      render(<Checkbox label="Test" disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-readonly when readOnly', () => {
      render(<Checkbox label="Test" readOnly />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-readonly', 'true');
    });

    it('should have role="alert" on error message', () => {
      render(<Checkbox label="Test" error errorMessage="Error" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should have aria-live="polite" on error message', () => {
      render(<Checkbox label="Test" error errorMessage="Error" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should not have role and aria-live on helper text when not error', () => {
      render(<Checkbox label="Test" helperText="Helper" />);
      const helperElement = screen.getByText('Helper');
      expect(helperElement).not.toHaveAttribute('role');
      expect(helperElement).not.toHaveAttribute('aria-live');
    });
  });

  describe('Variants and Sizes', () => {
    it('should apply variant data attribute', () => {
      const { container } = render(<Checkbox label="Test" variant="success" />);
      const checkbox = container.querySelector('[data-variant="success"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply size data attribute', () => {
      const { container } = render(<Checkbox label="Test" size="lg" />);
      const checkbox = container.querySelector('[data-size="lg"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply primary variant by default', () => {
      const { container } = render(<Checkbox label="Test" />);
      const checkbox = container.querySelector('[data-variant="primary"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply md size by default', () => {
      const { container } = render(<Checkbox label="Test" />);
      const checkbox = container.querySelector('[data-size="md"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply error data attribute', () => {
      const { container } = render(<Checkbox label="Test" error />);
      const checkbox = container.querySelector('[data-error="true"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply disabled data attribute', () => {
      const { container } = render(<Checkbox label="Test" disabled />);
      const checkbox = container.querySelector('[data-disabled="true"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply readonly data attribute', () => {
      const { container } = render(<Checkbox label="Test" readOnly />);
      const checkbox = container.querySelector('[data-readonly="true"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply checked data attribute', () => {
      const { container } = render(<Checkbox label="Test" checked onChange={() => {}} />);
      const checkbox = container.querySelector('[data-checked="true"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply indeterminate data attribute', () => {
      const { container } = render(<Checkbox label="Test" indeterminate />);
      const checkbox = container.querySelector('[data-indeterminate="true"]');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Custom Icons', () => {
    it('should render default check icon when checked', () => {
      const { container } = render(<Checkbox label="Test" checked onChange={() => {}} />);
      const icon = container.querySelector('[data-testid="icon-check"]');
      expect(icon).toBeInTheDocument();
    });

    it('should render custom check icon as string', () => {
      const { container } = render(
        <Checkbox label="Test" checked checkIcon="star" onChange={() => {}} />
      );
      const icon = container.querySelector('[data-testid="icon-star"]');
      expect(icon).toBeInTheDocument();
    });

    it('should render custom check icon as ReactNode', () => {
      const CustomIcon = () => <span data-testid="custom-check">✓</span>;
      render(<Checkbox label="Test" checked checkIcon={<CustomIcon />} onChange={() => {}} />);
      expect(screen.getByTestId('custom-check')).toBeInTheDocument();
    });

    it('should not render check icon when unchecked', () => {
      const { container } = render(<Checkbox label="Test" checked={false} onChange={() => {}} />);
      const icon = container.querySelector('[data-testid="icon-check"]');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Icon Sizes', () => {
    it('should render icon with sm size', () => {
      const { container } = render(<Checkbox label="Test" size="sm" checked onChange={() => {}} />);
      const icon = container.querySelector('[data-testid="icon-check"]');
      expect(icon).toBeInTheDocument();
    });

    it('should render icon with lg size', () => {
      const { container } = render(<Checkbox label="Test" size="lg" checked onChange={() => {}} />);
      const icon = container.querySelector('[data-testid="icon-check"]');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Custom ID', () => {
    it('should use provided id', () => {
      render(<Checkbox id="custom-id" label="Test" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
    });

    it('should generate id if not provided', () => {
      render(<Checkbox label="Test" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id');
    });
  });

  describe('Name Attribute', () => {
    it('should apply name attribute', () => {
      render(<Checkbox label="Test" name="testCheckbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'testCheckbox');
    });
  });

  describe('Data Test ID', () => {
    it('should apply data-testid', () => {
      render(<Checkbox label="Test" data-testid="custom-checkbox" />);
      const checkbox = screen.getByTestId('custom-checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should apply data-testid to container', () => {
      render(<Checkbox label="Test" data-testid="custom-checkbox" />);
      const container = screen.getByTestId('custom-checkbox-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(<Checkbox label="Test" className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Component Data Attribute', () => {
    it('should have data-component="checkbox" attribute', () => {
      const { container } = render(<Checkbox label="Test" />);
      const checkbox = container.querySelector('[data-component="checkbox"]');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });

    it('should forward ref as callback', () => {
      let inputElement: HTMLInputElement | null = null;
      const refCallback = (el: HTMLInputElement | null) => {
        inputElement = el;
      };
      render(<Checkbox label="Test" ref={refCallback} />);
      expect(inputElement).toBeInstanceOf(HTMLInputElement);
      expect(inputElement?.type).toBe('checkbox');
    });

    it('should set indeterminate on ref element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox label="Test" indeterminate ref={ref} />);
      expect(ref.current?.indeterminate).toBe(true);
    });
  });

  describe('Additional Props', () => {
    it('should pass additional props to input element', () => {
      render(<Checkbox label="Test" data-custom="custom-value" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-custom', 'custom-value');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined checkIcon and not render icon when unchecked', () => {
      const { container } = render(
        <Checkbox label="Test" checked={false} checkIcon={undefined} onChange={() => {}} />
      );
      const icon = container.querySelector('.icon');
      expect(icon).not.toBeInTheDocument();
    });

    it('should handle empty string checkIcon and fall back to default', () => {
      const { container } = render(
        <Checkbox label="Test" checked checkIcon="" onChange={() => {}} />
      );
      // Empty string is falsy, so it falls back to default "check" icon
      const icon = container.querySelector('[data-testid="icon-check"]');
      expect(icon).toBeInTheDocument();
    });

    it('should handle ReactNode with label as ReactNode', () => {
      const LabelComponent = () => <span>Label Component</span>;
      render(<Checkbox label={<LabelComponent />} />);
      expect(screen.getByText('Label Component')).toBeInTheDocument();
    });
  });
});
