import React, { forwardRef, useEffect } from 'react';
import type { BaseComponentProps } from '../../../types';
import { Collapse } from '../../display/Collapse';
import { Icon, type IconName } from '../../display/Icon';
import { Tooltip } from '../../overlays/Tooltip';
import { useSideNavContextStrict } from './SideNavContext';
import styles from './SideNav.module.scss';

export interface SideNavGroupProps extends BaseComponentProps {
  /**
   * Unique identifier for this group
   */
  groupId: string;

  /**
   * Group label
   */
  label: string;

  /**
   * Icon for the group header
   */
  icon?: React.ReactNode | IconName;

  /**
   * Controlled expanded state
   */
  expanded?: boolean;

  /**
   * Default expanded state
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Nested navigation items
   */
  children: React.ReactNode;
}

/**
 * SideNavGroup - Grouped/nested navigation items
 *
 * @example
 * ```tsx
 * <SideNavGroup groupId="settings" label="Settings" icon="Settings">
 *   <SideNavItem value="profile" label="Profile" />
 *   <SideNavItem value="security" label="Security" />
 *   <SideNavItem value="notifications" label="Notifications" />
 * </SideNavGroup>
 * ```
 */
export const SideNavGroup = forwardRef<HTMLDivElement, SideNavGroupProps>(
  (
    {
      groupId,
      label,
      icon,
      expanded: controlledExpanded,
      defaultExpanded = false,
      children,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    const { collapsed, expandedGroups, toggleGroup, registerDefaultExpanded } =
      useSideNavContextStrict();

    // Register default expanded state on mount
    useEffect(() => {
      if (defaultExpanded) {
        registerDefaultExpanded(groupId);
      }
    }, [defaultExpanded, groupId, registerDefaultExpanded]);

    const isControlled = controlledExpanded !== undefined;
    const isExpanded = isControlled ? controlledExpanded : expandedGroups.has(groupId);

    const handleToggle = () => {
      if (!isControlled) {
        toggleGroup(groupId);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
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

    // Clone children to add level prop
    const childrenWithLevel = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<{ level?: number }>, { level: 1 });
      }
      return child;
    });

    const componentClasses = [styles.group, className].filter(Boolean).join(' ');

    const headerContent = (
      <div
        className={styles.groupHeader}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        data-expanded={isExpanded || undefined}
        data-collapsed={collapsed || undefined}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`${groupId}-content`}
      >
        {icon && <span className={styles.itemIcon}>{renderIcon()}</span>}
        <span className={styles.itemLabel}>{label}</span>
        <span className={styles.groupChevron} data-expanded={isExpanded || undefined}>
          <Icon name="chevron-down" size={16} />
        </span>
      </div>
    );

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="side-nav-group"
        data-expanded={isExpanded || undefined}
        data-collapsed={collapsed || undefined}
        data-testid={testId}
        style={style}
        {...restProps}
      >
        {collapsed ? (
          <Tooltip content={label} position="right">
            {headerContent}
          </Tooltip>
        ) : (
          headerContent
        )}

        {!collapsed && (
          <Collapse isOpen={isExpanded} data-testid={testId ? `${testId}-content` : undefined}>
            <div id={`${groupId}-content`} role="group" aria-label={label}>
              {childrenWithLevel}
            </div>
          </Collapse>
        )}
      </div>
    );
  }
);

SideNavGroup.displayName = 'SideNavGroup';

export default SideNavGroup;
