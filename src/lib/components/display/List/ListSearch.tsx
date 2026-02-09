import React, { useRef, useEffect, type ChangeEvent } from 'react';
import styles from './List.module.scss';

export interface ListSearchProps {
  /**
   * Current search query
   */
  value: string;

  /**
   * Callback when search query changes
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text
   * @default 'Search...'
   */
  placeholder?: string;

  /**
   * Whether the search is currently filtering (debounce active)
   */
  isFiltering?: boolean;

  /**
   * Auto focus the input on mount
   */
  autoFocus?: boolean;

  /**
   * Callback when input is cleared
   */
  onClear?: () => void;
}

export function ListSearch({
  value,
  onChange,
  placeholder = 'Search...',
  isFiltering: _isFiltering = false,
  autoFocus = false,
  onClear,
}: ListSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && value) {
      event.preventDefault();
      handleClear();
    }
  };

  return (
    <div className={styles.listSearch}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}

export default ListSearch;
