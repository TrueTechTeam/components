import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonToggleGroup } from './ButtonToggleGroup';
import { ButtonToggleGroupItem } from './ButtonToggleGroupItem';

describe('ButtonToggleGroup', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(
        <ButtonToggleGroup aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
    });

    it('should render with radiogroup role', () => {
      render(
        <ButtonToggleGroup aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('should render items with radio role', () => {
      render(
        <ButtonToggleGroup aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getAllByRole('radio')).toHaveLength(2);
    });
  });

  describe('selection', () => {
    it('should select defaultValue', () => {
      render(
        <ButtonToggleGroup defaultValue="b" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByText('Option B').closest('button')).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });

    it('should update selection on click (uncontrolled)', () => {
      render(
        <ButtonToggleGroup defaultValue="a" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );

      fireEvent.click(screen.getByText('Option B'));
      expect(screen.getByText('Option B').closest('button')).toHaveAttribute(
        'aria-checked',
        'true'
      );
      expect(screen.getByText('Option A').closest('button')).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });

    it('should call onChange with new value', () => {
      const handleChange = jest.fn();
      render(
        <ButtonToggleGroup defaultValue="a" onChange={handleChange} aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );

      fireEvent.click(screen.getByText('Option B'));
      expect(handleChange).toHaveBeenCalledWith('b', expect.any(Object));
    });
  });

  describe('controlled mode', () => {
    it('should use value prop when provided', () => {
      render(
        <ButtonToggleGroup value="b" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByText('Option B').closest('button')).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });

    it('should reflect value prop changes', () => {
      const { rerender } = render(
        <ButtonToggleGroup value="a" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );

      expect(screen.getByText('Option A').closest('button')).toHaveAttribute(
        'aria-checked',
        'true'
      );

      rerender(
        <ButtonToggleGroup value="b" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );

      expect(screen.getByText('Option B').closest('button')).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });
  });

  describe('disabled state', () => {
    it('should disable all items when group is disabled', () => {
      render(
        <ButtonToggleGroup disabled aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );

      expect(screen.getByText('Option A').closest('button')).toBeDisabled();
      expect(screen.getByText('Option B').closest('button')).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(
        <ButtonToggleGroup disabled onChange={handleChange} aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );

      fireEvent.click(screen.getByText('Option A'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should disable individual items', () => {
      render(
        <ButtonToggleGroup aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b" disabled>
            Option B
          </ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );

      expect(screen.getByText('Option A').closest('button')).not.toBeDisabled();
      expect(screen.getByText('Option B').closest('button')).toBeDisabled();
    });
  });

  describe('data attributes', () => {
    it('should set data-orientation', () => {
      render(
        <ButtonToggleGroup orientation="vertical" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should set data-variant', () => {
      render(
        <ButtonToggleGroup variant="primary" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-variant', 'primary');
    });

    it('should set data-size', () => {
      render(
        <ButtonToggleGroup size="lg" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', 'lg');
    });

    it('should set data-full-width when fullWidth is true', () => {
      render(
        <ButtonToggleGroup fullWidth aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-full-width', 'true');
    });

    it('should set data-selected on selected item', () => {
      render(
        <ButtonToggleGroup defaultValue="a" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByText('Option A').closest('button')).toHaveAttribute(
        'data-selected',
        'true'
      );
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on group', () => {
      render(
        <ButtonToggleGroup aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Test group');
    });

    it('should have aria-checked on items', () => {
      render(
        <ButtonToggleGroup defaultValue="a" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByText('Option A').closest('button')).toHaveAttribute(
        'aria-checked',
        'true'
      );
      expect(screen.getByText('Option B').closest('button')).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });
  });

  describe('custom props', () => {
    it('should apply custom className to group', () => {
      render(
        <ButtonToggleGroup className="custom-class" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(
        <ButtonToggleGroup data-testid="custom-testid" aria-label="Test group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      );
      expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
    });
  });
});

describe('ButtonToggleGroupItem', () => {
  it('should throw error when used outside ButtonToggleGroup', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>);
    }).toThrow('ButtonToggleGroupItem must be used within ButtonToggleGroup');

    consoleSpy.mockRestore();
  });
});
