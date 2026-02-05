import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<Toggle aria-label="Test toggle" />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Toggle label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<Toggle aria-label="Toggle" />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeInTheDocument();
      expect(screen.queryByText('Toggle')).not.toBeInTheDocument();
    });

    it('should render helper text', () => {
      render(<Toggle label="Test" helperText="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should render helper text without label', () => {
      render(<Toggle aria-label="Test" helperText="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should render error message when in error state', () => {
      render(<Toggle label="Test" error errorMessage="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should show error message instead of helper text when both provided', () => {
      render(<Toggle label="Test" helperText="Helper" error errorMessage="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should render required indicator when required', () => {
      render(<Toggle label="Test" required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Toggle label="Test" className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render with data-component attribute', () => {
      const { container } = render(<Toggle label="Test" />);
      const toggle = container.querySelector('[data-component="toggle"]');
      expect(toggle).toBeInTheDocument();
    });
  });

  describe('Controlled Component', () => {
    it('should respect checked prop', () => {
      render(<Toggle label="Test" checked onChange={() => {}} />);
      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(true);
    });

    it('should call onChange when clicked', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" checked={false} onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it('should not update checked state when controlled', () => {
      render(<Toggle label="Test" checked={false} onChange={() => {}} />);
      const toggle = screen.getByRole('checkbox') as HTMLInputElement;

      fireEvent.click(toggle);

      // Should still be false because it's controlled
      expect(toggle.checked).toBe(false);
    });
  });

  describe('Uncontrolled Component', () => {
    it('should use defaultChecked', () => {
      render(<Toggle label="Test" defaultChecked />);
      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(true);
    });

    it('should update checked state when uncontrolled', () => {
      render(<Toggle label="Test" defaultChecked={false} />);
      const toggle = screen.getByRole('checkbox') as HTMLInputElement;

      expect(toggle.checked).toBe(false);
      fireEvent.click(toggle);
      expect(toggle.checked).toBe(true);
    });

    it('should call onChange when uncontrolled', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" defaultChecked={false} onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it('should default to false when no defaultChecked provided', () => {
      render(<Toggle label="Test" />);
      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(false);
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Toggle label="Test" disabled />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" disabled onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should be disabled when loading', () => {
      render(<Toggle label="Test" loading />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeDisabled();
    });

    it('should not call onChange when loading', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" loading onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when readOnly', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" readOnly onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should have required attribute when required', () => {
      render(<Toggle label="Test" required />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeRequired();
    });
  });

  describe('Label Placement', () => {
    it('should place label at end by default', () => {
      const { container } = render(<Toggle label="Test" />);
      const wrapper = container.querySelector('[data-label-placement="end"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should place label at start when specified', () => {
      const { container } = render(<Toggle label="Test" labelPlacement="start" />);
      const wrapper = container.querySelector('[data-label-placement="start"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Toggle label="Test" checked onChange={() => {}} />);
      const toggle = screen.getByRole('checkbox');

      expect(toggle).toHaveAttribute('aria-checked', 'true');
      expect(toggle).toHaveAttribute('aria-label', 'Test');
    });

    it('should use aria-label when provided', () => {
      render(<Toggle aria-label="Custom label" />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should have aria-invalid when in error state', () => {
      render(<Toggle label="Test" error />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-disabled when disabled', () => {
      render(<Toggle label="Test" disabled />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-readonly when readOnly', () => {
      render(<Toggle label="Test" readOnly />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-readonly', 'true');
    });

    it('should have role="alert" on error message', () => {
      render(<Toggle label="Test" error errorMessage="Error" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should have aria-live="polite" on error message', () => {
      render(<Toggle label="Test" error errorMessage="Error" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should not have role="alert" on helper text when no error', () => {
      render(<Toggle label="Test" helperText="Helper" />);
      const helperElement = screen.getByText('Helper');
      expect(helperElement).not.toHaveAttribute('role', 'alert');
    });
  });

  describe('Variants and Sizes', () => {
    it('should apply primary variant by default', () => {
      const { container } = render(<Toggle label="Test" />);
      const toggle = container.querySelector('[data-variant="primary"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply secondary variant', () => {
      const { container } = render(<Toggle label="Test" variant="secondary" />);
      const toggle = container.querySelector('[data-variant="secondary"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply success variant', () => {
      const { container } = render(<Toggle label="Test" variant="success" />);
      const toggle = container.querySelector('[data-variant="success"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply warning variant', () => {
      const { container } = render(<Toggle label="Test" variant="warning" />);
      const toggle = container.querySelector('[data-variant="warning"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply danger variant', () => {
      const { container } = render(<Toggle label="Test" variant="danger" />);
      const toggle = container.querySelector('[data-variant="danger"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply sm size', () => {
      const { container } = render(<Toggle label="Test" size="sm" />);
      const toggle = container.querySelector('[data-size="sm"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply md size by default', () => {
      const { container } = render(<Toggle label="Test" />);
      const toggle = container.querySelector('[data-size="md"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply lg size', () => {
      const { container } = render(<Toggle label="Test" size="lg" />);
      const toggle = container.querySelector('[data-size="lg"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply error data attribute', () => {
      const { container } = render(<Toggle label="Test" error />);
      const toggle = container.querySelector('[data-error="true"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply loading data attribute', () => {
      const { container } = render(<Toggle label="Test" loading />);
      const toggle = container.querySelector('[data-loading="true"]');
      expect(toggle).toBeInTheDocument();
    });
  });

  describe('Custom ID', () => {
    it('should use provided id', () => {
      render(<Toggle id="custom-id" label="Test" />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('id', 'custom-id');
    });

    it('should generate id if not provided', () => {
      render(<Toggle label="Test" />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('id');
    });

    it('should associate label with input via id', () => {
      render(<Toggle id="custom-id" label="Test" />);
      const toggle = screen.getByRole('checkbox');
      const labels = document.querySelectorAll('label[for="custom-id"]');
      expect(toggle).toHaveAttribute('id', 'custom-id');
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('Name Attribute', () => {
    it('should apply name attribute', () => {
      render(<Toggle label="Test" name="testToggle" />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('name', 'testToggle');
    });
  });

  describe('Data Test ID', () => {
    it('should apply data-testid', () => {
      render(<Toggle label="Test" data-testid="custom-toggle" />);
      const toggle = screen.getByTestId('custom-toggle');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply data-testid to container', () => {
      render(<Toggle label="Test" data-testid="custom-toggle" />);
      const container = screen.getByTestId('custom-toggle-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Toggle label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(Toggle.displayName).toBe('Toggle');
    });
  });

  describe('Data Attributes', () => {
    it('should apply data-checked attribute when checked', () => {
      const { container } = render(<Toggle label="Test" checked onChange={() => {}} />);
      const toggle = container.querySelector('[data-checked="true"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply data-disabled attribute when disabled', () => {
      const { container } = render(<Toggle label="Test" disabled />);
      const toggle = container.querySelector('[data-disabled="true"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply data-readonly attribute when readOnly', () => {
      const { container } = render(<Toggle label="Test" readOnly />);
      const toggle = container.querySelector('[data-readonly="true"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply data-required attribute when required', () => {
      const { container } = render(<Toggle label="Test" required />);
      const labelText = container.querySelector('[data-required="true"]');
      expect(labelText).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle unchecked to checked toggle', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" checked={false} onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it('should handle checked to unchecked toggle', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" checked onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
    });

    it('should not render helper text or error message when neither provided', () => {
      render(<Toggle label="Test" />);
      const helperText = screen.queryByRole('alert');
      expect(helperText).not.toBeInTheDocument();
    });

    it('should handle multiple rapid clicks', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" defaultChecked={false} onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('should work with both loading and disabled', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" loading disabled onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).not.toHaveBeenCalled();
      expect(toggle).toBeDisabled();
    });

    it('should accept additional HTML attributes', () => {
      render(<Toggle label="Test" title="Toggle title" tabIndex={0} />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('title', 'Toggle title');
      expect(toggle).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Callback with Event Object', () => {
    it('should pass event object to onChange callback', () => {
      const handleChange = jest.fn();
      render(<Toggle label="Test" checked={false} onChange={handleChange} />);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledWith(
        true,
        expect.objectContaining({
          target: expect.any(Object),
          type: 'change',
        })
      );
    });
  });

  describe('Container Structure', () => {
    it('should render correct container structure with label', () => {
      const { container } = render(<Toggle label="Test" />);
      const mainContainer = container.querySelector('[data-label-placement]');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should render correct container structure without label', () => {
      render(<Toggle aria-label="Test" data-testid="test-toggle" />);
      const container = screen.getByTestId('test-toggle-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Type Attribute', () => {
    it('should have type="checkbox"', () => {
      render(<Toggle label="Test" />);
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('type', 'checkbox');
    });
  });
});
