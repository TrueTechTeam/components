import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <Card
          variant="elevated"
          size="lg"
          padding="lg"
          interactive
          disabled
          hoverable
          fullWidth
          className="custom-class"
          data-testid="test-card"
        >
          Content
        </Card>
      );

      const element = screen.getByTestId('test-card');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(
        <Card>
          <span>Child 1</span>
          <span>Child 2</span>
        </Card>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const { container } = render(<Card>Test</Card>);
      const element = container.querySelector('[data-component="card"]');
      expect(element?.tagName).toBe('DIV');
    });

    it('includes data-component attribute', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-component', 'card');
    });

    it('renders with complex children structure', () => {
      render(
        <Card>
          <div>
            <h1>Title</h1>
            <p>Description</p>
          </div>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders outlined variant by default', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-variant', 'outlined');
    });

    it('renders outlined variant', () => {
      render(<Card variant="outlined">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-variant', 'outlined');
    });

    it('renders elevated variant', () => {
      render(<Card variant="elevated">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-variant', 'elevated');
    });

    it('renders filled variant', () => {
      render(<Card variant="filled">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-variant', 'filled');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders md size by default', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders sm size', () => {
      render(<Card size="sm">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders lg size', () => {
      render(<Card size="lg">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. Padding tests
  describe('padding', () => {
    it('renders md padding by default', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-padding', 'md');
    });

    it('renders none padding', () => {
      render(<Card padding="none">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-padding', 'none');
    });

    it('renders sm padding', () => {
      render(<Card padding="sm">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-padding', 'sm');
    });

    it('renders lg padding', () => {
      render(<Card padding="lg">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-padding', 'lg');
    });
  });

  // 5. Interactive state tests
  describe('interactive state', () => {
    it('is not interactive by default', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('data-interactive');
      expect(element).not.toHaveAttribute('role', 'button');
      expect(element).not.toHaveAttribute('tabIndex');
    });

    it('renders interactive state', () => {
      render(<Card interactive>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-interactive', 'true');
      expect(element).toHaveAttribute('role', 'button');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('handles click when interactive', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes event object to onClick handler', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('does not call onClick when not interactive', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive disabled onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 6. Disabled state tests
  describe('disabled state', () => {
    it('is not disabled by default', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('renders disabled state', () => {
      render(<Card disabled>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('renders disabled state when interactive', () => {
      render(
        <Card interactive disabled>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not have tabIndex when interactive and disabled', () => {
      render(
        <Card interactive disabled>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('tabIndex');
    });

    it('does not set aria-disabled when not interactive', () => {
      render(<Card disabled>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('aria-disabled');
    });

    it('does not add disabled attribute when false explicitly', () => {
      render(<Card disabled={false}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('data-disabled');
    });
  });

  // 7. Keyboard navigation tests
  describe('keyboard navigation', () => {
    it('handles Enter key when interactive', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.keyDown(element, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key when interactive', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.keyDown(element, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default on Space key', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      element.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('prevents default on Enter key', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      element.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('does not handle keyboard when not interactive', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.keyDown(element, { key: 'Enter' });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not handle keyboard when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive disabled onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.keyDown(element, { key: 'Enter' });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('ignores other keys', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.keyDown(element, { key: 'a' });
      fireEvent.keyDown(element, { key: 'Escape' });
      fireEvent.keyDown(element, { key: 'Tab' });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 8. Header tests
  describe('header', () => {
    it('does not render header by default', () => {
      const { container } = render(<Card>Test</Card>);
      const header = container.querySelector('[class*="cardHeader"]');
      expect(header).not.toBeInTheDocument();
    });

    it('renders header when provided', () => {
      render(<Card header={<h1>Header Title</h1>}>Test</Card>);
      expect(screen.getByText('Header Title')).toBeInTheDocument();
    });

    it('renders header with divider by default', () => {
      const { container } = render(<Card header={<h1>Header</h1>}>Test</Card>);
      const header = container.querySelector('[class*="cardHeader"]');
      expect(header).toHaveAttribute('data-divider', 'true');
    });

    it('renders header without divider when headerDivider is false', () => {
      const { container } = render(
        <Card header={<h1>Header</h1>} headerDivider={false}>
          Test
        </Card>
      );
      const header = container.querySelector('[class*="cardHeader"]');
      expect(header).not.toHaveAttribute('data-divider');
    });

    it('renders header with complex content', () => {
      render(
        <Card
          header={
            <div>
              <h1>Title</h1>
              <p>Subtitle</p>
            </div>
          }
        >
          Body
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('renders header with string content', () => {
      render(<Card header="Simple Header">Body</Card>);
      expect(screen.getByText('Simple Header')).toBeInTheDocument();
    });
  });

  // 9. Footer tests
  describe('footer', () => {
    it('does not render footer by default', () => {
      const { container } = render(<Card>Test</Card>);
      const footer = container.querySelector('[class*="cardFooter"]');
      expect(footer).not.toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(<Card footer={<button>Action</button>}>Test</Card>);
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders footer with divider by default', () => {
      const { container } = render(<Card footer={<button>Action</button>}>Test</Card>);
      const footer = container.querySelector('[class*="cardFooter"]');
      expect(footer).toHaveAttribute('data-divider', 'true');
    });

    it('renders footer without divider when footerDivider is false', () => {
      const { container } = render(
        <Card footer={<button>Action</button>} footerDivider={false}>
          Test
        </Card>
      );
      const footer = container.querySelector('[class*="cardFooter"]');
      expect(footer).not.toHaveAttribute('data-divider');
    });

    it('renders footer with complex content', () => {
      render(
        <Card
          footer={
            <div>
              <button>Cancel</button>
              <button>Submit</button>
            </div>
          }
        >
          Body
        </Card>
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('renders footer with string content', () => {
      render(<Card footer="Footer text">Body</Card>);
      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });
  });

  // 10. Header and footer combined
  describe('header and footer combined', () => {
    it('renders both header and footer', () => {
      render(
        <Card header={<h1>Header</h1>} footer={<button>Footer</button>}>
          Body
        </Card>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('renders header, body, and footer in correct order', () => {
      const { container } = render(
        <Card header="Header" footer="Footer">
          Body
        </Card>
      );
      const card = container.querySelector('[data-component="card"]');
      const textContent = card?.textContent;
      expect(textContent).toBe('HeaderBodyFooter');
    });

    it('renders with both dividers', () => {
      const { container } = render(
        <Card header="Header" footer="Footer">
          Body
        </Card>
      );
      const header = container.querySelector('[class*="cardHeader"]');
      const footer = container.querySelector('[class*="cardFooter"]');
      expect(header).toHaveAttribute('data-divider', 'true');
      expect(footer).toHaveAttribute('data-divider', 'true');
    });

    it('renders without both dividers', () => {
      const { container } = render(
        <Card header="Header" footer="Footer" headerDivider={false} footerDivider={false}>
          Body
        </Card>
      );
      const header = container.querySelector('[class*="cardHeader"]');
      const footer = container.querySelector('[class*="cardFooter"]');
      expect(header).not.toHaveAttribute('data-divider');
      expect(footer).not.toHaveAttribute('data-divider');
    });
  });

  // 11. Hoverable state tests
  describe('hoverable state', () => {
    it('is not hoverable by default', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('data-hoverable');
    });

    it('renders hoverable state when explicitly set', () => {
      render(<Card hoverable>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-hoverable', 'true');
    });

    it('is hoverable when interactive', () => {
      render(<Card interactive>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-hoverable', 'true');
    });

    it('is hoverable when both interactive and hoverable are set', () => {
      render(
        <Card interactive hoverable>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-hoverable', 'true');
    });

    it('is not hoverable when hoverable is false and not interactive', () => {
      render(<Card hoverable={false}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('data-hoverable');
    });
  });

  // 12. Full width tests
  describe('fullWidth', () => {
    it('is not full width by default', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('data-full-width');
    });

    it('renders full width', () => {
      render(<Card fullWidth>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-full-width', 'true');
    });

    it('does not set data-full-width when false', () => {
      render(<Card fullWidth={false}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('data-full-width');
    });
  });

  // 13. Accessibility tests
  describe('accessibility', () => {
    it('has correct aria-label when provided', () => {
      render(<Card aria-label="Test label">Test</Card>);
      expect(screen.getByLabelText('Test label')).toBeInTheDocument();
    });

    it('has role button when interactive', () => {
      render(<Card interactive>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('role', 'button');
    });

    it('does not have role button when not interactive', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('role');
    });

    it('has tabIndex 0 when interactive and not disabled', () => {
      render(<Card interactive>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('does not have tabIndex when not interactive', () => {
      render(<Card>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('tabIndex');
    });

    it('sets aria-disabled when interactive and disabled', () => {
      render(
        <Card interactive disabled>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not set aria-disabled when interactive and not disabled', () => {
      render(<Card interactive>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).not.toHaveAttribute('aria-disabled');
    });

    it('accepts additional ARIA attributes', () => {
      render(
        <Card aria-describedby="description-1" role="article">
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('aria-describedby', 'description-1');
      expect(element).toHaveAttribute('role', 'article');
    });
  });

  // 14. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Test</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('forwards ref with data attributes', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Card ref={ref} variant="elevated" size="lg">
          Test
        </Card>
      );
      expect(ref.current).toHaveAttribute('data-variant', 'elevated');
      expect(ref.current).toHaveAttribute('data-size', 'lg');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(<Card ref={refCallback}>Test</Card>);
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 15. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(<Card className="custom-card">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveClass('custom-card');
    });

    it('merges custom className with component classes', () => {
      render(<Card className="custom-card">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element?.className).toContain('custom-card');
    });

    it('accepts custom style prop', () => {
      render(<Card style={{ backgroundColor: 'red' }}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      render(<Card id="card-1">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('id', 'card-1');
    });

    it('handles undefined className gracefully', () => {
      render(<Card className={undefined}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toBeInTheDocument();
    });
  });

  // 16. Props spreading
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      render(
        <Card data-testid="test-card" data-custom="value">
          Test
        </Card>
      );
      const element = screen.getByTestId('test-card');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts and applies title attribute', () => {
      render(<Card title="Card title">Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('title', 'Card title');
    });

    it('forwards additional HTML attributes', () => {
      render(
        <Card data-custom="value" id="custom-id">
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-custom', 'value');
      expect(element).toHaveAttribute('id', 'custom-id');
    });
  });

  // 17. Combined props tests
  describe('combined props', () => {
    it('renders with multiple variants and sizes', () => {
      const variants: Array<'outlined' | 'elevated' | 'filled'> = [
        'outlined',
        'elevated',
        'filled',
      ];
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { container } = render(
            <Card variant={variant} size={size} data-testid={`card-${variant}-${size}`}>
              Test
            </Card>
          );
          const element = screen.getByTestId(`card-${variant}-${size}`);
          expect(element).toHaveAttribute('data-variant', variant);
          expect(element).toHaveAttribute('data-size', size);
          container.remove();
        });
      });
    });

    it('renders interactive card with all variants', () => {
      const variants: Array<'outlined' | 'elevated' | 'filled'> = [
        'outlined',
        'elevated',
        'filled',
      ];

      variants.forEach((variant) => {
        const { container } = render(
          <Card variant={variant} interactive data-testid={`card-${variant}`}>
            Test
          </Card>
        );
        const element = screen.getByTestId(`card-${variant}`);
        expect(element).toHaveAttribute('data-interactive', 'true');
        expect(element).toHaveAttribute('data-variant', variant);
        container.remove();
      });
    });

    it('renders with variant, size, padding, disabled, and custom className', () => {
      render(
        <Card variant="elevated" size="sm" padding="lg" disabled className="custom">
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]');
      expect(element).toHaveAttribute('data-variant', 'elevated');
      expect(element).toHaveAttribute('data-size', 'sm');
      expect(element).toHaveAttribute('data-padding', 'lg');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element).toHaveClass('custom');
    });

    it('renders interactive card with header and footer', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick} header="Header" footer="Footer">
          Body
        </Card>
      );
      const element = screen.getByText('Body').closest('[data-component="card"]') as HTMLElement;
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      fireEvent.click(element);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders all padding options with all sizes', () => {
      const paddings: Array<'none' | 'sm' | 'md' | 'lg'> = ['none', 'sm', 'md', 'lg'];
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      paddings.forEach((padding) => {
        sizes.forEach((size) => {
          const { container } = render(
            <Card padding={padding} size={size} data-testid={`card-${padding}-${size}`}>
              Test
            </Card>
          );
          const element = screen.getByTestId(`card-${padding}-${size}`);
          expect(element).toHaveAttribute('data-padding', padding);
          expect(element).toHaveAttribute('data-size', size);
          container.remove();
        });
      });
    });
  });

  // 18. Edge cases
  describe('edge cases', () => {
    it('renders with null children', () => {
      render(<Card data-testid="empty-card">{null}</Card>);
      const element = screen.getByTestId('empty-card');
      expect(element).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      render(<Card data-testid="empty-card">{undefined}</Card>);
      const element = screen.getByTestId('empty-card');
      expect(element).toBeInTheDocument();
    });

    it('renders with zero as content', () => {
      render(<Card>{0}</Card>);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders with empty string content', () => {
      render(<Card data-testid="card" />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('renders with long text content', () => {
      const longText =
        'This is a very long text content for the card component that should still render correctly';
      render(<Card>{longText}</Card>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('renders with special characters', () => {
      render(<Card>!@#$%^&*()</Card>);
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    });

    it('renders with unicode characters', () => {
      render(<Card>🎉 ✨ 🚀</Card>);
      expect(screen.getByText('🎉 ✨ 🚀')).toBeInTheDocument();
    });

    it('handles interactive and disabled together', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive disabled onClick={handleClick}>
          Test
        </Card>
      );
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      expect(element).toHaveAttribute('data-interactive', 'true');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(element);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles null header', () => {
      const { container } = render(<Card header={null}>Body</Card>);
      const header = container.querySelector('[class*="cardHeader"]');
      expect(header).not.toBeInTheDocument();
    });

    it('handles null footer', () => {
      const { container } = render(<Card footer={null}>Body</Card>);
      const footer = container.querySelector('[class*="cardFooter"]');
      expect(footer).not.toBeInTheDocument();
    });

    it('handles empty string header', () => {
      const { container } = render(<Card header="">Body</Card>);
      const header = container.querySelector('[class*="cardHeader"]');
      expect(header).not.toBeInTheDocument();
    });

    it('handles empty string footer', () => {
      const { container } = render(<Card footer="">Body</Card>);
      const footer = container.querySelector('[class*="cardFooter"]');
      expect(footer).not.toBeInTheDocument();
    });

    it('handles onClick without interactive prop', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick}>Test</Card>);
      const element = screen.getByText('Test').closest('[data-component="card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 19. Display name
  describe('display name', () => {
    it('has correct display name', () => {
      expect(Card.displayName).toBe('Card');
    });
  });
});
