import React, { forwardRef, useState, useCallback } from 'react';
import type { BaseComponentProps, ExtendedComponentSize } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import styles from './ToggleButton.module.scss';
import { ICON_SIZE_MAP } from '../../display/Icon/Icon';

export interface ToggleButtonProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Whether the toggle button is in active state (controlled)
   */
  active?: boolean;

  /**
   * Default active state for uncontrolled component
   * @default false
   */
  defaultActive?: boolean;

  /**
   * Callback fired when active state changes
   * @param active - The new active state
   * @param event - The click event
   */
  onChange?: (active: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Icon to display when active (filled icon recommended)
   * @default 'heart-filled'
   */
  activeIcon?: IconName;

  /**
   * Icon to display when inactive (outline icon recommended)
   * @default 'heart'
   */
  inactiveIcon?: IconName;

  /**
   * Button size
   * @default 'md'
   */
  size?: ExtendedComponentSize;

  /**
   * Color when active
   * @default 'var(--theme-error)'
   */
  activeColor?: string;

  /**
   * Color when inactive
   * @default 'var(--theme-text-secondary)'
   */
  inactiveColor?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Whether to show animation on toggle
   * @default true
   */
  animated?: boolean;

  /**
   * Accessible label (REQUIRED for icon-only buttons)
   */
  'aria-label': string;
}

/**
 * ToggleButton component - an icon button that toggles between two states
 *
 * A versatile toggle button that displays different icons for active/inactive states.
 * Perfect for like buttons, favorites, bookmarks, and similar toggle interactions.
 *
 * @example
 * ```tsx
 * // Like button (default)
 * <ToggleButton aria-label="Like" onChange={(liked) => console.log(liked)} />
 *
 * // Controlled bookmark button
 * <ToggleButton
 *   active={isBookmarked}
 *   onChange={setIsBookmarked}
 *   activeIcon="bookmark"
 *   inactiveIcon="bookmark"
 *   activeColor="var(--theme-primary)"
 *   aria-label="Bookmark"
 * />
 *
 * // Star favorite button
 * <ToggleButton
 *   activeIcon="star"
 *   inactiveIcon="star"
 *   activeColor="var(--theme-warning)"
 *   aria-label="Favorite"
 * />
 * ```
 */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      active,
      defaultActive = false,
      onChange,
      activeIcon = 'heart-filled',
      inactiveIcon = 'heart',
      size = 'md',
      activeColor = 'var(--theme-error)',
      inactiveColor = 'var(--theme-text-secondary)',
      disabled = false,
      type = 'button',
      animated = true,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    // Internal state for uncontrolled component
    const [internalActive, setInternalActive] = useState(defaultActive);

    // Use controlled value if provided, otherwise use internal state
    const isActive = active !== undefined ? active : internalActive;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          return;
        }

        const newActive = !isActive;

        // Update internal state if uncontrolled
        if (active === undefined) {
          setInternalActive(newActive);
        }

        onChange?.(newActive, event);
      },
      [active, isActive, disabled, onChange]
    );

    const buttonClasses = [styles.toggleButton, className].filter(Boolean).join(' ');

    // Map size to icon pixel value
    const iconSize = ICON_SIZE_MAP[size];

    // Current icon based on state
    const currentIcon = isActive ? activeIcon : inactiveIcon;

    // Custom CSS variables for colors
    const buttonStyle = {
      '--toggle-button-active-color': activeColor,
      '--toggle-button-inactive-color': inactiveColor,
      ...style,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        data-active={isActive || undefined}
        data-size={size}
        data-animated={animated || undefined}
        data-component="toggle-button"
        data-testid={testId || 'toggle-button'}
        disabled={disabled}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-pressed={isActive}
        style={buttonStyle}
        {...restProps}
      >
        <Icon name={currentIcon} size={iconSize} className={styles.icon} />
      </button>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
