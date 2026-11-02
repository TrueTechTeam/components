import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from './Dialog';
import React from 'react';
import { LabelsProvider } from '../../../contexts/LabelsContext';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';

describe('Dialog', () => {
  it('should not render when closed', () => {
    render(<Dialog isOpen={false} title="Dialog Title" />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(<Dialog isOpen title="Dialog Title" />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should render title in header', () => {
    render(<Dialog isOpen title="Dialog Title" />);
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  it('should render children in body', () => {
    render(<Dialog isOpen>Dialog Content</Dialog>);
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('should render actions in footer', () => {
    render(<Dialog isOpen actions={<button>Action</button>} />);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Dialog isOpen title="Dialog" onClose={onClose} />);
    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when clicking backdrop', () => {
    const onClose = jest.fn();
    render(<Dialog isOpen title="Dialog" onClose={onClose} />);
    fireEvent.mouseDown(screen.getByTestId('dialog').parentElement!);
    fireEvent.click(screen.getByTestId('dialog').parentElement!);
    expect(onClose).toHaveBeenCalled();
  });

  it('should not close on backdrop click if closeOnBackdropClick is false', () => {
    const onClose = jest.fn();
    render(<Dialog isOpen title="Dialog" onClose={onClose} closeOnBackdropClick={false} />);
    fireEvent.click(screen.getByTestId('dialog').parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = jest.fn();
    render(<Dialog isOpen title="Dialog" onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('should not close on Escape if closeOnEscape is false', () => {
    const onClose = jest.fn();
    render(<Dialog isOpen title="Dialog" onClose={onClose} closeOnEscape={false} />);
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render with custom size', () => {
    render(<Dialog isOpen size="lg" title="Dialog" />);
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-size', 'lg');
  });

  it('should render with custom className', () => {
    render(<Dialog isOpen className="custom-dialog" title="Dialog" />);
    expect(screen.getByTestId('dialog')).toHaveClass('custom-dialog');
  });

  it('should render with custom data-testid', () => {
    render(<Dialog isOpen data-testid="custom-dialog" title="Dialog" />);
    expect(screen.getByTestId('custom-dialog')).toBeInTheDocument();
  });

  it('should render custom header and footer', () => {
    render(
      <Dialog
        isOpen
        renderHeader={() => <div>Custom Header</div>}
        renderFooter={() => <div>Custom Footer</div>}
      />
    );
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('should call onOpenChange when open state changes', async () => {
    const onOpenChange = jest.fn();
    const { rerender } = render(<Dialog isOpen={false} onOpenChange={onOpenChange} />);
    rerender(<Dialog isOpen onOpenChange={onOpenChange} />);
    await waitFor(() => {
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });
  });

  it('should call onOpenComplete and onCloseComplete', async () => {
    jest.useFakeTimers();
    const onOpenComplete = jest.fn();
    const onCloseComplete = jest.fn();
    const { rerender } = render(
      <Dialog isOpen={false} onOpenComplete={onOpenComplete} onCloseComplete={onCloseComplete} />
    );
    rerender(<Dialog isOpen onOpenComplete={onOpenComplete} onCloseComplete={onCloseComplete} />);
    jest.advanceTimersByTime(250);
    expect(onOpenComplete).toHaveBeenCalled();
    rerender(
      <Dialog isOpen={false} onOpenComplete={onOpenComplete} onCloseComplete={onCloseComplete} />
    );
    jest.advanceTimersByTime(250);
    expect(onCloseComplete).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should render DialogHeader, DialogBody, DialogFooter compound components', () => {
    render(
      <div>
        <DialogHeader>Header</DialogHeader>
        <DialogBody>Body</DialogBody>
        <DialogFooter>Footer</DialogFooter>
      </div>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});

describe('Dialog translated labels', () => {
  it('translates the close button label', () => {
    render(
      <LabelsProvider labels={{ 'dialog.close': 'Fenster schliessen' }}>
        <Dialog isOpen title="T" />
      </LabelsProvider>
    );
    expect(screen.getByLabelText('Fenster schliessen')).toBeInTheDocument();
  });
});

describe('Dialog unsaved-changes guard', () => {
  let confirmSpy: jest.SpyInstance;
  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
  });
  afterEach(() => confirmSpy.mockRestore());

  const Dirty = ({ dirty = true }: { dirty?: boolean }) => {
    useUnsavedChanges(dirty);
    return null;
  };

  it('asks for confirmation on button, Escape and backdrop close; cancel keeps it open', () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen onClose={onClose} title="Edit">
        <Dirty />
      </Dialog>
    );

    fireEvent.click(screen.getByTestId('dialog-close-button'));
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByTestId('dialog').parentElement as HTMLElement);
    expect(confirmSpy).toHaveBeenCalledTimes(3);
    expect(onClose).not.toHaveBeenCalled();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes without asking when nothing is dirty', () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen onClose={onClose} title="Edit">
        <Dirty dirty={false} />
      </Dialog>
    );
    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('is not blocked by a dirty guard outside the Dialog', () => {
    const onClose = jest.fn();
    render(
      <>
        <Dirty />
        <Dialog isOpen onClose={onClose} title="Edit">
          content
        </Dialog>
      </>
    );
    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closing an outer Dialog asks when a guard in a nested Dialog is dirty', () => {
    const onCloseOuter = jest.fn();
    render(
      <Dialog isOpen onClose={onCloseOuter} title="Outer" data-testid="outer">
        <Dialog isOpen title="Inner" data-testid="inner">
          <Dirty />
        </Dialog>
      </Dialog>
    );
    const outerClose = within(screen.getByTestId('outer')).getAllByTestId('dialog-close-button')[0];
    fireEvent.click(outerClose);
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(onCloseOuter).not.toHaveBeenCalled();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(outerClose);
    expect(onCloseOuter).toHaveBeenCalledTimes(1);
  });
});
