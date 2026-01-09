import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

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

    it('should have role="alert" on error message', () => {
      render(<Checkbox label="Test" error errorMessage="Error" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
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
  });
});
