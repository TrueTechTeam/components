/**
 * FilterBar - Horizontal inline filter bar
 */

import React, { forwardRef, useMemo, useState } from 'react';
import { Button } from '../../../buttons/Button';
import { Popover } from '../../../overlays/Popover';
import { Icon } from '../../../display/Icon';
import { useFilterContext } from '../../FilterContext';
import { ActiveFilters } from '../../core/ActiveFilters';
import { FilterField } from '../../core/FilterField';
import type { FilterBarProps } from '../../types';
import styles from './FilterBar.module.scss';

/**
 * FilterBar provides a horizontal layout for inline filters.
 * Supports overflow handling with a "More Filters" dropdown.
 *
 * @example
 * ```tsx
 * <FilterProvider filters={filters}>
 *   <FilterBar visibleFilters={['status', 'date']}>
 *     <FilterField filterId="status" showLabel={false} />
 *     <FilterField filterId="date" showLabel={false} />
 *   </FilterBar>
 * </FilterProvider>
 * ```
 */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      visibleFilters,
      showMoreFilters = true,
      moreFiltersLabel = 'More Filters',
      wrap = true,
      gap = 'md',
      showActiveFilters = true,
      activeFiltersPosition = 'inline',
      showApplyButton = false,
      applyButtonLabel = 'Apply',
      showClearButton = true,
      clearButtonLabel = 'Clear',
      showResetButton = false,
      resetButtonLabel = 'Reset',
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const ctx = useFilterContext();
    const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

    // Determine which filters go in "More"
    const moreFilters = useMemo(() => {
      if (!ctx || !visibleFilters) {
        return [];
      }

      return ctx.filters.filter(
        (filter) => !visibleFilters.includes(filter.id) && ctx.isFilterVisible(filter.id)
      );
    }, [ctx, visibleFilters]);

    const handleApply = () => {
      ctx?.applyFilters();
    };

    const handleClear = () => {
      ctx?.clearAllFilters();
    };

    const handleReset = () => {
      ctx?.resetFilters();
    };

    const componentClasses = [styles.filterBar, className].filter(Boolean).join(' ');

    const hasActionButtons = showApplyButton || showClearButton || showResetButton;

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-wrap={wrap || undefined}
        data-gap={gap}
        {...restProps}
      >
        {/* Active filters at top */}
        {showActiveFilters && activeFiltersPosition === 'top' && (
          <div className={styles.activeFiltersRow}>
            <ActiveFilters maxVisible={5} showClearAll={false} />
          </div>
        )}

        <div className={styles.filtersRow}>
          {/* Main filter controls */}
          <div className={styles.filters}>{children}</div>

          {/* More Filters dropdown */}
          {showMoreFilters && moreFilters.length > 0 && (
            <Popover
              isOpen={moreFiltersOpen}
              onOpenChange={setMoreFiltersOpen}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  endIcon={<Icon name="chevron-down" size="1em" />}
                >
                  {moreFiltersLabel}
                  {moreFilters.some((f) => ctx?.isFilterActive(f.id)) && (
                    <span className={styles.moreFiltersBadge}>
                      {moreFilters.filter((f) => ctx?.isFilterActive(f.id)).length}
                    </span>
                  )}
                </Button>
              }
              position="bottom-left"
            >
              <div className={styles.moreFiltersContent}>
                {moreFilters.map((filter) => (
                  <FilterField key={filter.id} filterId={filter.id} showLabel />
                ))}
              </div>
            </Popover>
          )}

          {/* Inline active filters */}
          {showActiveFilters && activeFiltersPosition === 'inline' && (
            <ActiveFilters maxVisible={3} showClearAll={false} />
          )}

          {/* Action buttons */}
          {hasActionButtons && (
            <div className={styles.actions}>
              {showResetButton && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  {resetButtonLabel}
                </Button>
              )}
              {showClearButton && ctx && ctx.activeCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleClear}>
                  {clearButtonLabel}
                </Button>
              )}
              {showApplyButton && ctx?.hasPendingChanges && (
                <Button variant="primary" size="sm" onClick={handleApply}>
                  {applyButtonLabel}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Active filters at bottom */}
        {showActiveFilters && activeFiltersPosition === 'bottom' && (
          <div className={styles.activeFiltersRow}>
            <ActiveFilters maxVisible={5} showClearAll />
          </div>
        )}
      </div>
    );
  }
);

FilterBar.displayName = 'FilterBar';

export default FilterBar;

