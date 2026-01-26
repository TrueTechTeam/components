import React, { forwardRef, useCallback, useRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import { useTabsContextStrict } from './TabsContext';
import styles from './Tabs.module.scss';

export interface TabListProps extends BaseComponentProps {
  /**
   * Tab children
   */
  children: React.ReactNode;
}

/**
 * TabList component - container for Tab items
 *
 * Must be used within Tabs.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabList>
 *     <Tab value="tab1">Tab 1</Tab>
 *     <Tab value="tab2">Tab 2</Tab>
 *   </TabList>
 *   <TabPanel value="tab1">Content 1</TabPanel>
 *   <TabPanel value="tab2">Content 2</TabPanel>
 * </Tabs>
 * ```
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className, 'data-testid': testId, style, ...restProps }, ref) => {
    const context = useTabsContextStrict();
    const listRef = useRef<HTMLDivElement>(null);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const isHorizontal = context.orientation === 'horizontal';
        const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
        const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

        if (
          event.key === prevKey ||
          event.key === nextKey ||
          event.key === 'Home' ||
          event.key === 'End'
        ) {
          event.preventDefault();

          const container = listRef.current;
          if (!container) return;

          const tabs = Array.from(
            container.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
          );

          if (tabs.length === 0) return;

          const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

          let nextIndex: number;

          if (event.key === 'Home') {
            nextIndex = 0;
          } else if (event.key === 'End') {
            nextIndex = tabs.length - 1;
          } else if (event.key === prevKey) {
            nextIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
          } else {
            nextIndex = currentIndex >= tabs.length - 1 ? 0 : currentIndex + 1;
          }

          tabs[nextIndex]?.focus();
        }
      },
      [context.orientation]
    );

    const listClasses = [styles.tabList, className].filter(Boolean).join(' ');

    return (
      <div
        ref={(node) => {
          // Handle both refs
          (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="tablist"
        className={listClasses}
        data-variant={context.variant}
        data-fitted={context.fitted || undefined}
        data-component="tab-list"
        data-testid={testId || 'tab-list'}
        aria-orientation={context.orientation}
        onKeyDown={handleKeyDown}
        style={style}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

export default TabList;
