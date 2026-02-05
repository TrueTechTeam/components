import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<ProgressBar />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <ProgressBar
          variant="success"
          size="lg"
          value={75}
          max={100}
          showValue
          label="Loading..."
          animated
          striped
          className="custom-class"
          data-testid="test-progress"
        />
      );

      const element = screen.getByTestId('test-progress');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<ProgressBar label="Uploading..." value={50} />);
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });

    it('renders value when showValue is true', () => {
      render(<ProgressBar value={50} showValue />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('does not render value when showValue is false', () => {
      render(<ProgressBar value={50} showValue={false} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('renders both label and value when both provided', () => {
      render(<ProgressBar label="Progress" value={50} showValue />);
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders primary variant by default', () => {
      const { container } = render(<ProgressBar />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-variant', 'primary');
    });

    it('renders secondary variant', () => {
      const { container } = render(<ProgressBar variant="secondary" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders success variant', () => {
      const { container } = render(<ProgressBar variant="success" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-variant', 'success');
    });

    it('renders warning variant', () => {
      const { container } = render(<ProgressBar variant="warning" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-variant', 'warning');
    });

    it('renders danger variant', () => {
      const { container } = render(<ProgressBar variant="danger" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-variant', 'danger');
    });

    it('renders info variant', () => {
      const { container } = render(<ProgressBar variant="info" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-variant', 'info');
    });

    it('renders neutral variant', () => {
      const { container } = render(<ProgressBar variant="neutral" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-variant', 'neutral');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      const { container } = render(<ProgressBar />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      const { container } = render(<ProgressBar size="sm" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      const { container } = render(<ProgressBar size="lg" />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. Value tests
  describe('value handling', () => {
    it('displays 0% by default', () => {
      render(<ProgressBar showValue />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('displays correct percentage for value', () => {
      render(<ProgressBar value={50} showValue />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('displays 100% for max value', () => {
      render(<ProgressBar value={100} showValue />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('clamps value above max to 100%', () => {
      render(<ProgressBar value={150} max={100} showValue />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('clamps negative value to 0%', () => {
      render(<ProgressBar value={-10} showValue />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('calculates percentage based on custom max', () => {
      render(<ProgressBar value={50} max={200} showValue />);
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('uses custom format function', () => {
      const formatValue = (value: number, max: number) => `${value} of ${max}`;
      render(<ProgressBar value={50} max={100} showValue formatValue={formatValue} />);
      expect(screen.getByText('50 of 100')).toBeInTheDocument();
    });

    it('sets correct width on progress fill', () => {
      const { container } = render(<ProgressBar value={75} />);
      const progressFill = container.querySelector('[class*="progressBarFill"]') as HTMLElement;
      expect(progressFill).toHaveStyle({ width: '75%' });
    });
  });

  // 5. Animation and striped tests
  describe('animation and striped', () => {
    it('has animated attribute by default', () => {
      const { container } = render(<ProgressBar />);
      const progressFill = container.querySelector('[class*="progressBarFill"]');
      expect(progressFill).toHaveAttribute('data-animated', 'true');
    });

    it('does not have animated attribute when animated is false', () => {
      const { container } = render(<ProgressBar animated={false} />);
      const progressFill = container.querySelector('[class*="progressBarFill"]');
      expect(progressFill).not.toHaveAttribute('data-animated');
    });

    it('does not have striped attribute by default', () => {
      const { container } = render(<ProgressBar />);
      const progressFill = container.querySelector('[class*="progressBarFill"]');
      expect(progressFill).not.toHaveAttribute('data-striped');
    });

    it('has striped attribute when striped is true', () => {
      const { container } = render(<ProgressBar striped />);
      const progressFill = container.querySelector('[class*="progressBarFill"]');
      expect(progressFill).toHaveAttribute('data-striped', 'true');
    });

    it('has both animated and striped attributes', () => {
      const { container } = render(<ProgressBar animated striped />);
      const progressFill = container.querySelector('[class*="progressBarFill"]');
      expect(progressFill).toHaveAttribute('data-animated', 'true');
      expect(progressFill).toHaveAttribute('data-striped', 'true');
    });
  });

  // 6. Accessibility tests
  describe('accessibility', () => {
    it('has progressbar role', () => {
      const { container } = render(<ProgressBar />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('has correct aria-valuenow', () => {
      const { container } = render(<ProgressBar value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('has correct aria-valuemin', () => {
      const { container } = render(<ProgressBar />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    });

    it('has correct aria-valuemax', () => {
      const { container } = render(<ProgressBar max={200} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuemax', '200');
    });

    it('has correct aria-label when label is provided', () => {
      const { container } = render(<ProgressBar label="Loading files" />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-label', 'Loading files');
    });

    it('includes data-component attribute', () => {
      const { container } = render(<ProgressBar />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  // 7. Indeterminate mode tests
  describe('indeterminate mode', () => {
    it('sets indeterminate data attribute on container', () => {
      const { container } = render(<ProgressBar indeterminate />);
      const progressBar = container.querySelector('[data-component="progress-bar"]');
      expect(progressBar).toHaveAttribute('data-indeterminate', 'true');
    });

    it('sets indeterminate data attribute on fill', () => {
      const { container } = render(<ProgressBar indeterminate />);
      const progressFill = container.querySelector('[class*="progressBarFill"]');
      expect(progressFill).toHaveAttribute('data-indeterminate', 'true');
    });

    it('does not set width style in indeterminate mode', () => {
      const { container } = render(<ProgressBar indeterminate value={50} />);
      const progressFill = container.querySelector('[class*="progressBarFill"]') as HTMLElement;
      expect(progressFill.style.width).toBe('');
    });

    it('does not show value in indeterminate mode even when showValue is true', () => {
      render(<ProgressBar indeterminate value={50} showValue />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('still shows label in indeterminate mode', () => {
      render(<ProgressBar indeterminate label="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not set aria-valuenow in indeterminate mode', () => {
      const { container } = render(<ProgressBar indeterminate />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).not.toHaveAttribute('aria-valuenow');
    });

    it('does not render buffer in indeterminate mode', () => {
      const { container } = render(<ProgressBar indeterminate bufferValue={75} />);
      const buffer = container.querySelector('[class*="progressBarBuffer"]');
      expect(buffer).not.toBeInTheDocument();
    });
  });

  // 8. Buffer value tests
  describe('buffer value', () => {
    it('renders buffer when bufferValue is provided', () => {
      const { container } = render(<ProgressBar value={50} bufferValue={75} />);
      const buffer = container.querySelector('[class*="progressBarBuffer"]');
      expect(buffer).toBeInTheDocument();
    });

    it('does not render buffer when bufferValue is not provided', () => {
      const { container } = render(<ProgressBar value={50} />);
      const buffer = container.querySelector('[class*="progressBarBuffer"]');
      expect(buffer).not.toBeInTheDocument();
    });

    it('sets correct width for buffer value', () => {
      const { container } = render(<ProgressBar value={50} bufferValue={75} />);
      const buffer = container.querySelector('[class*="progressBarBuffer"]') as HTMLElement;
      expect(buffer).toHaveStyle({ width: '75%' });
    });

    it('normalizes buffer value above max to 100%', () => {
      const { container } = render(<ProgressBar value={50} bufferValue={150} max={100} />);
      const buffer = container.querySelector('[class*="progressBarBuffer"]') as HTMLElement;
      expect(buffer).toHaveStyle({ width: '100%' });
    });

    it('normalizes negative buffer value to 0%', () => {
      const { container } = render(<ProgressBar value={50} bufferValue={-10} />);
      const buffer = container.querySelector('[class*="progressBarBuffer"]') as HTMLElement;
      expect(buffer).toHaveStyle({ width: '0%' });
    });

    it('calculates buffer percentage based on custom max', () => {
      const { container } = render(<ProgressBar value={50} bufferValue={100} max={200} />);
      const buffer = container.querySelector('[class*="progressBarBuffer"]') as HTMLElement;
      expect(buffer).toHaveStyle({ width: '50%' });
    });
  });

  // 9. Edge cases
  describe('edge cases', () => {
    it('handles zero max value gracefully', () => {
      const { container } = render(<ProgressBar value={50} max={0} showValue />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      const progressFill = container.querySelector('[class*="progressBarFill"]') as HTMLElement;
      expect(progressFill).toHaveStyle({ width: '0%' });
    });

    it('rounds displayed percentage', () => {
      render(<ProgressBar value={33.333} max={100} showValue />);
      expect(screen.getByText('33%')).toBeInTheDocument();
    });

    it('handles value equal to max', () => {
      const { container } = render(<ProgressBar value={100} max={100} showValue />);
      expect(screen.getByText('100%')).toBeInTheDocument();
      const progressFill = container.querySelector('[class*="progressBarFill"]') as HTMLElement;
      expect(progressFill).toHaveStyle({ width: '100%' });
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('handles zero value', () => {
      const { container } = render(<ProgressBar value={0} showValue />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      const progressFill = container.querySelector('[class*="progressBarFill"]') as HTMLElement;
      expect(progressFill).toHaveStyle({ width: '0%' });
    });

    it('renders without label or value display', () => {
      const { container } = render(<ProgressBar value={50} />);
      const header = container.querySelector('[class*="progressBarHeader"]');
      expect(header).not.toBeInTheDocument();
    });

    it('renders header when only label is provided', () => {
      const { container } = render(<ProgressBar label="Test" value={50} />);
      const header = container.querySelector('[class*="progressBarHeader"]');
      expect(header).toBeInTheDocument();
    });

    it('renders header when only showValue is true', () => {
      const { container } = render(<ProgressBar value={50} showValue />);
      const header = container.querySelector('[class*="progressBarHeader"]');
      expect(header).toBeInTheDocument();
    });
  });

  // 10. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ProgressBar ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-component', 'progress-bar');
    });
  });
});
