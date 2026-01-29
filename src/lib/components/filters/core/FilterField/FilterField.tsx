/**
 * FilterField - Unified wrapper that renders the appropriate filter component
 */

import React, { forwardRef } from 'react';
import { useFilterContextStrict } from '../../FilterContext';
import { SelectFilter } from '../../fields/SelectFilter';
import { MultiSelectFilter } from '../../fields/MultiSelectFilter';
import { CheckboxFilter } from '../../fields/CheckboxFilter';
import { ToggleFilter } from '../../fields/ToggleFilter';
import { TextFilter } from '../../fields/TextFilter';
import { DateFilter } from '../../fields/DateFilter';
import { DateRangeFilter } from '../../fields/DateRangeFilter';
import { NumberFilter } from '../../fields/NumberFilter';
import { NumberRangeFilter } from '../../fields/NumberRangeFilter';
import { RatingFilter } from '../../fields/RatingFilter';
import { ListSelectFilter } from '../../fields/ListSelectFilter';
import type { FilterFieldProps } from '../../types';
import styles from './FilterField.module.scss';

/**
 * FilterField is a unified wrapper that automatically renders the appropriate
 * filter component based on the filter definition's type.
 *
 * @example
 * ```tsx
 * <FilterProvider filters={filters}>
 *   <FilterField filterId="status" />
 *   <FilterField filterId="dateRange" showLabel={false} />
 *   <FilterField filterId="search" placeholder="Search..." />
 * </FilterProvider>
 * ```
 */
export const FilterField = forwardRef<HTMLDivElement, FilterFieldProps>(
  (
    {
      filterId,
      label,
      placeholder,
      showLabel = true,
      componentProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const ctx = useFilterContextStrict();
    const filter = ctx.getFilter(filterId);
    const isVisible = ctx.isFilterVisible(filterId);

    if (!filter) {
      console.warn(`FilterField: Filter "${filterId}" not found in context`);
      return null;
    }

    // Don't render if filter is not visible (due to dependencies)
    if (!isVisible) {
      return null;
    }

    const componentClasses = [styles.filterField, className].filter(Boolean).join(' ');
    const size = ctx.size;

    // Common props for all filter components
    const commonProps = {
      filterId,
      label,
      placeholder,
      showLabel,
      size,
      ...componentProps,
    };

    // Render the appropriate filter component based on type
    const renderFilterComponent = () => {
      switch (filter.type) {
        case 'select':
          return <SelectFilter {...commonProps} />;

        case 'multi-select':
          return <MultiSelectFilter {...commonProps} />;

        case 'checkbox':
          return <CheckboxFilter {...commonProps} />;

        case 'toggle':
          return <ToggleFilter {...commonProps} />;

        case 'text':
          return <TextFilter {...commonProps} />;

        case 'date':
          return <DateFilter {...commonProps} />;

        case 'date-range':
          return <DateRangeFilter {...commonProps} />;

        case 'number':
          return <NumberFilter {...commonProps} />;

        case 'number-range':
          return <NumberRangeFilter {...commonProps} />;

        case 'rating':
          return <RatingFilter {...commonProps} />;

        case 'list-select':
          return <ListSelectFilter {...commonProps} />;

        default:
          console.warn(`FilterField: Unknown filter type "${filter.type}"`);
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-filter-id={filterId}
        data-filter-type={filter.type}
        {...restProps}
      >
        {renderFilterComponent()}
      </div>
    );
  }
);

FilterField.displayName = 'FilterField';

export default FilterField;
