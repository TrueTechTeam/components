import React from 'react';
import { IconButton } from '../../buttons/IconButton';
import styles from './Tag.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the Tag component
 */
export interface TagProps extends BaseComponentProps {
  /**
   * Visual variant of the tag
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Size of the tag
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the tag is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the tag can be removed
   * @default false
   */
  removable?: boolean;

  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;

  /**
   * Callback when tag is clicked (makes tag interactive)
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Tag - Standalone tag element for labeling and categorization
 *
 * @example
 * ```tsx
 * <Tag variant="primary" size="md">
 *   React
 * </Tag>
 * ```
 *
 * @example
 * ```tsx
 * <Tag variant="secondary" size="sm" removable onRemove={() => console.log('removed')}>
 *   Removable
 * </Tag>
 * ```
 *
 * @example
 * ```tsx
 * <Tag variant="tertiary" onClick={() => console.log('clicked')}>
 *   Clickable
 * </Tag>
 * ```
 */
export const Tag = ({
  ref,
  variant = 'primary',
  size = 'md',
  disabled = false,
  removable = false,
  onRemove,
  onClick,
  className,
  children,
  ...restProps
}: TagProps & {
  ref?: React.Ref<HTMLElement>;
}) => {
  // Determine if tag should be a button (if onClick is provided)
  const isButton = !!onClick;
  const Component = isButton ? 'button' : 'span';

  // Merge className with component styles
  const componentClasses = [styles.tag, className].filter(Boolean).join(' ');

  // Handle click
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // Handle remove
  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!disabled) {
      onRemove?.();
    }
  };

  return (
    <Component
      ref={ref as React.Ref<HTMLButtonElement & HTMLSpanElement>}
      className={componentClasses}
      data-component="tag"
      data-variant={variant}
      data-size={size}
      data-disabled={disabled || undefined}
      onClick={isButton ? handleClick : undefined}
      type={isButton ? 'button' : undefined}
      disabled={isButton && disabled ? true : undefined}
      {...restProps}
    >
      <span className={styles.tagText}>{children}</span>
      {removable && (
        <IconButton
          variant="ghost"
          size="xs"
          icon="close"
          onClick={handleRemove}
          aria-label={`Remove ${children}`}
          type="button"
          disabled={disabled}
          className={styles.removeButton}
        />
      )}
    </Component>
  );
};
