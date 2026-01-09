import React, { forwardRef, useState, useCallback, useId } from 'react';
import { IconButton } from '../../buttons/IconButton';
import { Input } from '../Input';
import {
  getCalendarDays,
  getMonthName,
  getDayName,
  formatDate,
  isSameDay,
  isToday,
  isDateInRange,
  isDateDisabled,
  isDateBefore,
  addMonths,
  addDays,
  getDaysDifference,
  startOfDay,
} from '../../../utils/dateUtils';
import { Popover } from '../../overlays/Popover';
import styles from './DateRangePicker.module.scss';
import Button from '../../buttons/Button';
import type {
  BaseComponentProps,
} from '../../../types/component.types';

export interface DateRangePreset {
  label: string;
  getValue: () => { startDate: Date; endDate: Date };
}

export interface DateRangePickerProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Controlled start date value
   */
  startDate?: Date | null;

  /**
   * Controlled end date value
   */
  endDate?: Date | null;

  /**
   * Default start date (uncontrolled)
   */
  defaultStartDate?: Date | null;

  /**
   * Default end date (uncontrolled)
   */
  defaultEndDate?: Date | null;

  /**
   * Callback when date range changes
   */
  onChange?: (startDate: Date | null, endDate: Date | null) => void;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Minimum number of days in range
   */
  minDays?: number;

  /**
   * Maximum number of days in range
   */
  maxDays?: number;

  /**
   * Date format string
   */
  format?: string;

  /**
   * Separator between start and end dates
   */
  separator?: string;

  /**
   * Show calendar popup
   */
  showCalendar?: boolean;

  /**
   * Show clear button
   */
  showClearButton?: boolean;

  /**
   * Show preset ranges
   */
  showPresets?: boolean;

  /**
   * Custom preset ranges
   */
  presets?: DateRangePreset[];

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

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: 'Today',
    getValue: () => ({
      startDate: startOfDay(new Date()),
      endDate: startOfDay(new Date()),
    }),
  },
  {
    label: 'Last 7 Days',
    getValue: () => ({
      startDate: addDays(startOfDay(new Date()), -6),
      endDate: startOfDay(new Date()),
    }),
  },
  {
    label: 'Last 30 Days',
    getValue: () => ({
      startDate: addDays(startOfDay(new Date()), -29),
      endDate: startOfDay(new Date()),
    }),
  },
  {
    label: 'This Month',
    getValue: () => {
      const now = new Date();
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    },
  },
  {
    label: 'Last Month',
    getValue: () => {
      const now = new Date();
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    },
  },
];

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/**
 * DateRangePicker component with custom dual calendar UI
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   label="Select Date Range"
 *   onChange={(start, end) => console.log(start, end)}
 * />
 * ```
 */
