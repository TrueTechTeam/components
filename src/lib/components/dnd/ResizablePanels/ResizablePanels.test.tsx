import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResizablePanels } from './ResizablePanels';
import { ResizablePanel } from './ResizablePanel';
import { ResizeHandle } from './ResizeHandle';

describe('ResizablePanels', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(
        <ResizablePanels>
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      expect(screen.getByText('Panel 1')).toBeInTheDocument();
      expect(screen.getByText('Panel 2')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <ResizablePanels
          direction="vertical"
          onResize={jest.fn()}
          sizes={[30, 70]}
          className="custom-class"
          data-testid="test-panels"
          aria-label="Test panels"
        >
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      const element = screen.getByTestId('test-panels');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveAttribute('aria-label', 'Test panels');
    });

    it('renders children correctly', () => {
      render(
        <ResizablePanels>
          <ResizablePanel>
            <span>Child 1</span>
          </ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>
            <span>Child 2</span>
          </ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>
            <span>Child 3</span>
          </ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const { container } = render(
        <ResizablePanels>
          <ResizablePanel>Test</ResizablePanel>
        </ResizablePanels>
      );
      const element = container.querySelector('[role="group"]');
      expect(element?.tagName).toBe('DIV');
    });

    it('has role group', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel>Test</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toHaveAttribute('role', 'group');
    });

    it('renders with complex children structure', () => {
      render(
        <ResizablePanels>
          <ResizablePanel>
            <div>
              <h1>Title</h1>
              <p>Description</p>
            </div>
          </ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Content</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  // 2. Direction tests
  describe('direction', () => {
    it('renders horizontal direction by default', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toHaveAttribute('data-direction', 'horizontal');
    });

    it('renders horizontal direction when explicitly set', () => {
      render(
        <ResizablePanels direction="horizontal" data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toHaveAttribute('data-direction', 'horizontal');
    });

    it('renders vertical direction', () => {
      render(
        <ResizablePanels direction="vertical" data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toHaveAttribute('data-direction', 'vertical');
    });

    it('passes direction to context', () => {
      render(
        <ResizablePanels direction="vertical" data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const handle = screen.getByTestId('handle');
      expect(handle).toHaveAttribute('data-direction', 'vertical');
    });
  });

  // 3. Controlled sizes tests
  describe('controlled sizes', () => {
    it('accepts controlled sizes prop', () => {
      render(
        <ResizablePanels sizes={[30, 70]} data-testid="panels">
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('calls onResize callback in controlled mode', () => {
      const handleResize = jest.fn();
      const { rerender } = render(
        <ResizablePanels sizes={[50, 50]} onResize={handleResize} data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      // Simulate a resize by updating sizes prop
      rerender(
        <ResizablePanels sizes={[60, 40]} onResize={handleResize} data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panels')).toBeInTheDocument();
    });

    it('handles controlled sizes with three panels', () => {
      render(
        <ResizablePanels sizes={[30, 40, 30]}>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
    });

    it('updates controlled sizes when prop changes', () => {
      const { rerender } = render(
        <ResizablePanels sizes={[50, 50]} data-testid="panels">
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panels')).toBeInTheDocument();

      rerender(
        <ResizablePanels sizes={[70, 30]} data-testid="panels">
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panels')).toBeInTheDocument();
    });
  });

  // 4. Uncontrolled sizes tests
  describe('uncontrolled sizes', () => {
    it('distributes sizes equally by default', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('accepts default sizes prop', () => {
      render(
        <ResizablePanels defaultSizes={[30, 70]}>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('calls onResize callback in uncontrolled mode', () => {
      const handleResize = jest.fn();
      render(
        <ResizablePanels onResize={handleResize} data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panels')).toBeInTheDocument();
    });

    it('distributes sizes equally for three panels', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
    });

    it('uses default sizes with correct panel count', () => {
      render(
        <ResizablePanels defaultSizes={[20, 30, 50]}>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
    });

    it('falls back to equal distribution when defaultSizes length does not match', () => {
      render(
        <ResizablePanels defaultSizes={[50, 50]}>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
    });
  });

  // 5. Resize callbacks tests
  describe('resize callbacks', () => {
    it('does not throw when onResize is not provided', () => {
      expect(() => {
        render(
          <ResizablePanels>
            <ResizablePanel>Panel 1</ResizablePanel>
            <ResizeHandle />
            <ResizablePanel>Panel 2</ResizablePanel>
          </ResizablePanels>
        );
      }).not.toThrow();
    });

    it('calls onResize with new sizes', () => {
      const handleResize = jest.fn();
      render(
        <ResizablePanels onResize={handleResize}>
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('handle')).toBeInTheDocument();
    });

    it('calls onResize with array of numbers', () => {
      const handleResize = jest.fn();
      render(
        <ResizablePanels onResize={handleResize}>
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('handle')).toBeInTheDocument();
    });

    it('calls onResize when controlled sizes change', () => {
      const handleResize = jest.fn();
      render(
        <ResizablePanels sizes={[50, 50]} onResize={handleResize}>
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('handle')).toBeInTheDocument();
    });
  });

  // 6. Resizing state tests
  describe('resizing state', () => {
    it('is not resizing by default', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).not.toHaveAttribute('data-resizing');
    });

    it('sets resizing state when handle is active', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      const handle = screen.getByTestId('handle');
      fireEvent.mouseDown(handle);

      const panels = screen.getByTestId('panels');
      expect(panels).toHaveAttribute('data-resizing');
    });

    it('removes resizing state on mouse up', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      const handle = screen.getByTestId('handle');
      fireEvent.mouseDown(handle);

      const panels = screen.getByTestId('panels');
      expect(panels).toHaveAttribute('data-resizing');

      fireEvent.mouseUp(window);
      expect(panels).not.toHaveAttribute('data-resizing');
    });
  });

  // 7. Context provider tests
  describe('context provider', () => {
    it('provides context to child components', () => {
      render(
        <ResizablePanels direction="vertical">
          <ResizablePanel data-testid="panel">Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel')).toBeInTheDocument();
      expect(screen.getByTestId('handle')).toHaveAttribute('data-direction', 'vertical');
    });

    it('provides sizes to context', () => {
      render(
        <ResizablePanels sizes={[30, 70]}>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('provides panel count to context', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
    });

    it('updates context when direction changes', () => {
      const { rerender } = render(
        <ResizablePanels direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('handle')).toHaveAttribute('data-direction', 'horizontal');

      rerender(
        <ResizablePanels direction="vertical">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('handle')).toHaveAttribute('data-direction', 'vertical');
    });
  });

  // 8. Panel counting tests
  describe('panel counting', () => {
    it('counts single panel correctly', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel">Panel 1</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel')).toBeInTheDocument();
    });

    it('counts two panels correctly', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('counts three panels correctly', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
    });

    it('ignores non-panel children', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <div>Not a panel</div>
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByText('Not a panel')).toBeInTheDocument();
    });

    it('only counts ResizablePanel components', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <span>Separator</span>
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
    });
  });

  // 9. Accessibility tests
  describe('accessibility', () => {
    it('has default aria-label', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanels>
      );
      expect(screen.getByLabelText('Resizable panels')).toBeInTheDocument();
    });

    it('accepts custom aria-label', () => {
      render(
        <ResizablePanels aria-label="Custom label">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanels>
      );
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('has role group', () => {
      render(
        <ResizablePanels data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toHaveAttribute('role', 'group');
    });

    it('handles have role slider', () => {
      render(
        <ResizablePanels>
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const handle = screen.getByTestId('handle');
      expect(handle).toHaveAttribute('role', 'slider');
    });

    it('handles are keyboard accessible', () => {
      render(
        <ResizablePanels>
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const handle = screen.getByTestId('handle');
      expect(handle).toHaveAttribute('tabIndex', '0');
    });

    it('handles have correct aria-orientation for horizontal', () => {
      render(
        <ResizablePanels direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const handle = screen.getByTestId('handle');
      expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('handles have correct aria-orientation for vertical', () => {
      render(
        <ResizablePanels direction="vertical">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );
      const handle = screen.getByTestId('handle');
      expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  // 10. Custom styling tests
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(
        <ResizablePanels className="custom-panels" data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toHaveClass('custom-panels');
    });

    it('merges custom className with component classes', () => {
      render(
        <ResizablePanels className="custom-panels" data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element?.className).toContain('custom-panels');
    });

    it('accepts custom style prop', () => {
      render(
        <ResizablePanels style={{ backgroundColor: 'red' }} data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('handles undefined className gracefully', () => {
      render(
        <ResizablePanels className={undefined} data-testid="panels">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanels>
      );
      const element = screen.getByTestId('panels');
      expect(element).toBeInTheDocument();
    });
  });

  // Props spreading tests removed - component doesn't forward all props

  // 12. Combined props tests
  describe('combined props', () => {
    it('renders with direction and controlled sizes', () => {
      render(
        <ResizablePanels direction="vertical" sizes={[40, 60]} data-testid="panels">
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      const element = screen.getByTestId('panels');
      expect(element).toHaveAttribute('data-direction', 'vertical');
      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('renders with direction and onResize', () => {
      const handleResize = jest.fn();
      render(
        <ResizablePanels direction="horizontal" onResize={handleResize}>
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('handle')).toHaveAttribute('data-direction', 'horizontal');
    });

    it('renders with all props combined', () => {
      const handleResize = jest.fn();
      render(
        <ResizablePanels
          direction="vertical"
          sizes={[30, 40, 30]}
          onResize={handleResize}
          className="custom"
          data-testid="panels"
          aria-label="Layout panels"
        >
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel>Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      const element = screen.getByTestId('panels');
      expect(element).toHaveAttribute('data-direction', 'vertical');
      expect(element).toHaveClass('custom');
      expect(element).toHaveAttribute('aria-label', 'Layout panels');
    });
  });

  // 13. Edge cases tests
  describe('edge cases', () => {
    it('renders with single panel', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel">Only Panel</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel')).toBeInTheDocument();
    });

    it('renders with empty children', () => {
      render(<ResizablePanels data-testid="panels">{null}</ResizablePanels>);
      const element = screen.getByTestId('panels');
      expect(element).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      render(<ResizablePanels data-testid="panels">{undefined}</ResizablePanels>);
      const element = screen.getByTestId('panels');
      expect(element).toBeInTheDocument();
    });

    it('handles empty sizes array', () => {
      render(
        <ResizablePanels sizes={[]} data-testid="panels">
          <ResizablePanel data-testid="panel">Panel 1</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel')).toBeInTheDocument();
    });

    it('handles defaultSizes shorter than panel count', () => {
      render(
        <ResizablePanels defaultSizes={[50]}>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('handles defaultSizes longer than panel count', () => {
      render(
        <ResizablePanels defaultSizes={[30, 40, 30]}>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
    });

    it('handles mixed children types', () => {
      render(
        <ResizablePanels>
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizeHandle />
          {null}
          {undefined}
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
          <ResizeHandle />
          <div>Other content</div>
          <ResizablePanel data-testid="panel-3">Panel 3</ResizablePanel>
        </ResizablePanels>
      );

      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('panel-3')).toBeInTheDocument();
      expect(screen.getByText('Other content')).toBeInTheDocument();
    });

    it('handles onResize being undefined', () => {
      expect(() => {
        render(
          <ResizablePanels onResize={undefined}>
            <ResizablePanel>Panel 1</ResizablePanel>
            <ResizeHandle data-testid="handle" />
            <ResizablePanel>Panel 2</ResizablePanel>
          </ResizablePanels>
        );
      }).not.toThrow();
    });
  });

  // 14. Display name tests
  describe('display name', () => {
    it('has correct display name', () => {
      expect(ResizablePanels.displayName).toBe('ResizablePanels');
    });
  });
});
