import React from 'react';
import { render, screen } from '@testing-library/react';
import { {{ComponentName}} } from './{{ComponentName}}';

describe('{{ComponentName}}', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<{{ComponentName}}>Test Content</{{ComponentName}}>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <{{ComponentName}}
          variant="success"
          size="lg"
          disabled
          className="custom-class"
          data-testid="test-{{componentName}}"
        >
          Content
        </{{ComponentName}}>
      );

      const element = screen.getByTestId('test-{{componentName}}');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(
        <{{ComponentName}}>
          <span>Child 1</span>
          <span>Child 2</span>
        </{{ComponentName}}>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<{{ComponentName}}>Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'primary');
    });

    it('renders secondary variant', () => {
      render(<{{ComponentName}} variant="secondary">Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders success variant', () => {
      render(<{{ComponentName}} variant="success">Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'success');
    });

    it('renders warning variant', () => {
      render(<{{ComponentName}} variant="warning">Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'warning');
    });

    it('renders danger variant', () => {
      render(<{{ComponentName}} variant="danger">Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-variant', 'danger');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<{{ComponentName}}>Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      render(<{{ComponentName}} size="sm">Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      render(<{{ComponentName}} size="lg">Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. State tests
  describe('states', () => {
    it('renders disabled state', () => {
      render(<{{ComponentName}} disabled>Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('does not add disabled attribute when not disabled', () => {
      render(<{{ComponentName}}>Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).not.toHaveAttribute('data-disabled');
    });
  });

  // 5. Interaction tests (if applicable)
  describe('interactions', () => {
    // Add onClick, onRemove, etc. tests if component is interactive
  });

  // 6. Accessibility tests
  describe('accessibility', () => {
    it('has correct ARIA label when provided', () => {
      render(<{{ComponentName}} aria-label="Test label">Test</{{ComponentName}}>);
      expect(screen.getByLabelText('Test label')).toBeInTheDocument();
    });

    it('includes data-component attribute', () => {
      render(<{{ComponentName}}>Test</{{ComponentName}}>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-component', '{{componentName}}');
    });
  });

  // 7. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTML{{Element}}Element>();
      render(<{{ComponentName}} ref={ref}>Test</{{ComponentName}}>);
      expect(ref.current).toBeInstanceOf(HTML{{Element}}Element);
      expect(ref.current).toHaveTextContent('Test');
    });
  });
});
