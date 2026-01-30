/**
 * FilterAccordion - Accordion-grouped filter layout
 */

import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import { Button } from '../../../buttons/Button';
import { AccordionContainer, Accordion } from '../../../display/Accordion';
import { Badge } from '../../../display/Badge';
import { useFilterContext } from '../../FilterContext';
import { FilterField } from '../../core/FilterField';
import { ActiveFilters } from '../../core/ActiveFilters';
import type { FilterAccordionProps } from '../../types';
import styles from './FilterAccordion.module.scss';

/**
 * FilterAccordion automatically groups filters by their group property
 * and displays them in an accordion layout.
 *
 * @example
 * ```tsx
 * <FilterProvider filters={filters} groups={groups}>
 *   <FilterAccordion mode="multiple" showGroupCounts />
 * </FilterProvider>
 * ```
 */
export const FilterAccordion = forwardRef<HTMLDivElement, FilterAccordionProps>(
  (
    {
      mode = 'multiple',
      defaultExpandedGroups,
      expandedGroups: controlledExpanded,
      onExpandedGroupsChange,
      showGroupCounts = true,
      showActiveFilters = false,
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

    // Get expanded state
    const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
      () => new Set(defaultExpandedGroups ?? [])
    );

    const expandedIds = controlledExpanded ? new Set(controlledExpanded) : internalExpanded;

    const handleToggle = useCallback(
      (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
          newExpanded.delete(id);
        } else {
          if (mode === 'single') {
            newExpanded.clear();
          }
          newExpanded.add(id);
        }

        if (controlledExpanded === undefined) {
          setInternalExpanded(newExpanded);
        }
        onExpandedGroupsChange?.(Array.from(newExpanded));
      },
      [expandedIds, mode, controlledExpanded, onExpandedGroupsChange]
    );

    // Get grouped filters
    const groupedFilters = useMemo(() => {
      if (!ctx) {
        return { groups: [], ungrouped: [] };
      }

      const groups = ctx.groups
        .map((group) => ({
          ...group,
          filters: ctx.getFiltersByGroup(group.id).filter((f) => ctx.isFilterVisible(f.id)),
          activeCount: ctx.getFiltersByGroup(group.id).filter((f) => ctx.isFilterActive(f.id))
            .length,
        }))
        .filter((g) => g.filters.length > 0)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const ungrouped = ctx.getUngroupedFilters().filter((f) => ctx.isFilterVisible(f.id));

      return { groups, ungrouped };
    }, [ctx]);

    const handleApply = () => {
      ctx?.applyFilters();
    };

    const handleClear = () => {
      ctx?.clearAllFilters();
    };

    const handleReset = () => {
      ctx?.resetFilters();
    };

    const componentClasses = [styles.filterAccordion, className].filter(Boolean).join(' ');

    const hasActionButtons = showApplyButton || showClearButton || showResetButton;
    const activeCount = ctx?.activeCount ?? 0;

    // If children are provided, use them directly
    if (children) {
      return (
        <div ref={ref} className={componentClasses} {...restProps}>
          {showActiveFilters && activeFiltersPosition === 'top' && activeCount > 0 && (
            <div className={styles.activeFiltersContainer}>
              <ActiveFilters maxVisible={5} showClearAll={false} />
            </div>
          )}

          <AccordionContainer mode={mode}>{children}</AccordionContainer>

          {showActiveFilters && activeFiltersPosition === 'bottom' && activeCount > 0 && (
            <div className={styles.activeFiltersContainer}>
              <ActiveFilters maxVisible={5} showClearAll={false} />
            </div>
          )}

          {hasActionButtons && (
            <div className={styles.actions}>
              {showResetButton && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  {resetButtonLabel}
                </Button>
              )}
              {showClearButton && activeCount > 0 && (
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
        </div>
      );
    }

    // Auto-generate accordion from groups
    return (
      <div ref={ref} className={componentClasses} {...restProps}>
        {showActiveFilters && activeFiltersPosition === 'top' && activeCount > 0 && (
          <div className={styles.activeFiltersContainer}>
            <ActiveFilters maxVisible={5} showClearAll={false} />
          </div>
        )}

        <AccordionContainer mode={mode}>
          {/* Ungrouped filters in their own section */}
          {groupedFilters.ungrouped.length > 0 && (
            <Accordion
              id="ungrouped"
              header="General"
              isOpen={expandedIds.has('ungrouped')}
              onOpenChange={() => handleToggle('ungrouped')}
            >
              <div className={styles.filterGroup}>
                {groupedFilters.ungrouped.map((filter) => (
                  <FilterField key={filter.id} filterId={filter.id} />
                ))}
              </div>
            </Accordion>
          )}

          {/* Grouped filters */}
          {groupedFilters.groups.map((group) => (
            <Accordion
              key={group.id}
              id={group.id}
              header={
                <span className={styles.groupTitle}>
                  {group.icon && <span className={styles.groupIcon}>{group.icon}</span>}
                  <span>{group.label}</span>
                  {showGroupCounts && group.activeCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {group.activeCount}
                    </Badge>
                  )}
                </span>
              }
              isOpen={expandedIds.has(group.id)}
              onOpenChange={() => handleToggle(group.id)}
            >
              {group.description && <p className={styles.groupDescription}>{group.description}</p>}
              <div className={styles.filterGroup}>
                {group.filters.map((filter) => (
                  <FilterField key={filter.id} filterId={filter.id} />
                ))}
              </div>
            </Accordion>
          ))}
        </AccordionContainer>

        {showActiveFilters && activeFiltersPosition === 'bottom' && activeCount > 0 && (
          <div className={styles.activeFiltersContainer}>
            <ActiveFilters maxVisible={5} showClearAll={false} />
          </div>
        )}

        {hasActionButtons && (
          <div className={styles.actions}>
            {showResetButton && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                {resetButtonLabel}
              </Button>
            )}
            {showClearButton && activeCount > 0 && (
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
      </div>
    );
  }
);

FilterAccordion.displayName = 'FilterAccordion';

export default FilterAccordion;
