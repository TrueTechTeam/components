import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Tag>Test Tag</Tag>);
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <Tag
          variant="secondary"
          size="lg"
          disabled
          removable
          onRemove={() => {}}
          className="custom-class"
          data-testid="test-tag"
        >
          Content
        </Tag>
      );

      const element = screen.getByTestId('test-tag');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(
        <Tag>
          <span>Child Content</span>
        </Tag>
      );

      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      render(<Tag>Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element?.tagName).toBe('SPAN');
    });

    it('renders as button when onClick is provided', () => {
      render(<Tag onClick={() => {}}>Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element?.tagName).toBe('BUTTON');
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Tag>Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-variant', 'primary');
    });

    it('renders secondary variant', () => {
      render(<Tag variant="secondary">Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders tertiary variant', () => {
      render(<Tag variant="tertiary">Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-variant', 'tertiary');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<Tag>Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      render(<Tag size="sm">Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      render(<Tag size="lg">Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. State tests
  describe('states', () => {
    it('renders disabled state', () => {
      render(<Tag disabled>Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('does not add disabled attribute when not disabled', () => {
      render(<Tag>Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('renders removable tag with remove button', () => {
      render(
        <Tag removable onRemove={() => {}}>
          Test
        </Tag>
      );
      expect(screen.getByLabelText('Remove Test')).toBeInTheDocument();
    });

    it('does not render remove button when not removable', () => {
      render(<Tag>Test</Tag>);
      expect(screen.queryByLabelText(/Remove/)).not.toBeInTheDocument();
    });
  });

  // 5. Interaction tests
  describe('interactions', () => {
    it('calls onClick when tag is clicked', () => {
      const handleClick = jest.fn();
      render(<Tag onClick={handleClick}>Test</Tag>);

      fireEvent.click(screen.getByText('Test').closest('[data-component="tag"]')!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Tag onClick={handleClick} disabled>
          Test
        </Tag>
      );

      fireEvent.click(screen.getByText('Test').closest('[data-component="tag"]')!);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onRemove when remove button is clicked', () => {
      const handleRemove = jest.fn();
      render(
        <Tag removable onRemove={handleRemove}>
          Test
        </Tag>
      );

      fireEvent.click(screen.getByLabelText('Remove Test'));
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('does not call onRemove when disabled', () => {
      const handleRemove = jest.fn();
      render(
        <Tag removable onRemove={handleRemove} disabled>
          Test
        </Tag>
      );

      const removeButton = screen.getByLabelText('Remove Test');
      expect(removeButton).toBeDisabled();
    });

    it('stops propagation when remove button is clicked', () => {
      const handleClick = jest.fn();
      const handleRemove = jest.fn();

      render(
        <Tag onClick={handleClick} removable onRemove={handleRemove}>
          Test
        </Tag>
      );

      fireEvent.click(screen.getByLabelText('Remove Test'));
      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 6. Accessibility tests
  describe('accessibility', () => {
    it('has correct ARIA label when provided', () => {
      render(<Tag aria-label="Test label">Test</Tag>);
      expect(screen.getByLabelText('Test label')).toBeInTheDocument();
    });

    it('includes data-component attribute', () => {
      render(<Tag>Test</Tag>);
      const element = screen.getByText('Test').closest('[data-component="tag"]');
      expect(element).toHaveAttribute('data-component', 'tag');
    });

    it('has button type when onClick is provided', () => {
      render(<Tag onClick={() => {}}>Test</Tag>);
      const element = screen.getByText('Test').closest('button');
      expect(element).toHaveAttribute('type', 'button');
    });

    it('has disabled attribute when disabled and onClick is provided', () => {
      render(
        <Tag onClick={() => {}} disabled>
          Test
        </Tag>
      );
      const element = screen.getByText('Test').closest('button');
      expect(element).toBeDisabled();
    });

    it('remove button has descriptive aria-label', () => {
      render(
        <Tag removable onRemove={() => {}}>
          React
        </Tag>
      );
      expect(screen.getByLabelText('Remove React')).toBeInTheDocument();
    });
  });

  // 7. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to span element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Tag ref={ref as any}>Test</Tag>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('forwards ref to button element when onClick is provided', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Tag ref={ref as any} onClick={() => {}}>
          Test
        </Tag>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Test');
    });
  });
});
