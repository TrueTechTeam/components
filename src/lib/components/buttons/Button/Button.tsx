import React, { forwardRef } from 'react';
import type { ExtendedComponentSize, ComponentVariant, BaseComponentProps } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../../assets/icons';
import styles from './Button.module.scss';

// Helper to render icon from IconName or ReactNode
const renderIcon = (
  icon: React.ReactNode | IconName | undefined,
  size: ExtendedComponentSize = 'md'
): React.ReactNode => {
  if (!icon) {return null;}
  if (typeof icon === 'string') {
    return <Icon name={icon as IconName} size={size} />;
  }
  return icon;
};

export interface ButtonProps extends BaseComponentProps {
  /**
   * Button variant
   * @default 'primary'
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
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display before the text
   * Can be an icon name or a React component
   */
  startIcon?: React.ReactNode | IconName;

  /**
   * Icon to display after the text
   * Can be an icon name or a React component
   */
  endIcon?: React.ReactNode | IconName;
}

/**
 * Button component with multiple variants and sizes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      type = 'button',
      onClick,
      fullWidth = false,
      startIcon,
      endIcon,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    const buttonClasses = [styles.button, className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        data-variant={variant}
        data-size={size}
        data-full-width={fullWidth || undefined}
        disabled={disabled}
        onClick={onClick}
        data-component="button"
        data-testid={testId || 'button'}
        aria-label={ariaLabel}
        style={style}
        {...restProps}
      >
        {startIcon && renderIcon(startIcon, size)}
        {children}
        {endIcon && renderIcon(endIcon, size)}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

