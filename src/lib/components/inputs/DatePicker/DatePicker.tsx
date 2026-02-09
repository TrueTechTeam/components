import React, { useState, useCallback, useId, useEffect } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { IconButton } from '../../buttons/IconButton';
import { Select } from '../Select';
import { Input } from '../Input';
import {
  getCalendarDays,
  getMonthName,
  getDayName,
  formatDate,
  parseDate,
  isSameDay,
  isToday,
  isDateDisabled,
  addMonths,
  startOfDay,
} from '../../../utils/dateUtils';
import { Popover } from '../../overlays/Popover';
import styles from './DatePicker.module.scss';
import type { IconName } from '../../display/Icon/icons';
import Button from '../../buttons/Button';

export interface DatePickerProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Controlled date value
   */
  value?: Date | null;

  /**
   * Default date value (uncontrolled)
   */
  defaultValue?: Date | null;

  /**
   * Callback when date changes
   */
  onChange?: (date: Date | null) => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Array of disabled dates
   */
  disabledDates?: Date[];

  /**
   * Date format string
   */
  format?: string;

  /**
   * Show calendar popup
   */
  showCalendar?: boolean;

  /**
   * Show clear button
   */
  showClearButton?: boolean;

  /**
   * Start icon (calendar icon by default)
   */
  startIcon?: React.ReactNode | IconName;

  /**
   * Input label text
   */
  label?: string;

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
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;
}
/**
 * DatePicker component with custom calendar UI built from scratch
 */