export const DateRangePicker = forwardRef<HTMLInputElement, DateRangePickerProps>(
  (
    {
      startDate: controlledStartDate,
      endDate: controlledEndDate,
      defaultStartDate = null,
      defaultEndDate = null,
      onChange,
      minDate,
      maxDate,
      minDays,
      maxDays,
      format = 'MM/DD/YYYY',
      separator = ' - ',
      showCalendar = true,
      showClearButton = true,
      showPresets = true,
      presets = DEFAULT_PRESETS,
      label,
      helperText,
      errorMessage,
      error = false,
      required = false,
      disabled = false,
      placeholder = 'MM/DD/YYYY - MM/DD/YYYY',
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      style,
      ...rest
    },
    ref
  ) => {
    const id = useId();

    // State
    const [internalStartDate, setInternalStartDate] = useState<Date | null>(defaultStartDate);
    const [internalEndDate, setInternalEndDate] = useState<Date | null>(defaultEndDate);
    const [inputValue, setInputValue] = useState(
      defaultStartDate && defaultEndDate
        ? `${formatDate(defaultStartDate, format)}${separator}${formatDate(defaultEndDate, format)}`
        : ''
    );
    const [viewDate, setViewDate] = useState(new Date());
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [selectingEnd, setSelectingEnd] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Get current dates
    const currentStartDate =
      controlledStartDate !== undefined ? controlledStartDate : internalStartDate;
    const currentEndDate = controlledEndDate !== undefined ? controlledEndDate : internalEndDate;

    // Update input value when controlled dates change
    React.useEffect(() => {
      if (controlledStartDate !== undefined && controlledEndDate !== undefined) {
        setInputValue(
          controlledStartDate && controlledEndDate
            ? `${formatDate(controlledStartDate, format)}${separator}${formatDate(
                controlledEndDate,
                format
              )}`
            : ''
        );
      }
    }, [controlledStartDate, controlledEndDate, format, separator]);

    // Apply input mask based on format
    const applyInputMask = useCallback((value: string) => {
      // Remove all non-numeric characters
      const digitsOnly = value.replace(/\D/g, '');

      // Determine mask based on format (MM/DD/YYYY or DD/MM/YYYY)
      const maskPattern = format.replace(/M/g, '9').replace(/D/g, '9').replace(/Y/g, '9');
      const fullMask = `${maskPattern}${separator}${maskPattern}`;

      let masked = '';
      let digitIndex = 0;

      for (let i = 0; i < fullMask.length && digitIndex < digitsOnly.length; i++) {
        if (fullMask[i] === '9') {
          masked += digitsOnly[digitIndex];
          digitIndex++;
        } else {
          masked += fullMask[i];
        }
      }

      return masked;
    }, [format, separator]);

    // Handle manual input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyInputMask(e.target.value);
      setInputValue(maskedValue);

      // Try to parse the dates if input is complete
      const expectedLength = format.length * 2 + separator.length;
      if (maskedValue.length === expectedLength) {
        // Parse dates from input
        const parts = maskedValue.split(separator);
        if (parts.length === 2) {
          try {
            const startDateStr = parts[0];
            const endDateStr = parts[1];

            // Simple date parsing based on format
            let startDate: Date | null = null;
            let endDate: Date | null = null;

            if (format === 'MM/DD/YYYY') {
              const [startMonth, startDay, startYear] = startDateStr.split('/');
              const [endMonth, endDay, endYear] = endDateStr.split('/');
              startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
              endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
            } else if (format === 'DD/MM/YYYY') {
              const [startDay, startMonth, startYear] = startDateStr.split('/');
              const [endDay, endMonth, endYear] = endDateStr.split('/');
              startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
              endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
            }

            // Validate dates
            if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              if (controlledStartDate === undefined) {
                setInternalStartDate(startDate);
                setInternalEndDate(endDate);
              }
              onChange?.(startDate, endDate);
            }
          } catch (error) {
            // Invalid date format, ignore
          }
        }
      }
    }, [applyInputMask, format, separator, controlledStartDate, onChange]);

    // Handle date selection
    const handleDateSelect = useCallback(
      (date: Date) => {
        const selectedDate = startOfDay(date);

        // If no start date or selecting end
        if (!currentStartDate || (currentStartDate && currentEndDate) || selectingEnd) {
          // Start new selection
          if (controlledStartDate === undefined) {
            setInternalStartDate(selectedDate);
            setInternalEndDate(null);
          }
          setSelectingEnd(false);
          onChange?.(selectedDate, null);
          setInputValue(formatDate(selectedDate, format));
        } else {
          // Select end date
          let newStartDate = currentStartDate;
          let newEndDate = selectedDate;

          // Ensure start is before end
          if (isDateBefore(selectedDate, currentStartDate)) {
            newStartDate = selectedDate;
            newEndDate = currentStartDate;
          }

          // Check day constraints
          const daysDiff = getDaysDifference(newStartDate, newEndDate);
          if (minDays && daysDiff < minDays - 1) {
            return; // Range too small
          }
          if (maxDays && daysDiff > maxDays - 1) {
            return; // Range too large
          }

          if (controlledStartDate === undefined) {
            setInternalStartDate(newStartDate);
            setInternalEndDate(newEndDate);
          }

          setInputValue(
            `${formatDate(newStartDate, format)}${separator}${formatDate(newEndDate, format)}`
          );
          onChange?.(newStartDate, newEndDate);
          setIsPopoverOpen(false); // Close popover after both dates selected
        }
      },
      [
        currentStartDate,
        currentEndDate,
        selectingEnd,
        minDays,
        maxDays,
        format,
        separator,
        controlledStartDate,
        onChange,
      ]
    );

    // Handle preset click
    const handlePresetClick = useCallback(
      (preset: DateRangePreset) => {
        const { startDate, endDate } = preset.getValue();

        if (controlledStartDate === undefined) {
          setInternalStartDate(startDate);
          setInternalEndDate(endDate);
        }

        setInputValue(`${formatDate(startDate, format)}${separator}${formatDate(endDate, format)}`);
        onChange?.(startDate, endDate);
        setViewDate(startDate);
        setIsPopoverOpen(false); // Close popover after preset selection
      },
      [format, separator, controlledStartDate, onChange]
    );

    // Handle clear
    const handleClear = useCallback(() => {
      if (controlledStartDate === undefined) {
        setInternalStartDate(null);
        setInternalEndDate(null);
      }

      setInputValue('');
      onChange?.(null, null);
    }, [controlledStartDate, onChange]);

    // Get calendar days for both months
    const leftMonth = viewDate.getMonth();
    const leftYear = viewDate.getFullYear();
    const rightDate = addMonths(viewDate, 1);
    const rightMonth = rightDate.getMonth();
    const rightYear = rightDate.getFullYear();

    const leftCalendarDays = getCalendarDays(leftYear, leftMonth);
    const rightCalendarDays = getCalendarDays(rightYear, rightMonth);

    // Container classes
    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    // Display error message or helper text
    const displayHelperText = error && errorMessage ? errorMessage : helperText;

    // Render calendar
    const renderCalendar = (
      calendarDays: Array<{ date: Date; isCurrentMonth: boolean }>,
      month: number,
      year: number,
      position: 'left' | 'right'
    ) => {
      return (
        <div className={styles.calendarMonth}>
          {/* Month/Year header */}
          <div className={styles.monthHeader}>
            {position === 'left' && (
              <IconButton
                variant="ghost"
                size="sm"
                icon="chevron-left"
                onClick={() => setViewDate((prev) => addMonths(prev, -1))}
                aria-label="Previous month"
                type="button"
                className={styles.navButton}
              />
            )}
            <div className={styles.monthLabel}>
              {getMonthName(month)} {year}
            </div>
            {position === 'right' && (
              <IconButton
                variant="ghost"
                size="sm"
                icon="chevron-right"
                onClick={() => setViewDate((prev) => addMonths(prev, 1))}
                aria-label="Next month"
                type="button"
                className={styles.navButton}
              />
            )}
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
              const isSelected =
                (currentStartDate && isSameDay(date, currentStartDate)) ||
                (currentEndDate && isSameDay(date, currentEndDate));
              const isTodayDate = isToday(date);
              const isInSelectedRange = isDateInRange(date, currentStartDate, currentEndDate);
              const isInHoverRange =
                currentStartDate && !currentEndDate && hoverDate
                  ? isDateInRange(
                      date,
                      isDateBefore(hoverDate, currentStartDate) ? hoverDate : currentStartDate,
                      isDateBefore(hoverDate, currentStartDate) ? currentStartDate : hoverDate
                    )
                  : false;
              const isDisabled = isDateDisabled(date, minDate, maxDate);

              return (
                <Button
                  key={index}
                  variant={isSelected ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => !isDisabled && handleDateSelect(date)}
                  onMouseEnter={() => setHoverDate(date)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={isDisabled}
                  aria-label={formatDate(date, format)}
                  type="button"
                  className={styles.dayCell}
                  data-current-month={isCurrentMonth || undefined}
                  data-today={isTodayDate || undefined}
                  data-in-range={isInSelectedRange || undefined}
                  data-in-hover-range={isInHoverRange || undefined}
                >
                  {date.getDate()}
                </Button>
              );
            })}
          </div>
        </div>
      );
    };

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
            isOpen={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            trigger={({ ref: popoverRef }) => (
              <div ref={popoverRef as any}>
                <Input
                  {...rest}
                  ref={ref}
                  id={id}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={disabled}
                  placeholder={placeholder}
                  onFocus={() => setIsPopoverOpen(true)}
                  aria-label={ariaLabel || label || 'Date range picker'}
                  error={error}
                  startIcon={<CalendarIcon />}
                  showClearButton={showClearButton}
                  onClear={handleClear}
                />
              </div>
            )}
            position="bottom-left"
            offset={8}
            width="auto"
            closeOnClickOutside
            closeOnEscape
          >
            <div className={styles.calendar}>
              {/* Presets */}
              {showPresets && (
                <div className={styles.presets}>
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePresetClick(preset)}
                      type="button"
                      className={styles.presetButton}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Dual calendars */}
              <div className={styles.calendars}>
                {renderCalendar(leftCalendarDays, leftMonth, leftYear, 'left')}
                {renderCalendar(rightCalendarDays, rightMonth, rightYear, 'right')}
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
            disabled={disabled}
            placeholder={placeholder}
            aria-label={ariaLabel || label || 'Date range picker'}
            error={error}
            startIcon={<CalendarIcon />}
            showClearButton={showClearButton}
            onClear={handleClear}
          />
        )}

        {displayHelperText && (
          <div className={styles.helperText} data-error={error || undefined}>
            {displayHelperText}
          </div>
        )}
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';

