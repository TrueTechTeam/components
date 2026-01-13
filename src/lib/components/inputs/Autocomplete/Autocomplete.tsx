/**
 * Autocomplete component - Filterable input with menu dropdown
 */

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
  type ChangeEvent,
} from 'react';
import { Menu, MenuList, MenuItem } from '../../overlays/Menu';
import { Input } from '../Input';
import { useDebounce } from '../../../hooks';
import type { IconName } from '../../../assets/icons';
import type { ComponentVariant, ComponentSize, BaseComponentProps } from '../../../types';
import styles from './Autocomplete.module.scss';

/**
 * Autocomplete option
 */
export interface AutocompleteOption {
  key: string;
  label: string;
  disabled?: boolean;
  [key: string]: any;
}

/**
 * Autocomplete component props
 */
export interface AutocompleteProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Input variant
   * @default 'primary'
   */
  variant?: ComponentVariant;

  /**
   * Input size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Input label
   */
  label?: string;

  /**
   * Input placeholder
   */
  placeholder?: string;

  /**
   * Available options
   */
  options: AutocompleteOption[];

  /**
   * Selected value(s) (controlled)
   */
  value?: string | string[];

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string | string[];

  /**
   * Selection mode
   * @default 'single'
   */
  selectionMode?: 'single' | 'multi';

  /**
   * Callback when selection changes
   */
  onChange?: (value: string | string[]) => void;

  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;

  /**
   * Custom filter function
   * @default case-insensitive includes
   */
  filterFunction?: (option: AutocompleteOption, inputValue: string) => boolean;

  /**
   * Async data loading function
   */
  onLoadOptions?: (inputValue: string) => Promise<AutocompleteOption[]>;

  /**
   * Debounce delay for async loading (ms)
   * @default 300
   */
  debounceDelay?: number;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * No options message
   * @default 'No options'
   */
  noOptionsMessage?: string;

  /**
   * Highlight matching text
   * @default true
   */
  highlightMatch?: boolean;

  /**
   * Start icon
   */
  startIcon?: ReactNode | IconName;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Helper text
   */
  helperText?: string;
}

/**
 * Default filter function
 */
const defaultFilterFunction = (
  option: AutocompleteOption,
  inputValue: string
): boolean => {
  return option.label.toLowerCase().includes(inputValue.toLowerCase());
};

/**
 * Autocomplete component
 * Filterable input with dropdown menu
 */
export const Autocomplete: React.FC<AutocompleteProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  placeholder,
  options: providedOptions,
  value: controlledValue,
  defaultValue,
  selectionMode = 'single',
  onChange,
  onInputChange,
  filterFunction = defaultFilterFunction,
  onLoadOptions,
  debounceDelay = 300,
  loading: controlledLoading,
  noOptionsMessage = 'No options',
  highlightMatch = true,
  startIcon,
  disabled,
  error,
  helperText,
  className,
  'data-testid': testId,
  ...restProps
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<AutocompleteOption[]>([]);
  const [asyncLoading, setAsyncLoading] = useState(false);

  const debouncedInputValue = useDebounce(inputValue, debounceDelay);

  // Async loading
  useEffect(() => {
    if (!onLoadOptions || !debouncedInputValue) {
      return;
    }

    let cancelled = false;

    const loadOptions = async () => {
      if (cancelled) return;
      setAsyncLoading(true);

      try {
        const options = await onLoadOptions(debouncedInputValue);
        if (!cancelled) {
          setAsyncOptions(options);
          setAsyncLoading(false);
        }
      } catch {
        if (!cancelled) {
          setAsyncLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [debouncedInputValue, onLoadOptions]);

  const options = onLoadOptions ? asyncOptions : providedOptions;
  const loading = controlledLoading ?? asyncLoading;

  // Filter options
  const filteredOptions = useMemo(() => {
    if (!inputValue || onLoadOptions) {
      return options;
    }
    return options.filter((option) => filterFunction(option, inputValue));
  }, [options, inputValue, filterFunction, onLoadOptions]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      onInputChange?.(newValue);
    },
    [onInputChange]
  );

  const handleSelectionChange = useCallback(
    (keys: string[]) => {
      if (selectionMode === 'single') {
        const selectedOption = options.find((opt) => opt.key === keys[0]);
        if (selectedOption) {
          setInputValue(selectedOption.label);
          onChange?.(keys[0]);
        }
        setIsOpen(false);
      } else {
        onChange?.(keys);
      }
    },
    [selectionMode, options, onChange]
  );

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const wrapperClasses = [styles.autocompleteWrapper, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={wrapperClasses}
      data-component="autocomplete"
      data-testid={testId || 'autocomplete'}
      {...restProps}
    >
      <Menu
        trigger={({ ref }) => (
          <div ref={ref as any}>
            <Input
              label={label}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              startIcon={startIcon}
              disabled={disabled}
              error={error}
              helperText={helperText}
            />
          </div>
        )}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        position="bottom-left"
        selectionMode={selectionMode}
        onSelectionChange={handleSelectionChange}
        autoFocusFirstItem={false}
        className={styles.autocompleteMenu}
      >
        <MenuList>
          {loading && (
            <div className={styles.autocompleteLoading} data-testid="autocomplete-loading">
              Loading...
            </div>
          )}
          {!loading && filteredOptions.length === 0 && (
            <div className={styles.autocompleteNoOptions} data-testid="autocomplete-no-options">
              {noOptionsMessage}
            </div>
          )}
          {!loading &&
            filteredOptions.map((option) => (
              <MenuItem
                key={option.key}
                itemKey={option.key}
                disabled={option.disabled}
              >
                {highlightMatch && inputValue ? (
                  <HighlightedText text={option.label} highlight={inputValue} />
                ) : (
                  option.label
                )}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
    </div>
  );
};

Autocomplete.displayName = 'Autocomplete';

/**
 * Highlighted text component
 */
const HighlightedText: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight,
}) => {
  if (!highlight) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className={styles.autocompleteHighlight}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};
