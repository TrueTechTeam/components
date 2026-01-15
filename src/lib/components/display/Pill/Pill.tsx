import React, { forwardRef } from 'react';
import styles from './Pill.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the Pill component
 */
export interface PillProps extends BaseComponentProps {
  /**
   * Visual variant of the component
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'subtle';

  /**
   * Color theme of the component
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

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
   * Click handler - makes the pill clickable (renders as button)
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Remove handler - adds a remove button
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Icon to display at the start of the pill
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display at the end of the pill
   */
  endIcon?: React.ReactNode;
}

/**
 * Pill - Fully rounded tag-like element for status, categories, or filter pills
 *
 * @example
 * ```tsx
 * <Pill color="primary" variant="filled">
 *   Active
 * </Pill>
 * ```
 *
 * @example
 * ```tsx
 * <Pill color="success" variant="outlined" size="sm">
 *   Available
 * </Pill>
 * ```
 *
 * @example
 * ```tsx
 * <Pill
 *   color="info"
 *   onClick={() => console.log('clicked')}
 *   startIcon={<Icon name="tag" />}
 * >
 *   Clickable
 * </Pill>
 * ```
 *
 * @example
 * ```tsx
 * <Pill
 *   color="danger"
 *   onRemove={() => console.log('removed')}
 * >
 *   Removable
 * </Pill>
 * ```
 */
export const Pill = forwardRef<HTMLElement, PillProps>(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'md',
      disabled = false,
      onClick,
      onRemove,
      startIcon,
      endIcon,
      className,
      children,
      ...restProps
    },
    ref
  ) => {
    // Determine if component should be clickable
    const isClickable = !!onClick;

    // Merge className with component styles
    const componentClasses = [styles.pill, className].filter(Boolean).join(' ');

    // Handle remove button click
    const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // Prevent pill onClick from firing
      onRemove?.(event);
    };

    // Common props for both span and button
    const commonProps = {
      className: componentClasses,
      'data-component': 'pill',
      'data-variant': variant,
      'data-color': color,
      'data-size': size,
      'data-disabled': disabled || undefined,
      'data-clickable': isClickable || undefined,
      'data-removable': !!onRemove || undefined,
      ...restProps,
    };

    const content = (
      <>
        {startIcon && <span className={styles.pillIcon}>{startIcon}</span>}
        <span className={styles.pillText}>{children}</span>
        {endIcon && !onRemove && <span className={styles.pillIcon}>{endIcon}</span>}
        {onRemove && (
          <button
            type="button"
            className={styles.pillRemove}
            onClick={handleRemoveClick}
            disabled={disabled}
            aria-label="Remove"
            tabIndex={-1}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 3L3 9M3 3L9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </>
    );

    // Render as button if clickable
    if (isClickable) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          disabled={disabled}
          {...commonProps}
        >
          {content}
        </button>
      );
    }

    // Render as span by default
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} {...commonProps}>
        {content}
      </span>
    );
  }
);

Pill.displayName = 'Pill';

export default Pill;
