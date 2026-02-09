import React, { useCallback } from 'react';
import type { BaseComponentProps } from '../../../types';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/icons';
import { useTabsContextStrict } from './TabsContext';
import styles from './Tabs.module.scss';
import { ICON_SIZE_MAP } from '../Icon/Icon';

export interface TabProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Value identifier for this tab (required)
   */
  value: string;

  /**
   * Icon to display before tab label
   */
  icon?: IconName;

  /**
   * Whether this tab is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Tab label content
   */
  children: React.ReactNode;
}

/**
 * Tab component - individual tab header button
 *
 * Must be used within TabList, which must be within Tabs.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabList>
 *     <Tab value="tab1">Tab 1</Tab>
 *     <Tab value="tab2" icon="settings">Settings</Tab>
 *   </TabList>
 *   <TabPanel value="tab1">Content 1</TabPanel>
 *   <TabPanel value="tab2">Content 2</TabPanel>
 * </Tabs>
 * ```
 */
export const Tab = ({
  ref,
  value,
  icon,
  disabled: tabDisabled = false,
  children,
  className,
  'data-testid': testId,
  style,
  ...restProps
}: TabProps & {
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const context = useTabsContextStrict();

  // Generate deterministic IDs based on tabs instance and value
  const tabId = `tab-${context.tabsId}-${value}`;
  const panelId = `tabpanel-${context.tabsId}-${value}`;

  const isSelected = context.selectedValue === value;
  const isDisabled = tabDisabled || context.disabled;

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return;
    }
    context.onChange(value);
  }, [context, value, isDisabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        return;
      }

      const isHorizontal = context.orientation === 'horizontal';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

      if (event.key === prevKey || event.key === nextKey) {
        event.preventDefault();
        // Arrow key navigation is handled at TabList level
      }
    },
    [context.orientation, isDisabled]
  );

  const tabClasses = [styles.tab, className].filter(Boolean).join(' ');

  // Map size to icon pixel value
  const iconSize = ICON_SIZE_MAP[context.size];

  return (
    <button
      ref={ref}
      id={tabId}
      type="button"
      role="tab"
      className={tabClasses}
      data-selected={isSelected || undefined}
      data-component="tab"
      data-testid={testId || `tab-${value}`}
      disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      style={style}
      {...restProps}
    >
      {icon && <Icon name={icon} size={iconSize} className={styles.tabIcon} />}
      <span className={styles.tabLabel}>{children}</span>
    </button>
  );
};

export default Tab;
