import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces string value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    expect(result.current).toBe('first');

    // Change value but don't advance timers yet
    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first'); // Still old value

    // Advance timers by less than delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('first'); // Still old value

    // Advance timers to complete the delay
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('second'); // Now updated
  });

  it('debounces number value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 0, delay: 300 },
    });

    expect(result.current).toBe(0);

    rerender({ value: 42, delay: 300 });
    expect(result.current).toBe(0);

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(42);
  });

  it('debounces boolean value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: false, delay: 200 },
    });

    expect(result.current).toBe(false);

    rerender({ value: true, delay: 200 });
    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe(true);
  });

  it('debounces object value changes', () => {
    const obj1 = { name: 'Alice', age: 30 };
    const obj2 = { name: 'Bob', age: 25 };

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: obj1, delay: 400 },
    });

    expect(result.current).toBe(obj1);

    rerender({ value: obj2, delay: 400 });
    expect(result.current).toBe(obj1);

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe(obj2);
  });

  it('debounces array value changes', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: arr1, delay: 250 },
    });

    expect(result.current).toBe(arr1);

    rerender({ value: arr2, delay: 250 });
    expect(result.current).toBe(arr1);

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe(arr2);
  });

  it('resets timer on multiple rapid changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    expect(result.current).toBe('first');

    // First change
    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('first');

    // Second change before first timeout completes
    rerender({ value: 'third', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('first'); // Still first

    // Third change before second timeout completes
    rerender({ value: 'fourth', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('first'); // Still first

    // Complete the final timeout
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('fourth'); // Now updated to the last value
  });

  it('handles delay changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Change value with original delay
    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Change delay before timeout completes (should reset timer)
    rerender({ value: 'second', delay: 200 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('second');
  });

  it('works with zero delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 0 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 0 });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current).toBe('second');
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { rerender, unmount } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    rerender({ value: 'second', delay: 500 });

    const timeoutCallsBefore = clearTimeoutSpy.mock.calls.length;

    unmount();

    // Should call clearTimeout on unmount
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(timeoutCallsBefore);

    clearTimeoutSpy.mockRestore();
  });

  it('handles null and undefined values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: null as any, delay: 300 },
    });

    expect(result.current).toBe(null);

    rerender({ value: undefined as any, delay: 300 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(undefined);

    rerender({ value: 'value', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('value');
  });

  it('handles very long delays', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 10000 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 10000 });
    act(() => {
      jest.advanceTimersByTime(9999);
    });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('second');
  });

  it('debounces multiple sequential value changes independently', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 1, delay: 300 },
    });

    expect(result.current).toBe(1);

    // Change to 2
    rerender({ value: 2, delay: 300 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(2);

    // Change to 3
    rerender({ value: 3, delay: 300 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(3);

    // Change to 4
    rerender({ value: 4, delay: 300 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(4);
  });

  it('handles same value updates', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'same', delay: 500 },
    });

    expect(result.current).toBe('same');

    // Update with same value
    rerender({ value: 'same', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('same');
  });
});
