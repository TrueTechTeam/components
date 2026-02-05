import React from 'react';
import { render, screen } from '@testing-library/react';
import { DragHandle } from './DragHandle';

describe('DragHandle', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<DragHandle data-testid="drag-handle" />);
      expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <DragHandle
          size="lg"
          variant="grip"
          disabled
          label="Custom drag handle"
          className="custom-class"
          data-testid="test-handle"
        />
      );

      const element = screen.getByTestId('test-handle');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders as div element', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element.tagName).toBe('DIV');
    });

    it('renders with role button', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('role', 'button');
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders dots variant by default', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-variant', 'dots');
    });

    it('renders dots variant', () => {
      const { container } = render(<DragHandle variant="dots" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-variant', 'dots');
      const dotsIcon = container.querySelector('[class*="dotsIcon"]');
      expect(dotsIcon).toBeInTheDocument();
    });

    it('renders lines variant', () => {
      const { container } = render(<DragHandle variant="lines" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-variant', 'lines');
      const linesIcon = container.querySelector('[class*="linesIcon"]');
      expect(linesIcon).toBeInTheDocument();
    });

    it('renders grip variant', () => {
      const { container } = render(<DragHandle variant="grip" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-variant', 'grip');
      const gripIcon = container.querySelector('[class*="gripIcon"]');
      expect(gripIcon).toBeInTheDocument();
    });

    it('renders dots variant with 6 dot elements', () => {
      const { container } = render(<DragHandle variant="dots" />);
      const dotsIcon = container.querySelector('[class*="dotsIcon"]');
      const dots = dotsIcon?.querySelectorAll('[class*="dot"]');
      expect(dots).toHaveLength(6);
    });

    it('renders lines variant with 3 line elements', () => {
      const { container } = render(<DragHandle variant="lines" />);
      const linesIcon = container.querySelector('[class*="linesIcon"]');
      const lines = linesIcon?.querySelectorAll('[class*="line"]');
      expect(lines).toHaveLength(3);
    });

    it('renders grip variant with svg element', () => {
      const { container } = render(<DragHandle variant="grip" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('renders grip variant with 6 circles in svg', () => {
      const { container } = render(<DragHandle variant="grip" />);
      const circles = container.querySelectorAll('circle');
      expect(circles).toHaveLength(6);
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders md size by default', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders xs size', () => {
      render(<DragHandle size="xs" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'xs');
    });

    it('renders sm size', () => {
      render(<DragHandle size="sm" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders md size', () => {
      render(<DragHandle size="md" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders lg size', () => {
      render(<DragHandle size="lg" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'lg');
    });

    it('renders xl size', () => {
      render(<DragHandle size="xl" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'xl');
    });
  });

  // 4. Disabled state tests
  describe('disabled state', () => {
    it('is not disabled by default', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('renders disabled state', () => {
      render(<DragHandle disabled data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('has tabIndex 0 when not disabled', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('has tabIndex -1 when disabled', () => {
      render(<DragHandle disabled data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });

    it('does not add disabled attribute when false explicitly', () => {
      render(<DragHandle disabled={false} data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).not.toHaveAttribute('data-disabled');
    });
  });

  // 5. Accessibility tests
  describe('accessibility', () => {
    it('has default aria-label', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('aria-label', 'Drag handle');
    });

    it('accepts custom label prop', () => {
      render(<DragHandle label="Custom drag label" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('aria-label', 'Custom drag label');
    });

    it('aria-label prop overrides label prop', () => {
      render(<DragHandle label="Label prop" aria-label="ARIA label prop" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('aria-label', 'ARIA label prop');
    });

    it('has role button', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('role', 'button');
    });

    it('is keyboard accessible when not disabled', () => {
      render(<DragHandle data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('is not keyboard accessible when disabled', () => {
      render(<DragHandle disabled data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });

    it('can be found by accessible label', () => {
      render(<DragHandle label="Move item" />);
      expect(screen.getByLabelText('Move item')).toBeInTheDocument();
    });

    it('can be found by custom aria-label', () => {
      render(<DragHandle aria-label="Drag to reorder" />);
      expect(screen.getByLabelText('Drag to reorder')).toBeInTheDocument();
    });
  });

  // 6. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<DragHandle ref={ref} data-testid="handle" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-testid', 'handle');
    });

    it('forwards ref with data attributes', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<DragHandle ref={ref} variant="grip" size="lg" />);
      expect(ref.current).toHaveAttribute('data-variant', 'grip');
      expect(ref.current).toHaveAttribute('data-size', 'lg');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(<DragHandle ref={refCallback} />);
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 7. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(<DragHandle className="custom-handle" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveClass('custom-handle');
    });

    it('merges custom className with component classes', () => {
      render(<DragHandle className="custom-handle" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element?.className).toContain('custom-handle');
    });

    it('accepts custom style prop', () => {
      render(<DragHandle style={{ backgroundColor: 'red' }} data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts multiple custom styles', () => {
      render(
        <DragHandle
          style={{ backgroundColor: 'blue', width: '50px', height: '50px' }}
          data-testid="handle"
        />
      );
      const element = screen.getByTestId('handle');
      expect(element).toHaveStyle({
        backgroundColor: 'blue',
        width: '50px',
        height: '50px',
      });
    });

    it('handles undefined className gracefully', () => {
      render(<DragHandle className={undefined} data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toBeInTheDocument();
    });

    it('handles undefined style gracefully', () => {
      render(<DragHandle style={undefined} data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toBeInTheDocument();
    });
  });

  // 8. Props spreading
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      render(<DragHandle data-testid="test-handle" data-custom="value" />);
      const element = screen.getByTestId('test-handle');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts and applies title attribute', () => {
      render(<DragHandle title="Drag handle title" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('title', 'Drag handle title');
    });

    it('forwards additional HTML attributes', () => {
      render(<DragHandle data-custom="value" id="custom-id" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-custom', 'value');
      expect(element).toHaveAttribute('id', 'custom-id');
    });

    it('accepts id attribute', () => {
      render(<DragHandle id="handle-1" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('id', 'handle-1');
    });
  });

  // 9. Combined props tests
  describe('combined props', () => {
    it('renders with multiple variants and sizes', () => {
      const variants: Array<'dots' | 'lines' | 'grip'> = ['dots', 'lines', 'grip'];
      const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { container } = render(
            <DragHandle variant={variant} size={size} data-testid={`handle-${variant}-${size}`} />
          );
          const element = screen.getByTestId(`handle-${variant}-${size}`);
          expect(element).toHaveAttribute('data-variant', variant);
          expect(element).toHaveAttribute('data-size', size);
          container.remove();
        });
      });
    });

    it('renders disabled handle with all variants', () => {
      const variants: Array<'dots' | 'lines' | 'grip'> = ['dots', 'lines', 'grip'];

      variants.forEach((variant) => {
        const { container } = render(
          <DragHandle variant={variant} disabled data-testid={`handle-${variant}`} />
        );
        const element = screen.getByTestId(`handle-${variant}`);
        expect(element).toHaveAttribute('data-disabled', 'true');
        expect(element).toHaveAttribute('data-variant', variant);
        container.remove();
      });
    });

    it('renders with variant, size, disabled, and custom className', () => {
      render(
        <DragHandle variant="grip" size="sm" disabled className="custom" data-testid="handle" />
      );
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-variant', 'grip');
      expect(element).toHaveAttribute('data-size', 'sm');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element).toHaveClass('custom');
    });

    it('renders all size options with all variants', () => {
      const variants: Array<'dots' | 'lines' | 'grip'> = ['dots', 'lines', 'grip'];
      const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { container } = render(
            <DragHandle variant={variant} size={size} data-testid={`handle-${variant}-${size}`} />
          );
          const element = screen.getByTestId(`handle-${variant}-${size}`);
          expect(element).toHaveAttribute('data-variant', variant);
          expect(element).toHaveAttribute('data-size', size);
          container.remove();
        });
      });
    });

    it('renders with all props together', () => {
      render(
        <DragHandle
          variant="lines"
          size="xl"
          disabled
          label="Custom label"
          className="custom-class"
          style={{ backgroundColor: 'green' }}
          data-testid="full-handle"
        />
      );
      const element = screen.getByTestId('full-handle');
      expect(element).toHaveAttribute('data-variant', 'lines');
      expect(element).toHaveAttribute('data-size', 'xl');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element).toHaveAttribute('aria-label', 'Custom label');
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveStyle({ backgroundColor: 'green' });
    });
  });

  // 10. Edge cases
  describe('edge cases', () => {
    it('handles disabled and enabled together correctly', () => {
      const { rerender } = render(<DragHandle disabled data-testid="handle" />);
      let element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element).toHaveAttribute('tabIndex', '-1');

      rerender(<DragHandle disabled={false} data-testid="handle" />);
      element = screen.getByTestId('handle');
      expect(element).not.toHaveAttribute('data-disabled');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('handles empty string label', () => {
      render(<DragHandle label="" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('aria-label', '');
    });

    it('handles empty string aria-label with label fallback', () => {
      render(<DragHandle aria-label="" data-testid="handle" />);
      const element = screen.getByTestId('handle');
      // Empty aria-label falls back to label prop default
      expect(element).toHaveAttribute('aria-label', 'Drag handle');
    });

    it('handles null className gracefully', () => {
      render(<DragHandle className={null as any} data-testid="handle" />);
      const element = screen.getByTestId('handle');
      expect(element).toBeInTheDocument();
    });

    it('renders correctly without data-testid', () => {
      const { container } = render(<DragHandle />);
      const element = container.querySelector('[role="button"]');
      expect(element).toBeInTheDocument();
    });

    it('handles variant change correctly', () => {
      const { container, rerender } = render(<DragHandle variant="dots" data-testid="handle" />);
      let dotsIcon = container.querySelector('[class*="dotsIcon"]');
      expect(dotsIcon).toBeInTheDocument();

      rerender(<DragHandle variant="lines" data-testid="handle" />);
      dotsIcon = container.querySelector('[class*="dotsIcon"]');
      const linesIcon = container.querySelector('[class*="linesIcon"]');
      expect(dotsIcon).not.toBeInTheDocument();
      expect(linesIcon).toBeInTheDocument();
    });

    it('handles size change correctly', () => {
      const { rerender } = render(<DragHandle size="sm" data-testid="handle" />);
      let element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'sm');

      rerender(<DragHandle size="xl" data-testid="handle" />);
      element = screen.getByTestId('handle');
      expect(element).toHaveAttribute('data-size', 'xl');
    });
  });

  // 11. Display name
  describe('display name', () => {
    it('has correct display name', () => {
      expect(DragHandle.displayName).toBe('DragHandle');
    });
  });

  // 12. Icon rendering tests
  describe('icon rendering', () => {
    it('only renders dots icon when variant is dots', () => {
      const { container } = render(<DragHandle variant="dots" />);
      const dotsIcon = container.querySelector('[class*="dotsIcon"]');
      const linesIcon = container.querySelector('[class*="linesIcon"]');
      const gripIcon = container.querySelector('[class*="gripIcon"]');
      expect(dotsIcon).toBeInTheDocument();
      expect(linesIcon).not.toBeInTheDocument();
      expect(gripIcon).not.toBeInTheDocument();
    });

    it('only renders lines icon when variant is lines', () => {
      const { container } = render(<DragHandle variant="lines" />);
      const dotsIcon = container.querySelector('[class*="dotsIcon"]');
      const linesIcon = container.querySelector('[class*="linesIcon"]');
      const gripIcon = container.querySelector('[class*="gripIcon"]');
      expect(dotsIcon).not.toBeInTheDocument();
      expect(linesIcon).toBeInTheDocument();
      expect(gripIcon).not.toBeInTheDocument();
    });

    it('only renders grip icon when variant is grip', () => {
      const { container } = render(<DragHandle variant="grip" />);
      const dotsIcon = container.querySelector('[class*="dotsIcon"]');
      const linesIcon = container.querySelector('[class*="linesIcon"]');
      const gripIcon = container.querySelector('[class*="gripIcon"]');
      expect(dotsIcon).not.toBeInTheDocument();
      expect(linesIcon).not.toBeInTheDocument();
      expect(gripIcon).toBeInTheDocument();
    });

    it('grip svg has correct attributes', () => {
      const { container } = render(<DragHandle variant="grip" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('stroke-width', '2');
      expect(svg).toHaveAttribute('stroke-linecap', 'round');
      expect(svg).toHaveAttribute('stroke-linejoin', 'round');
    });

    it('grip svg circles have correct positions', () => {
      const { container } = render(<DragHandle variant="grip" />);
      const circles = container.querySelectorAll('circle');

      // Check first column circles (cx="9")
      expect(circles[0]).toHaveAttribute('cx', '9');
      expect(circles[0]).toHaveAttribute('cy', '5');
      expect(circles[1]).toHaveAttribute('cx', '9');
      expect(circles[1]).toHaveAttribute('cy', '12');
      expect(circles[2]).toHaveAttribute('cx', '9');
      expect(circles[2]).toHaveAttribute('cy', '19');

      // Check second column circles (cx="15")
      expect(circles[3]).toHaveAttribute('cx', '15');
      expect(circles[3]).toHaveAttribute('cy', '5');
      expect(circles[4]).toHaveAttribute('cx', '15');
      expect(circles[4]).toHaveAttribute('cy', '12');
      expect(circles[5]).toHaveAttribute('cx', '15');
      expect(circles[5]).toHaveAttribute('cy', '19');
    });
  });
});
