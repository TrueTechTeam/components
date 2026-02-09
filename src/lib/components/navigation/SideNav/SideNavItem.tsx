import React from 'react';
import type { BaseComponentProps } from '../../../types';
import { Icon, type IconName } from '../../display/Icon';
import { Tooltip } from '../../overlays/Tooltip';
import { useSideNavContextStrict } from './SideNavContext';
import styles from './SideNav.module.scss';

export interface SideNavItemProps extends BaseComponentProps {
  /**
   * Unique identifier for this item
   */
  value: string;

  /**
   * Icon to display
   */
  icon?: React.ReactNode | IconName;

  /**
   * Label text
   */
  label: string;

  /**
   * Tooltip text (shown when collapsed, defaults to label)
   */
  tooltip?: string;

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
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;

  /**
   * Badge content
   */
  badge?: React.ReactNode;

  /**
   * End adornment (icon, badge, etc.)
   */
  endAdornment?: React.ReactNode;

  /**
   * Nesting level (set automatically by SideNavGroup)
   */
  level?: number;
}

/**
 * SideNavItem - Individual navigation item for SideNav
 *
 * @example
 * ```tsx
 * <SideNavItem value="home" icon="Home" label="Home" />
 *
 * // With badge
 * <SideNavItem
 *   value="notifications"
 *   icon="Bell"
 *   label="Notifications"
 *   badge={<Badge>5</Badge>}
 * />
 *
 * // As link
 * <SideNavItem
 *   value="settings"
 *   icon="Settings"
 *   label="Settings"
 *   href="/settings"
 * />
 * ```
 */
export const SideNavItem = ({
  ref,
  value,
  icon,
  label,
  tooltip,
  disabled = false,
  href,
  onClick,
  badge,
  endAdornment,
  level = 0,
  className,
  'data-testid': testId,
  style,
  ...restProps
}: SideNavItemProps & {
  ref?: React.Ref<HTMLElement>;
}) => {
  const { collapsed, selectedValue, onSelect } = useSideNavContextStrict();

  const isSelected = selectedValue === value;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onSelect(value);
      }
    }
  };

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    if (typeof icon === 'string') {
      return <Icon name={icon as IconName} size={20} />;
    }

    return icon;
  };

  const componentClasses = [styles.item, className].filter(Boolean).join(' ');

  const itemStyle = {
    '--sidenav-item-level': level,
    ...style,
  } as React.CSSProperties;

  const content = (
    <>
      {icon && <span className={styles.itemIcon}>{renderIcon()}</span>}
      <span className={styles.itemLabel}>{label}</span>
      {badge && <span className={styles.itemBadge}>{badge}</span>}
      {endAdornment && <span className={styles.itemEndAdornment}>{endAdornment}</span>}
    </>
  );

  const commonProps = {
    className: componentClasses,
    style: itemStyle,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'data-component': 'side-nav-item',
    'data-selected': isSelected || undefined,
    'data-disabled': disabled || undefined,
    'data-collapsed': collapsed || undefined,
    'data-testid': testId,
    'aria-current': isSelected ? ('page' as const) : undefined,
    'aria-disabled': disabled || undefined,
    tabIndex: disabled ? -1 : 0,
    role: 'menuitem',
  };

  const element = href ? (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={disabled ? undefined : href}
      {...commonProps}
      {...restProps}
    >
      {content}
    </a>
  ) : (
    <div ref={ref as React.Ref<HTMLDivElement>} {...commonProps} {...restProps}>
      {content}
    </div>
  );

  // Wrap with tooltip when collapsed
  if (collapsed) {
    return (
      <Tooltip content={tooltip || label} position="right">
        {element}
      </Tooltip>
    );
  }

  return element;
};

export default SideNavItem;
