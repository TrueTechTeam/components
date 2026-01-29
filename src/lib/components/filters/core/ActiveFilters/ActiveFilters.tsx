/**
 * ActiveFilters - Displays currently applied filters as removable chips
 */

import React, { forwardRef, useMemo, useState } from 'react';
import { Chip } from '../../../display/Chip';
import { Button } from '../../../buttons/Button';
import { useFilterContextStrict } from '../../FilterContext';
import type { ActiveFiltersProps, FilterDefinition, FilterValue } from '../../types';
import styles from './ActiveFilters.module.scss';

/**
 * ActiveFilters displays the currently applied filters as removable chips.
 * Provides an easy way for users to see and remove active filters.
 *
 * @example
 * ```tsx
 * <FilterProvider filters={filters}>
 *   <ActiveFilters maxVisible={5} showClearAll />
 *   <FilterSidebar>...</FilterSidebar>
 * </FilterProvider>
 * ```
 */
export const ActiveFilters = forwardRef<HTMLDivElement, ActiveFiltersProps>(
  (
    {
      maxVisible,
      showClearAll = true,
      clearAllLabel = 'Clear all',
      emptyContent,
      chipVariant = 'secondary',
      chipSize = 'sm',
      renderChip,
      className,
      ...restProps
    },
    ref
  ) => {
    const ctx = useFilterContextStrict();
    const [showAll, setShowAll] = useState(false);

    // Get all active filters with their metadata
    const activeFilters = useMemo(() => {
      const active: Array<{
        filter: FilterDefinition;
        value: FilterValue;
        displayValue: string;
      }> = [];

      for (const filter of ctx.filters) {
        if (ctx.isFilterActive(filter.id) && ctx.isFilterVisible(filter.id)) {
          const meta = ctx.getFilterMeta(filter.id);
          active.push({
            filter,
            value: ctx.values[filter.id],
            displayValue: meta?.displayValue ?? String(ctx.values[filter.id]),
          });
        }
      }

      return active;
    }, [ctx]);

    const handleRemoveFilter = (filterId: string) => {
      ctx.clearFilter(filterId);
    };

    const handleClearAll = () => {
      ctx.clearAllFilters();
    };

    // Determine which filters to show
    const visibleFilters = maxVisible && !showAll
      ? activeFilters.slice(0, maxVisible)
      : activeFilters;

    const hiddenCount = maxVisible ? activeFilters.length - maxVisible : 0;
    const hasHiddenFilters = hiddenCount > 0 && !showAll;

    const componentClasses = [styles.activeFilters, className].filter(Boolean).join(' ');

    // If no active filters, show empty content or nothing
    if (activeFilters.length === 0) {
      if (emptyContent) {
        return (
          <div ref={ref} className={componentClasses} {...restProps}>
            {emptyContent}
          </div>
        );
      }
      return null;
    }

    return (
      <div ref={ref} className={componentClasses} {...restProps}>
        <div className={styles.chipList}>
          {visibleFilters.map(({ filter, value, displayValue }) => {
            const label = filter.shortLabel || filter.label;
            const chipContent = `${label}: ${displayValue}`;

            if (renderChip) {
              return (
                <React.Fragment key={filter.id}>
                  {renderChip(filter, value, () => handleRemoveFilter(filter.id))}
                </React.Fragment>
              );
            }

            return (
              <Chip
                key={filter.id}
                variant={chipVariant}
                size={chipSize}
                onRemove={() => handleRemoveFilter(filter.id)}
                removeButtonAriaLabel={`Remove ${label} filter`}
              >
                {chipContent}
              </Chip>
            );
          })}

          {hasHiddenFilters && (
            <button
              type="button"
              className={styles.showMoreButton}
              onClick={() => setShowAll(true)}
            >
              +{hiddenCount} more
            </button>
          )}

          {showAll && maxVisible && activeFilters.length > maxVisible && (
            <button
              type="button"
              className={styles.showLessButton}
              onClick={() => setShowAll(false)}
            >
              Show less
            </button>
          )}
        </div>

        {showClearAll && activeFilters.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className={styles.clearAllButton}
          >
            {clearAllLabel}
          </Button>
        )}
      </div>
    );
  }
);

ActiveFilters.displayName = 'ActiveFilters';

export default ActiveFilters;
