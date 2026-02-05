import { renderHook } from '@testing-library/react';
import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  it('returns undefined initially', () => {
    const { result } = renderHook(() => usePrevious('initial'));
    expect(result.current).toBe(undefined);
  });

  it('returns previous value after rerender', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'first' },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 'second' });
    expect(result.current).toBe('first');
  });

  it('tracks multiple value changes correctly', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);

    rerender({ value: 4 });
    expect(result.current).toBe(3);
  });

  it('works with string values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'hello' },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 'world' });
    expect(result.current).toBe('hello');

    rerender({ value: 'foo' });
    expect(result.current).toBe('world');
  });

  it('works with number values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 42 });
    expect(result.current).toBe(0);

    rerender({ value: 100 });
    expect(result.current).toBe(42);
  });

  it('works with boolean values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: false },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: true });
    expect(result.current).toBe(false);

    rerender({ value: false });
    expect(result.current).toBe(true);
  });

  it('works with object values', () => {
    const obj1 = { name: 'Alice', age: 30 };
    const obj2 = { name: 'Bob', age: 25 };
    const obj3 = { name: 'Charlie', age: 35 };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1);

    rerender({ value: obj3 });
    expect(result.current).toBe(obj2);
  });

  it('works with array values', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const arr3 = [7, 8, 9];

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: arr1 },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: arr2 });
    expect(result.current).toBe(arr1);

    rerender({ value: arr3 });
    expect(result.current).toBe(arr2);
  });

  it('handles null values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: null as any },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 'value' });
    expect(result.current).toBe(null);

    rerender({ value: null as any });
    expect(result.current).toBe('value');
  });

  it('handles undefined values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: undefined as any },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 'value' });
    expect(result.current).toBe(undefined);

    rerender({ value: undefined as any });
    expect(result.current).toBe('value');
  });

  it('handles same value updates', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'same' },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 'same' });
    expect(result.current).toBe(undefined);

    rerender({ value: 'different' });
    expect(result.current).toBe('same');

    rerender({ value: 'different' });
    expect(result.current).toBe('same');
  });

  it('handles same object reference updates', () => {
    const obj = { name: 'Alice' };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: obj });
    expect(result.current).toBe(undefined);

    const newObj = { name: 'Bob' };
    rerender({ value: newObj });
    expect(result.current).toBe(obj);
  });

  it('returns previous value immediately after change', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'changed' });
    expect(result.current).toBe('initial');
  });

  it('handles zero values correctly', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 1 });
    expect(result.current).toBe(0);

    rerender({ value: 0 });
    expect(result.current).toBe(1);
  });

  it('handles empty string values correctly', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: '' },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 'non-empty' });
    expect(result.current).toBe('');

    rerender({ value: '' });
    expect(result.current).toBe('non-empty');
  });

  it('handles NaN values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: NaN },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 42 });
    expect(Number.isNaN(result.current)).toBe(true);

    rerender({ value: NaN });
    expect(result.current).toBe(42);
  });

  it('works with complex nested objects', () => {
    const obj1 = { user: { name: 'Alice', address: { city: 'NYC' } } };
    const obj2 = { user: { name: 'Bob', address: { city: 'LA' } } };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1);
    expect(result.current).toEqual({ user: { name: 'Alice', address: { city: 'NYC' } } });
  });

  it('works with function values', () => {
    const fn1 = () => 'first';
    const fn2 = () => 'second';

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: fn1 },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: fn2 });
    expect(result.current).toBe(fn1);
    expect(result.current?.()).toBe('first');
  });

  it('tracks changes between different types', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'string' as any },
    });

    expect(result.current).toBe(undefined);

    rerender({ value: 42 as any });
    expect(result.current).toBe('string');

    rerender({ value: true as any });
    expect(result.current).toBe(42);

    rerender({ value: { obj: true } as any });
    expect(result.current).toBe(true);
  });

  it('maintains separate state across multiple hook instances', () => {
    const { result: result1 } = renderHook(() => usePrevious('hook1'));
    const { result: result2 } = renderHook(() => usePrevious('hook2'));

    expect(result1.current).toBe(undefined);
    expect(result2.current).toBe(undefined);
  });

  it('handles rapid sequential changes', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    for (let i = 2; i <= 10; i++) {
      rerender({ value: i });
      expect(result.current).toBe(i - 1);
    }
  });
});
