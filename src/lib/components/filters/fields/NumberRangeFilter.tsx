/**
 * NumberRangeFilter - Number range filter with slider or dual inputs
 */

import React, { forwardRef, useCallback } from 'react';
import { Slider } from '../../inputs/Slider';
import { NumberInput } from '../../inputs/NumberInput';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { NumberRangeFilterConfig, NumberRangeValue } from '../types';
import styles from './NumberRangeFilter.module.scss';

export interface NumberRangeFilterProps extends BaseComponentProps {
  /** Filter ID from FilterDefinition */
  filterId: string;
  /** Override label */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Size variant */
  size?: ComponentSize;
  /** Additional props */
  componentProps?: Record<string, unknown>;
}

/**
 * NumberRangeFilter provides min/max number filtering with slider or inputs
 */
export const NumberRangeFilter = forwardRef<HTMLDivElement, NumberRangeFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      showLabel = true,
      size = 'md',
      componentProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, error } = useFilter<NumberRangeValue>({ filterId });

    const handleSliderChange = useCallback(
      (sliderValue: number | number[]) => {
        if (Array.isArray(sliderValue)) {
          setValue({ min: sliderValue[0], max: sliderValue[1] });
        }
      },
      [setValue]
    );

    const handleMinChange = useCallback(
      (newMin: number, currentMaxVal: number) => {
        setValue({ min: newMin, max: currentMaxVal });
      },
      [setValue]
    );

    const handleMaxChange = useCallback(
      (newMax: number, currentMinVal: number) => {
        setValue({ min: currentMinVal, max: newMax });
      },
      [setValue]
    );

    if (!filter) {
      console.warn(`NumberRangeFilter: Filter "${filterId}" not found`);
      return null;
    }

    const config = filter.config as NumberRangeFilterConfig | undefined;
    const label = labelOverride ?? filter.label;
    const displayMode = config?.displayMode ?? 'slider';
    const min = config?.min ?? 0;
    const max = config?.max ?? 100;
    const step = config?.step ?? 1;

    const currentMin = value?.min ?? min;
    const currentMax = value?.max ?? max;

    // Custom display formatter with prefix/suffix
    const formatValue =
      config?.prefix || config?.suffix
        ? (val: number) => `${config?.prefix ?? ''}${val}${config?.suffix ?? ''}`
        : (val: number) => String(val);

    const componentClasses = [styles.numberRangeFilter, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={componentClasses} data-mode={displayMode} {...restProps}>
        {showLabel && <label className={styles.label}>{label}</label>}

        {(displayMode === 'slider' || displayMode === 'both') && (
          <div className={styles.sliderContainer}>
            <Slider
              value={[currentMin, currentMax]}
              onChange={handleSliderChange}
              min={min}
              max={max}
              step={step}
              disabled={!isEnabled}
              showValue
              valueLabelFormat={formatValue}
              size={size}
              {...componentProps}
            />
          </div>
        )}

        {(displayMode === 'inputs' || displayMode === 'both') && (
          <div className={styles.inputsContainer}>
            <div className={styles.inputWrapper}>
              {config?.showLabels && (
                <span className={styles.inputLabel}>{config?.minLabel ?? 'Min'}</span>
              )}
              <NumberInput
                value={currentMin}
                onChange={(newMin) => handleMinChange(newMin, currentMax)}
                min={min}
                max={currentMax}
                step={step}
                disabled={!isEnabled}
              />
            </div>
            <span className={styles.separator}>-</span>
            <div className={styles.inputWrapper}>
              {config?.showLabels && (
                <span className={styles.inputLabel}>{config?.maxLabel ?? 'Max'}</span>
              )}
              <NumberInput
                value={currentMax}
                onChange={(newMax) => handleMaxChange(newMax, currentMin)}
                min={currentMin}
                max={max}
                step={step}
                disabled={!isEnabled}
              />
            </div>
          </div>
        )}

        {filter.helperText && <span className={styles.helperText}>{filter.helperText}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

NumberRangeFilter.displayName = 'NumberRangeFilter';

export default NumberRangeFilter;
