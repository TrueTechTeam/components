import { render, screen, fireEvent } from '@testing-library/react';
import { Popover } from './Popover';

describe('Popover', () => {
  describe('rendering', () => {
    it('should not render popover when closed', () => {
      render(
        <Popover trigger={<button>Trigger</button>} isOpen={false}>
          Popover Content
        </Popover>
      );

      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
    });

    it('should render popover when open', () => {
      render(
        <Popover trigger={<button>Trigger</button>} isOpen>
          Popover Content
        </Popover>
      );

      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });

    it('should render trigger element', () => {
      render(
        <Popover trigger={<button>Trigger</button>} isOpen={false}>
          Popover Content
        </Popover>
      );

      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('should render with data-testid', () => {
      render(
        <Popover
          trigger={<button>Trigger</button>}
          isOpen
          data-testid="custom-popover"
        >
          Popover Content
        </Popover>
      );

      expect(screen.getByTestId('custom-popover')).toBeInTheDocument();
    });
  });

  describe('controlled mode', () => {
    it('should respect controlled isOpen prop', () => {
      const { rerender } = render(
        <Popover trigger={<button>Trigger</button>} isOpen={false}>
          Popover Content
        </Popover>
      );

      expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();

      rerender(
        <Popover trigger={<button>Trigger</button>} isOpen>
          Popover Content
        </Popover>
      );

      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });

    it('should call onOpenChange when state changes', () => {
      const onOpenChange = jest.fn();

      render(
        <Popover
          trigger={<button>Trigger</button>}
          isOpen
          onOpenChange={onOpenChange}
          closeOnClickOutside
        >
          Popover Content
        </Popover>
      );

      // Click outside to trigger close
      fireEvent.mouseDown(document.body);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('uncontrolled mode', () => {
    it('should use defaultOpen', () => {
      render(
        <Popover trigger={<button>Trigger</button>} defaultOpen>
          Popover Content
        </Popover>
      );

      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  describe('positions', () => {
    it.each([
      'top',
      'top-left',
      'top-right',
      'bottom',
      'bottom-left',
      'bottom-right',
      'left',
      'right',
    ] as const)('should apply %s position', (position) => {
      render(
        <Popover
          trigger={<button>Trigger</button>}
          isOpen
          position={position}
        >
          Popover Content
        </Popover>
      );

      const popover = screen.getByTestId('popover');
      expect(popover).toHaveAttribute('data-position', position);
    });
  });

  describe('interactions', () => {
    it('should close on click outside when closeOnClickOutside is true', () => {
      const onOpenChange = jest.fn();

      render(
        <Popover
          trigger={<button>Trigger</button>}
          isOpen
          onOpenChange={onOpenChange}
          closeOnClickOutside
        >
          Popover Content
        </Popover>
      );

      fireEvent.mouseDown(document.body);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not close on click outside when closeOnClickOutside is false', () => {
      const onOpenChange = jest.fn();

      render(
        <Popover
          trigger={<button>Trigger</button>}
          isOpen
          onOpenChange={onOpenChange}
          closeOnClickOutside={false}
        >
          Popover Content
        </Popover>
      );

      fireEvent.mouseDown(document.body);

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should close on Escape key when closeOnEscape is true', () => {
      const onOpenChange = jest.fn();

      render(
        <Popover
          trigger={<button>Trigger</button>}
          isOpen
          onOpenChange={onOpenChange}
          closeOnEscape
        >
          Popover Content
        </Popover>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onClose when closing', () => {
      const onClose = jest.fn();

      render(
        <Popover
          trigger={<button>Trigger</button>}
          isOpen
          onClose={onClose}
          closeOnClickOutside
        >
          Popover Content
        </Popover>
      );

      fireEvent.mouseDown(document.body);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('trigger', () => {
    it('should support ReactNode trigger', () => {
      render(
        <Popover trigger={<button>Click Me</button>} isOpen>
          Popover Content
        </Popover>
      );

      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should support render prop trigger', () => {
      render(
        <Popover
          trigger={({ ref }) => <button ref={ref}>Render Prop</button>}
          isOpen
        >
          Popover Content
        </Popover>
      );

      expect(screen.getByText('Render Prop')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have data-component attribute', () => {
      render(
        <Popover trigger={<button>Trigger</button>} isOpen>
          Popover Content
        </Popover>
      );

      const popover = screen.getByTestId('popover');
      expect(popover).toHaveAttribute('data-component', 'popover');
    });

    it('should have data-state attribute', () => {
      render(
        <Popover trigger={<button>Trigger</button>} isOpen>
          Popover Content
        </Popover>
      );

      const popover = screen.getByTestId('popover');
      expect(popover).toHaveAttribute('data-state', 'open');
    });
  });
});
