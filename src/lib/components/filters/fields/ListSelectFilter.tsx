/**
 * ListSelectFilter - Searchable list selection filter
 */

import React, { forwardRef, useState, useCallback } from 'react';
import { Input } from '../../inputs/Input';
import { Checkbox } from '../../inputs/Checkbox';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { ListSelectFilterConfig } from '../types';
import styles from './ListSelectFilter.module.scss';

export interface ListSelectFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props */
  componentProps?: Record<string, unknown>;
}

/**
 * ListSelectFilter provides a searchable list for selecting one or more items
 */
export const ListSelectFilter = forwardRef<HTMLDivElement, ListSelectFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      showLabel = true,
      size = 'md',
      componentProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, options, error } = useFilter<string | string[]>({
      filterId,
    });

    const [searchQuery, setSearchQuery] = useState('');

    const handleSingleSelect = useCallback(
      (optionValue: string) => {
        setValue(optionValue);
      },
      [setValue]
    );

    const handleMultiSelect = useCallback(
      (optionValue: string, checked: boolean) => {
        const currentValues = Array.isArray(value) ? value : [];
        if (checked) {
          setValue([...currentValues, optionValue]);
        } else {
          setValue(currentValues.filter((v) => v !== optionValue));
        }
      },
      [value, setValue]
    );

    if (!filter) {
      console.warn(`ListSelectFilter: Filter "${filterId}" not found`);
      return null;
    }

    const config = filter.config as ListSelectFilterConfig | undefined;
    const label = labelOverride ?? filter.label;
    const selectionMode = config?.selectionMode ?? 'multiple';
    const searchable = config?.searchable ?? true;
    const maxHeight = config?.maxHeight ?? 200;

    // Filter options based on search
    const filteredOptions = searchQuery
      ? options.options.filter((opt) =>
          String(opt.label).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options.options;

    const isSelected = (optionValue: string): boolean => {
      if (selectionMode === 'single') {
        return value === optionValue;
      }
      return Array.isArray(value) && value.includes(optionValue);
    };

    const componentClasses = [styles.listSelectFilter, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={componentClasses} {...restProps}>
        {showLabel && <label className={styles.label}>{label}</label>}

        {searchable && (
          <div className={styles.searchContainer}>
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={config?.searchPlaceholder ?? 'Search...'}
              disabled={!isEnabled}
              showClearButton
              onClear={() => setSearchQuery('')}
            />
          </div>
        )}

        <div
          className={styles.listContainer}
          style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
        >
          {options.loading && <div className={styles.loadingState}>Loading...</div>}

          {!options.loading && filteredOptions.length === 0 && (
            <div className={styles.emptyState}>No options found</div>
          )}

          {!options.loading &&
            filteredOptions.map((option) => {
              const optionValue = String(option.value);
              const selected = isSelected(optionValue);

              return (
                <div
                  key={optionValue}
                  className={styles.listItem}
                  data-selected={selected || undefined}
                  data-disabled={option.disabled || !isEnabled || undefined}
                >
                  {selectionMode === 'single' ? (
                    <button
                      type="button"
                      className={styles.selectButton}
                      onClick={() => handleSingleSelect(optionValue)}
                      disabled={option.disabled || !isEnabled}
                    >
                      <span className={styles.optionLabel}>{option.label}</span>
                      {config?.showCounts && option.count !== undefined && (
                        <span className={styles.optionCount}>({option.count})</span>
                      )}
                    </button>
                  ) : (
                    <Checkbox
                      checked={selected}
                      onChange={(checked) => handleMultiSelect(optionValue, checked)}
                      disabled={option.disabled || !isEnabled}
                      label={
                        <span className={styles.optionLabel}>
                          {option.label}
                          {config?.showCounts && option.count !== undefined && (
                            <span className={styles.optionCount}>({option.count})</span>
                          )}
                        </span>
                      }
                      size={size}
                    />
                  )}
                </div>
              );
            })}

          {options.hasMore && (
            <button
              type="button"
              className={styles.loadMoreButton}
              onClick={options.loadMore}
              disabled={options.loading}
            >
              Load more...
            </button>
          )}
        </div>

        {filter.helperText && <span className={styles.helperText}>{filter.helperText}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

ListSelectFilter.displayName = 'ListSelectFilter';

export default ListSelectFilter;
