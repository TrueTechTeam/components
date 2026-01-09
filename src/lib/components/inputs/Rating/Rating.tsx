import React, { forwardRef, useState, useId, useCallback } from 'react';
import type { ComponentSize } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../../assets/icons';
import styles from './Rating.module.scss';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  size?: ComponentSize;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  precision?: number;
  icon?: React.ReactNode | IconName;
  emptyIcon?: React.ReactNode | IconName;
  label?: string;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      size = 'md',
      value: controlledValue,
      defaultValue = 0,
      onChange,
      max = 5,
      precision = 1,
      icon = '★',
      emptyIcon = '☆',
      label,
      helperText,
      readOnly = false,
      disabled = false,
      required = false,
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
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleClick = useCallback(
      (newValue: number) => {
        if (disabled || readOnly) {return;}

        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [controlledValue, disabled, readOnly, onChange]
    );

    const renderIcon = (iconProp: React.ReactNode | IconName) => {
      if (typeof iconProp === 'string') {
        if (iconProp.length === 1) {
          return iconProp; // Single character like ★
        }
        return <Icon name={iconProp as IconName} />;
      }
      return iconProp;
    };

    const items = [];
    for (let i = 1; i <= max; i++) {
      const itemValue = i;
      const isFilled = displayValue >= itemValue;
      const isHalfFilled = precision < 1 && displayValue > itemValue - 1 && displayValue < itemValue;

      items.push(
        <button
          key={i}
          type="button"
          className={styles.item}
          data-filled={isFilled || undefined}
          data-half={isHalfFilled || undefined}
          onClick={() => handleClick(itemValue)}
          onMouseEnter={() => !disabled && !readOnly && setHoverValue(itemValue)}
          onMouseLeave={() => setHoverValue(null)}
          disabled={disabled}
          aria-label={`${itemValue} ${max === 1 ? 'star' : 'stars'}`}
        >
          <span className={styles.iconWrapper}>
            {isFilled || isHalfFilled ? renderIcon(icon) : renderIcon(emptyIcon)}
          </span>
        </button>
      );
    }

    return (
      <div className={`${styles.container} ${className || ''}`} data-testid={dataTestId && `${dataTestId}-container`}>
        {label && (
          <label htmlFor={id} className={styles.label} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div
          ref={ref}
          id={id}
          className={styles.rating}
          data-size={size}
          data-readonly={readOnly || undefined}
          data-disabled={disabled || undefined}
          data-component="rating"
          role="radiogroup"
          aria-label={label}
          {...rest}
        >
          {items}
        </div>

        {helperText && (
          <div className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Rating.displayName = 'Rating';
