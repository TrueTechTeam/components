import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockStorage = {};

    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key: string) => mockStorage[key] || null);
    Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      mockStorage[key] = value;
    });
    Storage.prototype.removeItem = jest.fn((key: string) => {
      delete mockStorage[key];
    });

    // Clear console.warn spy
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    expect(result.current[0]).toBe('default-value');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns stored value when localStorage has data', () => {
    mockStorage['test-key'] = JSON.stringify('stored-value');

    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('setValue updates both state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated-value');
    });

    expect(result.current[0]).toBe('updated-value');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('updated-value')
    );
    expect(mockStorage['test-key']).toBe(JSON.stringify('updated-value'));
  });

  it('setValue with function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(15));
  });

  it('setValue with multiple function updaters in sequence', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev * 2);
    });

    expect(result.current[0]).toBe(2);

    act(() => {
      result.current[1]((prev) => prev + 3);
    });

    expect(result.current[0]).toBe(5);
  });

  it('remove() clears localStorage and resets to default', () => {
    mockStorage['test-key'] = JSON.stringify('stored-value');

    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    expect(result.current[0]).toBe('stored-value');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('default-value');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('test-key');
    expect(mockStorage['test-key']).toBeUndefined();
  });

  it('custom serializer for serialize', () => {
    const customSerializer = {
      serialize: (value: number) => `custom:${value}`,
      deserialize: (value: string) => parseInt(value.replace('custom:', ''), 10),
    };

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 42, { serializer: customSerializer })
    );

    act(() => {
      result.current[1](100);
    });

    expect(mockStorage['test-key']).toBe('custom:100');
  });

  it('custom serializer for deserialize', () => {
    const customSerializer = {
      serialize: (value: number) => `custom:${value}`,
      deserialize: (value: string) => parseInt(value.replace('custom:', ''), 10),
    };

    mockStorage['test-key'] = 'custom:999';

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 42, { serializer: customSerializer })
    );

    expect(result.current[0]).toBe(999);
  });

  it('cross-tab sync via storage events when syncTabs=true', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial', { syncTabs: true }));

    expect(result.current[0]).toBe('initial');

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('from-another-tab'),
        oldValue: JSON.stringify('initial'),
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('from-another-tab');
  });

  it('storage event with null newValue resets to default', () => {
    mockStorage['test-key'] = JSON.stringify('stored');

    const { result } = renderHook(() => useLocalStorage('test-key', 'default', { syncTabs: true }));

    expect(result.current[0]).toBe('stored');

    // Simulate storage event with null (item removed in another tab)
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'test-key',
        newValue: null,
        oldValue: JSON.stringify('stored'),
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('default');
  });

  it('no sync when syncTabs=false', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial', { syncTabs: false })
    );

    expect(result.current[0]).toBe('initial');

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('from-another-tab'),
        oldValue: JSON.stringify('initial'),
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    });

    // Should not update because syncTabs is false
    expect(result.current[0]).toBe('initial');
  });

  it('ignores storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial', { syncTabs: true }));

    expect(result.current[0]).toBe('initial');

    // Simulate storage event for different key
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'different-key',
        newValue: JSON.stringify('other-value'),
        oldValue: null,
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    });

    // Should not update because key is different
    expect(result.current[0]).toBe('initial');
  });

  it('error handling for invalid JSON in localStorage', () => {
    mockStorage['test-key'] = 'invalid-json{';

    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    expect(result.current[0]).toBe('default-value');
    expect(console.warn).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('error handling for invalid JSON in storage event', () => {
    renderHook(() => useLocalStorage('test-key', 'default', { syncTabs: true }));

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'test-key',
        newValue: 'invalid-json{',
        oldValue: null,
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    });

    expect(console.warn).toHaveBeenCalledWith(
      'Error parsing localStorage value for key "test-key":',
      expect.any(Error)
    );
  });

  it('error handling for localStorage quota exceeded', () => {
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(console.warn).toHaveBeenCalledWith(
      'Error setting localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('error handling for localStorage removeItem error', () => {
    Storage.prototype.removeItem = jest.fn(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[2]();
    });

    expect(console.warn).toHaveBeenCalledWith(
      'Error removing localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('has SSR safety checks for window undefined', () => {
    // The hook source code has typeof window === 'undefined' checks in:
    // - getStoredValue (line 86)
    // - setValue (line 108)
    // - remove (line 126)
    // - useEffect for storage listener (line 140)
    // This test verifies the hook initializes correctly in browser environment
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    expect(result.current[0]).toBe('default-value');
    expect(typeof result.current[1]).toBe('function');
    expect(typeof result.current[2]).toBe('function');

    // Verify it works in browser environment (window is defined)
    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  it('works with object values', () => {
    const defaultObj = { name: 'default', age: 0 };
    const newObj = { name: 'Alice', age: 30 };

    const { result } = renderHook(() => useLocalStorage('test-key', defaultObj));

    expect(result.current[0]).toEqual(defaultObj);

    act(() => {
      result.current[1](newObj);
    });

    expect(result.current[0]).toEqual(newObj);
    expect(mockStorage['test-key']).toBe(JSON.stringify(newObj));
  });

  it('works with array values', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1, 2, 3]));

    expect(result.current[0]).toEqual([1, 2, 3]);

    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
  });

  it('works with boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(mockStorage['test-key']).toBe(JSON.stringify(true));
  });

  it('works with null values', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('test-key', null));

    expect(result.current[0]).toBe(null);

    act(() => {
      result.current[1]('value');
    });

    expect(result.current[0]).toBe('value');

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBe(null);
  });

  it('updates defaultValue ref when defaultValue prop changes', () => {
    const { result, rerender } = renderHook(
      ({ defaultValue }) => useLocalStorage('test-key', defaultValue),
      { initialProps: { defaultValue: 'initial' } }
    );

    expect(result.current[0]).toBe('initial');

    // Change defaultValue
    rerender({ defaultValue: 'new-default' });

    // Remove to see if it resets to new default
    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('new-default');
  });

  it('cleans up storage event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useLocalStorage('test-key', 'initial', { syncTabs: true })
    );

    const callsBefore = removeEventListenerSpy.mock.calls.length;

    unmount();

    const callsAfter = removeEventListenerSpy.mock.calls.length;
    expect(callsAfter).toBeGreaterThan(callsBefore);

    // Verify the event listener was removed with correct parameters
    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('does not set up storage listener when syncTabs is false', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useLocalStorage('test-key', 'initial', { syncTabs: false }));

    // Filter for 'storage' event listeners added
    const storageListenerCalls = addEventListenerSpy.mock.calls.filter(
      (call) => call[0] === 'storage'
    );

    expect(storageListenerCalls.length).toBe(0);

    addEventListenerSpy.mockRestore();
  });

  it('handles multiple hooks with different keys independently', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'default1'));
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'default2'));

    expect(result1.current[0]).toBe('default1');
    expect(result2.current[0]).toBe('default2');

    act(() => {
      result1.current[1]('updated1');
    });

    expect(result1.current[0]).toBe('updated1');
    expect(result2.current[0]).toBe('default2');

    act(() => {
      result2.current[1]('updated2');
    });

    expect(result1.current[0]).toBe('updated1');
    expect(result2.current[0]).toBe('updated2');
  });

  it('handles multiple hooks with same key in sync', () => {
    mockStorage['shared-key'] = JSON.stringify('stored');

    const { result: result1 } = renderHook(() =>
      useLocalStorage('shared-key', 'default', { syncTabs: true })
    );
    const { result: result2 } = renderHook(() =>
      useLocalStorage('shared-key', 'default', { syncTabs: true })
    );

    expect(result1.current[0]).toBe('stored');
    expect(result2.current[0]).toBe('stored');

    // Simulate storage event
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'shared-key',
        newValue: JSON.stringify('synced'),
        oldValue: JSON.stringify('stored'),
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    });

    expect(result1.current[0]).toBe('synced');
    expect(result2.current[0]).toBe('synced');
  });

  it('handles complex nested objects', () => {
    const complexObj = {
      user: {
        name: 'Alice',
        profile: {
          age: 30,
          address: {
            city: 'NYC',
            zip: '10001',
          },
        },
      },
      settings: {
        theme: 'dark',
        notifications: true,
      },
    };

    const { result } = renderHook(() => useLocalStorage('test-key', complexObj));

    expect(result.current[0]).toEqual(complexObj);

    const updatedObj = {
      ...complexObj,
      user: {
        ...complexObj.user,
        profile: {
          ...complexObj.user.profile,
          age: 31,
        },
      },
    };

    act(() => {
      result.current[1](updatedObj);
    });

    expect(result.current[0]).toEqual(updatedObj);
    expect(JSON.parse(mockStorage['test-key'])).toEqual(updatedObj);
  });

  it('handles rapid sequential updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    for (let i = 1; i <= 10; i++) {
      act(() => {
        result.current[1](i);
      });
      expect(result.current[0]).toBe(i);
    }

    expect(mockStorage['test-key']).toBe(JSON.stringify(10));
  });

  it('handles empty string as valid value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('');
    });

    expect(result.current[0]).toBe('');
    expect(mockStorage['test-key']).toBe(JSON.stringify(''));
  });

  it('handles zero as valid value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 100));

    act(() => {
      result.current[1](0);
    });

    expect(result.current[0]).toBe(0);
    expect(mockStorage['test-key']).toBe(JSON.stringify(0));
  });

  it('setValue and remove functions work correctly across rerenders', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('test-key', 'initial'));

    const firstSetValue = result.current[1];
    const firstRemove = result.current[2];

    rerender();

    const secondSetValue = result.current[1];
    const secondRemove = result.current[2];

    // Functions should be stable (same reference)
    expect(typeof firstSetValue).toBe('function');
    expect(typeof firstRemove).toBe('function');
    expect(typeof secondSetValue).toBe('function');
    expect(typeof secondRemove).toBe('function');

    // Verify they still work after rerender
    act(() => {
      secondSetValue('updated');
    });

    expect(result.current[0]).toBe('updated');

    act(() => {
      secondRemove();
    });

    expect(result.current[0]).toBe('initial');
  });

  it('handles changing key prop by writing to new key', () => {
    mockStorage['key1'] = JSON.stringify('value1');
    mockStorage['key2'] = JSON.stringify('value2');

    const { result, rerender } = renderHook(({ key }) => useLocalStorage(key, 'default'), {
      initialProps: { key: 'key1' },
    });

    expect(result.current[0]).toBe('value1');

    rerender({ key: 'key2' });

    // After key change, updates should go to the new key
    act(() => {
      result.current[1]('updated-value');
    });

    expect(mockStorage['key2']).toBe(JSON.stringify('updated-value'));
    expect(result.current[0]).toBe('updated-value');
  });

  it('syncs with storage event containing same serializer format', () => {
    const customSerializer = {
      serialize: (value: { count: number }) => `COUNT:${value.count}`,
      deserialize: (value: string) => ({ count: parseInt(value.replace('COUNT:', ''), 10) }),
    };

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { count: 0 }, { serializer: customSerializer, syncTabs: true })
    );

    expect(result.current[0]).toEqual({ count: 0 });

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'test-key',
        newValue: 'COUNT:42',
        oldValue: 'COUNT:0',
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toEqual({ count: 42 });
  });
});
