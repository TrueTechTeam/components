/**
 * FilterSidebar - Vertical sidebar panel for filters
 */

import React, { forwardRef, useState, useCallback } from 'react';
import { Button } from '../../../buttons/Button';
import { Icon } from '../../../display/Icon';
import { ScrollArea } from '../../../display/ScrollArea';
import { useFilterContext } from '../../FilterContext';
import { ActiveFilters } from '../../core/ActiveFilters';
import type { FilterSidebarProps } from '../../types';
import styles from './FilterSidebar.module.scss';

/**
 * FilterSidebar provides a vertical sidebar layout for filter controls.
 * Supports collapsible behavior, header/footer slots, and active filters display.
 *
 * @example
 * ```tsx
 * <FilterProvider filters={filters}>
 *   <FilterSidebar width={280} header={<h3>Filters</h3>}>
 *     <FilterSection title="Status">
 *       <FilterField filterId="status" />
 *     </FilterSection>
 *   </FilterSidebar>
 *   <main>Content</main>
 * </FilterProvider>
 * ```
 */
export const FilterSidebar = forwardRef<HTMLDivElement, FilterSidebarProps>(
  (
    {
      width = 280,
      collapsible = false,
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      header,
      footer,
      position = 'left',
      showActiveFilters = true,
      activeFiltersPosition = 'top',
      showApplyButton = false,
      applyButtonLabel = 'Apply',
      showClearButton = true,
      clearButtonLabel = 'Clear',
      showResetButton = false,
      resetButtonLabel = 'Reset',
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const ctx = useFilterContext();
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const handleToggleCollapse = useCallback(() => {
      const newCollapsed = !isCollapsed;
      if (controlledCollapsed === undefined) {
        setInternalCollapsed(newCollapsed);
      }
      onCollapsedChange?.(newCollapsed);
    }, [isCollapsed, controlledCollapsed, onCollapsedChange]);

    const handleApply = () => {
      ctx?.applyFilters();
    };

    const handleClear = () => {
      ctx?.clearAllFilters();
    };

    const handleReset = () => {
      ctx?.resetFilters();
    };

    const componentClasses = [styles.filterSidebar, className].filter(Boolean).join(' ');

    const hasActionButtons = showApplyButton || showClearButton || showResetButton;

    return (
      <aside
        ref={ref}
        className={componentClasses}
        data-position={position}
        data-collapsed={isCollapsed || undefined}
        style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
        {...restProps}
      >
        {/* Header */}
        {(header || collapsible) && (
          <div className={styles.header}>
            {header && <div className={styles.headerContent}>{header}</div>}
            {collapsible && (
              <button
                type="button"
                className={styles.collapseButton}
                onClick={handleToggleCollapse}
                aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
              >
                <Icon
                  name={position === 'left' ? 'chevron-left' : 'chevron-right'}
                  size="1.25em"
                />
              </button>
            )}
          </div>
        )}

        {/* Active filters at top */}
        {showActiveFilters && activeFiltersPosition === 'top' && !isCollapsed && (
          <div className={styles.activeFiltersContainer}>
            <ActiveFilters maxVisible={3} showClearAll={false} />
          </div>
        )}

        {/* Scrollable content */}
        {!isCollapsed && (
          <ScrollArea className={styles.content}>
            {children}
          </ScrollArea>
        )}

        {/* Active filters at bottom */}
        {showActiveFilters && activeFiltersPosition === 'bottom' && !isCollapsed && (
          <div className={styles.activeFiltersContainer}>
            <ActiveFilters maxVisible={3} showClearAll={false} />
          </div>
        )}

        {/* Action buttons */}
        {hasActionButtons && !isCollapsed && (
          <div className={styles.actions}>
            {showResetButton && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                {resetButtonLabel}
              </Button>
            )}
            {showClearButton && ctx && ctx.activeCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                {clearButtonLabel}
              </Button>
            )}
            {showApplyButton && ctx?.hasPendingChanges && (
              <Button variant="primary" size="sm" onClick={handleApply}>
                {applyButtonLabel}
              </Button>
            )}
          </div>
        )}

        {/* Footer */}
        {footer && !isCollapsed && (
          <div className={styles.footer}>{footer}</div>
        )}
      </aside>
    );
  }
);

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
