import React, { useRef, useEffect, type ChangeEvent } from 'react';
import styles from './Table.module.scss';

export interface TableSearchProps {
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

export function TableSearch({
  value,
  onChange,
  placeholder = 'Search...',
  isFiltering = false,
  autoFocus = false,
  onClear,
}: TableSearchProps) {
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
    <div className={styles.tableSearch} data-filtering={isFiltering || undefined}>
      <svg
        className={styles.searchIcon}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        className={styles.searchInput}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default TableSearch;
