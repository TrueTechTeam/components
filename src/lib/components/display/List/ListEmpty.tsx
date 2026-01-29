import React, { type ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './List.module.scss';

export interface ListEmptyProps {
  /**
   * Content to display when list is empty
   * @default 'No items to display'
   */
  content?: ReactNode;

  /**
   * Custom render function for empty state
   */
  renderEmpty?: () => ReactNode;

  /**
   * Whether this is a "no results" state (from filtering)
   */
  isNoResults?: boolean;

  /**
   * Search query (shown when isNoResults is true)
   */
  searchQuery?: string;
}

export function ListEmpty({
  content = 'No items to display',
  renderEmpty,
  isNoResults = false,
  searchQuery,
}: ListEmptyProps) {
  // Use custom render if provided
  if (renderEmpty) {
    return <div className={styles.emptyState}>{renderEmpty()}</div>;
  }

  return (
    <div className={styles.emptyState}>
      <Icon
        name={isNoResults ? 'search' : 'inbox'}
        size="lg"
        style={{ opacity: 0.5 }}
      />
      <span>
        {isNoResults && searchQuery
          ? `No results found for "${searchQuery}"`
          : content}
      </span>
    </div>
  );
}

ListEmpty.displayName = 'ListEmpty';

export default ListEmpty;
