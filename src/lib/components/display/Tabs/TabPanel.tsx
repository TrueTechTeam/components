import React, { useEffect } from 'react';
import type { BaseComponentProps } from '../../../types';
import { useTabsContextStrict } from './TabsContext';
import styles from './Tabs.module.scss';

export interface TabPanelProps extends BaseComponentProps {
  /**
   * Value identifier matching the corresponding Tab
   */
  value: string;

  /**
   * Panel content
   */
  children: React.ReactNode;
}

/**
 * TabPanel component - content panel for a tab
 *
 * Must be used within Tabs and paired with a Tab of the same value.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabList>
 *     <Tab value="tab1">Tab 1</Tab>
 *     <Tab value="tab2">Tab 2</Tab>
 *   </TabList>
 *   <TabPanel value="tab1">Content for tab 1</TabPanel>
 *   <TabPanel value="tab2">Content for tab 2</TabPanel>
 * </Tabs>
 * ```
 */
export const TabPanel = ({
  ref,
  value,
  children,
  className,
  'data-testid': testId,
  style,
  ...restProps
}: TabPanelProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const context = useTabsContextStrict();

  // Generate deterministic IDs based on tabs instance and value
  const panelId = `tabpanel-${context.tabsId}-${value}`;
  const tabId = `tab-${context.tabsId}-${value}`;

  const isSelected = context.selectedValue === value;

  // Track if this panel has been activated (for keepMounted feature)
  const hasBeenSelected = context.activatedPanels.has(value);

  // Mark panel as activated when it becomes selected
  useEffect(() => {
    if (isSelected) {
      context.markPanelActivated(value);
    }
  }, [isSelected, value, context]);

  // Determine if we should render content
  const shouldRender =
    !context.lazyMount || // Always render if not lazy
    isSelected || // Render if currently selected
    (context.keepMounted && hasBeenSelected); // Render if keep mounted and was previously selected

  const panelClasses = [styles.tabPanel, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      id={panelId}
      role="tabpanel"
      className={panelClasses}
      data-selected={isSelected || undefined}
      data-hidden={!isSelected || undefined}
      data-component="tab-panel"
      data-testid={testId || `tab-panel-${value}`}
      aria-labelledby={tabId}
      hidden={!isSelected}
      tabIndex={0}
      style={style}
      {...restProps}
    >
      {shouldRender ? children : null}
    </div>
  );
};

export default TabPanel;
