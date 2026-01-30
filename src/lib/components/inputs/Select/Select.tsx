import React, {
  forwardRef,
  useState,
  useId,
  useCallback,
  useRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Icon } from '../../display/Icon';
import { IconButton } from '../../buttons/IconButton';
import { Input } from '../Input';
import { Menu } from '../../overlays/Menu';
import { MenuList } from '../../overlays/Menu/MenuList';
import { MenuItem } from '../../overlays/Menu/MenuItem';
import { MenuGroup } from '../../overlays/Menu/MenuGroup';
import type { IconName } from '../../display/Icon/icons';
import styles from './Select.module.scss';

export interface SelectOption {
  /**
   * Option value
   */
  value: string;

  /**
   * Option label (displayed text)
   */
  label: React.ReactNode;

  /**
   * Whether option is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional group name for grouping options
   */
  group?: string;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Options to display
   */
  options: SelectOption[];

  /**
   * Selected value
   */
  value?: string;

  /**
   * Default selected value for uncontrolled component
   */
  defaultValue?: string;

  /**
   * Callback fired when selection changes
   */
  onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;

  /**
   * Callback fired when select loses focus
   */
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;

  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the select is read-only
   * @default false
   */
  readOnly?: boolean;

  /**
   * Whether the select is required
   * @default false
   */
  required?: boolean;

  /**
   * Label text to display above select
   */
  label?: string;

  /**
   * Helper text to display below select
   */
  helperText?: string;

  /**
   * Error message to display when in error state
   */
  errorMessage?: string;

  /**
   * Whether the select is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * Show clear button to reset selection
   * @default false
   */
  showClearButton?: boolean;

  /**
   * Icon to display at start of select
   */
  startIcon?: React.ReactNode | IconName;

  /**
   * Icon to display at end of select (overrides default dropdown arrow)
   */
  endIcon?: React.ReactNode | IconName;

  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;

  /**
   * ID for the select element
   * Auto-generated if not provided
   */
  id?: string;

  /**
   * Enable search functionality for filtering options
   * @default false
   */
  searchable?: boolean;

  /**
   * Placeholder text for search input
   * @default 'Search...'
   */
  searchPlaceholder?: string;

  /**
   * Whether to scroll to the selected item when menu opens
   * @default true
   */
  scrollToSelected?: boolean;

  /**
   * Enable keyboard type-ahead navigation
   * When enabled, typing characters will jump to/cycle through matching items
   * @default false
   */
  enableTypeAhead?: boolean;

  /**
   * Delay in milliseconds before resetting the type-ahead search string
   * @default 500
   */
  typeAheadDelay?: number;
}

