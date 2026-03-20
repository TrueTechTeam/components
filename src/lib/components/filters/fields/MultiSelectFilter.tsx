/**
 * MultiSelectFilter - Multi-select filter with checkbox group, list, or dropdown mode
 */

import React, { useState, useCallback, useRef } from 'react';
import { CheckboxGroup, CheckboxGroupItem } from '../../inputs/CheckboxGroup';
import { Checkbox } from '../../inputs/Checkbox';
import { Input } from '../../inputs/Input';
import { Menu } from '../../overlays/Menu';
import { MenuList } from '../../overlays/Menu/MenuList';
import { MenuItem } from '../../overlays/Menu/MenuItem';
import { Icon } from '../../display/Icon';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { MultiSelectFilterConfig } from '../types';
import styles from './MultiSelectFilter.module.scss';

export interface MultiSelectFilterProps extends BaseComponentProps {
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
  /** Additional props */
  componentProps?: Record<string, unknown>;
}

/**
 * MultiSelectFilter wraps CheckboxGroup for multi-value selection
 */
export const MultiSelectFilter = ({
  ref,
  filterId,
  label: labelOverride,
  placeholder: placeholderOverride,
  showLabel = true,
  size = 'md',
  componentProps,
  className,
  ...restProps
}: MultiSelectFilterProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const { filter, value, setValue, isEnabled, options, error } = useFilter<string[]>({
    filterId,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
  const placeholder = placeholderOverride ?? filter.placeholder ?? `Select ${label}`;
  const displayMode = config?.displayMode ?? 'checkbox-group';
  const orientation = config?.orientation ?? 'vertical';

  const allSelected =
    options.options.filter((opt) => !opt.disabled).length === (value?.length ?? 0);

  const componentClasses = [styles.multiSelectFilter, className].filter(Boolean).join(' ');

  // Dropdown display mode — renders like a Select with checkboxes inside
  if (displayMode === 'dropdown') {
    const selectedCount = value?.length ?? 0;

    // Build display text
    let displayText = placeholder;
    if (selectedCount === 1) {
      const selectedOpt = options.options.find((o) => String(o.value) === value?.[0]);
      displayText = selectedOpt ? String(selectedOpt.label) : (value?.[0] ?? '');
    } else if (selectedCount > 1) {
      displayText = `${selectedCount} selected`;
    }

    // Filter options by search
    const filteredOptions = searchQuery
      ? options.options.filter((opt) =>
          String(opt.label).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options.options;

    const handleToggleItem = (optionValue: string) => {
      const current = value ?? [];
      const isSelected = current.includes(optionValue);
      if (isSelected) {
        setValue(current.filter((v) => v !== optionValue));
      } else {
        setValue([...current, optionValue]);
      }
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setSearchQuery('');
      } else {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    };

    return (
      <div ref={ref} className={componentClasses} data-mode="dropdown" {...restProps}>
        {showLabel && <label className={styles.label}>{label}</label>}

        <Menu
          trigger={
            <div
              ref={triggerRef}
              className={styles.dropdownTrigger}
              data-disabled={!isEnabled || undefined}
              data-open={isOpen || undefined}
              data-has-value={selectedCount > 0 || undefined}
              role="button"
              tabIndex={isEnabled ? 0 : -1}
              onClick={() => {
                if (isEnabled) {
                  setIsOpen((prev) => !prev);
                }
              }}
            >
              <span
                className={styles.dropdownValue}
                data-placeholder={selectedCount === 0 || undefined}
              >
                {displayText}
              </span>
              <Icon
                name="chevron-down"
                className={styles.dropdownArrow}
                data-open={isOpen || undefined}
              />
            </div>
          }
          selectionMode="multi"
          selectedKeys={value ?? []}
          onSelectionChange={handleChange}
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          position="bottom-left"
          width="trigger"
        >
          <div className={styles.dropdownContent}>
            {options.options.length > 6 && (
              <div className={styles.dropdownSearch}>
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startIcon="search"
                  showClearButton
                  onClear={() => setSearchQuery('')}
                />
              </div>
            )}

            {config?.showSelectAll && (
              <div className={styles.dropdownSelectAll}>
                <Checkbox
                  checked={allSelected}
                  onChange={() => (allSelected ? handleClearAll() : handleSelectAll())}
                  label={config.selectAllLabel ?? 'Select all'}
                  disabled={!isEnabled}
                  size={size}
                />
              </div>
            )}

            <MenuList>
              {filteredOptions.length === 0 ? (
                <div className={styles.dropdownNoResults}>
                  {searchQuery ? 'No results found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const optVal = String(option.value);
                  const isChecked = value?.includes(optVal) ?? false;

                  return (
                    <MenuItem key={optVal} itemKey={optVal} disabled={option.disabled}>
                      <span className={styles.dropdownOption}>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleToggleItem(optVal)}
                          disabled={option.disabled || !isEnabled}
                          size="sm"
                          label={String(option.label)}
                        />
                      </span>
                    </MenuItem>
                  );
                })
              )}
            </MenuList>

            {selectedCount > 0 && (
              <div className={styles.dropdownFooter}>
                <button type="button" className={styles.dropdownClearBtn} onClick={handleClearAll}>
                  Clear all ({selectedCount})
                </button>
              </div>
            )}
          </div>
        </Menu>

        {filter.helperText && <span className={styles.helperText}>{filter.helperText}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

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
};

export default MultiSelectFilter;
