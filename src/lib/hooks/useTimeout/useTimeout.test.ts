import { renderHook, act } from '@testing-library/react';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('executes callback after specified delay', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout({ callback, delay: 1000 }));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not execute callback when delay is null', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout({ callback, delay: null }));

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('provides reset function that restarts timeout', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout({ callback, delay: 1000 }));

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      result.current.reset();
    });

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('provides clear function that cancels timeout', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout({ callback, delay: 1000 }));

    act(() => {
      result.current.clear();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('uses latest callback when executing', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const { rerender } = renderHook(({ callback }) => useTimeout({ callback, delay: 1000 }), {
      initialProps: { callback: callback1 },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender({ callback: callback2 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('clears timeout on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useTimeout({ callback, delay: 1000 }));

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('returns stable reset and clear functions', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useTimeout({ callback, delay: 1000 }));

    const firstReset = result.current.reset;
    const firstClear = result.current.clear;

    rerender();

    expect(result.current.reset).toBe(firstReset);
    expect(result.current.clear).toBe(firstClear);
  });
});
