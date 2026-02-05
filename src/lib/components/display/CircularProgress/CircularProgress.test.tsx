import React from 'react';
import { render, screen } from '@testing-library/react';
import { CircularProgress } from './CircularProgress';

describe('CircularProgress', () => {
  // 1. Rendering tests
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
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders value when showValue is true', () => {
      const { container } = render(<CircularProgress value={50} showValue />);
      expect(container.textContent).toContain('50%');
    });

    it('does not render value when showValue is false', () => {
      const { container } = render(<CircularProgress value={50} showValue={false} />);
      expect(container.textContent).not.toContain('50%');
    });

    it('renders label when provided', () => {
      const { container } = render(<CircularProgress label="Loading..." />);
      expect(container.textContent).toContain('Loading...');
    });

    it('renders label instead of value when both are provided', () => {
      const { container } = render(<CircularProgress label="Loading..." value={50} showValue />);
      expect(container.textContent).toContain('Loading...');
      expect(container.textContent).not.toContain('50%');
    });

    it('renders SVG element', () => {
      const { container } = render(<CircularProgress />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders two circles (track and fill)', () => {
      const { container } = render(<CircularProgress />);
      const circles = container.querySelectorAll('circle');
      expect(circles).toHaveLength(2);
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders primary variant by default', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'primary');
    });

    it('renders secondary variant', () => {
      const { container } = render(<CircularProgress variant="secondary" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders success variant', () => {
      const { container } = render(<CircularProgress variant="success" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'success');
    });

    it('renders warning variant', () => {
      const { container } = render(<CircularProgress variant="warning" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'warning');
    });

    it('renders danger variant', () => {
      const { container } = render(<CircularProgress variant="danger" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'danger');
    });

    it('renders info variant', () => {
      const { container } = render(<CircularProgress variant="info" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'info');
    });

    it('renders neutral variant', () => {
      const { container } = render(<CircularProgress variant="neutral" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-variant', 'neutral');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      const { container } = render(<CircularProgress size="sm" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-size', 'sm');
    });

    it('renders medium size', () => {
      const { container } = render(<CircularProgress size="md" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-size', 'md');
    });

    it('renders large size', () => {
      const { container } = render(<CircularProgress size="lg" />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toHaveAttribute('data-size', 'lg');
    });

    it('sets correct SVG size for small', () => {
      const { container } = render(<CircularProgress size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
    });

    it('sets correct SVG size for medium', () => {
      const { container } = render(<CircularProgress size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '96');
      expect(svg).toHaveAttribute('height', '96');
    });

    it('sets correct SVG size for large', () => {
      const { container } = render(<CircularProgress size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '128');
      expect(svg).toHaveAttribute('height', '128');
    });
  });

  // 4. Value handling tests
  describe('value handling', () => {
    it('displays 0% by default', () => {
      render(<CircularProgress showValue />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('displays correct percentage for value', () => {
      render(<CircularProgress value={50} showValue />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('displays 100% for max value', () => {
      render(<CircularProgress value={100} showValue />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('clamps value above max to 100%', () => {
      render(<CircularProgress value={150} max={100} showValue />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('clamps negative value to 0%', () => {
      render(<CircularProgress value={-10} showValue />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('calculates percentage based on custom max', () => {
      render(<CircularProgress value={50} max={200} showValue />);
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('handles max of 0 without errors', () => {
      render(<CircularProgress value={50} max={0} showValue />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('rounds decimal percentages', () => {
      render(<CircularProgress value={33} max={100} showValue />);
      expect(screen.getByText('33%')).toBeInTheDocument();
    });

    it('uses custom format function', () => {
      const formatValue = (value: number, max: number) => `${value} of ${max}`;
      render(<CircularProgress value={50} max={100} showValue formatValue={formatValue} />);
      expect(screen.getByText('50 of 100')).toBeInTheDocument();
    });

    it('uses custom format function with normalized value', () => {
      const formatValue = (value: number) => `${value} items`;
      render(<CircularProgress value={150} max={100} showValue formatValue={formatValue} />);
      expect(screen.getByText('100 items')).toBeInTheDocument();
    });
  });

  // 5. SVG and stroke tests
  describe('SVG and stroke', () => {
    it('applies default stroke width', () => {
      const { container } = render(<CircularProgress />);
      const circles = container.querySelectorAll('circle');
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('stroke-width', '4');
      });
    });

    it('applies custom stroke width', () => {
      const { container } = render(<CircularProgress strokeWidth={8} />);
      const circles = container.querySelectorAll('circle');
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('stroke-width', '8');
      });
    });

    it('sets strokeDasharray on progress circle', () => {
      const { container } = render(<CircularProgress value={50} />);
      const circles = container.querySelectorAll('circle');
      const progressCircle = circles[1]; // Second circle is the progress
      expect(progressCircle).toHaveAttribute('stroke-dasharray');
    });

    it('sets strokeDashoffset on progress circle', () => {
      const { container } = render(<CircularProgress value={50} />);
      const circles = container.querySelectorAll('circle');
      const progressCircle = circles[1]; // Second circle is the progress
      expect(progressCircle).toHaveAttribute('stroke-dashoffset');
    });

    it('sets correct viewBox', () => {
      const { container } = render(<CircularProgress size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 96 96');
    });

    it('has rounded stroke linecap on progress circle', () => {
      const { container } = render(<CircularProgress />);
      const circles = container.querySelectorAll('circle');
      const progressCircle = circles[1];
      expect(progressCircle).toHaveAttribute('stroke-linecap', 'round');
    });
  });

  // 6. Accessibility tests
  describe('accessibility', () => {
    it('has progressbar role', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toBeInTheDocument();
    });

    it('has correct aria-valuenow', () => {
      const { container } = render(<CircularProgress value={50} />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
    });

    it('has correct aria-valuemin', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
    });

    it('has correct aria-valuemax', () => {
      const { container } = render(<CircularProgress max={200} />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuemax', '200');
    });

    it('has correct aria-label when label is provided', () => {
      const { container } = render(<CircularProgress label="Loading files" />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-label', 'Loading files');
    });

    it('normalizes aria-valuenow when value exceeds max', () => {
      const { container } = render(<CircularProgress value={150} max={100} />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
    });

    it('normalizes aria-valuenow when value is negative', () => {
      const { container } = render(<CircularProgress value={-10} />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('includes data-component attribute', () => {
      const { container } = render(<CircularProgress />);
      const progress = container.querySelector('[data-component="circular-progress"]');
      expect(progress).toBeInTheDocument();
    });
  });

  // 7. CSS custom properties
  describe('CSS custom properties', () => {
    it('sets --circle-size custom property for small size', () => {
      const { container } = render(<CircularProgress size="sm" />);
      const progress = container.querySelector(
        '[data-component="circular-progress"]'
      ) as HTMLElement;
      expect(progress.style.getPropertyValue('--circle-size')).toBe('64px');
    });

    it('sets --circle-size custom property for medium size', () => {
      const { container } = render(<CircularProgress size="md" />);
      const progress = container.querySelector(
        '[data-component="circular-progress"]'
      ) as HTMLElement;
      expect(progress.style.getPropertyValue('--circle-size')).toBe('96px');
    });

    it('sets --circle-size custom property for large size', () => {
      const { container } = render(<CircularProgress size="lg" />);
      const progress = container.querySelector(
        '[data-component="circular-progress"]'
      ) as HTMLElement;
      expect(progress.style.getPropertyValue('--circle-size')).toBe('128px');
    });
  });

  // 8. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CircularProgress ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-component', 'circular-progress');
    });
  });
});
