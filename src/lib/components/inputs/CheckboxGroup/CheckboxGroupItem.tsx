import React, { forwardRef, useCallback } from 'react';
import type { BaseComponentProps } from '../../../types';
import type { IconName } from '../../display/Icon/icons';
import { Checkbox } from '../Checkbox';
import { useCheckboxGroupStrict } from './CheckboxGroupContext';
import styles from './CheckboxGroup.module.scss';

export interface CheckboxGroupItemProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Value for this checkbox (required in group)
   */
  value: string;

  /**
   * Label text to display next to checkbox
   */
  label?: string;

  /**
   * Label placement relative to checkbox
   * @default 'end'
   */
  labelPlacement?: 'start' | 'end';

  /**
   * Whether this specific checkbox is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;

  /**
   * Custom check icon
   */
  checkIcon?: React.ReactNode | IconName;

  /**
   * ID for the input element
   */
  id?: string;
}

/**
 * CheckboxGroupItem component - individual checkbox within a CheckboxGroup
 *
 * Must be used as a child of CheckboxGroup.
 *
 * @example
 * ```tsx
 * <CheckboxGroup value={selected} onChange={setSelected}>
 *   <CheckboxGroupItem value="option1" label="Option 1" />
 *   <CheckboxGroupItem value="option2" label="Option 2" />
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroupItem = forwardRef<HTMLInputElement, CheckboxGroupItemProps>(
  (
    {
      value,
      label,
      labelPlacement = 'end',
      disabled: itemDisabled = false,
      helperText,
      checkIcon = 'check',
      id,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    const context = useCheckboxGroupStrict();

    const isChecked = context.values.includes(value);
    const isDisabled = itemDisabled || context.disabled;
    const isReadOnly = context.readOnly;

    const handleChange = useCallback(
      (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
        if (isDisabled || isReadOnly) return;
        context.onChange(value, checked, event);
      },
      [context, value, isDisabled, isReadOnly]
    );

    const itemClasses = [styles.item, className].filter(Boolean).join(' ');

    return (
      <div className={itemClasses} style={style}>
        <Checkbox
          ref={ref}
          id={id}
          name={context.name}
          checked={isChecked}
          onChange={handleChange}
          disabled={isDisabled}
          readOnly={isReadOnly}
          label={label}
          labelPlacement={labelPlacement}
          helperText={helperText}
          checkIcon={checkIcon}
          variant={context.variant}
          size={context.size}
          data-testid={testId || `checkbox-group-item-${value}`}
          {...restProps}
        />
      </div>
    );
  }
);

CheckboxGroupItem.displayName = 'CheckboxGroupItem';

export default CheckboxGroupItem;
