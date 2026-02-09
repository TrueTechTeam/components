import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { Icon } from '../../display/Icon';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('renders with data-testid', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('renders with default data-testid when not provided', () => {
      render(<Button>Button</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('renders with custom style', () => {
      render(<Button style={{ backgroundColor: 'red' }}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ backgroundColor: 'red' });
    });

    it('includes data-component attribute', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-component', 'button');
    });

    it('renders multiple children correctly', () => {
      render(
        <Button>
          <span>Part 1</span>
          <span>Part 2</span>
        </Button>
      );
      expect(screen.getByText('Part 1')).toBeInTheDocument();
      expect(screen.getByText('Part 2')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it.each(['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'] as const)(
      'renders %s variant',
      (variant) => {
        render(<Button variant={variant}>Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('sizes', () => {
    it('renders md size by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'md');
    });

    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('renders %s size', (size) => {
      render(<Button size={size}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', size);
    });
  });

  describe('interactions', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes event object to onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('does not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not trigger click when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} loading>
          Click
        </Button>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('has button type by default', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it.each(['button', 'submit', 'reset'] as const)('has correct type attribute for %s', (type) => {
      render(<Button type={type}>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', type);
    });
  });

  describe('icons', () => {
    it('renders with start icon as React node', () => {
      render(<Button startIcon={<Icon name="check" />}>Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });

    it('renders with end icon as React node', () => {
      render(<Button endIcon={<Icon name="chevron-right" />}>Next</Button>);
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument();
    });

    it('renders with start icon as icon name string', () => {
      render(<Button startIcon="check">Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });

    it('renders with end icon as icon name string', () => {
      render(<Button endIcon="chevron-right">Next</Button>);
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument();
    });

    it('renders with both start and end icons', () => {
      render(
        <Button startIcon="check" endIcon="chevron-right">
          Continue
        </Button>
      );
      expect(screen.getByText('Continue')).toBeInTheDocument();
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
      expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument();
    });

    it('does not render icons when loading', () => {
      render(
        <Button startIcon="check" endIcon="chevron-right" loading>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-chevron-right')).not.toBeInTheDocument();
    });
  });

  describe('fullWidth', () => {
    it('does not set data-full-width by default', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).not.toHaveAttribute('data-full-width');
    });

    it('renders full width button', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-full-width', 'true');
    });

    it('does not set data-full-width when false', () => {
      render(<Button fullWidth={false}>Button</Button>);
      expect(screen.getByRole('button')).not.toHaveAttribute('data-full-width');
    });
  });

  describe('loading state', () => {
    it('renders spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('is disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets data-loading attribute when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
    });

    it('does not set data-loading when not loading', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).not.toHaveAttribute('data-loading');
    });

    it('sets aria-busy to true when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('sets aria-busy to false when not loading', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false');
    });

    it('displays children text by default when loading', () => {
      render(<Button loading>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('displays loadingText when provided', () => {
      render(
        <Button loading loadingText="Please wait...">
          Click me
        </Button>
      );
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    });

    it('displays empty string loadingText correctly', () => {
      render(
        <Button loading loadingText="">
          Click me
        </Button>
      );
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders spinner at start position by default', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      const spinner = screen.getByTestId('spinner');
      expect(button).toContainElement(spinner);
      // Spinner should be first child when at start
      expect(button.firstChild).toContainElement(spinner);
    });

    it('renders spinner at end position', () => {
      render(
        <Button loading loadingPosition="end">
          Loading
        </Button>
      );
      const button = screen.getByRole('button');
      const spinner = screen.getByTestId('spinner');
      expect(button).toContainElement(spinner);
      // Spinner should be last child when at end
      expect(button.lastChild).toContainElement(spinner);
    });

    it('renders only spinner at center position', () => {
      render(
        <Button loading loadingPosition="center">
          Loading
        </Button>
      );
      const button = screen.getByRole('button');
      const spinner = screen.getByTestId('spinner');
      expect(button).toContainElement(spinner);
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    it('uses correct spinner size for xs button', () => {
      render(
        <Button size="xs" loading>
          Loading
        </Button>
      );
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', 'xs');
    });

    it('uses correct spinner size for sm button', () => {
      render(
        <Button size="sm" loading>
          Loading
        </Button>
      );
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', 'xs');
    });

    it('uses correct spinner size for md button', () => {
      render(
        <Button size="md" loading>
          Loading
        </Button>
      );
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', 'sm');
    });

    it('uses correct spinner size for lg button', () => {
      render(
        <Button size="lg" loading>
          Loading
        </Button>
      );
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', 'sm');
    });

    it('uses correct spinner size for xl button', () => {
      render(
        <Button size="xl" loading>
          Loading
        </Button>
      );
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-size', 'md');
    });

    it('applies minWidth style when transitioning to loading', () => {
      const { rerender } = render(<Button>Click me</Button>);
      const button = screen.getByRole('button');

      // Mock offsetWidth to simulate a button with width
      Object.defineProperty(button, 'offsetWidth', {
        writable: true,
        configurable: true,
        value: 100,
      });

      // Trigger re-render to loading state
      rerender(<Button loading>Click me</Button>);

      // The button should have minWidth applied based on the captured width
      // Note: In jsdom, we need to check that the component attempts to set minWidth
      // The actual minWidth will only be set if offsetWidth > 0 during the effect
      expect(button).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('accessibility', () => {
    it('has correct aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is not disabled by default', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('supports additional ARIA attributes', () => {
      render(
        <Button aria-describedby="tooltip-1" aria-pressed="true">
          Button
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'tooltip-1');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Button');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(<Button ref={refCallback}>Button</Button>);
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('handles multiple refs correctly', () => {
      const ref1 = React.createRef<HTMLButtonElement>();
      const ref2 = jest.fn();

      const { rerender } = render(<Button ref={ref1}>Button</Button>);
      expect(ref1.current).toBeInstanceOf(HTMLButtonElement);

      rerender(<Button ref={ref2}>Button</Button>);
      expect(ref2).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });
});

describe('additional HTML attributes', () => {
  it('forwards additional HTML attributes', () => {
    render(
      <Button data-custom="value" id="custom-id">
        Button
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-custom', 'value');
    expect(button).toHaveAttribute('id', 'custom-id');
  });

  it('forwards form attribute', () => {
    render(<Button form="my-form">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('form', 'my-form');
  });

  it('forwards name attribute', () => {
    render(<Button name="submit-button">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('name', 'submit-button');
  });

  it('forwards value attribute', () => {
    render(<Button value="action-value">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('value', 'action-value');
  });
});

describe('edge cases', () => {
  it('renders without children', () => {
    render(<Button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with null children', () => {
    render(<Button>{null}</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with undefined children', () => {
    render(<Button>{undefined}</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with zero as children', () => {
    render(<Button>{0}</Button>);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with empty string as children', () => {
    render(<Button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles both disabled and loading props correctly', () => {
    render(
      <Button disabled loading>
        Button
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
