import { renderHook, act } from '@testing-library/react';
import { useInterval } from './useInterval';

describe('useInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns reset and clear functions', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval({ callback, delay: 1000 }));

    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.clear).toBe('function');
  });

  it('executes callback at specified interval', () => {
    const callback = jest.fn();
    renderHook(() => useInterval({ callback, delay: 1000 }));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('does not execute callback when delay is null', () => {
    const callback = jest.fn();
    renderHook(() => useInterval({ callback, delay: null }));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('executes callback immediately when immediate is true', () => {
    const callback = jest.fn();
    renderHook(() => useInterval({ callback, delay: 1000, immediate: true }));

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('stops interval when clear is called', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval({ callback, delay: 1000 }));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.clear();
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets interval timing when reset is called', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval({ callback, delay: 1000 }));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current.reset();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('cleans up interval on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval({ callback, delay: 1000 }));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('restarts interval when delay changes', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(({ delay }) => useInterval({ callback, delay }), {
      initialProps: { delay: 1000 },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    rerender({ delay: 2000 });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
