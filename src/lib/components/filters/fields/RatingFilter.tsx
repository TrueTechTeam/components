/**
 * RatingFilter - Star rating filter
 */

import React, { forwardRef } from 'react';
import { Rating } from '../../inputs/Rating';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { RatingFilterConfig } from '../types';
import styles from './RatingFilter.module.scss';

export interface RatingFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props for Rating component */
  ratingProps?: Record<string, unknown>;
}

/**
 * RatingFilter wraps the Rating component for star-based filters
 */
export const RatingFilter = forwardRef<HTMLDivElement, RatingFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      showLabel = true,
      size = 'md',
      ratingProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, error } = useFilter<number>({ filterId });

    if (!filter) {
      console.warn(`RatingFilter: Filter "${filterId}" not found`);
      return null;
    }

    const config = filter.config as RatingFilterConfig | undefined;
    const label = labelOverride ?? filter.label;

    const handleChange = (newValue: number) => {
      // Allow clearing by clicking the same value
      if (config?.allowClear && newValue === value) {
        setValue(0);
      } else {
        setValue(newValue);
      }
    };

    const componentClasses = [styles.ratingFilter, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={componentClasses} {...restProps}>
        {showLabel && <label className={styles.label}>{label}</label>}

        <Rating
          value={value ?? 0}
          onChange={handleChange}
          max={config?.max ?? 5}
          disabled={!isEnabled}
          icon={config?.icon}
          emptyIcon={config?.emptyIcon}
          size={size}
          {...ratingProps}
        />

        {filter.helperText && <span className={styles.helperText}>{filter.helperText}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

RatingFilter.displayName = 'RatingFilter';

export default RatingFilter;
