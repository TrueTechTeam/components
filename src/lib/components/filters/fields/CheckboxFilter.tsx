/**
 * CheckboxFilter - Single checkbox boolean filter
 */

import React, { forwardRef } from 'react';
import { Checkbox } from '../../inputs/Checkbox';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';

export interface CheckboxFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props for Checkbox component */
  checkboxProps?: Record<string, unknown>;
}

/**
 * CheckboxFilter wraps the Checkbox component for boolean filters
 */
export const CheckboxFilter = forwardRef<HTMLDivElement, CheckboxFilterProps>(
  (
    { filterId, label: labelOverride, size = 'md', checkboxProps, className, ...restProps },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, error } = useFilter<boolean>({ filterId });

    if (!filter) {
      console.warn(`CheckboxFilter: Filter "${filterId}" not found`);
      return null;
    }

    const label = labelOverride ?? filter.label;

    const handleChange = (checked: boolean) => {
      setValue(checked);
    };

    return (
      <div ref={ref} className={className} {...restProps}>
        <Checkbox
          checked={value ?? false}
          onChange={handleChange}
          label={label}
          disabled={!isEnabled}
          error={!!error}
          errorMessage={error ?? undefined}
          helperText={filter.helperText}
          size={size}
          {...checkboxProps}
        />
      </div>
    );
  }
);

CheckboxFilter.displayName = 'CheckboxFilter';

export default CheckboxFilter;
