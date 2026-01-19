import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pill } from './Pill';

describe('Pill', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Pill>Test Content</Pill>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <Pill
          variant="outlined"
          color="success"
          size="lg"
          disabled
          className="custom-class"
          data-testid="test-pill"
        >
          Content
        </Pill>
      );

      const element = screen.getByTestId('test-pill');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(
        <Pill>
          <span>Child 1</span>
          <span>Child 2</span>
        </Pill>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      const { container } = render(<Pill>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element?.tagName).toBe('SPAN');
    });

    it('renders as button when onClick is provided', () => {
      const { container } = render(<Pill onClick={() => {}}>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element?.tagName).toBe('BUTTON');
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders filled variant by default', () => {
      const { container } = render(<Pill>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-variant', 'filled');
    });

    it('renders outlined variant', () => {
      const { container } = render(<Pill variant="outlined">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-variant', 'outlined');
    });

    it('renders subtle variant', () => {
      const { container } = render(<Pill variant="subtle">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-variant', 'subtle');
    });
  });

  // 3. Color tests
  describe('colors', () => {
    it('renders primary color by default', () => {
      const { container } = render(<Pill>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-color', 'primary');
    });

    it('renders secondary color', () => {
      const { container } = render(<Pill color="secondary">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-color', 'secondary');
    });

    it('renders success color', () => {
      const { container } = render(<Pill color="success">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-color', 'success');
    });

    it('renders warning color', () => {
      const { container } = render(<Pill color="warning">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-color', 'warning');
    });

    it('renders danger color', () => {
      const { container } = render(<Pill color="danger">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-color', 'danger');
    });

    it('renders info color', () => {
      const { container } = render(<Pill color="info">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-color', 'info');
    });

    it('renders neutral color', () => {
      const { container } = render(<Pill color="neutral">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-color', 'neutral');
    });
  });

  // 4. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      const { container } = render(<Pill>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      const { container } = render(<Pill size="sm">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      const { container } = render(<Pill size="lg">Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 5. State tests
  describe('states', () => {
    it('renders disabled state', () => {
      const { container } = render(<Pill disabled>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('does not add disabled attribute when not disabled', () => {
      const { container } = render(<Pill>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('adds clickable attribute when onClick is provided', () => {
      const { container } = render(<Pill onClick={() => {}}>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-clickable', 'true');
    });

    it('adds removable attribute when onRemove is provided', () => {
      const { container } = render(<Pill onRemove={() => {}}>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-removable', 'true');
    });
  });

  // 6. Interaction tests
  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      const { container } = render(<Pill onClick={handleClick}>Test</Pill>);

      const element = container.querySelector('[data-component="pill"]');
      fireEvent.click(element!);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <Pill onClick={handleClick} disabled>
          Test
        </Pill>
      );

      const element = container.querySelector('[data-component="pill"]');
      fireEvent.click(element!);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onRemove when remove button is clicked', () => {
      const handleRemove = jest.fn();
      render(<Pill onRemove={handleRemove}>Test</Pill>);

      const removeButton = screen.getByLabelText('Remove');
      fireEvent.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when remove button is clicked', () => {
      const handleClick = jest.fn();
      const handleRemove = jest.fn();
      render(
        <Pill onClick={handleClick} onRemove={handleRemove}>
          Test
        </Pill>
      );

      const removeButton = screen.getByLabelText('Remove');
      fireEvent.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onRemove when disabled', () => {
      const handleRemove = jest.fn();
      render(
        <Pill onRemove={handleRemove} disabled>
          Test
        </Pill>
      );

      const removeButton = screen.getByLabelText('Remove');
      fireEvent.click(removeButton);

      expect(handleRemove).not.toHaveBeenCalled();
    });
  });

  // 7. Icon tests
  describe('icons', () => {
    it('renders start icon when provided', () => {
      render(
        <Pill startIcon={<span data-testid="start-icon">→</span>}>Test</Pill>
      );

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders end icon when provided', () => {
      render(<Pill endIcon={<span data-testid="end-icon">←</span>}>Test</Pill>);

      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('renders both start and end icons', () => {
      render(
        <Pill
          startIcon={<span data-testid="start-icon">→</span>}
          endIcon={<span data-testid="end-icon">←</span>}
        >
          Test
        </Pill>
      );

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('does not render end icon when onRemove is provided', () => {
      render(
        <Pill
          endIcon={<span data-testid="end-icon">←</span>}
          onRemove={() => {}}
        >
          Test
        </Pill>
      );

      expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Remove')).toBeInTheDocument();
    });
  });

  // 8. Accessibility tests
  describe('accessibility', () => {
    it('has correct ARIA label when provided', () => {
      render(<Pill aria-label="Test label">Test</Pill>);
      expect(screen.getByLabelText('Test label')).toBeInTheDocument();
    });

    it('includes data-component attribute', () => {
      const { container } = render(<Pill>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('data-component', 'pill');
    });

    it('remove button has aria-label', () => {
      render(<Pill onRemove={() => {}}>Test</Pill>);
      expect(screen.getByLabelText('Remove')).toBeInTheDocument();
    });

    it('remove button has tabIndex -1', () => {
      render(<Pill onRemove={() => {}}>Test</Pill>);
      const removeButton = screen.getByLabelText('Remove');
      expect(removeButton).toHaveAttribute('tabIndex', '-1');
    });

    it('clickable pill has type="button"', () => {
      const { container } = render(<Pill onClick={() => {}}>Test</Pill>);
      const element = container.querySelector('[data-component="pill"]');
      expect(element).toHaveAttribute('type', 'button');
    });
  });

  // 9. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to span element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Pill ref={ref}>Test</Pill>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('forwards ref to button element when clickable', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Pill ref={ref} onClick={() => {}}>
          Test
        </Pill>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Test');
    });
  });
});
