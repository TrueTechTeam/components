import React from 'react';
import { render } from '@testing-library/react';
import { CircularProgress } from './CircularProgress';

describe('CircularProgress', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const { container } = render(
        <CircularProgress
          variant="success"
          size="lg"
          value={75}
          max={100}
          showValue
          label="Loading"
          strokeWidth={6}
          className="custom-class"
          data-testid="test-progress"
        />
      );

      const element = container.querySelector('[data-testid="test-progress"]');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders value when showValue is true', () => {
      const { container } = render(<CircularProgress value={50} showValue />);
      expect(container.textContent).toContain('50%');
    });

    it('renders label when provided', () => {
      const { container } = render(<CircularProgress label="Loading..." />);
      expect(container.textContent).toContain('Loading...');
    });
  });

  describe('variants', () => {
    it('renders primary variant by default', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'primary');
    });

    it.each(['secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const)(
      'renders %s variant',
      (variant) => {
        const { container } = render(<CircularProgress variant={variant} />);
        const progress = container.querySelector('[data-component="circular-progress"]');
        expect(progress).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('sizes', () => {
    it('renders medium size by default', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)('renders %s size', (size) => {
      const { container } = render(<CircularProgress size={size} />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-size', size);
    });
  });

  describe('accessibility', () => {
    it('has progressbar role', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toBeInTheDocument();
    });

    it('has correct aria attributes', () => {
      const { container } = render(<CircularProgress value={50} max={200} label="Test" />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '200');
      expect(progress).toHaveAttribute('aria-label', 'Test');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CircularProgress ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
