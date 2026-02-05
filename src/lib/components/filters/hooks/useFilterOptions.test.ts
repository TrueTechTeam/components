import { renderHook, act, waitFor } from '@testing-library/react';
import { useFilterOptions, clearOptionsCache } from './useFilterOptions';
import type { FilterOption, FilterOptionsLoader } from '../types';

describe('useFilterOptions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearOptionsCache();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('static options', () => {
    it('returns provided static options immediately', () => {
      const staticOptions: FilterOption[] = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ];

      const { result } = renderHook(() => useFilterOptions({ staticOptions }));

      expect(result.current.options).toEqual(staticOptions);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('returns empty array when no options provided', () => {
      const { result } = renderHook(() => useFilterOptions({}));

      expect(result.current.options).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('async options loading', () => {
    it('loads async options on mount', async () => {
      const options: FilterOption[] = [{ value: 'option1', label: 'Option 1' }];

      const loader: FilterOptionsLoader = {
        load: jest.fn().mockResolvedValue({ options, hasMore: false }),
      };

      const { result } = renderHook(() => useFilterOptions({ loader }));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.options).toEqual(options);
      expect(loader.load).toHaveBeenCalledTimes(1);
    });

    it('does not load on mount when loadOnMount is false', async () => {
      const loader: FilterOptionsLoader = {
        load: jest.fn().mockResolvedValue({ options: [], hasMore: false }),
      };

      const { result } = renderHook(() => useFilterOptions({ loader, loadOnMount: false }));

      expect(result.current.loading).toBe(false);
      expect(loader.load).not.toHaveBeenCalled();
    });
  });

  describe('search with debounce', () => {
    it('debounces search query changes', async () => {
      const loader: FilterOptionsLoader = {
        load: jest.fn().mockResolvedValue({ options: [], hasMore: false }),
        debounceMs: 300,
      };

      const { result } = renderHook(() => useFilterOptions({ loader }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialCallCount = (loader.load as jest.Mock).mock.calls.length;

      act(() => {
        result.current.search('test');
      });

      expect(loader.load).toHaveBeenCalledTimes(initialCallCount);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(loader.load).toHaveBeenCalledTimes(initialCallCount + 1);
      });

      expect(loader.load).toHaveBeenLastCalledWith(
        expect.objectContaining({ searchQuery: 'test', page: 1 })
      );
    });
  });

  describe('pagination', () => {
    it('appends options when loadMore is called', async () => {
      const firstPageOptions: FilterOption[] = [{ value: '1', label: 'One' }];
      const secondPageOptions: FilterOption[] = [{ value: '2', label: 'Two' }];

      const loader: FilterOptionsLoader = {
        load: jest
          .fn()
          .mockResolvedValueOnce({ options: firstPageOptions, hasMore: true })
          .mockResolvedValueOnce({ options: secondPageOptions, hasMore: false }),
      };

      const { result } = renderHook(() => useFilterOptions({ loader }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.options).toEqual(firstPageOptions);
      expect(result.current.hasMore).toBe(true);

      act(() => {
        result.current.loadMore();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.options).toEqual([...firstPageOptions, ...secondPageOptions]);
      expect(result.current.hasMore).toBe(false);
    });

    it('does not load more when hasMore is false', async () => {
      const loader: FilterOptionsLoader = {
        load: jest.fn().mockResolvedValue({ options: [], hasMore: false }),
      };

      const { result } = renderHook(() => useFilterOptions({ loader }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.loadMore();
      });

      expect(loader.load).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('sets error when loader throws', async () => {
      const loader: FilterOptionsLoader = {
        load: jest.fn().mockRejectedValue(new Error('Failed to load')),
      };

      const { result } = renderHook(() => useFilterOptions({ loader }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to load');
      expect(result.current.options).toEqual([]);
    });

    it('clears error on successful reload', async () => {
      const loader: FilterOptionsLoader = {
        load: jest
          .fn()
          .mockRejectedValueOnce(new Error('First error'))
          .mockResolvedValueOnce({ options: [{ value: '1', label: 'One' }], hasMore: false }),
      };

      const { result } = renderHook(() => useFilterOptions({ loader }));

      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      act(() => {
        result.current.reload();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.options).toHaveLength(1);
    });
  });

  describe('reload functionality', () => {
    it('reloads options when reload is called', async () => {
      const loader: FilterOptionsLoader = {
        load: jest.fn().mockResolvedValue({ options: [], hasMore: false }),
      };

      const { result } = renderHook(() => useFilterOptions({ loader }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(loader.load).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.reload();
      });

      await waitFor(() => {
        expect(loader.load).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('dependency values', () => {
    it('reloads when dependencyValues change', async () => {
      const loader: FilterOptionsLoader = {
        load: jest.fn().mockResolvedValue({ options: [], hasMore: false }),
        debounceMs: 0,
      };

      const { rerender } = renderHook(
        ({ dependencyValues }) => useFilterOptions({ loader, dependencyValues }),
        { initialProps: { dependencyValues: { dep1: 'value1' } } }
      );

      await waitFor(() => {
        expect(loader.load).toHaveBeenCalledTimes(1);
      });

      rerender({ dependencyValues: { dep1: 'value2' } });

      await waitFor(() => {
        expect(loader.load).toHaveBeenCalledTimes(2);
      });

      expect(loader.load).toHaveBeenLastCalledWith(
        expect.objectContaining({ dependencyValues: { dep1: 'value2' } })
      );
    });
  });

  describe('clearOptionsCache', () => {
    it('clears cache for specific filter ID', async () => {
      const loader: FilterOptionsLoader = {
        load: jest
          .fn()
          .mockResolvedValue({ options: [{ value: '1', label: 'One' }], hasMore: false }),
      };

      const { unmount } = renderHook(() => useFilterOptions({ loader, filterId: 'test-filter' }));

      await waitFor(() => {
        expect(loader.load).toHaveBeenCalledTimes(1);
      });

      unmount();
      clearOptionsCache('test-filter');

      renderHook(() => useFilterOptions({ loader, filterId: 'test-filter' }));

      await waitFor(() => {
        expect(loader.load).toHaveBeenCalledTimes(2);
      });
    });
  });
});