export const DatePicker = ({
  ref,
  value: controlledValue,
  defaultValue = null,
  onChange,
  onBlur,
  minDate,
  maxDate,
  disabledDates,
  format = 'MM/DD/YYYY',
  showCalendar = true,
  showClearButton = true,
  startIcon = 'calendar',
  label,
  helperText,
  errorMessage,
  error = false,
  required = false,
  disabled = false,
  placeholder = 'MM/DD/YYYY',
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
  ...rest
}: DatePickerProps & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  const id = useId();

  // State
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [inputValue, setInputValue] = useState(
    defaultValue ? formatDate(defaultValue, format) : ''
  );
  const [viewDate, setViewDate] = useState(controlledValue || defaultValue || new Date());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Get current date
  const currentDate = controlledValue !== undefined ? controlledValue : internalValue;

  // Sync inputValue with controlledValue when it changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue ? formatDate(controlledValue, format) : '');
      setViewDate(controlledValue || new Date());
    }
  }, [controlledValue, format]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // Try to parse the date
      const parsed = parseDate(value, format);
      if (parsed) {
        const date = startOfDay(parsed);

        // Check if date is disabled
        if (!isDateDisabled(date, minDate, maxDate, disabledDates)) {
          if (controlledValue === undefined) {
            setInternalValue(date);
          }
          setViewDate(date);
          onChange?.(date);
        }
      }
    },
    [format, minDate, maxDate, disabledDates, controlledValue, onChange]
  );

  // Handle date selection from calendar
  const handleDateSelect = useCallback(
    (date: Date) => {
      const selectedDate = startOfDay(date);

      if (controlledValue === undefined) {
        setInternalValue(selectedDate);
      }

      setInputValue(formatDate(selectedDate, format));
      setViewDate(selectedDate);
      onChange?.(selectedDate);
      setIsPopoverOpen(false); // Close popover after selection
    },
    [format, controlledValue, onChange]
  );

  // Handle clear
  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue(null);
    }

    setInputValue('');
    onChange?.(null);
  }, [controlledValue, onChange]);

  // Navigate to previous month
  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => addMonths(prev, -1));
  }, []);

  // Navigate to next month
  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => addMonths(prev, 1));
  }, []);

  // Handle year change
  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const year = parseInt(e.target.value, 10);
      const newDate = new Date(viewDate);
      newDate.setFullYear(year);
      setViewDate(newDate);
    },
    [viewDate]
  );

  // Handle month change
  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const month = parseInt(e.target.value, 10);
      const newDate = new Date(viewDate);
      newDate.setMonth(month);
      setViewDate(newDate);
    },
    [viewDate]
  );

  // Get calendar days for current view
  const calendarDays = getCalendarDays(viewDate.getFullYear(), viewDate.getMonth());

  // Year range for selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  // Container classes
  const containerClasses = [styles.container, className].filter(Boolean).join(' ');

  // Display error message or helper text
  const displayHelperText = error && errorMessage ? errorMessage : helperText;

  // Convert date format to input mask format
  const formatMask = format.replace(/M/g, '#').replace(/D/g, '#').replace(/Y/g, '#');

  return (
    <div className={containerClasses} style={style} data-testid={dataTestId}>
      {label && (
        <label className={styles.label} data-required={required || undefined} htmlFor={id}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {showCalendar ? (
        <Popover
          isOpen={isPopoverOpen && !disabled}
          onOpenChange={setIsPopoverOpen}
          trigger={({ ref: popoverRef }) => (
            <div
              ref={popoverRef as React.RefObject<HTMLDivElement>}
              onClick={() => {
                if (!disabled) {
                  setIsPopoverOpen(true);
                }
              }}
            >
              <Input
                {...rest}
                ref={ref}
                id={id}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={onBlur}
                disabled={disabled}
                placeholder={placeholder}
                aria-label={ariaLabel || label || 'Date picker'}
                error={error}
                startIcon={startIcon}
                showClearButton={showClearButton}
                onClear={handleClear}
                formatMask={formatMask}
                inputFilter={/^[0-9/\-.\s]*$/}
              />
            </div>
          )}
          position="bottom-left"
          offset={8}
          width="auto"
          closeOnClickOutside
          closeOnEscape
        >
          <div className={styles.calendar} onMouseDown={(e) => e.stopPropagation()}>
            {/* Calendar header */}
            <div className={styles.calendarHeader}>
              <IconButton
                variant="ghost"
                size="sm"
                icon="chevron-left"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className={styles.navButton}
              />

              <div className={styles.monthYearSelectors}>
                <Select
                  options={Array.from({ length: 12 }, (_, i) => ({
                    value: i.toString(),
                    label: getMonthName(i, true),
                  }))}
                  value={viewDate.getMonth().toString()}
                  onChange={(value) =>
                    handleMonthChange({
                      target: { value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  className={styles.monthSelect}
                  enableTypeAhead
                />

                <Select
                  options={years.map((year) => ({
                    value: year.toString(),
                    label: year.toString(),
                  }))}
                  value={viewDate.getFullYear().toString()}
                  onChange={(value) =>
                    handleYearChange({
                      target: { value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  className={styles.yearSelect}
                  enableTypeAhead
                />
              </div>

              <IconButton
                variant="ghost"
                size="sm"
                icon="chevron-right"
                onClick={handleNextMonth}
                aria-label="Next month"
                className={styles.navButton}
              />
            </div>

            {/* Day headers */}
            <div className={styles.dayHeaders}>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={styles.dayHeader}>
                  {getDayName(i)}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className={styles.calendarGrid}>
              {calendarDays.map(({ date, isCurrentMonth }, index) => {
                const isSelected = currentDate && isSameDay(date, currentDate);
                const isTodayDate = isToday(date);
                const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);

                return (
                  <Button
                    key={index}
                    variant={isSelected ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => !isDisabled && handleDateSelect(date)}
                    disabled={isDisabled}
                    aria-label={formatDate(date, format)}
                    type="button"
                    className={styles.dayCell}
                    data-current-month={isCurrentMonth || undefined}
                    data-today={isTodayDate || undefined}
                    data-selected={isSelected || undefined}
                  >
                    <span className={styles.dayCellContent}>
                      {date.getDate()}
                      {isSelected && <span className={styles.selectedIndicator} />}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </Popover>
      ) : (
        <Input
          {...rest}
          ref={ref}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel || label || 'Date picker'}
          error={error}
          startIcon={startIcon}
          showClearButton={showClearButton}
          onClear={handleClear}
          formatMask={formatMask}
          inputFilter={/^[0-9/\-.\s]*$/}
        />
      )}

      {displayHelperText && (
        <div className={styles.helperText} data-error={error || undefined}>
          {displayHelperText}
        </div>
      )}
    </div>
  );
};
