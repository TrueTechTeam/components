import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import { Icon, type IconName } from '../../display/Icon';
import { useBottomNavigationContextStrict } from './BottomNavigationContext';
import styles from './BottomNavigation.module.scss';

export interface BottomNavigationItemProps extends BaseComponentProps {
  /**
   * Unique identifier for this item
   */
  value: string;

  /**
   * Item label
   */
  label: string;

  /**
   * Item icon
   */
  icon: React.ReactNode | IconName;

  /**
   * Badge content
   */
  badge?: React.ReactNode;

  /**
   * Whether item is disabled
   */
  disabled?: boolean;

  /**
   * Link href (renders as anchor tag)
   */
  href?: string;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * BottomNavigationItem - Individual item in BottomNavigation
 *
 * @example
 * ```tsx
 * <BottomNavigationItem value="home" label="Home" icon="Home" />
 *
 * // With badge
 * <BottomNavigationItem
 *   value="notifications"
 *   label="Notifications"
 *   icon="Bell"
 *   badge={<Badge>5</Badge>}
 * />
 *
 * // As link
 * <BottomNavigationItem
 *   value="profile"
 *   label="Profile"
 *   icon="User"
 *   href="/profile"
 * />
 * ```
 */
export const BottomNavigationItem = forwardRef<HTMLElement, BottomNavigationItemProps>(
  (
    {
      value,
      label,
      icon,
      badge,
      disabled = false,
      href,
      onClick,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    const { selectedValue, onSelect, showLabels, showSelectedLabel } =
      useBottomNavigationContextStrict();

    const isSelected = selectedValue === value;
    const shouldShowLabel = showLabels || (showSelectedLabel && isSelected);

    const handleClick = (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      if (!href) {
        e.preventDefault();
      }

      onSelect(value);
      onClick?.(e);
    };

    const renderIcon = () => {
      if (typeof icon === 'string') {
        return <Icon name={icon as IconName} size={24} />;
      }
      return icon;
    };

    const componentClasses = [styles.item, className].filter(Boolean).join(' ');

    const content = (
      <>
        <span className={styles.iconWrapper}>
          {renderIcon()}
          {badge && <span className={styles.badge}>{badge}</span>}
        </span>
        {shouldShowLabel && <span className={styles.label}>{label}</span>}
      </>
    );

    const commonProps = {
      className: componentClasses,
      onClick: handleClick,
      'data-component': 'bottom-navigation-item',
      'data-selected': isSelected || undefined,
      'data-disabled': disabled || undefined,
      'data-testid': testId,
      'aria-current': isSelected ? ('page' as const) : undefined,
      'aria-disabled': disabled || undefined,
      style,
    };

    if (href && !disabled) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...commonProps} {...restProps}>
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        {...commonProps}
        {...restProps}
      >
        {content}
      </button>
    );
  }
);

BottomNavigationItem.displayName = 'BottomNavigationItem';

export default BottomNavigationItem;
