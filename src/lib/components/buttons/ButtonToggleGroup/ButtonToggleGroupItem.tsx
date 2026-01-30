import React, { forwardRef, useCallback } from 'react';
import type { BaseComponentProps } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import { useButtonToggleGroup } from './ButtonToggleGroupContext';
import styles from './ButtonToggleGroup.module.scss';
import { ICON_SIZE_MAP } from '../../display/Icon/Icon';

export interface ButtonToggleGroupItemProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Value for this item (required for selection)
   */
  value: string;

  /**
   * Icon to display (can be used with or without children)
   */
  icon?: IconName;

  /**
   * Whether this specific item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Button content (text label)
   */
  children?: React.ReactNode;
}

/**
 * ButtonToggleGroupItem component - individual button within a ButtonToggleGroup
 *
 * Must be used as a child of ButtonToggleGroup.
 *
 * @example
 * ```tsx
 * <ButtonToggleGroup value={view} onChange={setView}>
 *   <ButtonToggleGroupItem value="list" icon="list">List</ButtonToggleGroupItem>
 *   <ButtonToggleGroupItem value="grid" icon="grid">Grid</ButtonToggleGroupItem>
 * </ButtonToggleGroup>
 * ```
 */
export const ButtonToggleGroupItem = forwardRef<HTMLButtonElement, ButtonToggleGroupItemProps>(
  (
    {
      value,
      icon,
      disabled: itemDisabled = false,
      children,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    const context = useButtonToggleGroup();

    const isSelected = context.value === value;
    const isDisabled = itemDisabled || context.disabled;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          return;
        }
        context.onChange?.(value, event);
      },
      [context, value, isDisabled]
    );

    const itemClasses = [styles.item, className].filter(Boolean).join(' ');

    // Map size to icon pixel value
    const iconSize = context.size ? ICON_SIZE_MAP[context.size] : ICON_SIZE_MAP.md;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        className={itemClasses}
        data-selected={isSelected || undefined}
        data-component="button-toggle-group-item"
        data-testid={testId || `button-toggle-group-item-${value}`}
        disabled={isDisabled}
        onClick={handleClick}
        aria-checked={isSelected}
        aria-label={typeof children === 'string' ? children : undefined}
        style={style}
        {...restProps}
      >
        {icon && <Icon name={icon} size={iconSize} className={styles.icon} />}
        {children && <span className={styles.label}>{children}</span>}
      </button>
    );
  }
);

ButtonToggleGroupItem.displayName = 'ButtonToggleGroupItem';

export default ButtonToggleGroupItem;
