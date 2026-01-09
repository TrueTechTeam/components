import React, { forwardRef, useState, useId, useCallback, useRef, useEffect } from 'react';
import type { ComponentSize, ComponentVariant } from '../../../types';
import styles from './Slider.module.scss';

export interface Mark {
  value: number;
  label?: React.ReactNode;
}

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> {
  variant?: ComponentVariant;
  size?: ComponentSize;
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (value: number | number[]) => void;
  onChangeCommitted?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean | Mark[];
  label?: string;
  helperText?: string;
  errorMessage?: string;
  error?: boolean;
  showValue?: boolean;
  valueLabelDisplay?: 'on' | 'auto' | 'off';
  valueLabelFormat?: (value: number) => string;
  orientation?: 'horizontal' | 'vertical';
  id?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      value: controlledValue,
      defaultValue = 50,
      onChange,
      onChangeCommitted,
      min = 0,
      max = 100,
      step = 1,
      marks = false,
      label,
      helperText,
      errorMessage,
      error = false,
      showValue = false,
      valueLabelDisplay = 'auto',
      valueLabelFormat = (val) => String(val),
      orientation = 'horizontal',
      disabled = false,
      id: providedId,
      className,
      'data-testid': dataTestId,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(null);
    const [hoveredThumbIndex, setHoveredThumbIndex] = useState<number | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const isRange = Array.isArray(value);
    const currentValue = isRange ? value : [value];

    const handleChange = useCallback(
      (newValue: number | number[]) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [controlledValue, onChange]
    );

    const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

    const formatValue = (val: number) => {
      return valueLabelFormat ? valueLabelFormat(val) : String(val);
    };

    const generateMarks = (): Mark[] => {
      if (!marks) {return [];}
      if (Array.isArray(marks)) {return marks;}

      const marksArray: Mark[] = [];
      for (let i = min; i <= max; i += step) {
        marksArray.push({ value: i });
      }
      return marksArray;
    };

    const marksToRender = generateMarks();

    const isMarkFilled = (markValue: number): boolean => {
      if (isRange) {
        return markValue >= currentValue[0] && markValue <= currentValue[1];
      }
      return markValue <= currentValue[0];
    };

    const getClickPosition = (e: React.MouseEvent<HTMLInputElement>): number => {
      // Use the slider container, not the input element, for accurate positioning
      if (!sliderRef.current) {return min;}
      const sliderElement = sliderRef.current.querySelector(
        '[data-component="slider"]'
      ) as HTMLElement;
      if (!sliderElement) {return min;}

      const rect = sliderElement.getBoundingClientRect();

      if (orientation === 'horizontal') {
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        return min + percentage * (max - min);
      } else {
        const clickY = e.clientY - rect.top;
        const percentage = 1 - clickY / rect.height;
        return min + percentage * (max - min);
      }
    };

    const isClickNearThumb = (clickValue: number, thumbValue: number): boolean => {
      // Calculate pixel threshold (approximately 30 pixels worth of value range for easier clicking)
      if (!sliderRef.current) {return false;}
      const sliderElement = sliderRef.current.querySelector(
        '[data-component="slider"]'
      ) as HTMLElement;
      if (!sliderElement) {return false;}

      const rect = sliderElement.getBoundingClientRect();
      const sliderSize = orientation === 'horizontal' ? rect.width : rect.height;
      const threshold = ((max - min) / sliderSize) * 50;
      return Math.abs(clickValue - thumbValue) <= threshold;
    };

    // Handle dragging for all sliders with global mouse events
    useEffect(() => {
      if (!isDragging || activeThumbIndex === null) {
        return;
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!sliderRef.current) {return;}

        const sliderElement = sliderRef.current.querySelector(
          '[data-component="slider"]'
        ) as HTMLElement;
        if (!sliderElement) {return;}

        const rect = sliderElement.getBoundingClientRect();
        let newValue: number;

        if (orientation === 'horizontal') {
          const mouseX = e.clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
          newValue = min + percentage * (max - min);
        } else {
          const mouseY = e.clientY - rect.top;
          const percentage = Math.max(0, Math.min(1, 1 - mouseY / rect.height));
          newValue = min + percentage * (max - min);
        }

        // Round to nearest step
        newValue = Math.round(newValue / step) * step;

        // Update the value
        if (isRange) {
          const newRange = [...(value as number[])];
          if (activeThumbIndex === 0) {
            newRange[0] = Math.min(newValue, currentValue[1] - step);
          } else {
            newRange[1] = Math.max(newValue, currentValue[0] + step);
          }
          handleChange(newRange);
        } else {
          // Single slider - just update the single value
          handleChange(newValue);
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setActiveThumbIndex(null);
        onChangeCommitted?.(value);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [
      isDragging,
      activeThumbIndex,
      isRange,
      orientation,
      min,
      max,
      step,
      value,
      currentValue,
      handleChange,
      onChangeCommitted,
    ]);

    return (
      <div
        className={`${styles.container} ${className || ''}`}
        data-testid={dataTestId && `${dataTestId}-container`}
      >
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}

        <div ref={sliderRef} className={styles.sliderWrapper} data-orientation={orientation}>
          <div
            className={styles.slider}
            data-variant={variant}
            data-size={size}
            data-error={error || undefined}
            data-orientation={orientation}
            data-component="slider"
          >
            <div
              className={styles.track}
              onMouseDown={(e) => {
                if (!isRange || disabled) {return;}

                const clickValue = getClickPosition(e as any);
                // Round to nearest step
                const roundedValue = Math.round(clickValue / step) * step;

                const dist0 = Math.abs(roundedValue - currentValue[0]);
                const dist1 = Math.abs(roundedValue - currentValue[1]);
                const closerIndex = dist0 <= dist1 ? 0 : 1;

                const newRange = [...(value as number[])];
                if (closerIndex === 0) {
                  newRange[0] = Math.min(roundedValue, currentValue[1] - step);
                } else {
                  newRange[1] = Math.max(roundedValue, currentValue[0] + step);
                }
                handleChange(newRange);
                onChangeCommitted?.(newRange);
              }}
            >
              <div
                className={styles.trackFilled}
                style={{
                  [orientation === 'horizontal' ? 'left' : 'bottom']: isRange
                    ? `${getPercentage(currentValue[0])}%`
                    : '0%',
                  [orientation === 'horizontal' ? 'width' : 'height']: isRange
                    ? `${getPercentage(currentValue[1]) - getPercentage(currentValue[0])}%`
                    : `${getPercentage(currentValue[0])}%`,
                }}
              />
            </div>

            {currentValue.map((val, index) => {
              return (
                <React.Fragment key={index}>
                  <input
                    ref={index === 0 ? ref : undefined}
                    type="range"
                    id={index === 0 ? id : undefined}
                    className={styles.input}
                    min={min}
                    max={max}
                    step={step}
                    value={val}
                    onChange={(e) => {
                      // Only update if this thumb is active or if not a range slider
                      if (!isRange || activeThumbIndex === index) {
                        const newVal = Number(e.target.value);
                        if (isRange) {
                          const newRange = [...(value as number[])];
                          // Ensure thumbs don't cross or have the same value
                          if (index === 0) {
                            newRange[0] = Math.min(newVal, currentValue[1] - step);
                          } else {
                            newRange[1] = Math.max(newVal, currentValue[0] + step);
                          }
                          handleChange(newRange);
                        } else {
                          handleChange(newVal);
                        }
                      }
                    }}
                    onMouseDown={() => {
                      // Only fires for single sliders (range sliders have pointer-events: none)
                      setActiveThumbIndex(0);
                      setIsDragging(true);
                    }}
                    onMouseUp={() => {
                      setIsDragging(false);
                      setActiveThumbIndex(null);
                      onChangeCommitted?.(value);
                    }}
                    onKeyDown={() => {
                      if (!isRange) {
                        setActiveThumbIndex(0);
                      } else {
                        setActiveThumbIndex(index);
                      }
                    }}
                    disabled={disabled}
                    style={{
                      zIndex: isRange ? (activeThumbIndex === index ? 5 : 2) : 2,
                      pointerEvents: isRange ? 'none' : 'auto',
                    }}
                    {...rest}
                  />
                  <div
                    className={`${styles.thumb} ${
                      hoveredThumbIndex === index ? styles.thumbHovered : ''
                    } ${activeThumbIndex === index ? styles.thumbActive : ''}`}
                    style={{
                      [orientation === 'horizontal' ? 'left' : 'bottom']: `${getPercentage(val)}%`,
                      zIndex: isRange ? (activeThumbIndex === index ? 4 : 3) : 3,
                    }}
                    onMouseEnter={() => setHoveredThumbIndex(index)}
                    onMouseLeave={() => setHoveredThumbIndex(null)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveThumbIndex(index);
                      setIsDragging(true);
                    }}
                  >
                    {(showValue ||
                      valueLabelDisplay === 'on' ||
                      (valueLabelDisplay === 'auto' && isDragging)) && (
                      <div className={styles.valueLabel}>{formatValue(val)}</div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {marksToRender.map((mark) => {
              const isFilled = isMarkFilled(mark.value);
              return (
                <div
                  key={mark.value}
                  className={styles.mark}
                  style={{
                    [orientation === 'horizontal' ? 'left' : 'bottom']: `${getPercentage(
                      mark.value
                    )}%`,
                  }}
                >
                  <div
                    className={styles.markDot}
                    style={{
                      backgroundColor: isFilled ? 'var(--slider-track-filled-color)' : undefined,
                    }}
                  />
                  {mark.label && <div className={styles.markLabel}>{mark.label}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {(helperText || (error && errorMessage)) && (
          <div
            className={styles.helperText}
            data-error={error || undefined}
            role={error ? 'alert' : undefined}
          >
            {error && errorMessage ? errorMessage : helperText}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

