import { render, screen, fireEvent } from '@testing-library/react';
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

    it('should render error message when in error state', () => {
      render(<Toggle label="Test" error errorMessage="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should show error message instead of helper text when both provided', () => {
      render(
        <Toggle
          label="Test"
          helperText="Helper"
          error
          errorMessage="Error"
        />
      );
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
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
      expect(handleChange).toHaveBeenCalledWith(
        true,
        expect.any(Object)
      );
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
  });

  describe('Variants and Sizes', () => {
    it('should apply variant data attribute', () => {
      const { container } = render(<Toggle label="Test" variant="success" />);
      const toggle = container.querySelector('[data-variant="success"]');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply size data attribute', () => {
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
  });
});
