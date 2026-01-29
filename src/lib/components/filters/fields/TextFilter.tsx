/**
 * TextFilter - Text input filter with debounce support
 */

import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Input } from '../../inputs/Input';
import { useFilter } from '../hooks/useFilter';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { TextFilterConfig } from '../types';

export interface TextFilterProps extends BaseComponentProps {
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
  /** Additional props for Input component */
  inputProps?: Record<string, unknown>;
}

/**
 * TextFilter wraps the Input component for text/search filters
 */
export const TextFilter = forwardRef<HTMLDivElement, TextFilterProps>(
  (
    {
      filterId,
      label: labelOverride,
      placeholder: placeholderOverride,
      showLabel = true,
      size = 'md',
      inputProps,
      className,
      ...restProps
    },
    ref
  ) => {
    const { filter, value, setValue, isEnabled, error } = useFilter<string>({ filterId });

    const config = filter?.config as TextFilterConfig | undefined;
    const debounceMs = config?.debounceMs ?? 300;

    // Local state for immediate feedback, tracking external value for sync detection
    const [localState, setLocalState] = useState(() => ({
      externalValue: value,
      inputValue: value ?? '',
    }));
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync local value only when external value prop changes (e.g., filter reset)
    if (localState.externalValue !== value) {
      setLocalState({ externalValue: value, inputValue: value ?? '' });
    }

    const localValue = localState.inputValue;

    // Cleanup debounce on unmount
    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    if (!filter) {
      console.warn(`TextFilter: Filter "${filterId}" not found`);
      return null;
    }

    const label = labelOverride ?? filter.label;
    const placeholder = placeholderOverride ?? filter.placeholder ?? `Enter ${label}`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocalState((prev) => ({ ...prev, inputValue: newValue }));

      // Debounce the actual filter update
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (debounceMs > 0) {
        debounceRef.current = setTimeout(() => {
          setValue(newValue);
        }, debounceMs);
      } else {
        setValue(newValue);
      }
    };

    const handleClear = () => {
      setLocalState((prev) => ({ ...prev, inputValue: '' }));
      setValue('');
    };

    return (
      <div ref={ref} className={className} {...restProps}>
        <Input
          type={config?.inputType ?? 'text'}
          value={localValue}
          onChange={handleChange}
          label={showLabel ? label : undefined}
          placeholder={placeholder}
          disabled={!isEnabled}
          error={!!error}
          errorMessage={error ?? undefined}
          helperText={filter.helperText}
          maxLength={config?.maxLength}
          showClearButton={config?.showClearButton}
          startIcon={config?.startIcon}
          onClear={handleClear}
          {...inputProps}
        />
      </div>
    );
  }
);

TextFilter.displayName = 'TextFilter';

export default TextFilter;

