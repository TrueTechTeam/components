import { render, screen, act } from '@testing-library/react';
import { Collapse } from './Collapse';

describe('Collapse', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(
        <Collapse isOpen>
          <div>Content</div>
        </Collapse>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render children when open', () => {
      render(
        <Collapse isOpen>
          <div data-testid="child">Child content</div>
        </Collapse>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render children when closed (but hidden)', () => {
      render(
        <Collapse isOpen={false}>
          <div data-testid="child">Child content</div>
        </Collapse>
      );
      // Content is still in DOM but visually hidden via CSS
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should apply data-component attribute', () => {
      const { container } = render(
        <Collapse isOpen>
          <div>Content</div>
        </Collapse>
      );
      expect(container.querySelector('[data-component="collapse"]')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Collapse isOpen className="custom-class">
          <div>Content</div>
        </Collapse>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply data-testid', () => {
      render(
        <Collapse isOpen data-testid="custom-collapse">
          <div>Content</div>
        </Collapse>
      );
      expect(screen.getByTestId('custom-collapse')).toBeInTheDocument();
    });
  });

  describe('Open/Close State', () => {
    it('should have data-open attribute when open', () => {
      const { container } = render(
        <Collapse isOpen>
          <div>Content</div>
        </Collapse>
      );
      expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
    });

    it('should not have data-open attribute when closed', () => {
      const { container } = render(
        <Collapse isOpen={false}>
          <div>Content</div>
        </Collapse>
      );
      expect(container.querySelector('[data-open="true"]')).not.toBeInTheDocument();
    });

    it('should have aria-hidden true when closed', () => {
      const { container } = render(
        <Collapse isOpen={false}>
          <div>Content</div>
        </Collapse>
      );
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden false when open', () => {
      const { container } = render(
        <Collapse isOpen>
          <div>Content</div>
        </Collapse>
      );
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Animation Duration and Easing', () => {
    it('should apply default duration CSS variable', () => {
      const { container } = render(
        <Collapse isOpen>
          <div>Content</div>
        </Collapse>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.getPropertyValue('--collapse-duration')).toBe('250ms');
    });

    it('should apply custom duration CSS variable', () => {
      const { container } = render(
        <Collapse isOpen duration={500}>
          <div>Content</div>
        </Collapse>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.getPropertyValue('--collapse-duration')).toBe('500ms');
    });

    it('should apply default easing CSS variable', () => {
      const { container } = render(
        <Collapse isOpen>
          <div>Content</div>
        </Collapse>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.getPropertyValue('--collapse-easing')).toBe('ease-in-out');
    });

    it('should apply custom easing CSS variable', () => {
      const { container } = render(
        <Collapse isOpen easing="linear">
          <div>Content</div>
        </Collapse>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.getPropertyValue('--collapse-easing')).toBe('linear');
    });

    it('should apply custom cubic-bezier easing', () => {
      const { container } = render(
        <Collapse isOpen easing="cubic-bezier(0.4, 0, 0.2, 1)">
          <div>Content</div>
        </Collapse>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.getPropertyValue('--collapse-easing')).toBe(
        'cubic-bezier(0.4, 0, 0.2, 1)'
      );
    });
  });

  describe('Animation Callbacks', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call onExpandStart when opening', () => {
      const onExpandStart = jest.fn();
      const { rerender } = render(
        <Collapse isOpen={false} onExpandStart={onExpandStart}>
          <div>Content</div>
        </Collapse>
      );

      rerender(
        <Collapse isOpen onExpandStart={onExpandStart}>
          <div>Content</div>
        </Collapse>
      );

      expect(onExpandStart).toHaveBeenCalledTimes(1);
    });

    it('should call onExpandEnd after duration when opening', async () => {
      const onExpandEnd = jest.fn();
      const duration = 250;

      const { rerender } = render(
        <Collapse isOpen={false} onExpandEnd={onExpandEnd} duration={duration}>
          <div>Content</div>
        </Collapse>
      );

      rerender(
        <Collapse isOpen onExpandEnd={onExpandEnd} duration={duration}>
          <div>Content</div>
        </Collapse>
      );

      expect(onExpandEnd).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(duration);
      });

      expect(onExpandEnd).toHaveBeenCalledTimes(1);
    });

    it('should call onCollapseStart when closing', () => {
      const onCollapseStart = jest.fn();
      const { rerender } = render(
        <Collapse isOpen onCollapseStart={onCollapseStart}>
          <div>Content</div>
        </Collapse>
      );

      rerender(
        <Collapse isOpen={false} onCollapseStart={onCollapseStart}>
          <div>Content</div>
        </Collapse>
      );

      expect(onCollapseStart).toHaveBeenCalledTimes(1);
    });

    it('should call onCollapseEnd after duration when closing', async () => {
      const onCollapseEnd = jest.fn();
      const duration = 250;

      const { rerender } = render(
        <Collapse isOpen onCollapseEnd={onCollapseEnd} duration={duration}>
          <div>Content</div>
        </Collapse>
      );

      rerender(
        <Collapse isOpen={false} onCollapseEnd={onCollapseEnd} duration={duration}>
          <div>Content</div>
        </Collapse>
      );

      expect(onCollapseEnd).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(duration);
      });

      expect(onCollapseEnd).toHaveBeenCalledTimes(1);
    });

    it('should not call callbacks on initial render', () => {
      const onExpandStart = jest.fn();
      const onExpandEnd = jest.fn();

      render(
        <Collapse isOpen onExpandStart={onExpandStart} onExpandEnd={onExpandEnd}>
          <div>Content</div>
        </Collapse>
      );

      expect(onExpandStart).not.toHaveBeenCalled();
      expect(onExpandEnd).not.toHaveBeenCalled();
    });
  });

  describe('Unmount on Collapse', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should unmount children when unmountOnCollapse is true and collapsed', async () => {
      const { rerender } = render(
        <Collapse isOpen unmountOnCollapse>
          <div data-testid="child">Content</div>
        </Collapse>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();

      rerender(
        <Collapse isOpen={false} unmountOnCollapse>
          <div data-testid="child">Content</div>
        </Collapse>
      );

      // Wait for animation to complete
      act(() => {
        jest.advanceTimersByTime(250);
      });

      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    });

    it('should remount children when opening after unmount', async () => {
      const { rerender } = render(
        <Collapse isOpen={false} unmountOnCollapse>
          <div data-testid="child">Content</div>
        </Collapse>
      );

      // Initially closed and unmountOnCollapse, so content should not be rendered
      // Actually, on initial render with isOpen=false and unmountOnCollapse, it should render
      // but then shouldRender state is false initially when isOpen is false

      rerender(
        <Collapse isOpen unmountOnCollapse>
          <div data-testid="child">Content</div>
        </Collapse>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should keep children when unmountOnCollapse is false', () => {
      const { rerender } = render(
        <Collapse isOpen unmountOnCollapse={false}>
          <div data-testid="child">Content</div>
        </Collapse>
      );

      rerender(
        <Collapse isOpen={false} unmountOnCollapse={false}>
          <div data-testid="child">Content</div>
        </Collapse>
      );

      // Content should still be in DOM
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom style prop', () => {
      const { container } = render(
        <Collapse isOpen style={{ backgroundColor: 'red' }}>
          <div>Content</div>
        </Collapse>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.backgroundColor).toBe('red');
    });

    it('should merge custom style with CSS variables', () => {
      const { container } = render(
        <Collapse isOpen duration={300} style={{ backgroundColor: 'blue' }}>
          <div>Content</div>
        </Collapse>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.backgroundColor).toBe('blue');
      expect(element.style.getPropertyValue('--collapse-duration')).toBe('300ms');
    });
  });

  describe('Aria Label', () => {
    it('should apply aria-label when provided', () => {
      const { container } = render(
        <Collapse isOpen aria-label="Collapsible section">
          <div>Content</div>
        </Collapse>
      );
      expect(container.firstChild).toHaveAttribute('aria-label', 'Collapsible section');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to the root element', () => {
      const ref = { current: null };
      render(
        <Collapse isOpen ref={ref}>
          <div>Content</div>
        </Collapse>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
