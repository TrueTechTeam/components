import React, { forwardRef } from 'react';
import type { ComponentVariant, BaseComponentProps, ExtendedComponentSize } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import styles from './IconButton.module.scss';
import { ICON_SIZE_MAP } from '../../display/Icon/Icon';

export interface IconButtonProps extends BaseComponentProps {
  /**
   * Icon to display (required)
   */
  icon: IconName;

  /**
   * Button variant
   * @default 'ghost'
   */
  variant?: ComponentVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ExtendedComponentSize;

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
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Accessible label (REQUIRED for icon-only buttons)
   */
  'aria-label': string;
}

/**
 * IconButton component - a button that displays only an icon
 *
 * This component is specifically designed for icon-only buttons with:
 * - Extended size range (xs through xl)
 * - Icon size automatically matched to button size
 * - Default ghost variant for minimal UI
 * - Required aria-label for accessibility
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size = 'md',
      disabled = false,
      type = 'button',
      onClick,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    const buttonClasses = [styles.iconButton, className].filter(Boolean).join(' ');

    // Map size to icon pixel value
    const iconSize = ICON_SIZE_MAP[size];

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        data-variant={variant}
        data-size={size}
        disabled={disabled}
        onClick={onClick}
        data-component="icon-button"
        data-testid={testId || 'icon-button'}
        aria-label={ariaLabel}
        style={style}
        {...restProps}
      >
        <Icon name={icon} size={iconSize} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
