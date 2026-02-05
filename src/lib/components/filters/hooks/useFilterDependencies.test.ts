import { renderHook } from '@testing-library/react';
import { useFilterDependencies, getDependencyValues } from './useFilterDependencies';
import type { FilterDefinition } from '../types';

describe('useFilterDependencies', () => {
  describe('filter with no dependencies', () => {
    it('returns default visibility and enabled state', () => {
      const filter: FilterDefinition = {
        id: 'test-filter',
        type: 'text',
        label: 'Test Filter',
      };

      const { result } = renderHook(() => useFilterDependencies({ filter, allValues: {} }));

      expect(result.current.isVisible).toBe(true);
      expect(result.current.isEnabled).toBe(true);
      expect(result.current.shouldReloadOptions).toBe(false);
    });

    it('respects hidden and disabled flags', () => {
      const filter: FilterDefinition = {
        id: 'test-filter',
        type: 'text',
        label: 'Test Filter',
        hidden: true,
        disabled: true,
      };

      const { result } = renderHook(() => useFilterDependencies({ filter, allValues: {} }));

      expect(result.current.isVisible).toBe(false);
      expect(result.current.isEnabled).toBe(false);
    });
  });

  describe('show/hide actions', () => {
    it('shows filter when dependency condition is met', () => {
      const filter: FilterDefinition = {
        id: 'subcategory',
        type: 'select',
        label: 'Subcategory',
        dependencies: [{ dependsOn: 'category', action: 'show' }],
      };

      const { result } = renderHook(() =>
        useFilterDependencies({
          filter,
          allValues: { category: 'electronics' },
        })
      );

      expect(result.current.isVisible).toBe(true);
    });

    it('hides filter when dependency condition is not met', () => {
      const filter: FilterDefinition = {
        id: 'subcategory',
        type: 'select',
        label: 'Subcategory',
        dependencies: [{ dependsOn: 'category', action: 'show' }],
      };

      const { result } = renderHook(() =>
        useFilterDependencies({
          filter,
          allValues: { category: '' },
        })
      );

      expect(result.current.isVisible).toBe(false);
    });

    it('hides filter when hide action condition is met', () => {
      const filter: FilterDefinition = {
        id: 'discount',
        type: 'number',
        label: 'Discount',
        dependencies: [{ dependsOn: 'hideDiscount', action: 'hide' }],
      };

      const { result } = renderHook(() =>
        useFilterDependencies({
          filter,
          allValues: { hideDiscount: true },
        })
      );

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('enable/disable actions', () => {
    it('enables filter when dependency condition is met', () => {
      const filter: FilterDefinition = {
        id: 'subcategory',
        type: 'select',
        label: 'Subcategory',
        dependencies: [{ dependsOn: 'category', action: 'enable' }],
      };

      const { result } = renderHook(() =>
        useFilterDependencies({
          filter,
          allValues: { category: 'electronics' },
        })
      );

      expect(result.current.isEnabled).toBe(true);
    });

    it('disables filter when enable condition is not met', () => {
      const filter: FilterDefinition = {
        id: 'subcategory',
        type: 'select',
        label: 'Subcategory',
        dependencies: [{ dependsOn: 'category', action: 'enable' }],
      };

      const { result } = renderHook(() =>
        useFilterDependencies({
          filter,
          allValues: { category: '' },
        })
      );

      expect(result.current.isEnabled).toBe(false);
    });
  });

  describe('reload-options action', () => {
    it('sets shouldReloadOptions when condition is met', () => {
      const filter: FilterDefinition = {
        id: 'city',
        type: 'select',
        label: 'City',
        dependencies: [{ dependsOn: 'country', action: 'reload-options' }],
      };

      const { result } = renderHook(() =>
        useFilterDependencies({
          filter,
          allValues: { country: 'USA' },
        })
      );

      expect(result.current.shouldReloadOptions).toBe(true);
    });

    it('calls onReloadOptions when dependency value changes', () => {
      const onReloadOptions = jest.fn();
      const filter: FilterDefinition = {
        id: 'city',
        type: 'select',
        label: 'City',
        dependencies: [{ dependsOn: 'country', action: 'reload-options' }],
      };

      const { rerender } = renderHook(
        ({ allValues }) => useFilterDependencies({ filter, allValues, onReloadOptions }),
        { initialProps: { allValues: { country: 'USA' } } }
      );

      expect(onReloadOptions).not.toHaveBeenCalled();

      rerender({ allValues: { country: 'Canada' } });

      expect(onReloadOptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom condition functions', () => {
    it('uses custom condition function', () => {
      const filter: FilterDefinition = {
        id: 'discount',
        type: 'number',
        label: 'Discount',
        dependencies: [
          {
            dependsOn: 'price',
            action: 'show',
            condition: (values) => (values.price as number) > 100,
          },
        ],
      };

      const { result: result1 } = renderHook(() =>
        useFilterDependencies({ filter, allValues: { price: 150 } })
      );
      expect(result1.current.isVisible).toBe(true);

      const { result: result2 } = renderHook(() =>
        useFilterDependencies({ filter, allValues: { price: 50 } })
      );
      expect(result2.current.isVisible).toBe(false);
    });
  });

  describe('resetOnChange', () => {
    it('calls onResetValue when dependency changes', () => {
      const onResetValue = jest.fn();
      const filter: FilterDefinition = {
        id: 'subcategory',
        type: 'select',
        label: 'Subcategory',
        dependencies: [{ dependsOn: 'category', action: 'show', resetOnChange: true }],
      };

      const { rerender } = renderHook(
        ({ allValues }) => useFilterDependencies({ filter, allValues, onResetValue }),
        { initialProps: { allValues: { category: 'electronics' } } }
      );

      expect(onResetValue).not.toHaveBeenCalled();

      rerender({ allValues: { category: 'books' } });

      expect(onResetValue).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDependencyValues utility', () => {
    it('returns empty object when no dependencies', () => {
      const filter: FilterDefinition = {
        id: 'test',
        type: 'text',
        label: 'Test',
      };

      expect(getDependencyValues(filter, { field1: 'value1' })).toEqual({});
    });

    it('returns values for dependency fields', () => {
      const filter: FilterDefinition = {
        id: 'product',
        type: 'select',
        label: 'Product',
        dependencies: [{ dependsOn: ['category', 'brand'], action: 'show' }],
      };

      const result = getDependencyValues(filter, {
        category: 'electronics',
        brand: 'Apple',
        otherField: 'ignored',
      });

      expect(result).toEqual({
        category: 'electronics',
        brand: 'Apple',
      });
    });
  });
});
