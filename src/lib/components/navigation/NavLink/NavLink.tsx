import React, { forwardRef } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import { Icon, type IconName } from '../../display/Icon';
import styles from './NavLink.module.scss';

export type NavLinkVariant = 'default' | 'underline' | 'pill' | 'ghost';

export interface NavLinkProps extends BaseComponentProps {
  /**
   * Link destination
   */
  href: string;

  /**
   * Whether link is active
   */
  active?: boolean;

  /**
   * Icon to display
   */
  icon?: React.ReactNode | IconName;

  /**
   * Icon position
   * @default 'start'
   */
  iconPosition?: 'start' | 'end';

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: NavLinkVariant;

  /**
   * Size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Whether link is disabled
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Link content
   */
  children: React.ReactNode;

  /**
   * Target attribute
   */
  target?: string;

  /**
   * Rel attribute (defaults to 'noopener noreferrer' when target='_blank')
   */
  rel?: string;
}

/**
 * NavLink - Reusable navigation link with active state support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <NavLink href="/home">Home</NavLink>
 *
 * // With icon
 * <NavLink href="/settings" icon="settings">Settings</NavLink>
 *
 * // Active state
 * <NavLink href="/dashboard" active>Dashboard</NavLink>
 *
 * // Different variants
 * <NavLink href="/about" variant="underline">About</NavLink>
 * <NavLink href="/profile" variant="pill" active>Profile</NavLink>
 * ```
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      href,
      active = false,
      icon,
      iconPosition = 'start',
      variant = 'default',
      size = 'md',
      disabled = false,
      onClick,
      children,
      className,
      target,
      rel,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const renderIcon = () => {
      if (!icon) {
        return null;
      }

      if (typeof icon === 'string') {
        return <Icon name={icon as IconName} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      }

      return icon;
    };

    const componentClasses = [styles.navLink, className].filter(Boolean).join(' ');

    // Default rel for external links
    const computedRel = rel || (target === '_blank' ? 'noopener noreferrer' : undefined);

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        className={componentClasses}
        onClick={handleClick}
        target={target}
        rel={computedRel}
        data-component="nav-link"
        data-variant={variant}
        data-size={size}
        data-active={active || undefined}
        data-disabled={disabled || undefined}
        data-testid={testId}
        aria-label={ariaLabel}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        style={style}
        {...restProps}
      >
        {icon && iconPosition === 'start' && (
          <span className={styles.icon} data-position="start">
            {renderIcon()}
          </span>
        )}
        <span className={styles.label}>{children}</span>
        {icon && iconPosition === 'end' && (
          <span className={styles.icon} data-position="end">
            {renderIcon()}
          </span>
        )}
      </a>
    );
  }
);

NavLink.displayName = 'NavLink';

export default NavLink;
