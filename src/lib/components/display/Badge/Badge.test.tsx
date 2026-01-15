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
  });

  // 6. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Test');
    });
  });
});
