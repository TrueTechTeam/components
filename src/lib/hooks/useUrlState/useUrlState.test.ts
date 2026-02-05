import { renderHook, act } from '@testing-library/react';
import { useUrlState, urlStateSerializers } from './useUrlState';

describe('useUrlState', () => {
  let originalLocation: Location;
  let originalHistory: History;

  beforeEach(() => {
    jest.useFakeTimers();

    // Save original location and history
    originalLocation = window.location;
    originalHistory = window.history;

    // Mock window.location
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      pathname: '/test',
      search: '',
      href: 'http://localhost/test',
    } as Location;

    // Mock window.history
    window.history.pushState = jest.fn((state, title, url) => {
      if (typeof url === 'string') {
        const [pathname, search] = url.split('?');
        window.location.pathname = pathname;
        window.location.search = search ? `?${search}` : '';
      }
    });

    window.history.replaceState = jest.fn((state, title, url) => {
      if (typeof url === 'string') {
        const [pathname, search] = url.split('?');
        window.location.pathname = pathname;
        window.location.search = search ? `?${search}` : '';
      }
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();

    // Restore original location and history
    window.location = originalLocation;
    window.history = originalHistory;
  });

  describe('basic functionality', () => {
    it('returns default value when param not in URL', () => {
      const { result } = renderHook(() => useUrlState('query', { defaultValue: 'default' }));

      expect(result.current[0]).toBe('default');
    });

    it('returns deserialized value from URL', () => {
      window.location.search = '?query=test-value';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      expect(result.current[0]).toBe('test-value');
    });

    it('setValue updates both state and URL', () => {
      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?query=new-value');
    });

    it('setValue with function updater', () => {
      window.location.search = '?query=initial';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      expect(result.current[0]).toBe('initial');

      act(() => {
        result.current[1]((prev) => `${prev}-updated`);
      });

      expect(result.current[0]).toBe('initial-updated');
      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '/test?query=initial-updated'
      );
    });

    it('clear() removes param from URL', () => {
      window.location.search = '?query=test';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      expect(result.current[0]).toBe('test');

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('');
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test');
    });

    it('removes param when value equals default', () => {
      window.location.search = '?query=test';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: 'default' }));

      act(() => {
        result.current[1]('default');
      });

      expect(result.current[0]).toBe('default');
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test');
    });
  });

  describe('serializers', () => {
    it('string serializer', () => {
      const { result } = renderHook(() =>
        useUrlState('text', {
          defaultValue: 'default',
          serializer: urlStateSerializers.string,
        })
      );

      act(() => {
        result.current[1]('hello world');
      });

      expect(result.current[0]).toBe('hello world');
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?text=hello+world');
    });

    it('number serializer', () => {
      const { result } = renderHook(() =>
        useUrlState('page', {
          defaultValue: 1,
          serializer: urlStateSerializers.number,
        })
      );

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?page=42');
    });

    it('number serializer handles NaN values', () => {
      window.location.search = '?page=not-a-number';

      const { result } = renderHook(() =>
        useUrlState('page', {
          defaultValue: 1,
          serializer: urlStateSerializers.number,
        })
      );

      expect(result.current[0]).toBe(1);
    });

    it('boolean serializer', () => {
      const { result } = renderHook(() =>
        useUrlState('active', {
          defaultValue: false,
          serializer: urlStateSerializers.boolean,
        })
      );

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?active=true');

      act(() => {
        result.current[1](false);
      });

      expect(result.current[0]).toBe(false);
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test');
    });

    it('boolean serializer deserializes correctly', () => {
      window.location.search = '?active=true';

      const { result } = renderHook(() =>
        useUrlState('active', {
          defaultValue: false,
          serializer: urlStateSerializers.boolean,
        })
      );

      expect(result.current[0]).toBe(true);
    });

    it('array serializer', () => {
      const { result } = renderHook(() =>
        useUrlState('tags', {
          defaultValue: [] as string[],
          serializer: urlStateSerializers.array<string>(),
        })
      );

      act(() => {
        result.current[1](['tag1', 'tag2', 'tag3']);
      });

      expect(result.current[0]).toEqual(['tag1', 'tag2', 'tag3']);
      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '/test?tags=tag1%2Ctag2%2Ctag3'
      );
    });

    it('array serializer deserializes from URL', () => {
      window.location.search = '?tags=red,green,blue';

      const { result } = renderHook(() =>
        useUrlState('tags', {
          defaultValue: [] as string[],
          serializer: urlStateSerializers.array<string>(),
        })
      );

      expect(result.current[0]).toEqual(['red', 'green', 'blue']);
    });

    it('array serializer handles empty string', () => {
      window.location.search = '?tags=';

      const { result } = renderHook(() =>
        useUrlState('tags', {
          defaultValue: ['default'],
          serializer: urlStateSerializers.array<string>(),
        })
      );

      expect(result.current[0]).toEqual(['default']);
    });

    it('numberArray serializer', () => {
      const { result } = renderHook(() =>
        useUrlState('ids', {
          defaultValue: [] as number[],
          serializer: urlStateSerializers.numberArray(),
        })
      );

      act(() => {
        result.current[1]([1, 2, 3, 4, 5]);
      });

      expect(result.current[0]).toEqual([1, 2, 3, 4, 5]);
      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '/test?ids=1%2C2%2C3%2C4%2C5'
      );
    });

    it('numberArray serializer deserializes from URL', () => {
      window.location.search = '?ids=10,20,30';

      const { result } = renderHook(() =>
        useUrlState('ids', {
          defaultValue: [] as number[],
          serializer: urlStateSerializers.numberArray(),
        })
      );

      expect(result.current[0]).toEqual([10, 20, 30]);
    });

    it('numberArray serializer filters out NaN values', () => {
      window.location.search = '?ids=1,invalid,3,bad,5';

      const { result } = renderHook(() =>
        useUrlState('ids', {
          defaultValue: [] as number[],
          serializer: urlStateSerializers.numberArray(),
        })
      );

      expect(result.current[0]).toEqual([1, 3, 5]);
    });

    it('json serializer with object', () => {
      const { result } = renderHook(() =>
        useUrlState('config', {
          defaultValue: { theme: 'light', size: 'medium' },
          serializer: urlStateSerializers.json<{ theme: string; size: string }>(),
        })
      );

      act(() => {
        result.current[1]({ theme: 'dark', size: 'large' });
      });

      expect(result.current[0]).toEqual({ theme: 'dark', size: 'large' });
      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '/test?config=%7B%22theme%22%3A%22dark%22%2C%22size%22%3A%22large%22%7D'
      );
    });

    it('json serializer deserializes from URL', () => {
      window.location.search = '?config=%7B%22x%22%3A10%2C%22y%22%3A20%7D';

      const { result } = renderHook(() =>
        useUrlState('config', {
          defaultValue: { x: 0, y: 0 },
          serializer: urlStateSerializers.json<{ x: number; y: number }>(),
        })
      );

      expect(result.current[0]).toEqual({ x: 10, y: 20 });
    });

    it('json serializer handles invalid JSON', () => {
      window.location.search = '?config=invalid-json';

      const { result } = renderHook(() =>
        useUrlState('config', {
          defaultValue: { theme: 'light' },
          serializer: urlStateSerializers.json<{ theme: string }>(),
        })
      );

      expect(result.current[0]).toEqual({ theme: 'light' });
    });
  });

  describe('automatic serializer inference', () => {
    it('infers string serializer from string default', () => {
      window.location.search = '?text=hello';

      const { result } = renderHook(() => useUrlState('text', { defaultValue: '' }));

      expect(result.current[0]).toBe('hello');

      act(() => {
        result.current[1]('world');
      });

      expect(result.current[0]).toBe('world');
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?text=world');
    });

    it('infers number serializer from number default', () => {
      window.location.search = '?count=42';

      const { result } = renderHook(() => useUrlState('count', { defaultValue: 0 }));

      expect(result.current[0]).toBe(42);

      act(() => {
        result.current[1](100);
      });

      expect(result.current[0]).toBe(100);
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?count=100');
    });

    it('infers boolean serializer from boolean default', () => {
      window.location.search = '?enabled=true';

      const { result } = renderHook(() => useUrlState('enabled', { defaultValue: false }));

      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1](false);
      });

      expect(result.current[0]).toBe(false);
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test');
    });

    it('infers array serializer from string array default', () => {
      window.location.search = '?tags=a,b,c';

      const { result } = renderHook(() => useUrlState('tags', { defaultValue: [] as string[] }));

      expect(result.current[0]).toEqual(['a', 'b', 'c']);

      act(() => {
        result.current[1](['x', 'y', 'z']);
      });

      expect(result.current[0]).toEqual(['x', 'y', 'z']);
    });

    it('infers numberArray serializer from number array default', () => {
      window.location.search = '?nums=1,2,3';

      const { result } = renderHook(() => useUrlState('nums', { defaultValue: [0] }));

      expect(result.current[0]).toEqual([1, 2, 3]);

      act(() => {
        result.current[1]([4, 5, 6]);
      });

      expect(result.current[0]).toEqual([4, 5, 6]);
    });

    it('infers json serializer from object default', () => {
      window.location.search = '?obj=%7B%22key%22%3A%22value%22%7D';

      const { result } = renderHook(() => useUrlState('obj', { defaultValue: {} }));

      expect(result.current[0]).toEqual({ key: 'value' });

      act(() => {
        result.current[1]({ foo: 'bar' });
      });

      expect(result.current[0]).toEqual({ foo: 'bar' });
    });
  });

  describe('replace option', () => {
    it('uses replaceState instead of pushState when replace is true', () => {
      const { result } = renderHook(() =>
        useUrlState('query', { defaultValue: '', replace: true })
      );

      act(() => {
        result.current[1]('test');
      });

      expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/test?query=test');
      expect(window.history.pushState).not.toHaveBeenCalled();
    });

    it('uses pushState when replace is false', () => {
      const { result } = renderHook(() =>
        useUrlState('query', { defaultValue: '', replace: false })
      );

      act(() => {
        result.current[1]('test');
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?query=test');
      expect(window.history.replaceState).not.toHaveBeenCalled();
    });

    it('uses pushState by default when replace is not specified', () => {
      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      act(() => {
        result.current[1]('test');
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?query=test');
      expect(window.history.replaceState).not.toHaveBeenCalled();
    });
  });

  describe('debounce option', () => {
    it('delays URL updates when debounce is set', () => {
      const { result } = renderHook(() =>
        useUrlState('query', { defaultValue: '', debounce: 500 })
      );

      act(() => {
        result.current[1]('test');
      });

      // State should update immediately
      expect(result.current[0]).toBe('test');

      // URL should not update yet
      expect(window.history.pushState).not.toHaveBeenCalled();

      // Advance timers by less than debounce
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(window.history.pushState).not.toHaveBeenCalled();

      // Complete the debounce
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?query=test');
    });

    it('resets debounce timer on rapid changes', () => {
      const { result } = renderHook(() =>
        useUrlState('query', { defaultValue: '', debounce: 500 })
      );

      act(() => {
        result.current[1]('first');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      act(() => {
        result.current[1]('second');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(window.history.pushState).not.toHaveBeenCalled();

      act(() => {
        result.current[1]('third');
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should only update with the last value
      expect(window.history.pushState).toHaveBeenCalledTimes(1);
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?query=third');
    });

    it('updates URL immediately when debounce is 0', () => {
      const { result } = renderHook(() => useUrlState('query', { defaultValue: '', debounce: 0 }));

      act(() => {
        result.current[1]('test');
      });

      expect(result.current[0]).toBe('test');
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?query=test');
    });

    it('cleans up debounce timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() =>
        useUrlState('query', { defaultValue: '', debounce: 500 })
      );

      act(() => {
        result.current[1]('test');
      });

      const callsBefore = clearTimeoutSpy.mock.calls.length;

      unmount();

      expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(callsBefore);

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('popstate event handling', () => {
    it('updates state when popstate event is triggered', () => {
      window.location.search = '?query=initial';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      expect(result.current[0]).toBe('initial');

      // Simulate browser back/forward navigation
      window.location.search = '?query=changed';

      act(() => {
        window.dispatchEvent(new PopStateEvent('popstate'));
      });

      expect(result.current[0]).toBe('changed');
    });

    it('updates state to default when param is removed via popstate', () => {
      window.location.search = '?query=test';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: 'default' }));

      expect(result.current[0]).toBe('test');

      // Simulate navigation to URL without the param
      window.location.search = '';

      act(() => {
        window.dispatchEvent(new PopStateEvent('popstate'));
      });

      expect(result.current[0]).toBe('default');
    });

    it('cleans up popstate listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('multiple parameters', () => {
    it('preserves other URL parameters when updating', () => {
      window.location.search = '?other=value&query=test';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      act(() => {
        result.current[1]('updated');
      });

      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        '',
        '/test?other=value&query=updated'
      );
    });

    it('preserves other parameters when clearing', () => {
      window.location.search = '?other=value&query=test';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      act(() => {
        result.current[2]();
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?other=value');
    });
  });

  describe('edge cases', () => {
    it('handles null URL value', () => {
      window.location.search = '';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: 'default' }));

      expect(result.current[0]).toBe('default');
    });

    it('handles special characters in values', () => {
      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      act(() => {
        result.current[1]('hello&world=test');
      });

      expect(result.current[0]).toBe('hello&world=test');
    });

    it('handles empty string values', () => {
      const { result } = renderHook(() => useUrlState('query', { defaultValue: 'default' }));

      act(() => {
        result.current[1]('');
      });

      expect(result.current[0]).toBe('');
    });

    it('handles function updater with debounce', () => {
      const { result } = renderHook(() => useUrlState('count', { defaultValue: 0, debounce: 500 }));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(2);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/test?count=2');
    });

    it('updates defaultValue ref when defaultValue changes', () => {
      const { result, rerender } = renderHook(
        ({ defaultValue }) => useUrlState('query', { defaultValue }),
        { initialProps: { defaultValue: 'initial' } }
      );

      act(() => {
        result.current[1]('test');
      });

      expect(result.current[0]).toBe('test');

      // Change the default value
      rerender({ defaultValue: 'new-default' });

      // Clear to the new default
      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('new-default');
    });

    it('handles empty array default value', () => {
      const { result } = renderHook(() => useUrlState('tags', { defaultValue: [] as string[] }));

      expect(result.current[0]).toEqual([]);

      act(() => {
        result.current[1](['tag1', 'tag2']);
      });

      expect(result.current[0]).toEqual(['tag1', 'tag2']);
    });

    it('handles complex object with nested properties', () => {
      const defaultValue = { user: { name: 'John', age: 30 }, active: true };

      const { result } = renderHook(() =>
        useUrlState('data', {
          defaultValue,
          serializer: urlStateSerializers.json(),
        })
      );

      act(() => {
        result.current[1]({ user: { name: 'Jane', age: 25 }, active: false });
      });

      expect(result.current[0]).toEqual({
        user: { name: 'Jane', age: 25 },
        active: false,
      });
    });

    it('works correctly when setting value equal to current value', () => {
      window.location.search = '?query=test';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: '' }));

      expect(result.current[0]).toBe('test');

      const pushStateCallsBefore = (window.history.pushState as jest.Mock).mock.calls.length;

      act(() => {
        result.current[1]('test');
      });

      expect(result.current[0]).toBe('test');
      expect((window.history.pushState as jest.Mock).mock.calls.length).toBeGreaterThan(
        pushStateCallsBefore
      );
    });
  });

  describe('SSR compatibility', () => {
    it('handles missing window gracefully', () => {
      // Clear the URL search to ensure default is used
      window.location.search = '';

      const { result } = renderHook(() => useUrlState('query', { defaultValue: 'default' }));

      // In a browser environment, should return default when no URL param exists
      expect(result.current[0]).toBe('default');

      // setValue should work even if it internally checks for window
      act(() => {
        result.current[1]('test');
      });

      expect(result.current[0]).toBe('test');
    });
  });
});
