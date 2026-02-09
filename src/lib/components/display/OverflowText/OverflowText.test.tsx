import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverflowText } from './OverflowText';

describe('OverflowText', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<OverflowText>Test Content</OverflowText>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <OverflowText
          lines={2}
          tooltipPosition="top"
          tooltipDelay={100}
          disableTooltip={false}
          tooltipMaxWidth={400}
          as="p"
          className="custom-class"
          data-testid="test-overflow-text"
        >
          Content
        </OverflowText>
      );

      const element = screen.getByTestId('test-overflow-text');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders text correctly', () => {
      const text = 'This is a test text';
      render(<OverflowText>{text}</OverflowText>);
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('renders as span element by default', () => {
      const { container } = render(<OverflowText>Test</OverflowText>);
      const element = container.querySelector('[data-component="overflow-text"]');
      expect(element?.tagName).toBe('SPAN');
    });

    it('includes data-component attribute', () => {
      render(<OverflowText>Test</OverflowText>);
      const element = screen.getByText('Test').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-component', 'overflow-text');
    });
  });

  // 2. Element type tests
  describe('element type', () => {
    it('renders as span when as is span', () => {
      const { container } = render(<OverflowText as="span">Test</OverflowText>);
      const element = container.querySelector('[data-component="overflow-text"]');
      expect(element?.tagName).toBe('SPAN');
    });

    it('renders as p when as is p', () => {
      const { container } = render(<OverflowText as="p">Test</OverflowText>);
      const element = container.querySelector('[data-component="overflow-text"]');
      expect(element?.tagName).toBe('P');
    });

    it('renders as div when as is div', () => {
      const { container } = render(<OverflowText as="div">Test</OverflowText>);
      const element = container.querySelector('[data-component="overflow-text"]');
      expect(element?.tagName).toBe('DIV');
    });
  });

  // 3. Lines prop tests
  describe('lines', () => {
    it('renders with 1 line by default', () => {
      render(<OverflowText>Test</OverflowText>);
      const element = screen.getByText('Test').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-lines', '1');
    });

    it('renders with 2 lines', () => {
      render(<OverflowText lines={2}>Test</OverflowText>);
      const element = screen.getByText('Test').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-lines', '2');
    });

    it('renders with 3 lines', () => {
      render(<OverflowText lines={3}>Test</OverflowText>);
      const element = screen.getByText('Test').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-lines', '3');
    });

    it('sets CSS variable for lines', () => {
      render(<OverflowText lines={4}>Test</OverflowText>);
      const element = screen
        .getByText('Test')
        .closest('[data-component="overflow-text"]') as HTMLElement;
      expect(element.style.getPropertyValue('--overflow-text-lines')).toBe('4');
    });
  });

  // 4. Tooltip tests
  describe('tooltip', () => {
    it('wraps with tooltip by default', async () => {
      const user = userEvent.setup();
      const longText = 'This is a very long text that should overflow and show tooltip';

      render(<OverflowText tooltipDelay={0}>{longText}</OverflowText>);

      const textElement = screen.getByText(longText);
      await user.hover(textElement);

      await waitFor(() => {
        expect(screen.getAllByText(longText).length).toBeGreaterThan(1);
      });
    });

    it('does not wrap with tooltip when disableTooltip is true', () => {
      render(<OverflowText disableTooltip>Test text</OverflowText>);

      const element = screen.getByText('Test text').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('title', 'Test text');
    });

    it('shows tooltip on hover when enabled', async () => {
      const user = userEvent.setup();
      const text = 'Hover text';

      render(<OverflowText tooltipDelay={0}>{text}</OverflowText>);

      const textElement = screen.getByText(text);
      await user.hover(textElement);

      await waitFor(() => {
        const tooltips = screen.getAllByText(text);
        expect(tooltips.length).toBeGreaterThan(1);
      });
    });

    it('uses custom tooltip content when provided', async () => {
      const user = userEvent.setup();
      const displayText = 'Short';
      const tooltipText = 'This is the full tooltip content';

      render(
        <OverflowText tooltipContent={tooltipText} tooltipDelay={0}>
          {displayText}
        </OverflowText>
      );

      const textElement = screen.getByText(displayText);
      await user.hover(textElement);

      await waitFor(() => {
        expect(screen.getByText(tooltipText)).toBeInTheDocument();
      });
    });

    it('sets title attribute when tooltip is disabled', () => {
      render(<OverflowText disableTooltip>Test text</OverflowText>);

      const element = screen.getByText('Test text').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('title', 'Test text');
    });
  });

  // 5. Tooltip position tests
  describe('tooltip position', () => {
    it('uses bottom position by default', async () => {
      render(<OverflowText tooltipDelay={0}>Test text</OverflowText>);

      // Tooltip component should render with default position
      expect(screen.getByText('Test text')).toBeInTheDocument();
    });

    it('accepts top position', () => {
      render(<OverflowText tooltipPosition="top">Test text</OverflowText>);

      expect(screen.getByText('Test text')).toBeInTheDocument();
    });

    it('accepts bottom position', () => {
      render(<OverflowText tooltipPosition="bottom">Test text</OverflowText>);

      expect(screen.getByText('Test text')).toBeInTheDocument();
    });

    it('accepts left position', () => {
      render(<OverflowText tooltipPosition="left">Test text</OverflowText>);

      expect(screen.getByText('Test text')).toBeInTheDocument();
    });

    it('accepts right position', () => {
      render(<OverflowText tooltipPosition="right">Test text</OverflowText>);

      expect(screen.getByText('Test text')).toBeInTheDocument();
    });
  });

  // 6. Tooltip delay tests
  describe('tooltip delay', () => {
    it('uses 200ms delay by default', () => {
      render(<OverflowText>Test text</OverflowText>);

      expect(screen.getByText('Test text')).toBeInTheDocument();
    });

    it('accepts custom delay', () => {
      render(<OverflowText tooltipDelay={500}>Test text</OverflowText>);

      expect(screen.getByText('Test text')).toBeInTheDocument();
    });

    it('accepts zero delay', async () => {
      const user = userEvent.setup();

      render(<OverflowText tooltipDelay={0}>Test text</OverflowText>);

      const textElement = screen.getByText('Test text');
      await user.hover(textElement);

      await waitFor(() => {
        const elements = screen.getAllByText('Test text');
        expect(elements.length).toBeGreaterThan(1);
      });
    });
  });

  // 7. Tooltip max width tests
  describe('tooltip max width', () => {
    it('uses 300px max width by default', () => {
      render(<OverflowText>Test</OverflowText>);
      const element = screen
        .getByText('Test')
        .closest('[data-component="overflow-text"]') as HTMLElement;
      expect(element.style.getPropertyValue('--overflow-text-tooltip-max-width')).toBe('300px');
    });

    it('accepts custom max width', () => {
      render(<OverflowText tooltipMaxWidth={500}>Test</OverflowText>);
      const element = screen
        .getByText('Test')
        .closest('[data-component="overflow-text"]') as HTMLElement;
      expect(element.style.getPropertyValue('--overflow-text-tooltip-max-width')).toBe('500px');
    });

    it('accepts zero max width', () => {
      render(<OverflowText tooltipMaxWidth={0}>Test</OverflowText>);
      const element = screen
        .getByText('Test')
        .closest('[data-component="overflow-text"]') as HTMLElement;
      expect(element.style.getPropertyValue('--overflow-text-tooltip-max-width')).toBe('0px');
    });
  });

  // 8. Multi-line support tests
  describe('multi-line support', () => {
    it('supports single line truncation', () => {
      const longText =
        'This is a very long text that will be truncated with ellipsis on a single line';
      render(<OverflowText lines={1}>{longText}</OverflowText>);
      const element = screen.getByText(longText).closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-lines', '1');
    });

    it('supports two line truncation', () => {
      const longText =
        'This is a very long text that will be truncated with ellipsis after two lines';
      render(<OverflowText lines={2}>{longText}</OverflowText>);
      const element = screen.getByText(longText).closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-lines', '2');
    });

    it('supports three line truncation', () => {
      const longText =
        'This is a very long text that will be truncated with ellipsis after three lines';
      render(<OverflowText lines={3}>{longText}</OverflowText>);
      const element = screen.getByText(longText).closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-lines', '3');
    });

    it('supports many lines truncation', () => {
      const longText =
        'This is a very long text that will be truncated with ellipsis after many lines';
      render(<OverflowText lines={10}>{longText}</OverflowText>);
      const element = screen.getByText(longText).closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('data-lines', '10');
    });

    it('shows full text in tooltip for multi-line overflow', async () => {
      const user = userEvent.setup();
      const longText =
        'This is a very long text that spans multiple lines and should show in tooltip';

      render(
        <OverflowText lines={2} tooltipDelay={0}>
          {longText}
        </OverflowText>
      );

      const textElement = screen.getByText(longText);
      await user.hover(textElement);

      await waitFor(() => {
        const tooltips = screen.getAllByText(longText);
        expect(tooltips.length).toBeGreaterThan(1);
      });
    });
  });

  // 9. Accessibility tests
  describe('accessibility', () => {
    it('has correct aria-label when provided', () => {
      render(<OverflowText aria-label="Test label">Test</OverflowText>);
      expect(screen.getByLabelText('Test label')).toBeInTheDocument();
    });

    it('uses text content as aria-label by default', () => {
      render(<OverflowText>Test content</OverflowText>);
      const element = screen.getByText('Test content').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('aria-label', 'Test content');
    });

    it('accepts custom aria-label', () => {
      render(<OverflowText aria-label="Custom label">Display text</OverflowText>);
      const element = screen.getByText('Display text').closest('[data-component="overflow-text"]');
      expect(element).toHaveAttribute('aria-label', 'Custom label');
    });

    it('includes data-component attribute', () => {
      render(<OverflowText>Test</OverflowText>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-component', 'overflow-text');
    });
  });

  // 10. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLElement>();
      render(<OverflowText ref={ref}>Test</OverflowText>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('forwards ref to p element', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <OverflowText ref={ref} as="p">
          Test
        </OverflowText>
      );
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <OverflowText ref={ref} as="div">
          Test
        </OverflowText>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(<OverflowText ref={refCallback}>Test</OverflowText>);
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
    });
  });

  // 11. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(<OverflowText className="custom-overflow">Test</OverflowText>);
      const element = screen.getByText('Test');
      expect(element).toHaveClass('custom-overflow');
    });

    it('merges custom className with component classes', () => {
      render(<OverflowText className="custom-overflow">Test</OverflowText>);
      const element = screen.getByText('Test');
      expect(element.className).toContain('custom-overflow');
    });

    it('accepts custom style prop', () => {
      render(<OverflowText style={{ color: 'red' }}>Test</OverflowText>);
      const element = screen.getByText('Test');
      expect(element).toHaveStyle({ color: 'red' });
    });

    it('merges custom style with CSS variables', () => {
      render(
        <OverflowText style={{ color: 'blue' }} lines={2}>
          Test
        </OverflowText>
      );
      const element = screen.getByText('Test') as HTMLElement;
      expect(element).toHaveStyle({ color: 'blue' });
      expect(element.style.getPropertyValue('--overflow-text-lines')).toBe('2');
    });

    it('handles undefined className gracefully', () => {
      render(<OverflowText className={undefined}>Test</OverflowText>);
      const element = screen.getByText('Test');
      expect(element).toBeInTheDocument();
    });
  });

  // 12. Props spreading
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      render(
        <OverflowText data-testid="test-overflow" data-custom="value">
          Test
        </OverflowText>
      );
      const element = screen.getByTestId('test-overflow');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts and applies id attribute', () => {
      render(<OverflowText id="overflow-1">Test</OverflowText>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('id', 'overflow-1');
    });

    it('forwards additional HTML attributes', () => {
      render(
        <OverflowText data-custom="value" id="custom-id">
          Test
        </OverflowText>
      );
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-custom', 'value');
      expect(element).toHaveAttribute('id', 'custom-id');
    });
  });

  // 13. Combined props tests
  describe('combined props', () => {
    it('renders with lines, position, and custom className', () => {
      render(
        <OverflowText lines={3} tooltipPosition="top" className="custom">
          Test
        </OverflowText>
      );
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-lines', '3');
      expect(element).toHaveClass('custom');
    });

    it('renders as div with multiple lines and disabled tooltip', () => {
      render(
        <OverflowText as="div" lines={2} disableTooltip>
          Test
        </OverflowText>
      );
      const element = screen.getByText('Test');
      expect(element.tagName).toBe('DIV');
      expect(element).toHaveAttribute('data-lines', '2');
      expect(element).toHaveAttribute('title', 'Test');
    });

    it('renders with all tooltip customizations', () => {
      render(
        <OverflowText
          tooltipPosition="right"
          tooltipDelay={300}
          tooltipMaxWidth={400}
          tooltipContent="Custom tooltip"
        >
          Test
        </OverflowText>
      );
      const element = screen.getByText('Test');
      expect(element).toBeInTheDocument();
    });

    it('renders multi-line with custom element and tooltip', async () => {
      const user = userEvent.setup();

      render(
        <OverflowText as="p" lines={3} tooltipPosition="top" tooltipDelay={0}>
          Long text content
        </OverflowText>
      );

      const element = screen.getByText('Long text content');
      expect(element.tagName).toBe('P');
      expect(element).toHaveAttribute('data-lines', '3');

      await user.hover(element);
      await waitFor(() => {
        const tooltips = screen.getAllByText('Long text content');
        expect(tooltips.length).toBeGreaterThan(1);
      });
    });
  });

  // 14. Edge cases
  describe('edge cases', () => {
    it('renders with long text content', () => {
      const longText =
        'This is a very long text content that should be truncated with ellipsis when it exceeds the available width or specified number of lines';
      render(<OverflowText>{longText}</OverflowText>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('renders with short text content', () => {
      render(<OverflowText>Hi</OverflowText>);
      expect(screen.getByText('Hi')).toBeInTheDocument();
    });

    it('renders with single character', () => {
      render(<OverflowText>A</OverflowText>);
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('renders with special characters', () => {
      render(<OverflowText>!@#$%^&*()</OverflowText>);
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    });

    it('renders with unicode characters', () => {
      render(<OverflowText>🎉 ✨ 🚀</OverflowText>);
      expect(screen.getByText('🎉 ✨ 🚀')).toBeInTheDocument();
    });

    it('renders with numbers', () => {
      render(<OverflowText>1234567890</OverflowText>);
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });

    it('renders with mixed content', () => {
      const mixedText = 'Text with 123 numbers and 🎉 emoji!';
      render(<OverflowText>{mixedText}</OverflowText>);
      expect(screen.getByText(mixedText)).toBeInTheDocument();
    });

    it('handles disabled tooltip with custom tooltip content', () => {
      render(
        <OverflowText disableTooltip tooltipContent="Should not appear">
          Test
        </OverflowText>
      );
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('title', 'Test');
    });

    it('renders with very large line number', () => {
      render(<OverflowText lines={100}>Test</OverflowText>);
      const element = screen.getByText('Test');
      expect(element).toHaveAttribute('data-lines', '100');
    });

    it('renders with whitespace in text', () => {
      const text = '  Text with   spaces  ';
      render(<OverflowText data-testid="whitespace-test">{text}</OverflowText>);
      const element = screen.getByTestId('whitespace-test');
      expect(element).toBeInTheDocument();
      expect(element.textContent).toBe(text);
    });

    it('renders with line breaks in text', () => {
      const text = 'Line 1\nLine 2\nLine 3';
      render(<OverflowText data-testid="linebreak-test">{text}</OverflowText>);
      const element = screen.getByTestId('linebreak-test');
      expect(element).toBeInTheDocument();
      expect(element.textContent).toBe(text);
    });
  });

  // 15. Truncation behavior tests
  describe('truncation behavior', () => {
    it('applies CSS for single line truncation', () => {
      render(<OverflowText lines={1}>Test text</OverflowText>);
      const element = screen.getByText('Test text') as HTMLElement;
      expect(element.style.getPropertyValue('--overflow-text-lines')).toBe('1');
    });

    it('applies CSS for multi-line truncation', () => {
      render(<OverflowText lines={3}>Test text</OverflowText>);
      const element = screen.getByText('Test text') as HTMLElement;
      expect(element.style.getPropertyValue('--overflow-text-lines')).toBe('3');
    });

    it('displays full text when not overflowing', () => {
      render(<OverflowText>Short</OverflowText>);
      expect(screen.getByText('Short')).toBeInTheDocument();
    });
  });

  // 16. Callback tests
  describe('onOverflowChange callback', () => {
    it('accepts onOverflowChange callback', () => {
      const handleOverflowChange = jest.fn();
      render(<OverflowText onOverflowChange={handleOverflowChange}>Test text</OverflowText>);
      expect(screen.getByText('Test text')).toBeInTheDocument();
    });

    it('does not throw when callback is not provided', () => {
      expect(() => {
        render(<OverflowText>Test text</OverflowText>);
      }).not.toThrow();
    });
  });
});

// 18. Tooltip interaction tests
describe('tooltip interactions', () => {
  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup();
    const text = 'Test text';

    render(<OverflowText tooltipDelay={0}>{text}</OverflowText>);

    const textElement = screen.getByText(text);

    await user.hover(textElement);
    await waitFor(() => {
      const tooltips = screen.getAllByText(text);
      expect(tooltips.length).toBeGreaterThan(1);
    });

    await user.unhover(textElement);

    // After unhover, tooltip should eventually disappear
    await waitFor(
      () => {
        const tooltips = screen.queryAllByText(text);
        expect(tooltips.length).toBeLessThanOrEqual(1);
      },
      { timeout: 500 }
    );
  });

  it('shows tooltip with custom content on hover', async () => {
    const user = userEvent.setup();
    const displayText = 'Short';
    const tooltipText = 'Full description';

    render(
      <OverflowText tooltipContent={tooltipText} tooltipDelay={0}>
        {displayText}
      </OverflowText>
    );

    await user.hover(screen.getByText(displayText));

    await waitFor(() => {
      expect(screen.getByText(tooltipText)).toBeInTheDocument();
    });
  });
});

// 19. CSS variables tests
describe('CSS variables', () => {
  it('sets correct CSS variables', () => {
    render(
      <OverflowText lines={5} tooltipMaxWidth={600}>
        Test
      </OverflowText>
    );
    const element = screen.getByText('Test') as HTMLElement;
    expect(element.style.getPropertyValue('--overflow-text-lines')).toBe('5');
    expect(element.style.getPropertyValue('--overflow-text-tooltip-max-width')).toBe('600px');
  });

  it('merges CSS variables with custom styles', () => {
    render(
      <OverflowText lines={2} tooltipMaxWidth={400} style={{ fontSize: '16px', color: 'red' }}>
        Test
      </OverflowText>
    );
    const element = screen.getByText('Test') as HTMLElement;
    expect(element.style.getPropertyValue('--overflow-text-lines')).toBe('2');
    expect(element.style.getPropertyValue('--overflow-text-tooltip-max-width')).toBe('400px');
    expect(element.style.fontSize).toBe('16px');
    expect(element.style.color).toBe('red');
  });
});
