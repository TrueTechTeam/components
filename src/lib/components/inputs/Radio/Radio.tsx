import React, { useId, useCallback } from 'react';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import { useRadioGroup } from './RadioGroup';
import styles from './Radio.module.scss';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'type'> {
  /**
   * The value of this radio button
   */
  value: string;

  /**
   * Label text to display next to radio
   */
  label?: string;

  /**
   * Label placement relative to radio
   * @default 'end'
   */
  labelPlacement?: 'start' | 'end';

  /**
   * Helper text to display below the radio
   */
  helperText?: string;

  /**
   * Custom checked icon
   * Can be icon name (string) or React component
   */
  checkedIcon?: React.ReactNode | IconName;

  /**
   * ID for the input element
   * Auto-generated if not provided
   */
  id?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}

/**
 * Radio component
 * Individual radio button to be used within RadioGroup
 *
 * @example
 * ```tsx
 * <Radio value="option1" label="Option 1" />
 * ```
 */
export const Radio = ({
  ref,
  value,
  label,
  labelPlacement = 'end',
  helperText,
  checkedIcon,
  disabled: disabledProp,
  readOnly: readOnlyProp,
  id: providedId,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  ...rest
}: RadioProps & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  const autoId = useId();
  const id = providedId || autoId;

  const group = useRadioGroup();
  const {
    name,
    value: groupValue,
    onChange,
    disabled: groupDisabled,
    readOnly: groupReadOnly,
    size,
    variant,
  } = group;

  const isChecked = groupValue === value;
  const disabled = disabledProp ?? groupDisabled;
  const readOnly = readOnlyProp ?? groupReadOnly;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || readOnly) {
        return;
      }

      onChange?.(value, event);
    },
    [value, disabled, readOnly, onChange]
  );

  const renderIcon = (icon: React.ReactNode | IconName | undefined) => {
    if (!icon) {
      return null;
    }

    if (typeof icon === 'string') {
      return <Icon name={icon as IconName} className={styles.icon} />;
    }

    return <span className={styles.icon}>{icon}</span>;
  };

  const radioInput = (
    <label
      htmlFor={id}
      className={styles.radio}
      data-variant={variant}
      data-size={size}
      data-checked={isChecked || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-component="radio"
    >
      <input
        ref={ref}
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        className={styles.input}
        data-testid={dataTestId}
        aria-label={ariaLabel || label}
        aria-checked={isChecked}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        {...rest}
      />

      <span className={styles.circle}>{isChecked && renderIcon(checkedIcon)}</span>
    </label>
  );

  if (!label) {
    return (
      <div
        className={`${styles.container} ${className || ''}`}
        data-testid={dataTestId && `${dataTestId}-container`}
      >
        {radioInput}
        {helperText && <div className={styles.helperText}>{helperText}</div>}
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${className || ''}`}
      data-testid={dataTestId && `${dataTestId}-container`}
    >
      <div className={styles.radioRow} data-label-placement={labelPlacement}>
        {radioInput}
        <label
          htmlFor={id}
          className={styles.labelText}
          data-disabled={disabled || undefined}
          data-readonly={readOnly || undefined}
        >
          {label}
        </label>
      </div>
      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </div>
  );
};
