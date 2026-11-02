import React from 'react';
import { render } from '@testing-library/react';
import { useUnsavedChanges } from './useUnsavedChanges';
import {
  NavigationGuardProvider,
  useNavigationGuard,
  type NavigationGuardApi,
} from '../../contexts/NavigationGuardContext';

let api: NavigationGuardApi;
const Probe = () => {
  api = useNavigationGuard();
  return null;
};

const Guarded = ({ dirty, enabled }: { dirty: boolean; enabled?: boolean }) => {
  useUnsavedChanges(dirty, { enabled });
  return null;
};

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

  it('does not register an inert guard when disabled', () => {
    const { rerender } = render(
      <>
        <Probe />
        <Guarded dirty enabled={false} />
      </>
    );
    expect(api.isBlocked()).toBe(false);
    rerender(
      <>
        <Probe />
        <Guarded dirty />
      </>
    );
    expect(api.isBlocked()).toBe(true);
  });
});
