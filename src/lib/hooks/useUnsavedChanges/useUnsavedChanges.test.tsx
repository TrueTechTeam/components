import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useUnsavedChanges } from './useUnsavedChanges';
import {
  NavigationGuardProvider,
  useNavigationGuard,
  type NavigationGuardApi,
} from '../../contexts/NavigationGuardContext';
import { Dialog } from '../../components/overlays/Dialog';
import { FormBuilder, type FormFieldConfig } from '../../components/forms/FormBuilder';

let api: NavigationGuardApi;
const Probe = () => {
  api = useNavigationGuard();
  return null;
};

const Guarded = ({ dirty, enabled }: { dirty: boolean; enabled?: boolean }) => {
  useUnsavedChanges(dirty, { enabled });
  return null;
};

const fields: FormFieldConfig[] = [{ name: 'name', type: 'input', label: 'Name' }];

const beforeUnload = () => {
  const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
  window.dispatchEvent(event);
  return event;
};

describe('useUnsavedChanges', () => {
  let confirmSpy: jest.SpyInstance;
  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
  });
  afterEach(() => confirmSpy.mockRestore());

  it('adds beforeunload only while dirty', () => {
    const { rerender } = render(<Guarded dirty={false} />);
    expect(beforeUnload().defaultPrevented).toBe(false);

    rerender(<Guarded dirty />);
    expect(beforeUnload().defaultPrevented).toBe(true);

    rerender(<Guarded dirty enabled={false} />);
    expect(beforeUnload().defaultPrevented).toBe(false);

    rerender(<Guarded dirty />);
    expect(beforeUnload().defaultPrevented).toBe(true);
    rerender(<Guarded dirty={false} />);
    expect(beforeUnload().defaultPrevented).toBe(false);
  });

  it('removes the beforeunload listener on unmount', () => {
    const { unmount } = render(<Guarded dirty />);
    unmount();
    expect(beforeUnload().defaultPrevented).toBe(false);
  });

  it('confirmNavigation returns true when clean, else window.confirm result', () => {
    const { rerender } = render(
      <>
        <Probe />
        <Guarded dirty={false} />
      </>
    );
    expect(api.isBlocked()).toBe(false);
    expect(api.confirmNavigation()).toBe(true);
    expect(confirmSpy).not.toHaveBeenCalled();

    rerender(
      <>
        <Probe />
        <Guarded dirty />
      </>
    );
    expect(api.isBlocked()).toBe(true);
    expect(api.confirmNavigation()).toBe(false);
    expect(confirmSpy).toHaveBeenCalledWith('You have unsaved changes. Leave anyway?');

    confirmSpy.mockReturnValue(true);
    expect(api.confirmNavigation()).toBe(true);
  });

  it('works inside a provider too', () => {
    render(
      <NavigationGuardProvider>
        <Probe />
        <Guarded dirty />
      </NavigationGuardProvider>
    );
    expect(api.isBlocked()).toBe(true);
  });

  it('unregisters on unmount', () => {
    const { rerender } = render(
      <>
        <Probe />
        <Guarded dirty />
      </>
    );
    expect(api.isBlocked()).toBe(true);
    rerender(<Probe />);
    expect(api.isBlocked()).toBe(false);
  });

  it('Dialog close asks for confirmation when a guarded form inside is dirty; cancel keeps it open', async () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen onClose={onClose} title="Edit">
        <FormBuilder fields={fields} guardUnsaved />
      </Dialog>
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });

    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('dialog').parentElement as HTMLElement);
    expect(onClose).not.toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalledTimes(3);

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Dialog closes without asking when the form is clean', () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen onClose={onClose} title="Edit">
        <FormBuilder fields={fields} guardUnsaved />
      </Dialog>
    );
    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not guard the Dialog when guardUnsaved is off', () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen onClose={onClose} title="Edit">
        <FormBuilder fields={fields} />
      </Dialog>
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByTestId('dialog-close-button'));
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('a guarded form in a Dialog also blocks the global registry', () => {
    render(
      <>
        <Probe />
        <Dialog isOpen title="Edit">
          <FormBuilder fields={fields} guardUnsaved guardMessage="Discard edits?" />
        </Dialog>
      </>
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(api.isBlocked()).toBe(true);
    api.confirmNavigation();
    expect(confirmSpy).toHaveBeenCalledWith('Discard edits?');
  });

  it('FormBuilder guardUnsaved stops blocking after a successful submit', async () => {
    let resolveSubmit: () => void = () => {};
    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );
    render(
      <>
        <Probe />
        <FormBuilder fields={fields} guardUnsaved onSubmit={onSubmit} />
      </>
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(api.isBlocked()).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'abc' }));
    expect(api.isBlocked()).toBe(true);

    await act(async () => resolveSubmit());
    await waitFor(() => expect(api.isBlocked()).toBe(false));
    expect(beforeUnload().defaultPrevented).toBe(false);
  });

  it('FormBuilder stays blocking when submit rejects', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const onSubmit = jest.fn().mockRejectedValue(new Error('nope'));
    render(
      <>
        <Probe />
        <FormBuilder fields={fields} guardUnsaved onSubmit={onSubmit} />
      </>
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    expect(api.isBlocked()).toBe(true);
    errorSpy.mockRestore();
  });
});
