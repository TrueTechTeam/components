import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('Chip', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Chip>Test Content</Chip>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const handleRemove = jest.fn();
      render(
        <Chip
          variant="success"
          size="lg"
          disabled
          onRemove={handleRemove}
          className="custom-class"
          data-testid="test-chip"
        >
          Content
        </Chip>
      );

      const element = screen.getByTestId('test-chip');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(
        <Chip>
          <span>Child 1</span>
          <span>Child 2</span>
        </Chip>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('renders remove button when onRemove is provided', () => {
      const handleRemove = jest.fn();
      render(<Chip onRemove={handleRemove}>Test</Chip>);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
    });

    it('does not render remove button when onRemove is not provided', () => {
      render(<Chip>Test</Chip>);

      const removeButton = screen.queryByRole('button', { name: /remove/i });
      expect(removeButton).not.toBeInTheDocument();
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Chip>Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-variant', 'primary');
    });

    it('renders secondary variant', () => {
      render(<Chip variant="secondary">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders success variant', () => {
      render(<Chip variant="success">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-variant', 'success');
    });

    it('renders warning variant', () => {
      render(<Chip variant="warning">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-variant', 'warning');
    });

    it('renders danger variant', () => {
      render(<Chip variant="danger">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-variant', 'danger');
    });

    it('renders info variant', () => {
      render(<Chip variant="info">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-variant', 'info');
    });

    it('renders neutral variant', () => {
      render(<Chip variant="neutral">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-variant', 'neutral');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<Chip>Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      render(<Chip size="sm">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      render(<Chip size="lg">Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. State tests
  describe('states', () => {
    it('renders disabled state', () => {
      render(<Chip disabled>Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('does not add disabled attribute when not disabled', () => {
      render(<Chip>Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('disables remove button when chip is disabled', () => {
      const handleRemove = jest.fn();
      render(
        <Chip disabled onRemove={handleRemove}>
          Test
        </Chip>
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeDisabled();
    });
  });

  // 5. Interaction tests
  describe('interactions', () => {
    it('calls onRemove when remove button is clicked', () => {
      const handleRemove = jest.fn();
      render(<Chip onRemove={handleRemove}>Test</Chip>);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('does not call onRemove when disabled', () => {
      const handleRemove = jest.fn();
      render(
        <Chip disabled onRemove={handleRemove}>
          Test
        </Chip>
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);

      expect(handleRemove).not.toHaveBeenCalled();
    });

    it('stops propagation when remove button is clicked', () => {
      const handleRemove = jest.fn();
      const handleChipClick = jest.fn();

      render(
        <Chip onRemove={handleRemove} onClick={handleChipClick}>
          Test
        </Chip>
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleChipClick).not.toHaveBeenCalled();
    });

    it('allows keyboard interaction with remove button', async () => {
      const user = userEvent.setup();
      const handleRemove = jest.fn();

      render(<Chip onRemove={handleRemove}>Test</Chip>);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.tab();
      expect(removeButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });
  });

  // 6. Accessibility tests
  describe('accessibility', () => {
    it('has correct ARIA label when provided', () => {
      render(<Chip aria-label="Test label">Test</Chip>);
      expect(screen.getByLabelText('Test label')).toBeInTheDocument();
    });

    it('includes data-component attribute', () => {
      render(<Chip>Test</Chip>);
      const element = screen.getByText('Test').parentElement;
      expect(element).toHaveAttribute('data-component', 'chip');
    });

    it('has correct aria-label on remove button by default', () => {
      const handleRemove = jest.fn();
      render(<Chip onRemove={handleRemove}>Test</Chip>);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAttribute('aria-label', 'Remove');
    });

    it('uses custom aria-label on remove button when provided', () => {
      const handleRemove = jest.fn();
      render(
        <Chip onRemove={handleRemove} removeButtonAriaLabel="Delete chip">
          Test
        </Chip>
      );

      const removeButton = screen.getByRole('button', { name: /delete chip/i });
      expect(removeButton).toBeInTheDocument();
    });

    it('sets correct tabIndex on remove button', () => {
      const handleRemove = jest.fn();
      render(<Chip onRemove={handleRemove}>Test</Chip>);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAttribute('tabIndex', '0');
    });

    it('sets tabIndex to -1 on disabled remove button', () => {
      const handleRemove = jest.fn();
      render(
        <Chip disabled onRemove={handleRemove}>
          Test
        </Chip>
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAttribute('tabIndex', '-1');
    });
  });

  // 7. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Chip ref={ref}>Test</Chip>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Test');
    });
  });
});
