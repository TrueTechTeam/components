/**
 * DateRangeFilter - Date range picker filter
 */

import React from 'react';
import { DateRangePicker } from '../../inputs/DateRangePicker';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { DateRangeFilterConfig, DateRangeValue } from '../types';

export interface DateRangeFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props for DateRangePicker component */
  dateRangePickerProps?: Record<string, unknown>;
}

/**
 * DateRangeFilter wraps the DateRangePicker component for date range filters
 */
export const DateRangeFilter = ({
  ref,
  filterId,
  label: labelOverride,
  showLabel = true,
  size = 'md',
  dateRangePickerProps,
  className,
  ...restProps
}: DateRangeFilterProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const { filter, value, setValue, isEnabled, error } = useFilter<DateRangeValue>({ filterId });

  if (!filter) {
    console.warn(`DateRangeFilter: Filter "${filterId}" not found`);
    return null;
  }

  const config = filter.config as DateRangeFilterConfig | undefined;
  const label = labelOverride ?? filter.label;

  const handleChange = (startDate: Date | null, endDate: Date | null) => {
    setValue({ startDate, endDate });
  };

  // Convert presets to the format expected by DateRangePicker
  const presets = config?.presets?.map((preset) => ({
    label: preset.label,
    getValue: preset.getValue,
  }));

  return (
    <div ref={ref} className={className} {...restProps}>
      <DateRangePicker
        startDate={value?.startDate ?? null}
        endDate={value?.endDate ?? null}
        onChange={handleChange}
        label={showLabel ? label : undefined}
        disabled={!isEnabled}
        error={!!error}
        errorMessage={error ?? undefined}
        helperText={filter.helperText}
        minDate={config?.minDate}
        maxDate={config?.maxDate}
        presets={presets}
        {...dateRangePickerProps}
      />
    </div>
  );
};

export default DateRangeFilter;
