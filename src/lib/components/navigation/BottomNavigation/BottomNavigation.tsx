import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import type { BaseComponentProps } from '../../../types';
import { BottomNavigationContext, type BottomNavigationContextValue } from './BottomNavigationContext';
import styles from './BottomNavigation.module.scss';

export interface BottomNavigationProps extends BaseComponentProps {
  /**
   * Selected item value (controlled)
   */
  value?: string;

  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether to show labels for all items
   * @default true
   */
  showLabels?: boolean;

  /**
   * Whether to only show label for selected item
   * @default false
   */
  showSelectedLabel?: boolean;

  /**
   * Navigation items
   */
  children: React.ReactNode;
}

/**
 * BottomNavigation - Mobile bottom navigation bar
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BottomNavigation value={selected} onChange={setSelected}>
 *   <BottomNavigationItem value="home" label="Home" icon="Home" />
 *   <BottomNavigationItem value="search" label="Search" icon="Search" />
 *   <BottomNavigationItem value="profile" label="Profile" icon="User" />
 * </BottomNavigation>
 *
 * // Show label only for selected item
 * <BottomNavigation value={selected} onChange={setSelected} showSelectedLabel>
 *   <BottomNavigationItem value="home" label="Home" icon="Home" />
 *   <BottomNavigationItem value="search" label="Search" icon="Search" />
 *   <BottomNavigationItem value="notifications" label="Notifications" icon="Bell" badge={<Badge>3</Badge>} />
 *   <BottomNavigationItem value="profile" label="Profile" icon="User" />
 * </BottomNavigation>
 * ```
 */
export const BottomNavigation = forwardRef<HTMLElement, BottomNavigationProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      showLabels = true,
      showSelectedLabel = false,
      children,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);

    const selectedValue = isControlled ? controlledValue : internalValue;

    const handleSelect = useCallback(
      (value: string) => {
        if (!isControlled) {
          setInternalValue(value);
        }
        onChange?.(value);
      },
      [isControlled, onChange]
    );

    const contextValue: BottomNavigationContextValue = useMemo(
      () => ({
        selectedValue,
        onSelect: handleSelect,
        showLabels,
        showSelectedLabel,
      }),
      [selectedValue, handleSelect, showLabels, showSelectedLabel]
    );

    const componentClasses = [styles.bottomNavigation, className].filter(Boolean).join(' ');

    return (
      <nav
        ref={ref}
        className={componentClasses}
        data-component="bottom-navigation"
        data-show-labels={showLabels || undefined}
        data-show-selected-label={showSelectedLabel || undefined}
        data-testid={testId}
        aria-label={ariaLabel || 'Bottom navigation'}
        style={style}
        {...restProps}
      >
        <BottomNavigationContext.Provider value={contextValue}>
          {children}
        </BottomNavigationContext.Provider>
      </nav>
    );
  }
);

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
