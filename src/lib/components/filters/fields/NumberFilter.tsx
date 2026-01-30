/**
 * NumberFilter - Single number input filter
 */

import React, { forwardRef } from 'react';
import { NumberInput } from '../../inputs/NumberInput';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { NumberFilterConfig } from '../types';

export interface NumberFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props for NumberInput component */
  numberInputProps?: Record<string, unknown>;
}

/**
 * NumberFilter wraps the NumberInput component for numeric filters
 */
export const NumberFilter = forwardRef<HTMLDivElement, NumberFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      showLabel = true,
      size: _size = 'md',
      numberInputProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, error } = useFilter<number>({ filterId });

    if (!filter) {
      console.warn(`NumberFilter: Filter "${filterId}" not found`);
      return null;
    }

    const config = filter.config as NumberFilterConfig | undefined;
    const label = labelOverride ?? filter.label;

    const handleChange = (newValue: number) => {
      setValue(newValue);
    };

    // Custom display formatter with prefix/suffix
    const formatDisplay =
      config?.prefix || config?.suffix
        ? (val: number) => `${config?.prefix ?? ''}${val}${config?.suffix ?? ''}`
        : undefined;

    return (
      <div ref={ref} className={className} {...restProps}>
        <NumberInput
          value={value ?? 0}
          onChange={handleChange}
          label={showLabel ? label : undefined}
          disabled={!isEnabled}
          error={!!error}
          errorMessage={error ?? undefined}
          helperText={filter.helperText}
          min={config?.min}
          max={config?.max}
          step={config?.step}
          formatDisplay={formatDisplay}
          {...numberInputProps}
        />
      </div>
    );
  }
);

NumberFilter.displayName = 'NumberFilter';

export default NumberFilter;
