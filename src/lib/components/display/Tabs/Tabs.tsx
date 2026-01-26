import React, { forwardRef, useState, useCallback, useMemo, useId } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import { TabsContext, type TabsContextValue, type TabsVariant } from './TabsContext';
import styles from './Tabs.module.scss';

export interface TabsProps extends Omit<BaseComponentProps, 'onChange'> {
  /**
   * Currently selected tab value (controlled)
   */
  value?: string;

  /**
   * Default selected tab value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Callback when tab selection changes
   * @param value - The newly selected tab value
   */
  onChange?: (value: string) => void;

  /**
   * Visual variant of the tabs
   * @default 'line'
   */
  variant?: TabsVariant;

  /**
   * Size of the tabs
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Orientation of the tab list
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether tabs are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether tab panels should be lazy loaded (only render when active)
   * @default false
   */
  lazyMount?: boolean;

  /**
   * Whether to keep inactive panels mounted (with lazyMount)
   * @default false
   */
  keepMounted?: boolean;

  /**
   * Whether tabs should fit container width (distribute equally)
   * @default false
   */
  fitted?: boolean;

  /**
   * Tab components (TabList and TabPanels)
   */
  children: React.ReactNode;
}

/**
 * Tabs component - tab navigation with headers and content panels
 *
 * A container component that manages tab selection and provides context
 * to TabList, Tab, and TabPanel children.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Tabs defaultValue="tab1">
 *   <TabList>
 *     <Tab value="tab1">Overview</Tab>
 *     <Tab value="tab2">Details</Tab>
 *     <Tab value="tab3">Settings</Tab>
 *   </TabList>
 *   <TabPanel value="tab1">Overview content</TabPanel>
 *   <TabPanel value="tab2">Details content</TabPanel>
 *   <TabPanel value="tab3">Settings content</TabPanel>
 * </Tabs>
 *
 * // Controlled with icons
 * <Tabs value={activeTab} onChange={setActiveTab} variant="enclosed">
 *   <TabList>
 *     <Tab value="home" icon="home">Home</Tab>
 *     <Tab value="settings" icon="settings">Settings</Tab>
 *   </TabList>
 *   <TabPanel value="home">Home content</TabPanel>
 *   <TabPanel value="settings">Settings content</TabPanel>
 * </Tabs>
 * ```
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      defaultValue = '',
      onChange,
      variant = 'line',
      size = 'md',
      orientation = 'horizontal',
      disabled = false,
      lazyMount = false,
      keepMounted = false,
      fitted = false,
      children,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    // Unique ID for this tabs instance
    const tabsId = useId();

    // Internal state for uncontrolled component
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Use controlled value if provided, otherwise use internal state
    const selectedValue = value !== undefined ? value : internalValue;

    // Track which panels have been activated (for keepMounted feature)
    const [activatedPanels] = useState(() => new Set<string>());

    const handleChange = useCallback(
      (newValue: string) => {
        // Update internal state if uncontrolled
        if (value === undefined) {
          setInternalValue(newValue);
        }

        onChange?.(newValue);
      },
      [value, onChange]
    );

    const markPanelActivated = useCallback((panelValue: string) => {
      activatedPanels.add(panelValue);
    }, [activatedPanels]);

    const contextValue: TabsContextValue = useMemo(
      () => ({
        tabsId,
        selectedValue,
        onChange: handleChange,
        orientation,
        variant,
        size,
        disabled,
        fitted,
        lazyMount,
        keepMounted,
        activatedPanels,
        markPanelActivated,
      }),
      [
        tabsId,
        selectedValue,
        handleChange,
        orientation,
        variant,
        size,
        disabled,
        fitted,
        lazyMount,
        keepMounted,
        activatedPanels,
        markPanelActivated,
      ]
    );

    const tabsClasses = [styles.tabs, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={tabsClasses}
        data-orientation={orientation}
        data-variant={variant}
        data-size={size}
        data-component="tabs"
        data-testid={testId || 'tabs'}
        style={style}
        {...restProps}
      >
        <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export default Tabs;
