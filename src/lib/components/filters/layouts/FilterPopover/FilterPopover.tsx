/**
 * FilterPopover - Trigger-based popover filter panel
 */

import React, { useState, useCallback } from 'react';
import { Button } from '../../../buttons/Button';
import { Popover } from '../../../overlays/Popover';
import { Icon } from '../../../display/Icon';
import { Badge } from '../../../display/Badge';
import { useFilterContext } from '../../FilterContext';
import { ActiveFilters } from '../../core/ActiveFilters';
import type { FilterPopoverProps } from '../../types';
import styles from './FilterPopover.module.scss';

/**
 * FilterPopover provides a trigger-based dropdown for filter controls.
 * Shows a badge with active filter count on the trigger button.
 *
 * @example
 * ```tsx
 * <FilterProvider filters={filters}>
 *   <FilterPopover triggerLabel="Filters">
 *     <FilterSection title="Status">
 *       <FilterField filterId="status" />
 *     </FilterSection>
 *   </FilterPopover>
 * </FilterProvider>
 * ```
 */
export const FilterPopover = ({
  ref,
  trigger,
  triggerLabel = 'Filters',
  showTriggerBadge = true,
  position,
  width = 320,
  maxHeight,
  isOpen: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnApply = true,
  closeOnClickOutside = true,
  showActiveFilters = false,
  activeFiltersPosition = 'top',
  showApplyButton = true,
  applyButtonLabel = 'Apply',
  showClearButton = true,
  clearButtonLabel = 'Clear',
  showResetButton = false,
  resetButtonLabel = 'Reset',
  children,
  className,
  ...restProps
}: FilterPopoverProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const ctx = useFilterContext();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(open);
      }
      onOpenChange?.(open);
    },
    [controlledOpen, onOpenChange]
  );

  const handleApply = () => {
    ctx?.applyFilters();
    if (closeOnApply) {
      handleOpenChange(false);
    }
  };

  const handleClear = () => {
    ctx?.clearAllFilters();
  };

  const handleReset = () => {
    ctx?.resetFilters();
  };

  const activeCount = ctx?.activeCount ?? 0;

  const componentClasses = [styles.filterPopover, className].filter(Boolean).join(' ');

  // Default trigger button
  const triggerElement = trigger ?? (
    <Button
      variant="outline"
      size="sm"
      startIcon={<Icon name="filter" size="1em" />}
      endIcon={<Icon name="chevron-down" size="1em" />}
    >
      {triggerLabel}
      {showTriggerBadge && activeCount > 0 && (
        <Badge variant="primary" size="sm" className={styles.triggerBadge}>
          {activeCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <div ref={ref} className={componentClasses} {...restProps}>
      <Popover
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        trigger={triggerElement}
        position={position}
        closeOnClickOutside={closeOnClickOutside}
      >
        <div
          className={styles.popoverContent}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            maxHeight: maxHeight
              ? typeof maxHeight === 'number'
                ? `${maxHeight}px`
                : maxHeight
              : undefined,
          }}
        >
          {/* Active filters at top */}
          {showActiveFilters && activeFiltersPosition === 'top' && activeCount > 0 && (
            <div className={styles.activeFiltersContainer}>
              <ActiveFilters maxVisible={3} showClearAll={false} chipSize="sm" />
            </div>
          )}

          {/* Filter content */}
          <div className={styles.content}>{children}</div>

          {/* Active filters at bottom */}
          {showActiveFilters && activeFiltersPosition === 'bottom' && activeCount > 0 && (
            <div className={styles.activeFiltersContainer}>
              <ActiveFilters maxVisible={3} showClearAll={false} chipSize="sm" />
            </div>
          )}

          {/* Footer actions */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              {showResetButton && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  {resetButtonLabel}
                </Button>
              )}
            </div>
            <div className={styles.footerRight}>
              {showClearButton && activeCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleClear}>
                  {clearButtonLabel}
                </Button>
              )}
              {showApplyButton && (
                <Button variant="primary" size="sm" onClick={handleApply}>
                  {applyButtonLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default FilterPopover;
