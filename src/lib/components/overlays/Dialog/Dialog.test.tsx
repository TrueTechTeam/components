import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from './Dialog';
import React from 'react';

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
