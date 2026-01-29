import React, { type ReactNode, type KeyboardEvent, type MouseEvent } from 'react';
import { Icon } from '../Icon';
import { Collapse } from '../Collapse';
import styles from './List.module.scss';

export interface ListGroupProps {
  /**
   * Group key (used for collapse state tracking)
   */
  groupKey: string;

  /**
   * Number of items in the group
   */
  itemCount: number;

  /**
   * Whether the group is collapsible
   */
  collapsible: boolean;

  /**
   * Whether the group is collapsed
   */
  isCollapsed: boolean;

  /**
   * Callback to toggle collapse state
   */
  onToggle: () => void;

  /**
   * Custom render function for the group header
   */
  renderHeader?: (groupKey: string, itemCount: number, isCollapsed: boolean) => ReactNode;

  /**
   * Children (the group items)
   */
  children: ReactNode;
}

export function ListGroup({
  groupKey,
  itemCount,
  collapsible,
  isCollapsed,
  onToggle,
  renderHeader,
  children,
}: ListGroupProps) {
  const handleClick = (event: MouseEvent) => {
    if (collapsible) {
      event.preventDefault();
      onToggle();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (collapsible && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onToggle();
    }
  };

  // Skip rendering the default group if there's no groupBy
  if (groupKey === '__default__') {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={styles.groupHeader}
        data-collapsible={collapsible || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
        aria-controls={`list-group-${groupKey}`}
      >
        {renderHeader ? (
          renderHeader(groupKey, itemCount, isCollapsed)
        ) : (
          <div className={styles.groupHeaderContent}>
              {collapsible && (
                <span
                  className={styles.groupCollapseIcon}
                  data-collapsed={isCollapsed || undefined}
                >
                  <Icon name="chevron-down" size="sm" />
                </span>
              )}
              <span>{groupKey}</span>
              <span className={styles.groupHeaderCount}>({itemCount})</span>
            </div>
        )}
      </div>

      <Collapse isOpen={!isCollapsed}>
        <div
          className={styles.groupItems}
          id={`list-group-${groupKey}`}
          role="group"
          aria-label={groupKey}
        >
          {children}
        </div>
      </Collapse>
    </>
  );
}

ListGroup.displayName = 'ListGroup';

export default ListGroup;
