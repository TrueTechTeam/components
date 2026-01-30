/**
 * MultiSelectFilter - Multi-select filter with checkbox group or dropdown mode
 */

import React, { forwardRef, useCallback } from 'react';
import { CheckboxGroup, CheckboxGroupItem } from '../../inputs/CheckboxGroup';
import { Checkbox } from '../../inputs/Checkbox';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { MultiSelectFilterConfig } from '../types';
import styles from './MultiSelectFilter.module.scss';

export interface MultiSelectFilterProps extends BaseComponentProps {
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
 * MultiSelectFilter wraps CheckboxGroup for multi-value selection
 */
export const MultiSelectFilter = forwardRef<HTMLDivElement, MultiSelectFilterProps>(
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
    const { filter, value, setValue, isEnabled, options, error } = useFilter<string[]>({
      filterId,
    });

    const handleChange = useCallback(
      (newValues: string[]) => {
        setValue(newValues);
      },
      [setValue]
    );

    const handleSelectAll = useCallback(() => {
      const allValues = options.options
        .filter((opt) => !opt.disabled)
        .map((opt) => String(opt.value));
      setValue(allValues);
    }, [options.options, setValue]);

    const handleClearAll = useCallback(() => {
      setValue([]);
    }, [setValue]);

    if (!filter) {
      console.warn(`MultiSelectFilter: Filter "${filterId}" not found`);
      return null;
    }

    const config = filter.config as MultiSelectFilterConfig | undefined;
    const label = labelOverride ?? filter.label;
    const displayMode = config?.displayMode ?? 'checkbox-group';
    const orientation = config?.orientation ?? 'vertical';

    const allSelected =
      options.options.filter((opt) => !opt.disabled).length === (value?.length ?? 0);

    const componentClasses = [styles.multiSelectFilter, className].filter(Boolean).join(' ');

    if (displayMode === 'checkbox-group') {
      return (
        <div ref={ref} className={componentClasses} data-orientation={orientation} {...restProps}>
          {showLabel && <label className={styles.label}>{label}</label>}

          {config?.showSelectAll && (
            <div className={styles.selectAllRow}>
              <Checkbox
                checked={allSelected}
                onChange={() => (allSelected ? handleClearAll() : handleSelectAll())}
                label={config.selectAllLabel ?? 'Select all'}
                disabled={!isEnabled}
                size={size}
              />
            </div>
          )}

          <CheckboxGroup
            value={value ?? []}
            onChange={handleChange}
            orientation={orientation}
            disabled={!isEnabled}
            error={!!error}
            errorMessage={error ?? undefined}
            helperText={filter.helperText}
            min={config?.min}
            max={config?.max}
            size={size}
            {...componentProps}
          >
            {options.options.map((option) => (
              <CheckboxGroupItem
                key={String(option.value)}
                value={String(option.value)}
                label={option.label as string}
                disabled={option.disabled}
              />
            ))}
          </CheckboxGroup>
        </div>
      );
    }

    // List mode - simple vertical list of checkboxes
    return (
      <div ref={ref} className={componentClasses} data-mode="list" {...restProps}>
        {showLabel && <label className={styles.label}>{label}</label>}

        {config?.showSelectAll && (
          <div className={styles.selectAllRow}>
            <Checkbox
              checked={allSelected}
              onChange={() => (allSelected ? handleClearAll() : handleSelectAll())}
              label={config.selectAllLabel ?? 'Select all'}
              disabled={!isEnabled}
              size={size}
            />
          </div>
        )}

        <div className={styles.optionsList}>
          {options.options.map((option) => {
            const isChecked = value?.includes(String(option.value)) ?? false;

            return (
              <div key={String(option.value)} className={styles.optionItem}>
                <Checkbox
                  checked={isChecked}
                  onChange={(checked) => {
                    if (checked) {
                      setValue([...(value ?? []), String(option.value)]);
                    } else {
                      setValue((value ?? []).filter((v) => v !== String(option.value)));
                    }
                  }}
                  label={
                    <span className={styles.optionLabel}>
                      {option.label}
                      {option.count !== undefined && (
                        <span className={styles.optionCount}>({option.count})</span>
                      )}
                    </span>
                  }
                  disabled={!isEnabled || option.disabled}
                  size={size}
                />
              </div>
            );
          })}
        </div>

        {filter.helperText && <span className={styles.helperText}>{filter.helperText}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

MultiSelectFilter.displayName = 'MultiSelectFilter';

export default MultiSelectFilter;
