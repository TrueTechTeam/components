import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Badge>Test Content</Badge>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <Badge
          variant="success"
          size="lg"
          disabled
          className="custom-class"
          data-testid="test-badge"
        >
          Content
        </Badge>
      );

      const element = screen.getByTestId('test-badge');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(
        <Badge>
          <span>Child 1</span>
          <span>Child 2</span>
        </Badge>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('renders as span element', () => {
      const { container } = render(<Badge>Test</Badge>);
      const element = container.querySelector('[data-component="badge"]');
      expect(element?.tagName).toBe('SPAN');
    });

    it('renders numerical content', () => {
      render(<Badge>5</Badge>);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders text content', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Badge>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'primary');
    });

    it('renders secondary variant', () => {
      render(<Badge variant="secondary">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders success variant', () => {
      render(<Badge variant="success">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'success');
    });

    it('renders warning variant', () => {
      render(<Badge variant="warning">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'warning');
    });

    it('renders danger variant', () => {
      render(<Badge variant="danger">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'danger');
    });

    it('renders info variant', () => {
      render(<Badge variant="info">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'info');
    });

    it('renders neutral variant', () => {
      render(<Badge variant="neutral">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'neutral');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<Badge>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      render(<Badge size="sm">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      render(<Badge size="lg">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. State tests
  describe('states', () => {
    it('renders disabled state', () => {
      render(<Badge disabled>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('does not add disabled attribute when not disabled', () => {
      render(<Badge>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('renders disabled state with false explicitly', () => {
      render(<Badge disabled={false}>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).not.toHaveAttribute('data-disabled');
    });
  });

  // 5. Accessibility tests
  describe('accessibility', () => {
    it('has correct ARIA label when provided', () => {
      render(<Badge aria-label="Test label">Test</Badge>);
      expect(screen.getByLabelText('Test label')).toBeInTheDocument();
    });

    it('includes data-component attribute', () => {
      render(<Badge>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-component', 'badge');
    });

    it('accepts role attribute', () => {
      render(<Badge role="status">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('role', 'status');
    });

    it('accepts aria-live attribute', () => {
      render(<Badge aria-live="polite">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('aria-live', 'polite');
    });

    it('accepts aria-describedby attribute', () => {
      render(<Badge aria-describedby="description">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('aria-describedby', 'description');
    });
  });

  // 6. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('forwards ref with data attributes', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(
        <Badge ref={ref} variant="success" size="lg">
          Test
        </Badge>
      );
      expect(ref.current).toHaveAttribute('data-variant', 'success');
      expect(ref.current).toHaveAttribute('data-size', 'lg');
    });
  });

  // 7. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(<Badge className="custom-badge">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveClass('custom-badge');
    });

    it('merges custom className with component classes', () => {
      render(<Badge className="custom-badge">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element.className).toContain('custom-badge');
    });

    it('accepts custom style prop', () => {
      render(<Badge style={{ backgroundColor: 'red' }}>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      render(<Badge id="badge-1">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('id', 'badge-1');
    });
  });

  // 8. Props spreading
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      render(
        <Badge data-testid="test-badge" data-custom="value">
          Test
        </Badge>
      );
      const element = screen.getByTestId('test-badge');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts and applies title attribute', () => {
      render(<Badge title="Badge title">Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('title', 'Badge title');
    });

    it('accepts and applies onClick handler', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Test</Badge>);
      const element = screen.getByText('Test');
      element.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // 9. Combined props tests
  describe('combined props', () => {
    it('renders with multiple variants and sizes', () => {
      const variants: Array<
        'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
      > = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'];
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { container } = render(
            <Badge variant={variant} size={size} data-testid={`badge-${variant}-${size}`}>
              Test
            </Badge>
          );
          const element = screen.getByTestId(`badge-${variant}-${size}`);
          expect(element).toHaveAttribute('data-variant', variant);
          expect(element).toHaveAttribute('data-size', size);
          container.remove();
        });
      });
    });

    it('renders disabled badge with all variants', () => {
      const variants: Array<
        'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
      > = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'];

      variants.forEach((variant) => {
        const { container } = render(
          <Badge variant={variant} disabled data-testid={`badge-${variant}`}>
            Test
          </Badge>
        );
        const element = screen.getByTestId(`badge-${variant}`);
        expect(element).toHaveAttribute('data-disabled', 'true');
        expect(element).toHaveAttribute('data-variant', variant);
        container.remove();
      });
    });

    it('renders with variant, size, disabled, and custom className', () => {
      render(
        <Badge variant="danger" size="sm" disabled className="custom">
          Test
        </Badge>
      );
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'danger');
      expect(element).toHaveAttribute('data-size', 'sm');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element).toHaveClass('custom');
    });
  });

  // 10. Edge cases
  describe('edge cases', () => {
    it('renders with empty string content', () => {
      render(<Badge data-testid="empty-badge" />);
      const element = screen.getByTestId('empty-badge');
      expect(element).toBeInTheDocument();
      expect(element).toBeEmptyDOMElement();
    });

    it('renders with zero as content', () => {
      render(<Badge>0</Badge>);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders with long text content', () => {
      const longText = 'This is a very long text content for the badge component';
      render(<Badge>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('renders with special characters', () => {
      render(<Badge>!@#$%^&*()</Badge>);
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    });

    it('renders with unicode characters', () => {
      render(<Badge>🎉 ✨ 🚀</Badge>);
      expect(screen.getByText('🎉 ✨ 🚀')).toBeInTheDocument();
    });

    it('handles undefined className gracefully', () => {
      render(<Badge className={undefined}>Test</Badge>);
      const element = screen.getByText('Test');
      expect(element).toBeInTheDocument();
    });

    it('handles null children gracefully', () => {
      render(<Badge>{null}</Badge>);
      const element = screen.getByText('', { selector: '[data-component="badge"]' });
      expect(element).toBeInTheDocument();
    });
  });
});
