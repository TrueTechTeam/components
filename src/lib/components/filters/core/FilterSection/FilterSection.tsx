/**
 * FilterSection - Collapsible section for grouping filters
 */

import React, { forwardRef, useState, useMemo, useCallback } from 'react';
import { Collapse } from '../../../display/Collapse';
import { Icon } from '../../../display/Icon';
import { useFilterContext } from '../../FilterContext';
import type { FilterSectionProps } from '../../types';
import styles from './FilterSection.module.scss';

/**
 * FilterSection provides a collapsible container for grouping related filters.
 * Shows an optional badge with the count of active filters in the section.
 *
 * @example
 * ```tsx
 * <FilterSection title="Product" collapsible showActiveCount>
 *   <FilterField filterId="category" />
 *   <FilterField filterId="brand" />
 * </FilterSection>
 * ```
 */
export const FilterSection = forwardRef<HTMLDivElement, FilterSectionProps>(
  (
    {
      id,
      title,
      description,
      icon,
      collapsible = true,
      defaultCollapsed = false,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      showActiveCount = true,
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const ctx = useFilterContext();
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

    // Determine if controlled or uncontrolled
    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const handleToggle = useCallback(() => {
      const newCollapsed = !isCollapsed;

      if (controlledCollapsed === undefined) {
        setInternalCollapsed(newCollapsed);
      }

      onCollapsedChange?.(newCollapsed);
    }, [isCollapsed, controlledCollapsed, onCollapsedChange]);

    // Calculate active filter count for this section
    const activeCount = useMemo(() => {
      if (!ctx || !showActiveCount || !id) {
        return 0;
      }

      const sectionFilters = ctx.getFiltersByGroup(id);
      return sectionFilters.filter((filter) => ctx.isFilterActive(filter.id)).length;
    }, [ctx, showActiveCount, id]);

    const componentClasses = [styles.filterSection, className].filter(Boolean).join(' ');

    // If no title, just render children directly
    if (!title && !collapsible) {
      return (
        <div ref={ref} className={componentClasses} {...restProps}>
          <div className={styles.content}>{children}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-collapsed={isCollapsed || undefined}
        {...restProps}
      >
        {title && (
          <button
            type="button"
            className={styles.header}
            onClick={collapsible ? handleToggle : undefined}
            disabled={!collapsible}
            aria-expanded={!isCollapsed}
            aria-controls={id ? `filter-section-${id}` : undefined}
          >
            <span className={styles.titleGroup}>
              {icon && <span className={styles.icon}>{icon}</span>}
              <span className={styles.title}>{title}</span>
              {showActiveCount && activeCount > 0 && (
                <span className={styles.badge}>{activeCount}</span>
              )}
            </span>

            {collapsible && (
              <span className={styles.chevron} data-open={!isCollapsed || undefined}>
                <Icon name="chevron-down" size="1em" />
              </span>
            )}
          </button>
        )}

        {description && !isCollapsed && <p className={styles.description}>{description}</p>}

        {collapsible ? (
          <Collapse isOpen={!isCollapsed}>
            <div id={id ? `filter-section-${id}` : undefined} className={styles.content}>
              {children}
            </div>
          </Collapse>
        ) : (
          <div id={id ? `filter-section-${id}` : undefined} className={styles.content}>
            {children}
          </div>
        )}
      </div>
    );
  }
);

FilterSection.displayName = 'FilterSection';

export default FilterSection;
