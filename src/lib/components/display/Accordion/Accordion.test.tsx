import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';
import { AccordionContext, type AccordionContextValue } from './AccordionContext';

describe('Accordion', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(
        <Accordion header="Test Header">
          <p>Test content</p>
        </Accordion>
      );
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    it('should render header content', () => {
      render(
        <Accordion header="My Accordion Header">
          <p>Content</p>
        </Accordion>
      );
      expect(screen.getByText('My Accordion Header')).toBeInTheDocument();
    });

    it('should render header as ReactNode', () => {
      render(
        <Accordion
          header={
            <span data-testid="custom-header">
              <strong>Bold Header</strong>
            </span>
          }
        >
          <p>Content</p>
        </Accordion>
      );
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.getByText('Bold Header')).toBeInTheDocument();
    });

    it('should render body content when open', () => {
      render(
        <Accordion header="Header" defaultOpen>
          <p data-testid="body-content">Body content</p>
        </Accordion>
      );
      expect(screen.getByTestId('body-content')).toBeInTheDocument();
    });

    it('should apply data-component attribute', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-component="accordion"]')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Accordion header="Header" className="custom-class">
          <p>Content</p>
        </Accordion>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply data-testid', () => {
      render(
        <Accordion header="Header" data-testid="custom-accordion">
          <p>Content</p>
        </Accordion>
      );
      expect(screen.getByTestId('custom-accordion')).toBeInTheDocument();
    });
  });

  describe('Open/Close State', () => {
    it('should be closed by default', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-open="true"]')).not.toBeInTheDocument();
    });

    it('should be open when defaultOpen is true', () => {
      const { container } = render(
        <Accordion header="Header" defaultOpen>
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });

    it('should toggle open state when header is clicked', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );

      const header = screen.getByRole('button');
      expect(container.querySelector('[data-open="true"]')).not.toBeInTheDocument();

      fireEvent.click(header);
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();

      fireEvent.click(header);
      expect(container.querySelector('[data-open="true"]')).not.toBeInTheDocument();
    });

    it('should toggle on Enter key', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );

      const header = screen.getByRole('button');
      fireEvent.keyDown(header, { key: 'Enter' });
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });

    it('should toggle on Space key', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );

      const header = screen.getByRole('button');
      fireEvent.keyDown(header, { key: ' ' });
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });
  });

  describe('Controlled Component', () => {
    it('should respect isOpen prop', () => {
      const { container } = render(
        <Accordion header="Header" isOpen>
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });

    it('should call onOpenChange when toggled', () => {
      const handleOpenChange = jest.fn();
      render(
        <Accordion header="Header" isOpen={false} onOpenChange={handleOpenChange}>
          <p>Content</p>
        </Accordion>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('should not update internal state when controlled', () => {
      const { container } = render(
        <Accordion header="Header" isOpen={false} onOpenChange={() => {}}>
          <p>Content</p>
        </Accordion>
      );

      fireEvent.click(screen.getByRole('button'));
      // Should still be closed because parent controls state
      expect(container.querySelector('[data-open="true"]')).not.toBeInTheDocument();
    });
  });

  describe('Uncontrolled Component', () => {
    it('should use defaultOpen for initial state', () => {
      const { container } = render(
        <Accordion header="Header" defaultOpen>
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });

    it('should update state internally when uncontrolled', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });

    it('should call onOpenChange in uncontrolled mode', () => {
      const handleOpenChange = jest.fn();
      render(
        <Accordion header="Header" onOpenChange={handleOpenChange}>
          <p>Content</p>
        </Accordion>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Disabled State', () => {
    it('should not toggle when disabled', () => {
      const handleOpenChange = jest.fn();
      const { container } = render(
        <Accordion header="Header" disabled onOpenChange={handleOpenChange}>
          <p>Content</p>
        </Accordion>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleOpenChange).not.toHaveBeenCalled();
      expect(container.querySelector('[data-open="true"]')).not.toBeInTheDocument();
    });

    it('should apply disabled data attribute', () => {
      const { container } = render(
        <Accordion header="Header" disabled>
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-disabled="true"]')).toBeInTheDocument();
    });

    it('should disable the header button', () => {
      render(
        <Accordion header="Header" disabled>
          <p>Content</p>
        </Accordion>
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Icon Position', () => {
    it('should have icon on right by default', () => {
      render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );
      const header = screen.getByRole('button');
      expect(header).toHaveAttribute('data-icon-position', 'right');
    });

    it('should have icon on left when specified', () => {
      render(
        <Accordion header="Header" iconPosition="left">
          <p>Content</p>
        </Accordion>
      );
      const header = screen.getByRole('button');
      expect(header).toHaveAttribute('data-icon-position', 'left');
    });
  });

  describe('Size Variants', () => {
    it('should apply sm size', () => {
      const { container } = render(
        <Accordion header="Header" size="sm">
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-size="sm"]')).toBeInTheDocument();
    });

    it('should apply md size by default', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-size="md"]')).toBeInTheDocument();
    });

    it('should apply lg size', () => {
      const { container } = render(
        <Accordion header="Header" size="lg">
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
    });
  });

  describe('Bordered', () => {
    it('should be bordered by default', () => {
      const { container } = render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-bordered="true"]')).toBeInTheDocument();
    });

    it('should not be bordered when bordered is false', () => {
      const { container } = render(
        <Accordion header="Header" bordered={false}>
          <p>Content</p>
        </Accordion>
      );
      expect(container.querySelector('[data-bordered="true"]')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-expanded attribute', () => {
      render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );
      const header = screen.getByRole('button');
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when opened', () => {
      render(
        <Accordion header="Header">
          <p>Content</p>
        </Accordion>
      );
      const header = screen.getByRole('button');

      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-controls linking header to panel', () => {
      render(
        <Accordion header="Header" id="test-accordion">
          <p>Content</p>
        </Accordion>
      );
      const header = screen.getByRole('button');
      expect(header).toHaveAttribute('aria-controls', 'accordion-panel-test-accordion');
    });

    it('should have role="region" on the panel', () => {
      render(
        <Accordion header="Header" defaultOpen>
          <p>Content</p>
        </Accordion>
      );
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should have aria-labelledby on the panel', () => {
      render(
        <Accordion header="Header" id="test-accordion" defaultOpen>
          <p>Content</p>
        </Accordion>
      );
      const panel = screen.getByRole('region');
      expect(panel).toHaveAttribute('aria-labelledby', 'accordion-header-test-accordion');
    });

    it('should apply aria-label when provided', () => {
      render(
        <Accordion header="Header" aria-label="Custom label">
          <p>Content</p>
        </Accordion>
      );
      const header = screen.getByRole('button');
      expect(header).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should have aria-disabled when disabled', () => {
      render(
        <Accordion header="Header" disabled>
          <p>Content</p>
        </Accordion>
      );
      const header = screen.getByRole('button');
      expect(header).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Header Click Callback', () => {
    it('should call onHeaderClick when header is clicked', () => {
      const handleHeaderClick = jest.fn();
      render(
        <Accordion header="Header" onHeaderClick={handleHeaderClick}>
          <p>Content</p>
        </Accordion>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleHeaderClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onHeaderClick when disabled', () => {
      const handleHeaderClick = jest.fn();
      render(
        <Accordion header="Header" disabled onHeaderClick={handleHeaderClick}>
          <p>Content</p>
        </Accordion>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleHeaderClick).not.toHaveBeenCalled();
    });
  });

  describe('Context Integration', () => {
    const createMockContext = (overrides: Partial<AccordionContextValue> = {}): AccordionContextValue => ({
      expandedIds: new Set<string>(),
      toggleAccordion: jest.fn(),
      mode: 'multiple',
      disabled: false,
      size: 'md',
      bordered: true,
      ...overrides,
    });

    it('should use context expandedIds for open state', () => {
      const context = createMockContext({ expandedIds: new Set(['test-id']) });

      const { container } = render(
        <AccordionContext.Provider value={context}>
          <Accordion header="Header" id="test-id">
            <p>Content</p>
          </Accordion>
        </AccordionContext.Provider>
      );

      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });

    it('should call context toggleAccordion when clicked', () => {
      const toggleAccordion = jest.fn();
      const context = createMockContext({ toggleAccordion });

      render(
        <AccordionContext.Provider value={context}>
          <Accordion header="Header" id="test-id">
            <p>Content</p>
          </Accordion>
        </AccordionContext.Provider>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(toggleAccordion).toHaveBeenCalledWith('test-id');
    });

    it('should use context disabled state', () => {
      const toggleAccordion = jest.fn();
      const context = createMockContext({ disabled: true, toggleAccordion });

      const { container } = render(
        <AccordionContext.Provider value={context}>
          <Accordion header="Header" id="test-id">
            <p>Content</p>
          </Accordion>
        </AccordionContext.Provider>
      );

      expect(container.querySelector('[data-disabled="true"]')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button'));
      expect(toggleAccordion).not.toHaveBeenCalled();
    });

    it('should use context size when not explicitly set', () => {
      const context = createMockContext({ size: 'lg' });

      const { container } = render(
        <AccordionContext.Provider value={context}>
          <Accordion header="Header">
            <p>Content</p>
          </Accordion>
        </AccordionContext.Provider>
      );

      expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
    });

    it('should use context bordered when not explicitly set', () => {
      const context = createMockContext({ bordered: false });

      const { container } = render(
        <AccordionContext.Provider value={context}>
          <Accordion header="Header">
            <p>Content</p>
          </Accordion>
        </AccordionContext.Provider>
      );

      expect(container.querySelector('[data-bordered="true"]')).not.toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to the root element', () => {
      const ref = { current: null };
      render(
        <Accordion header="Header" ref={ref}>
          <p>Content</p>
        </Accordion>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
