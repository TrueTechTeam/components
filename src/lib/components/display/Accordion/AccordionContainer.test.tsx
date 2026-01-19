import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionContainer } from './AccordionContainer';
import { Accordion } from './Accordion';

// Helper to count open accordions (only count accordion components, not collapse)
const getOpenAccordionCount = (container: HTMLElement) => {
  return container.querySelectorAll('[data-component="accordion"][data-open="true"]').length;
};

describe('AccordionContainer', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(
        <AccordionContainer>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    it('should render multiple accordions', () => {
      render(
        <AccordionContainer>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
          <Accordion id="acc3" header="Section 3">
            Content 3
          </Accordion>
        </AccordionContainer>
      );
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Section 3')).toBeInTheDocument();
    });

    it('should apply data-component attribute', () => {
      const { container } = render(
        <AccordionContainer>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );
      expect(container.querySelector('[data-component="accordion-container"]')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <AccordionContainer className="custom-class">
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply data-testid', () => {
      render(
        <AccordionContainer data-testid="custom-container">
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );
      expect(screen.getByTestId('custom-container')).toBeInTheDocument();
    });
  });

  describe('Multiple Mode (Default)', () => {
    it('should allow multiple accordions to be open', () => {
      const { container } = render(
        <AccordionContainer mode="multiple">
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      const buttons = screen.getAllByRole('button', { name: /Section/ });

      // Open first accordion
      fireEvent.click(buttons[0]);
      expect(getOpenAccordionCount(container)).toBe(1);

      // Open second accordion
      fireEvent.click(buttons[1]);
      expect(getOpenAccordionCount(container)).toBe(2);
    });
  });

  describe('Single Mode', () => {
    it('should only allow one accordion to be open at a time', () => {
      const { container } = render(
        <AccordionContainer mode="single">
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      const buttons = screen.getAllByRole('button', { name: /Section/ });

      // Open first accordion
      fireEvent.click(buttons[0]);
      expect(getOpenAccordionCount(container)).toBe(1);

      // Open second accordion - should close first
      fireEvent.click(buttons[1]);
      expect(getOpenAccordionCount(container)).toBe(1);

      // Verify it's the second one that's open
      const openAccordion = container.querySelector('[data-component="accordion"][data-open="true"]');
      expect(openAccordion).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('should respect expandedIds prop', () => {
      const { container } = render(
        <AccordionContainer expandedIds={['acc1', 'acc2']}>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
          <Accordion id="acc3" header="Section 3">
            Content 3
          </Accordion>
        </AccordionContainer>
      );

      expect(getOpenAccordionCount(container)).toBe(2);
    });

    it('should call onExpandedChange when accordion is toggled', () => {
      const handleExpandedChange = jest.fn();
      render(
        <AccordionContainer expandedIds={[]} onExpandedChange={handleExpandedChange}>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleExpandedChange).toHaveBeenCalledWith(['acc1']);
    });
  });

  describe('Uncontrolled Mode', () => {
    it('should use defaultExpandedIds', () => {
      const { container } = render(
        <AccordionContainer defaultExpandedIds={['acc2']}>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      expect(getOpenAccordionCount(container)).toBe(1);
    });

    it('should update state internally when uncontrolled', () => {
      const { container } = render(
        <AccordionContainer>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(container.querySelector('[data-component="accordion"][data-open="true"]')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button'));
      expect(container.querySelector('[data-component="accordion"][data-open="true"]')).toBeInTheDocument();
    });
  });

  describe('Expand All / Collapse All Controls', () => {
    it('should not show controls by default', () => {
      render(
        <AccordionContainer>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(screen.queryByText('Expand All')).not.toBeInTheDocument();
      expect(screen.queryByText('Collapse All')).not.toBeInTheDocument();
    });

    it('should show controls when showExpandAllControls is true', () => {
      render(
        <AccordionContainer showExpandAllControls>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(screen.getByText('Expand All')).toBeInTheDocument();
      expect(screen.getByText('Collapse All')).toBeInTheDocument();
    });

    it('should not show controls in single mode', () => {
      render(
        <AccordionContainer showExpandAllControls mode="single">
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(screen.queryByText('Expand All')).not.toBeInTheDocument();
      expect(screen.queryByText('Collapse All')).not.toBeInTheDocument();
    });

    it('should expand all accordions when Expand All is clicked', () => {
      const { container } = render(
        <AccordionContainer showExpandAllControls>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      fireEvent.click(screen.getByText('Expand All'));
      expect(getOpenAccordionCount(container)).toBe(2);
    });

    it('should collapse all accordions when Collapse All is clicked', () => {
      const { container } = render(
        <AccordionContainer showExpandAllControls defaultExpandedIds={['acc1', 'acc2']}>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      expect(getOpenAccordionCount(container)).toBe(2);

      fireEvent.click(screen.getByText('Collapse All'));
      expect(getOpenAccordionCount(container)).toBe(0);
    });

    it('should disable Expand All when all are expanded', () => {
      render(
        <AccordionContainer showExpandAllControls defaultExpandedIds={['acc1', 'acc2']}>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      expect(screen.getByText('Expand All')).toBeDisabled();
    });

    it('should disable Collapse All when all are collapsed', () => {
      render(
        <AccordionContainer showExpandAllControls>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      expect(screen.getByText('Collapse All')).toBeDisabled();
    });

    it('should use custom labels', () => {
      render(
        <AccordionContainer
          showExpandAllControls
          expandAllLabel="Open All"
          collapseAllLabel="Close All"
        >
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(screen.getByText('Open All')).toBeInTheDocument();
      expect(screen.getByText('Close All')).toBeInTheDocument();
    });
  });

  describe('Controls Position', () => {
    it('should position controls top-right by default', () => {
      const { container } = render(
        <AccordionContainer showExpandAllControls>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      const controls = container.querySelector('[data-position="top-right"]');
      expect(controls).toBeInTheDocument();
    });

    it('should position controls based on controlsPosition prop', () => {
      const { container } = render(
        <AccordionContainer showExpandAllControls controlsPosition="bottom-left">
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      const controls = container.querySelector('[data-position="bottom-left"]');
      expect(controls).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable all accordions when container is disabled', () => {
      const { container } = render(
        <AccordionContainer disabled>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="acc2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      );

      const buttons = screen.getAllByRole('button', { name: /Section/ });
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });

      // Verify disabled data attribute on accordion components
      expect(container.querySelectorAll('[data-component="accordion"][data-disabled="true"]').length).toBe(2);
    });

    it('should disable expand/collapse all buttons when container is disabled', () => {
      render(
        <AccordionContainer showExpandAllControls disabled>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(screen.getByText('Expand All')).toBeDisabled();
      expect(screen.getByText('Collapse All')).toBeDisabled();
    });
  });

  describe('Size Prop', () => {
    it('should pass size to child accordions', () => {
      const { container } = render(
        <AccordionContainer size="lg">
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
    });
  });

  describe('Bordered Prop', () => {
    it('should pass bordered to child accordions', () => {
      const { container } = render(
        <AccordionContainer bordered={false}>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      expect(container.querySelector('[data-component="accordion"][data-bordered="true"]')).not.toBeInTheDocument();
    });
  });

  describe('Gap Prop', () => {
    it('should apply gap CSS variable', () => {
      const { container } = render(
        <AccordionContainer gap={16}>
          <Accordion id="acc1" header="Section 1">
            Content 1
          </Accordion>
        </AccordionContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.getPropertyValue('--accordion-container-gap')).toBe('16px');
    });
  });

  describe('Auto-generated IDs', () => {
    it('should generate IDs for accordions without explicit IDs', () => {
      render(
        <AccordionContainer>
          <Accordion header="Section 1">Content 1</Accordion>
          <Accordion header="Section 2">Content 2</Accordion>
        </AccordionContainer>
      );

      // Should still work without explicit IDs
      const buttons = screen.getAllByRole('button', { name: /Section/ });
      expect(buttons.length).toBe(2);
    });
  });
});
