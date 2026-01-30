/**
 * DateFilter - Single date picker filter
 */

import React, { forwardRef } from 'react';
import { DatePicker } from '../../inputs/DatePicker';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { DateFilterConfig } from '../types';

export interface DateFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Override placeholder */
  placeholder?: string;
  /** Show label */
  showLabel?: boolean;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props for DatePicker component */
  datePickerProps?: Record<string, unknown>;
}

/**
 * DateFilter wraps the DatePicker component for date filters
 */
export const DateFilter = forwardRef<HTMLDivElement, DateFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      placeholder: placeholderOverride,
      showLabel = true,
      size = 'md',
      datePickerProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, error } = useFilter<Date | null>({ filterId });

    if (!filter) {
      console.warn(`DateFilter: Filter "${filterId}" not found`);
      return null;
    }

    const config = filter.config as DateFilterConfig | undefined;
    const label = labelOverride ?? filter.label;
    const placeholder = placeholderOverride ?? filter.placeholder ?? 'Select date';

    const handleChange = (date: Date | null) => {
      setValue(date);
    };

    return (
      <div ref={ref} className={className} {...restProps}>
        <DatePicker
          value={value}
          onChange={handleChange}
          label={showLabel ? label : undefined}
          placeholder={placeholder}
          disabled={!isEnabled}
          error={!!error}
          errorMessage={error ?? undefined}
          helperText={filter.helperText}
          minDate={config?.minDate}
          maxDate={config?.maxDate}
          format={config?.format}
          showCalendar={config?.showCalendar}
          showClearButton={config?.showClearButton}
          {...datePickerProps}
        />
      </div>
    );
  }
);

DateFilter.displayName = 'DateFilter';

export default DateFilter;
