import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';

describe('Radio', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" aria-label="Test radio" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(
        <RadioGroup label="Group Label">
          <Radio value="option1" aria-label="Option1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
      // The radio itself should not have a visible label text (uses aria-label)
      expect(screen.queryByText('Option1')).not.toBeInTheDocument();
    });

    it('should render helper text', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" helperText="Helper text" />
        </RadioGroup>
      );
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should render helper text without label', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" aria-label="Option" helperText="Helper text" />
        </RadioGroup>
      );
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });
  });

  describe('RadioGroup Integration', () => {
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

    it('should render RadioGroup helper text', () => {
      render(
        <RadioGroup label="Test" helperText="Helper text">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should render RadioGroup error message', () => {
      render(
        <RadioGroup label="Test" error errorMessage="Error message">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('Controlled Component', () => {
    it('should respect value prop from RadioGroup', () => {
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

    it('should not call onChange when same value is clicked', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" value="option1" onChange={handleChange}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      fireEvent.click(radio1);

      // Standard HTML radio behavior: onChange is not fired when clicking already-selected value
      expect(handleChange).not.toHaveBeenCalled();
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

    it('should not call onChange when group is disabled', () => {
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

    it('should not call onChange when group is readOnly', () => {
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

    it('should not call onChange when individual radio is disabled', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" onChange={handleChange}>
          <Radio value="option1" label="Option 1" disabled />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      fireEvent.click(radio1);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should allow individual radio to be readOnly', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" onChange={handleChange}>
          <Radio value="option1" label="Option 1" readOnly />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      fireEvent.click(radio1);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should prioritize individual disabled over group disabled', () => {
      render(
        <RadioGroup label="Test" disabled={false}>
          <Radio value="option1" label="Option 1" disabled />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).toBeDisabled();
      expect(radio2).not.toBeDisabled();
    });
  });

  describe('Label Placement', () => {
    it('should place label at end by default', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const wrapper = container.querySelector('[data-label-placement="end"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should place label at start when specified', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" labelPlacement="start" />
        </RadioGroup>
      );
      const wrapper = container.querySelector('[data-label-placement="start"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should not render label placement wrapper when no label', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" aria-label="Option" />
        </RadioGroup>
      );
      const wrapper = container.querySelector('[data-label-placement]');
      expect(wrapper).not.toBeInTheDocument();
    });
  });

  describe('Checked Icon', () => {
    it('should render checked icon when checked', () => {
      render(
        <RadioGroup label="Test" value="option1">
          <Radio value="option1" label="Option 1" checkedIcon="check" />
        </RadioGroup>
      );

      const icon = screen.getByTestId('icon-check');
      expect(icon).toBeInTheDocument();
    });

    it('should not render checked icon when not checked', () => {
      render(
        <RadioGroup label="Test" value="option2">
          <Radio value="option1" label="Option 1" checkedIcon="check" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const icon = screen.queryByTestId('icon-check');
      expect(icon).not.toBeInTheDocument();
    });

    it('should render custom checked icon component', () => {
      const CustomIcon = () => <span data-testid="custom-icon">✓</span>;
      render(
        <RadioGroup label="Test" value="option1">
          <Radio value="option1" label="Option 1" checkedIcon={<CustomIcon />} />
        </RadioGroup>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should not render custom icon when not checked', () => {
      const CustomIcon = () => <span data-testid="custom-icon">✓</span>;
      render(
        <RadioGroup label="Test" value="option2">
          <Radio value="option1" label="Option 1" checkedIcon={<CustomIcon />} />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
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
      expect(radio1).toHaveAttribute('aria-label', 'Option 1');
      expect(radio2).toHaveAttribute('aria-label', 'Option 2');
    });

    it('should use aria-label when provided', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" aria-label="Custom label" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should use aria-label over label text', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Label text" aria-label="ARIA label" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('aria-label', 'ARIA label');
    });

    it('should have aria-disabled when disabled', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" disabled />
        </RadioGroup>
      );
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-readonly when readOnly', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" readOnly />
        </RadioGroup>
      );
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('aria-readonly', 'true');
    });

    it('should have role="alert" on RadioGroup error message', () => {
      render(
        <RadioGroup label="Test" error errorMessage="Error">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );

      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should have proper radio role', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('type', 'radio');
    });
  });

  describe('Variants and Sizes', () => {
    it('should apply variant from RadioGroup', () => {
      const { container } = render(
        <RadioGroup label="Test" variant="success">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const radio = container.querySelector('[data-variant="success"]');
      expect(radio).toBeInTheDocument();
    });

    it('should apply size from RadioGroup', () => {
      const { container } = render(
        <RadioGroup label="Test" size="lg">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const radio = container.querySelector('[data-size="lg"]');
      expect(radio).toBeInTheDocument();
    });

    it('should apply checked data attribute when checked', () => {
      const { container } = render(
        <RadioGroup label="Test" value="option1">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const radio = container.querySelector('[data-checked]');
      expect(radio).toBeInTheDocument();
    });

    it('should not apply checked data attribute when not checked', () => {
      render(
        <RadioGroup label="Test" value="option2">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1Label = screen.getByLabelText('Option 1').closest('label');
      expect(radio1Label).not.toHaveAttribute('data-checked');
    });

    it('should apply disabled data attribute', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" disabled />
        </RadioGroup>
      );
      const radio = container.querySelector('[data-disabled]');
      expect(radio).toBeInTheDocument();
    });

    it('should apply readonly data attribute', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" readOnly />
        </RadioGroup>
      );
      const radio = container.querySelector('[data-readonly]');
      expect(radio).toBeInTheDocument();
    });

    it('should apply component data attribute', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const radio = container.querySelector('[data-component="radio"]');
      expect(radio).toBeInTheDocument();
    });
  });

  describe('Custom ID', () => {
    it('should use provided id', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" id="custom-id" label="Option 1" />
        </RadioGroup>
      );
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('id', 'custom-id');
    });

    it('should generate id if not provided', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('id');
      expect(radio.getAttribute('id')).toBeTruthy();
    });

    it('should link label to input via id', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const radio = screen.getByLabelText('Option 1');
      const label = screen.getByText('Option 1').closest('label');
      expect(label).toHaveAttribute('for', radio.getAttribute('id') || '');
    });
  });

  describe('Name Attribute', () => {
    it('should apply name from RadioGroup', () => {
      render(
        <RadioGroup label="Test" name="testGroup">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).toHaveAttribute('name', 'testGroup');
      expect(radio2).toHaveAttribute('name', 'testGroup');
    });

    it('should auto-generate name if not provided', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');

      expect(radio1).toHaveAttribute('name');
      expect(radio2).toHaveAttribute('name');
      expect(radio1.getAttribute('name')).toBe(radio2.getAttribute('name'));
    });
  });

  describe('Data Test ID', () => {
    it('should apply data-testid', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" data-testid="custom-radio" />
        </RadioGroup>
      );
      const radio = screen.getByTestId('custom-radio');
      expect(radio).toBeInTheDocument();
    });

    it('should apply data-testid to container', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" data-testid="custom-radio" />
        </RadioGroup>
      );
      const container = screen.getByTestId('custom-radio-container');
      expect(container).toBeInTheDocument();
    });

    it('should apply data-testid to RadioGroup', () => {
      render(
        <RadioGroup label="Test" data-testid="custom-group">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      const group = screen.getByTestId('custom-group');
      expect(group).toBeInTheDocument();
    });
  });

  describe('Value Attribute', () => {
    it('should set value attribute on input', () => {
      render(
        <RadioGroup label="Test">
          <Radio value="test-value" label="Option 1" />
        </RadioGroup>
      );
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('value', 'test-value');
    });

    it('should use value for checking against group value', () => {
      render(
        <RadioGroup label="Test" value="option2">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
    });
  });

  describe('Custom Class Name', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" className="custom-class" />
        </RadioGroup>
      );
      const radioContainer = container.querySelector('.custom-class');
      expect(radioContainer).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through additional HTML attributes', () => {
      render(
        <RadioGroup label="Test">
          <Radio
            value="option1"
            label="Option 1"
            data-custom="custom-value"
            aria-describedby="description"
          />
        </RadioGroup>
      );
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('data-custom', 'custom-value');
      expect(radio).toHaveAttribute('aria-describedby', 'description');
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

  describe('Event Handling', () => {
    it('should call onChange with correct value and event', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" onChange={handleChange}>
          <Radio value="test-value" label="Option 1" />
        </RadioGroup>
      );

      const radio = screen.getByLabelText('Option 1');
      fireEvent.click(radio);

      expect(handleChange).toHaveBeenCalledWith('test-value', expect.any(Object));
      expect(handleChange.mock.calls[0][1].target).toBe(radio);
    });

    it('should handle multiple radio changes', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" onChange={handleChange}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
      );

      fireEvent.click(screen.getByLabelText('Option 1'));
      fireEvent.click(screen.getByLabelText('Option 2'));
      fireEvent.click(screen.getByLabelText('Option 3'));

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, 'option1', expect.any(Object));
      expect(handleChange).toHaveBeenNthCalledWith(2, 'option2', expect.any(Object));
      expect(handleChange).toHaveBeenNthCalledWith(3, 'option3', expect.any(Object));
    });

    it('should not call onChange when clicking label of disabled radio', () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup label="Test" onChange={handleChange}>
          <Radio value="option1" label="Option 1" disabled />
        </RadioGroup>
      );

      const label = screen.getByText('Option 1');
      fireEvent.click(label);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(
        <RadioGroup label="Test">
          <Radio value="option1" label="Option 1" ref={ref} />
        </RadioGroup>
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('radio');
    });
  });
});
