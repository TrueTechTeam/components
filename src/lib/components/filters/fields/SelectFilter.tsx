/**
 * SelectFilter - Single select dropdown filter
 */

import React, { forwardRef } from 'react';
import { Select } from '../../inputs/Select';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { SelectFilterConfig } from '../types';

export interface SelectFilterProps extends BaseComponentProps {
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
  /** Additional props for Select component */
  selectProps?: Record<string, unknown>;
}

/**
 * SelectFilter wraps the Select component for use in filter systems
 */
export const SelectFilter = forwardRef<HTMLDivElement, SelectFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      placeholder: placeholderOverride,
      showLabel = true,
      size = 'md',
      selectProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, options, error } = useFilter<string>({ filterId });

    if (!filter) {
      console.warn(`SelectFilter: Filter "${filterId}" not found`);
      return null;
    }

    const config = filter.config as SelectFilterConfig | undefined;
    const label = labelOverride ?? filter.label;
    const placeholder = placeholderOverride ?? filter.placeholder ?? `Select ${label}`;

    const handleChange = (newValue: string) => {
      setValue(newValue);
    };

    return (
      <div ref={ref} className={className} {...restProps}>
        <Select
          value={value ?? ''}
          onChange={handleChange}
          options={options.options.map((opt) => ({
            value: String(opt.value),
            label: opt.label as string,
            disabled: opt.disabled,
            group: opt.group,
          }))}
          label={showLabel ? label : undefined}
          placeholder={placeholder}
          disabled={!isEnabled}
          error={!!error}
          errorMessage={error ?? undefined}
          helperText={filter.helperText}
          searchable={config?.searchable}
          searchPlaceholder={config?.searchPlaceholder}
          showClearButton={config?.showClearButton}
          scrollToSelected={config?.scrollToSelected}
          {...selectProps}
        />
      </div>
    );
  }
);

SelectFilter.displayName = 'SelectFilter';

export default SelectFilter;
