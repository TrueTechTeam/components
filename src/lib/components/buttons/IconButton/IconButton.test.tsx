import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  describe('rendering', () => {
    it('should render with icon', () => {
      render(<IconButton icon="check" aria-label="Confirm" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Confirm');
    });

    it('should render with custom className', () => {
      render(<IconButton icon="check" aria-label="Confirm" className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should render with data-testid', () => {
      render(<IconButton icon="check" aria-label="Confirm" data-testid="custom-icon-button" />);
      expect(screen.getByTestId('custom-icon-button')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it.each(['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'] as const)(
      'should render %s variant',
      (variant) => {
        render(<IconButton icon="check" aria-label="Confirm" variant={variant} />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-variant', variant);
      }
    );

    it('should default to ghost variant', () => {
      render(<IconButton icon="check" aria-label="Confirm" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });
  });

  describe('sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('should render %s size', (size) => {
      render(<IconButton icon="check" aria-label="Confirm" size={size} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', size);
    });

    it('should default to md size', () => {
      render(<IconButton icon="check" aria-label="Confirm" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'md');
    });
  });

  describe('interactions', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<IconButton icon="check" aria-label="Confirm" onClick={handleClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(<IconButton icon="check" aria-label="Confirm" onClick={handleClick} disabled />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have correct type attribute', () => {
      render(<IconButton icon="check" aria-label="Confirm" type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should default to button type', () => {
      render(<IconButton icon="check" aria-label="Confirm" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  describe('accessibility', () => {
    it('should require aria-label', () => {
      render(<IconButton icon="check" aria-label="Confirm action" />);
      expect(screen.getByLabelText('Confirm action')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<IconButton icon="check" aria-label="Confirm" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('icon rendering', () => {
    it('should render correct icon', () => {
      render(<IconButton icon="check" aria-label="Confirm" />);
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });

    it('should use correct icon size for each button size', () => {
      const sizes: Record<string, number> = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
      };

      Object.entries(sizes).forEach(([size, expectedSize]) => {
        const { container } = render(
          <IconButton
            icon="check"
            aria-label="Confirm"
            size={size as any}
            data-testid={`button-${size}`}
          />
        );
        const icon = container.querySelector('[role="img"]');
        expect(icon).toHaveStyle({ '--icon-size': `${expectedSize}px` });
      });
    });
  });
});
