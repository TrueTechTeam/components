/**
 * ToggleFilter - Toggle/switch boolean filter
 */

import React, { forwardRef } from 'react';
import { Toggle } from '../../inputs/Toggle';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';

export interface ToggleFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props for Toggle component */
  toggleProps?: Record<string, unknown>;
}

/**
 * ToggleFilter wraps the Toggle component for boolean switch filters
 */
export const ToggleFilter = forwardRef<HTMLDivElement, ToggleFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      size = 'md',
      toggleProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const {
      filter,
      value,
      setValue,
      isEnabled,
      error,
    } = useFilter<boolean>({ filterId });

    if (!filter) {
      console.warn(`ToggleFilter: Filter "${filterId}" not found`);
      return null;
    }

    const label = labelOverride ?? filter.label;

    const handleChange = (checked: boolean) => {
      setValue(checked);
    };

    return (
      <div ref={ref} className={className} {...restProps}>
        <Toggle
          checked={value ?? false}
          onChange={handleChange}
          label={label}
          disabled={!isEnabled}
          error={!!error}
          errorMessage={error ?? undefined}
          helperText={filter.helperText}
          size={size}
          {...toggleProps}
        />
      </div>
    );
  }
);

ToggleFilter.displayName = 'ToggleFilter';

export default ToggleFilter;
