import React, { forwardRef, useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { IconButton } from '../../buttons/IconButton';
import { Menu, MenuList, MenuItem } from '../../overlays/Menu';
import styles from './TagInput.module.scss';
import type { InputBaseProps } from '../../../types/component.types';

export interface TagInputProps
  extends Omit<InputBaseProps, 'value' | 'onChange' | 'type' | 'defaultValue' | 'onBlur'> {
  /**
   * Controlled tags array
   */
  value?: string[];

  /**
   * Default tags (uncontrolled)
   */
  defaultValue?: string[];

  /**
   * Callback when tags change
   */
  onChange?: (tags: string[]) => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Input label text
   */
  label?: string;

  /**
   * Label placement
   */
  labelPlacement?: 'top' | 'left';

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message (shows when error is true)
   */
  errorMessage?: string;

  /**
   * Whether the input is in an error state
   */
  error?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Maximum number of tags allowed
   */
  maxTags?: number;

  /**
   * Delimiters that trigger tag creation (default: Enter, comma)
   */
  delimiters?: string[];

  /**
   * Allow duplicate tags
   */
  allowDuplicates?: boolean;

  /**
   * Transform tag before adding (e.g., lowercase, trim)
   */
  transformTag?: (tag: string) => string;

  /**
   * Validate tag before adding
   */
  validateTag?: (tag: string) => boolean | string;

  /**
   * Autocomplete suggestions
   */
  suggestions?: string[];

  /**
   * Show autocomplete suggestions
   */
  showSuggestions?: boolean;

  /**
   * Placeholder for input field
   */
  placeholder?: string;

  /**
   * Custom tag render function
   */
  renderTag?: (tag: string, onRemove: () => void) => React.ReactNode;

  /**
   * Whether to clear input on blur
   */
  clearOnBlur?: boolean;

  /**
   * Add tag on blur
   */
  addOnBlur?: boolean;
}

/**
 * TagInput component for multi-value chip input
 *
 * @example
 * ```tsx
 * <TagInput
 *   label="Tags"
 *   placeholder="Add tags..."
 *   onChange={(tags) => console.log(tags)}
 * />
 * ```
 */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = [],
      onChange,
      onBlur: onBlurProp,
      label,
      labelPlacement = 'top',
      helperText,
      errorMessage,
      error = false,
      required = false,
      disabled = false,
      maxTags,
      delimiters = ['Enter', ','],
      allowDuplicates = false,
      transformTag,
      validateTag,
      suggestions = [],
      showSuggestions = true,
      placeholder = 'Add a tag...',
      renderTag,
      clearOnBlur = false,
      addOnBlur = false,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      style,
      ...rest
    },
    ref
  ) => {
    // State
    const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Controlled vs uncontrolled
    const tags = controlledValue !== undefined ? controlledValue : internalTags;

    // Filter suggestions based on input
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        !tags.includes(suggestion) && suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Add tag
    const addTag = useCallback(
      (tag: string) => {
        // Transform tag if needed
        const transformedTag = transformTag ? transformTag(tag) : tag.trim();

        if (!transformedTag) {
          return;
        }

        // Check max tags
        if (maxTags && tags.length >= maxTags) {
          return;
        }

        // Check duplicates
        if (!allowDuplicates && tags.includes(transformedTag)) {
          return;
        }

        // Validate tag
        if (validateTag) {
          const validationResult = validateTag(transformedTag);
          if (validationResult === false || typeof validationResult === 'string') {
            return;
          }
        }

        // Add tag
        const newTags = [...tags, transformedTag];

        if (controlledValue === undefined) {
          setInternalTags(newTags);
        }

        onChange?.(newTags);
        setInputValue('');
        setShowSuggestionsDropdown(false);
        setSelectedSuggestionIndex(-1);
      },
      [tags, maxTags, allowDuplicates, transformTag, validateTag, controlledValue, onChange]
    );

    // Remove tag
    const removeTag = useCallback(
      (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);

        if (controlledValue === undefined) {
          setInternalTags(newTags);
        }

        onChange?.(newTags);
      },
      [tags, controlledValue, onChange]
    );

    // Handle input change
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        // Show suggestions if there's input
        if (value && showSuggestions && filteredSuggestions.length > 0) {
          setShowSuggestionsDropdown(true);
          setSelectedSuggestionIndex(-1);
        } else {
          setShowSuggestionsDropdown(false);
        }
      },
      [showSuggestions, filteredSuggestions.length]
    );

    // Handle key down
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        // Handle delimiter keys
        if (delimiters.includes(event.key)) {
          event.preventDefault();
          addTag(inputValue);
          return;
        }

        // Handle backspace to remove last tag
        if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
          removeTag(tags.length - 1);
          return;
        }

        // Handle arrow keys for suggestions
        if (showSuggestionsDropdown && filteredSuggestions.length > 0) {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) =>
              prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            );
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
          } else if (event.key === 'Enter' && selectedSuggestionIndex >= 0) {
            event.preventDefault();
            addTag(filteredSuggestions[selectedSuggestionIndex]);
          } else if (event.key === 'Escape') {
            setShowSuggestionsDropdown(false);
            setSelectedSuggestionIndex(-1);
          }
        }
      },
      [
        delimiters,
        inputValue,
        tags,
        addTag,
        removeTag,
        showSuggestionsDropdown,
        filteredSuggestions,
        selectedSuggestionIndex,
      ]
    );

    // Handle blur
    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (addOnBlur && inputValue) {
          addTag(inputValue);
        } else if (clearOnBlur) {
          setInputValue('');
        }

        setTimeout(() => {
          setShowSuggestionsDropdown(false);
          setSelectedSuggestionIndex(-1);
        }, 200);

        onBlurProp?.(event);
      },
      [addOnBlur, clearOnBlur, inputValue, addTag, onBlurProp]
    );

    // Handle suggestion click
    const handleSuggestionClick = useCallback(
      (suggestion: string) => {
        addTag(suggestion);
        inputRef.current?.focus();
      },
      [addTag]
    );

    // Container classes
    const containerClasses = [
      styles.container,
      labelPlacement === 'left' && styles.horizontal,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Display error message or helper text
    const displayHelperText = error && errorMessage ? errorMessage : helperText;

    // Check if max tags reached
    const isMaxReached = maxTags ? tags.length >= maxTags : false;

    return (
      <div className={containerClasses} style={style} data-testid={dataTestId}>
        {label && (
          <label className={styles.label} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputContainer} ref={wrapperRef}>
          <div
            className={styles.tagsWrapper}
            data-error={error || undefined}
            data-disabled={disabled || undefined}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Render tags */}
            {tags.map((tag, index) =>
              renderTag ? (
                <React.Fragment key={`${tag}-${index}`}>
                  {renderTag(tag, () => removeTag(index))}
                </React.Fragment>
              ) : (
                <div
                  key={`${tag}-${index}`}
                  className={styles.tag}
                  data-disabled={disabled || undefined}
                >
                  <span className={styles.tagText}>{tag}</span>
                  {!disabled && (
                    <IconButton
                      variant="ghost"
                      size="xs"
                      icon="close"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        removeTag(index);
                      }}
                      aria-label={`Remove ${tag}`}
                      type="button"
                    />
                  )}
                </div>
              )
            )}

            {/* Input field */}
            {!isMaxReached && (
              <input
                {...rest}
                ref={(node) => {
                  // Handle both internal and forwarded refs
                  if (inputRef) {
                    (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                  }
                  if (typeof ref === 'function') {
                    ref(node);
                  } else if (ref) {
                    (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                  }
                }}
                type="text"
                className={styles.input}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                disabled={disabled}
                placeholder={tags.length === 0 ? placeholder : ''}
                aria-label={ariaLabel || label || 'Tag input'}
                aria-invalid={error}
              />
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestionsDropdown && filteredSuggestions.length > 0 && (
            <Menu
              trigger={({ ref }) => (
                <div
                  ref={ref as React.RefObject<HTMLDivElement>}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: wrapperRef.current?.offsetWidth || '100%',
                    height: wrapperRef.current?.clientHeight,
                    pointerEvents: 'none',
                  }}
                />
              )}
              isOpen
              onOpenChange={(open) => !open && setShowSuggestionsDropdown(false)}
              position="bottom-left"
              width="trigger"
              selectionMode="none"
              onAction={handleSuggestionClick}
              closeOnClickOutside={false}
            >
              <MenuList>
                {filteredSuggestions.map((suggestion, index) => (
                  <MenuItem
                    key={suggestion}
                    itemKey={suggestion}
                    data-selected={index === selectedSuggestionIndex || undefined}
                  >
                    {suggestion}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </div>

        {displayHelperText && (
          <div className={styles.helperText} data-error={error || undefined}>
            {displayHelperText}
            {maxTags && (
              <span className={styles.counter}>
                {' '}
                ({tags.length}/{maxTags})
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
