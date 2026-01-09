import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';

describe('RadioGroup and Radio', () => {
  describe('Basic Rendering', () => {
    it('should render RadioGroup with Radio buttons', () => {
      render(
        <RadioGroup label="Test group">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      expect(screen.getByText('Test group')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    });

    it('should render helper text', () => {
      render(
        <RadioGroup label="Test" helperText="Helper text">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(
        <RadioGroup label="Test" error errorMessage="Error message">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('Controlled Component', () => {
    it('should respect value prop', () => {
      render(
        <RadioGroup label="Test" value="option2" onChange={() => {}}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
    });

    it('should call onChange when selection changes', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" value="option1" onChange={handleChange}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2');
      fireEvent.click(radio2);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option2', expect.any(Object));
    });
  });

  describe('Uncontrolled Component', () => {
    it('should use defaultValue', () => {
      render(
        <RadioGroup label="Test" defaultValue="option2">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;
      expect(radio2.checked).toBe(true);
    });

    it('should update selection when uncontrolled', () => {
      render(
        <RadioGroup label="Test" defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;

      expect(radio1.checked).toBe(true);
      expect(radio2.checked).toBe(false);

      fireEvent.click(radio2);

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
    });
  });

  describe('States', () => {
    it('should disable all radios when group is disabled', () => {
      render(
        <RadioGroup label="Test" disabled>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).toBeDisabled();
      expect(radio2).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" disabled onChange={handleChange}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2');
      fireEvent.click(radio2);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when readOnly', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" readOnly value="option1" onChange={handleChange}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio2 = screen.getByLabelText('Option 2');
      fireEvent.click(radio2);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should allow individual radio to be disabled', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" disabled />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).not.toBeDisabled();
      expect(radio2).toBeDisabled();
    });
  });

  describe('Orientation', () => {
    it('should render vertical by default', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );

      const radioList = container.querySelector('[data-orientation="vertical"]');
      expect(radioList).toBeInTheDocument();
    });

    it('should render horizontal when specified', () => {
      const { container } = render(
        <RadioGroup label="Test" orientation="horizontal">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );

      const radioList = container.querySelector('[data-orientation="horizontal"]');
      expect(radioList).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <RadioGroup label="Test" value="option2" onChange={() => {}}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).toHaveAttribute('aria-checked', 'false');
      expect(radio2).toHaveAttribute('aria-checked', 'true');
    });

    it('should have role="alert" on error message', () => {
      render(
        <RadioGroup label="Test" error errorMessage="Error">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );

      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });
  });

  describe('Context Error', () => {
    it('should throw error when Radio used outside RadioGroup', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Radio value="option1" label="Option 1" />);
      }).toThrow('Radio must be used within RadioGroup');

      consoleSpy.mockRestore();
    });
  });
});
