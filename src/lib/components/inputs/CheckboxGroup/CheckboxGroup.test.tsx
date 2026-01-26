import { render, screen, fireEvent } from '@testing-library/react';
import { CheckboxGroup } from './CheckboxGroup';
import { CheckboxGroupItem } from './CheckboxGroupItem';

const TestCheckboxGroup = ({
  defaultValue = [],
  ...props
}: Partial<React.ComponentProps<typeof CheckboxGroup>>) => (
  <CheckboxGroup defaultValue={defaultValue} {...props}>
    <CheckboxGroupItem value="option1" label="Option 1" />
    <CheckboxGroupItem value="option2" label="Option 2" />
    <CheckboxGroupItem value="option3" label="Option 3" />
  </CheckboxGroup>
);

describe('CheckboxGroup', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<TestCheckboxGroup />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<TestCheckboxGroup label="Select options" />);
      expect(screen.getByText('Select options')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<TestCheckboxGroup helperText="Select one or more options" />);
      expect(screen.getByText('Select one or more options')).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(<TestCheckboxGroup label="Select options" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('should select defaultValue', () => {
      render(<TestCheckboxGroup defaultValue={['option1', 'option2']} />);
      expect(screen.getByLabelText('Option 1')).toBeChecked();
      expect(screen.getByLabelText('Option 2')).toBeChecked();
      expect(screen.getByLabelText('Option 3')).not.toBeChecked();
    });

    it('should update selection on click (uncontrolled)', () => {
      render(<TestCheckboxGroup />);

      const option1 = screen.getByLabelText('Option 1');
      const option2 = screen.getByLabelText('Option 2');

      expect(option1).not.toBeChecked();
      expect(option2).not.toBeChecked();

      fireEvent.click(option1);
      expect(option1).toBeChecked();

      fireEvent.click(option2);
      expect(option1).toBeChecked();
      expect(option2).toBeChecked();

      fireEvent.click(option1);
      expect(option1).not.toBeChecked();
      expect(option2).toBeChecked();
    });

    it('should call onChange with updated values', () => {
      const handleChange = jest.fn();
      render(<TestCheckboxGroup onChange={handleChange} />);

      fireEvent.click(screen.getByLabelText('Option 1'));
      expect(handleChange).toHaveBeenCalledWith(['option1']);

      fireEvent.click(screen.getByLabelText('Option 2'));
      expect(handleChange).toHaveBeenCalledWith(['option1', 'option2']);
    });
  });

  describe('controlled mode', () => {
    it('should use value prop when provided', () => {
      render(
        <CheckboxGroup value={['option2']}>
          <CheckboxGroupItem value="option1" label="Option 1" />
          <CheckboxGroupItem value="option2" label="Option 2" />
        </CheckboxGroup>
      );

      expect(screen.getByLabelText('Option 1')).not.toBeChecked();
      expect(screen.getByLabelText('Option 2')).toBeChecked();
    });

    it('should reflect value prop changes', () => {
      const { rerender } = render(
        <CheckboxGroup value={['option1']}>
          <CheckboxGroupItem value="option1" label="Option 1" />
          <CheckboxGroupItem value="option2" label="Option 2" />
        </CheckboxGroup>
      );

      expect(screen.getByLabelText('Option 1')).toBeChecked();
      expect(screen.getByLabelText('Option 2')).not.toBeChecked();

      rerender(
        <CheckboxGroup value={['option2']}>
          <CheckboxGroupItem value="option1" label="Option 1" />
          <CheckboxGroupItem value="option2" label="Option 2" />
        </CheckboxGroup>
      );

      expect(screen.getByLabelText('Option 1')).not.toBeChecked();
      expect(screen.getByLabelText('Option 2')).toBeChecked();
    });
  });

  describe('constraints', () => {
    it('should not allow more than max selections', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup defaultValue={['option1', 'option2']} max={2} onChange={handleChange}>
          <CheckboxGroupItem value="option1" label="Option 1" />
          <CheckboxGroupItem value="option2" label="Option 2" />
          <CheckboxGroupItem value="option3" label="Option 3" />
        </CheckboxGroup>
      );

      // Already at max, clicking option3 should not add it
      fireEvent.click(screen.getByLabelText('Option 3'));
      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByLabelText('Option 3')).not.toBeChecked();
    });

    it('should not allow fewer than min selections', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup defaultValue={['option1']} min={1} onChange={handleChange}>
          <CheckboxGroupItem value="option1" label="Option 1" />
          <CheckboxGroupItem value="option2" label="Option 2" />
        </CheckboxGroup>
      );

      // At min, unchecking option1 should not remove it
      fireEvent.click(screen.getByLabelText('Option 1'));
      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByLabelText('Option 1')).toBeChecked();
    });
  });

  describe('disabled state', () => {
    it('should disable all items when group is disabled', () => {
      render(<TestCheckboxGroup disabled />);

      expect(screen.getByLabelText('Option 1')).toBeDisabled();
      expect(screen.getByLabelText('Option 2')).toBeDisabled();
      expect(screen.getByLabelText('Option 3')).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<TestCheckboxGroup disabled onChange={handleChange} />);

      fireEvent.click(screen.getByLabelText('Option 1'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should disable individual items', () => {
      render(
        <CheckboxGroup>
          <CheckboxGroupItem value="option1" label="Option 1" />
          <CheckboxGroupItem value="option2" label="Option 2" disabled />
          <CheckboxGroupItem value="option3" label="Option 3" />
        </CheckboxGroup>
      );

      expect(screen.getByLabelText('Option 1')).not.toBeDisabled();
      expect(screen.getByLabelText('Option 2')).toBeDisabled();
      expect(screen.getByLabelText('Option 3')).not.toBeDisabled();
    });
  });

  describe('error state', () => {
    it('should display error message', () => {
      render(<TestCheckboxGroup error errorMessage="Please select an option" />);
      expect(screen.getByText('Please select an option')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should set aria-invalid when in error', () => {
      render(<TestCheckboxGroup error />);
      expect(screen.getByTestId('checkbox-group')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('data attributes', () => {
    it('should set data-orientation', () => {
      render(<TestCheckboxGroup orientation="horizontal" />);
      expect(screen.getByTestId('checkbox-group')).toHaveAttribute(
        'data-orientation',
        'horizontal'
      );
    });

    it('should set data-error when in error', () => {
      render(<TestCheckboxGroup error />);
      expect(screen.getByTestId('checkbox-group')).toHaveAttribute('data-error', 'true');
    });

    it('should set data-checked on checked items', () => {
      render(<TestCheckboxGroup defaultValue={['option1']} />);
      const checkbox = screen.getByLabelText('Option 1').closest('label');
      expect(checkbox).toHaveAttribute('data-checked', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have proper fieldset structure', () => {
      render(<TestCheckboxGroup label="Options" />);
      const fieldset = screen.getByRole('group');
      expect(fieldset).toBeInTheDocument();
      expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('should set aria-required when required', () => {
      render(<TestCheckboxGroup required />);
      expect(screen.getByTestId('checkbox-group')).toHaveAttribute('aria-required', 'true');
    });

    it('should have aria-checked on items', () => {
      render(<TestCheckboxGroup defaultValue={['option1']} />);
      expect(screen.getByLabelText('Option 1')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByLabelText('Option 2')).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('custom props', () => {
    it('should apply custom className', () => {
      render(<TestCheckboxGroup className="custom-class" />);
      expect(screen.getByTestId('checkbox-group')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(<TestCheckboxGroup data-testid="custom-testid" />);
      expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
    });
  });
});

describe('CheckboxGroupItem', () => {
  it('should throw error when used outside CheckboxGroup', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<CheckboxGroupItem value="test" label="Test" />);
    }).toThrow('CheckboxGroupItem must be used within CheckboxGroup');

    consoleSpy.mockRestore();
  });
});