/**
 * Select component
 * Custom select element with Menu component, option grouping, and optional search
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *   ]}
 *   value={country}
 *   onChange={(value) => setCountry(value)}
 *   searchable
 * />
 * ```
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      onBlur,
      label,
      helperText,
      errorMessage,
      error = false,
      showClearButton = false,
      startIcon,
      endIcon,
      placeholder = 'Select an option',
      disabled = false,
      readOnly = false,
      required = false,
      id: providedId,
      searchable = false,
      searchPlaceholder = 'Search...',
      scrollToSelected = true,
      enableTypeAhead = false,
      typeAheadDelay = 500,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;

    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const triggerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Expose the trigger element via the forwarded ref
    useImperativeHandle(ref, () => triggerRef.current!);

    const handleSelectionChange = useCallback(
      (keys: string[]) => {
        const newValue = keys[0] || '';

        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }

        // Create a synthetic event for backward compatibility
        const syntheticEvent = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange?.(newValue, syntheticEvent);
        setIsOpen(false);
        setSearchQuery('');
      },
      [controlledValue, onChange]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        const emptyValue = '';
        if (controlledValue === undefined) {
          setInternalValue(emptyValue);
        }
        const syntheticEvent = {
          target: { value: emptyValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange?.(emptyValue, syntheticEvent);
      },
      [controlledValue, onChange]
    );

    const handleOpenChange = useCallback(
      (open: boolean) => {
        setIsOpen(open);
        if (!open) {
          setSearchQuery('');
        } else if (searchable && searchInputRef.current) {
          // Focus search input when menu opens
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      },
      [searchable]
    );

    const handleTriggerClick = useCallback(() => {
      if (disabled || readOnly) {
        return;
      }
      setIsOpen((prev) => !prev);
    }, [disabled, readOnly]);

    const renderIcon = (icon: React.ReactNode | IconName | undefined) => {
      if (!icon) {
        return null;
      }

      if (typeof icon === 'string') {
        return <Icon name={icon as IconName} className={styles.icon} />;
      }

      return <span className={styles.icon}>{icon}</span>;
    };

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
      if (!searchable || !searchQuery.trim()) {
        return options;
      }

      const query = searchQuery.toLowerCase();
      return options.filter((option) => {
        const label = typeof option.label === 'string' ? option.label : '';
        return label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query);
      });
    }, [options, searchQuery, searchable]);

    // Group options by group property
    const groupedOptions = useMemo(() => {
      return filteredOptions.reduce(
        (acc, option) => {
          const groupName = option.group || '__ungrouped__';
          if (!acc[groupName]) {
            acc[groupName] = [];
          }
          acc[groupName].push(option);
          return acc;
        },
        {} as Record<string, SelectOption[]>
      );
    }, [filteredOptions]);

    const hasGroups = Object.keys(groupedOptions).length > 1 || !groupedOptions['__ungrouped__'];

    // Get selected option label
    const selectedOption = options.find((opt) => opt.value === value);
    const displayValue = selectedOption?.label || placeholder;

    return (
      <div className={`${styles.container} ${className || ''}`}>
        {label && (
          <label htmlFor={id} className={styles.label} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <Menu
          trigger={
            <div
              ref={triggerRef}
              id={id}
              className={styles.selectTrigger}
              data-error={error || undefined}
              data-has-start-icon={!!startIcon || undefined}
              data-has-end-icon={!!(endIcon || showClearButton) || undefined}
              data-component="select"
              data-disabled={disabled || readOnly || undefined}
              data-open={isOpen || undefined}
              aria-label={ariaLabel || label}
              aria-invalid={error}
              aria-describedby={
                helperText || (error && errorMessage) ? `${id}-helper-text` : undefined
              }
              aria-disabled={disabled || readOnly}
              aria-required={required}
              role="button"
              tabIndex={disabled || readOnly ? -1 : 0}
              onClick={handleTriggerClick}
              onBlur={onBlur}
              {...rest}
            >
              {startIcon && <div className={styles.startIcon}>{renderIcon(startIcon)}</div>}

              <span className={styles.selectValue} data-placeholder={!selectedOption || undefined}>
                {displayValue}
              </span>

              <div className={styles.endIcon}>
                {showClearButton && value && !disabled && !readOnly ? (
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="close"
                    onClick={handleClear}
                    aria-label="Clear selection"
                    type="button"
                    className={styles.clearButton}
                  />
                ) : endIcon ? (
                  renderIcon(endIcon)
                ) : (
                  <Icon
                    name="chevron-down"
                    className={styles.dropdownArrow}
                    data-open={isOpen || undefined}
                  />
                )}
              </div>
            </div>
          }
          selectionMode="single"
          selectedKeys={value ? [value] : []}
          onSelectionChange={handleSelectionChange}
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          position="bottom-left"
          scrollToSelected={scrollToSelected}
          enableTypeAhead={enableTypeAhead}
          typeAheadDelay={typeAheadDelay}
        >
          <div className={styles.menuContent}>
            {searchable && (
              <div className={styles.searchWrapper}>
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startIcon="search"
                  showClearButton
                  onClear={() => setSearchQuery('')}
                />
              </div>
            )}

            <MenuList>
              {filteredOptions.length === 0 ? (
                <div className={styles.noResults}>
                  {searchQuery ? 'No results found' : 'No options available'}
                </div>
              ) : hasGroups ? (
                Object.entries(groupedOptions).map(([groupName, groupOptions]) => {
                  if (groupName === '__ungrouped__') {
                    return groupOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        itemKey={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </MenuItem>
                    ));
                  }

                  return (
                    <MenuGroup key={groupName} label={groupName}>
                      {groupOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          itemKey={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MenuGroup>
                  );
                })
              ) : (
                filteredOptions.map((option) => (
                  <MenuItem key={option.value} itemKey={option.value} disabled={option.disabled}>
                    {option.label}
                  </MenuItem>
                ))
              )}
            </MenuList>
          </div>
        </Menu>

        {(helperText || (error && errorMessage)) && (
          <div
            id={`${id}-helper-text`}
            className={styles.helperText}
            data-error={error || undefined}
            role={error ? 'alert' : undefined}
            aria-live={error ? 'polite' : undefined}
          >
            {error && errorMessage ? errorMessage : helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
