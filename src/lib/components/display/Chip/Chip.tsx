import React from 'react';
import styles from './Chip.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';
import { Icon } from '../Icon';

/**
 * Props for the Chip component
 */
export interface ChipProps extends BaseComponentProps {
  /**
   * Visual variant of the component
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  /**
   * Size of the component
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback when the remove button is clicked
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Custom class name for the remove button
   */
  removeButtonClassName?: string;

  /**
   * ARIA label for the remove button
   * @default 'Remove'
   */
  removeButtonAriaLabel?: string;
}

/**
 * Chip - Interactive tag-like component with optional remove functionality
 *
 * @example
 * ```tsx
 * <Chip variant="primary" size="md">
 *   Tag Name
 * </Chip>
 * ```
 *
 * @example
 * ```tsx
 * <Chip variant="danger" size="sm" onRemove={() => console.log('removed')}>
 *   Removable
 * </Chip>
 * ```
 *
 * @example
 * ```tsx
 * <Chip variant="success">
 *   Active
 * </Chip>
 * ```
 */
export const Chip = ({
  ref,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onRemove,
  removeButtonClassName,
  removeButtonAriaLabel = 'Remove',
  className,
  children,
  ...restProps
}: ChipProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  // Merge className with component styles
  const componentClasses = [styles.chip, className].filter(Boolean).join(' ');

  const removeButtonClasses = [styles.chipRemove, removeButtonClassName].filter(Boolean).join(' ');

  const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    event.stopPropagation();
    onRemove?.(event);
  };

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-component="chip"
      data-variant={variant}
      data-size={size}
      data-disabled={disabled || undefined}
      {...restProps}
    >
      <span className={styles.chipContent}>{children}</span>
      {onRemove && (
        <button
          type="button"
          className={removeButtonClasses}
          onClick={handleRemoveClick}
          aria-label={removeButtonAriaLabel}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <Icon name="close" size="1em" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Chip;
