/**
 * FilterModal - Full modal dialog for filters
 */

import React, { useState, useCallback } from 'react';
import { Button } from '../../../buttons/Button';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../../overlays/Dialog';
import { Icon } from '../../../display/Icon';
import { Badge } from '../../../display/Badge';
import { useFilterContext } from '../../FilterContext';
import { ActiveFilters } from '../../core/ActiveFilters';
import type { FilterModalProps } from '../../types';
import styles from './FilterModal.module.scss';

/**
 * FilterModal provides a full modal dialog for complex filter interfaces.
 * Useful for advanced filters with many options.
 *
 * @example
 * ```tsx
 * <FilterProvider filters={filters}>
 *   <FilterModal
 *     title="Advanced Filters"
 *     renderTrigger={({ onClick, activeCount }) => (
 *       <Button onClick={onClick}>
 *         Filters {activeCount > 0 && `(${activeCount})`}
 *       </Button>
 *     )}
 *   >
 *     <FilterAccordion>...</FilterAccordion>
 *   </FilterModal>
 * </FilterProvider>
 * ```
 */
export const FilterModal = ({
  ref,
  title = 'Filters',
  size = 'md',
  isOpen: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnApply = true,
  showFooter = true,
  renderTrigger,
  showActiveFilters = true,
  activeFiltersPosition = 'top',
  showApplyButton = true,
  applyButtonLabel = 'Apply Filters',
  showClearButton = true,
  clearButtonLabel = 'Clear All',
  showResetButton = false,
  resetButtonLabel = 'Reset',
  children,
  className,
  ...restProps
}: FilterModalProps & {
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

  const handleOpen = () => {
    handleOpenChange(true);
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  const handleApply = () => {
    ctx?.applyFilters();
    if (closeOnApply) {
      handleClose();
    }
  };

  const handleClear = () => {
    ctx?.clearAllFilters();
  };

  const handleReset = () => {
    ctx?.resetFilters();
  };

  const activeCount = ctx?.activeCount ?? 0;

  const componentClasses = [styles.filterModal, className].filter(Boolean).join(' ');

  // Default trigger
  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      startIcon={<Icon name="filter" size="1em" />}
      onClick={handleOpen}
    >
      Filters
      {activeCount > 0 && (
        <Badge variant="primary" size="sm" className={styles.triggerBadge}>
          {activeCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <div ref={ref} className={componentClasses} {...restProps}>
      {/* Trigger */}
      {renderTrigger ? renderTrigger({ onClick: handleOpen, activeCount }) : defaultTrigger}

      {/* Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        size={size}
        renderHeader={({ onClose }) => (
          <DialogHeader showCloseButton onClose={onClose}>
            <div className={styles.headerContent}>
              <h2 className={styles.title}>{title}</h2>
              {activeCount > 0 && (
                <Badge variant="secondary" size="sm">
                  {activeCount} active
                </Badge>
              )}
            </div>
          </DialogHeader>
        )}
      >
        <DialogBody className={styles.body}>
          {/* Active filters at top */}
          {showActiveFilters && activeFiltersPosition === 'top' && activeCount > 0 && (
            <div className={styles.activeFiltersContainer}>
              <ActiveFilters maxVisible={5} showClearAll={false} />
            </div>
          )}

          {/* Filter content */}
          <div className={styles.content}>{children}</div>

          {/* Active filters at bottom */}
          {showActiveFilters && activeFiltersPosition === 'bottom' && activeCount > 0 && (
            <div className={styles.activeFiltersContainer}>
              <ActiveFilters maxVisible={5} showClearAll={false} />
            </div>
          )}
        </DialogBody>

        {showFooter && (
          <DialogFooter>
            <div className={styles.footerLeft}>
              {showResetButton && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  {resetButtonLabel}
                </Button>
              )}
            </div>
            <div className={styles.footerRight}>
              <Button variant="outline" size="sm" onClick={handleClose}>
                Cancel
              </Button>
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
          </DialogFooter>
        )}
      </Dialog>
    </div>
  );
};

export default FilterModal;
