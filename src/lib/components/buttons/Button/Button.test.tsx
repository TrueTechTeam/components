import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { Icon } from '../../display/Icon';

describe('Button', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should render with data-testid', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it.each(['primary', 'secondary', 'outline', 'ghost'] as const)(
      'should render %s variant',
      (variant) => {
        render(<Button variant={variant}>Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('should render %s size', (size) => {
      render(<Button size={size}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', size);
    });
  });

  describe('interactions', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have correct type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('icons', () => {
    it('should render with start icon', () => {
      render(<Button startIcon={<Icon name="check" />}>Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should render with end icon', () => {
      render(<Button endIcon={<Icon name="chevron-right" />}>Next</Button>);
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('fullWidth', () => {
    it('should render full width button', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-full-width', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
