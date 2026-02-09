import React, { useMemo } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import { Icon } from '../../display/Icon';
import styles from './Pagination.module.scss';

export type PaginationVariant = 'default' | 'outlined' | 'minimal';
export type PaginationShape = 'rounded' | 'circular' | 'square';

export interface PaginationProps extends BaseComponentProps {
  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Current page (1-indexed)
   */
  currentPage: number;

  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;

  /**
   * Number of page buttons to show on each side of current page
   * @default 1
   */
  siblingCount?: number;

  /**
   * Number of boundary pages to show at start and end
   * @default 1
   */
  boundaryCount?: number;

  /**
   * Show first/last page buttons
   * @default true
   */
  showFirstLast?: boolean;

  /**
   * Show prev/next buttons
   * @default true
   */
  showPrevNext?: boolean;

  /**
   * Size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: PaginationVariant;

  /**
   * Shape of page buttons
   * @default 'rounded'
   */
  shape?: PaginationShape;

  /**
   * Whether to disable component
   */
  disabled?: boolean;

  /**
   * Custom labels
   */
  labels?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
    page?: (page: number) => string;
  };
}

/**
 * Generate pagination range with ellipsis
 */
function usePaginationRange(
  totalPages: number,
  currentPage: number,
  siblingCount: number,
  boundaryCount: number
): Array<number | 'ellipsis'> {
  return useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2;

    // If total pages is less than what we want to show, return all pages
    if (totalNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount + 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - boundaryCount);

    const shouldShowLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - boundaryCount - 1;

    const range: Array<number | 'ellipsis'> = [];

    // Left boundary
    for (let i = 1; i <= boundaryCount; i++) {
      range.push(i);
    }

    // Left ellipsis
    if (shouldShowLeftEllipsis) {
      range.push('ellipsis');
    } else {
      for (let i = boundaryCount + 1; i < leftSiblingIndex; i++) {
        range.push(i);
      }
    }

    // Middle range (siblings + current)
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      range.push(i);
    }

    // Right ellipsis
    if (shouldShowRightEllipsis) {
      range.push('ellipsis');
    } else {
      for (let i = rightSiblingIndex + 1; i <= totalPages - boundaryCount; i++) {
        range.push(i);
      }
    }

    // Right boundary
    for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
      if (i > 0 && !range.includes(i)) {
        range.push(i);
      }
    }

    return range;
  }, [totalPages, currentPage, siblingCount, boundaryCount]);
}

/**
 * Pagination - Page navigation for paginated content
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Pagination
 *   totalPages={10}
 *   currentPage={currentPage}
 *   onPageChange={setCurrentPage}
 * />
 *
 * // With custom sibling count
 * <Pagination
 *   totalPages={20}
 *   currentPage={currentPage}
 *   onPageChange={setCurrentPage}
 *   siblingCount={2}
 * />
 *
 * // Minimal style without first/last
 * <Pagination
 *   totalPages={10}
 *   currentPage={currentPage}
 *   onPageChange={setCurrentPage}
 *   variant="minimal"
 *   showFirstLast={false}
 * />
 * ```
 */
export const Pagination = ({
  ref,
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  variant = 'default',
  shape = 'rounded',
  disabled = false,
  labels = {},
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
  style,
  ...restProps
}: PaginationProps & {
  ref?: React.Ref<HTMLElement>;
}) => {
  const range = usePaginationRange(totalPages, currentPage, siblingCount, boundaryCount);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageClick = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  const getPageLabel = (page: number) => {
    return labels.page ? labels.page(page) : `Page ${page}`;
  };

  const componentClasses = [styles.pagination, className].filter(Boolean).join(' ');

  if (totalPages <= 0) {
    return null;
  }

  return (
    <nav
      ref={ref}
      className={componentClasses}
      data-component="pagination"
      data-size={size}
      data-variant={variant}
      data-shape={shape}
      data-disabled={disabled || undefined}
      data-testid={testId}
      aria-label={ariaLabel || 'Pagination'}
      style={style}
      {...restProps}
    >
      {/* First page button */}
      {showFirstLast && (
        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageClick(1)}
          disabled={disabled || isFirstPage}
          aria-label={labels.first || 'Go to first page'}
          data-type="first"
        >
          <Icon name="chevrons-left" />
        </button>
      )}

      {/* Previous button */}
      {showPrevNext && (
        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={disabled || isFirstPage}
          aria-label={labels.prev || 'Go to previous page'}
          data-type="prev"
        >
          <Icon name="chevron-left" />
        </button>
      )}

      {/* Page numbers */}
      <div className={styles.pages}>
        {range.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                <Icon name="more" />
              </span>
            );
          }

          const isActive = item === currentPage;

          return (
            <button
              key={item}
              type="button"
              className={styles.button}
              onClick={() => handlePageClick(item)}
              disabled={disabled}
              aria-label={getPageLabel(item)}
              aria-current={isActive ? 'page' : undefined}
              data-type="page"
              data-active={isActive || undefined}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {showPrevNext && (
        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={disabled || isLastPage}
          aria-label={labels.next || 'Go to next page'}
          data-type="next"
        >
          <Icon name="chevron-right" />
        </button>
      )}

      {/* Last page button */}
      {showFirstLast && (
        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageClick(totalPages)}
          disabled={disabled || isLastPage}
          aria-label={labels.last || 'Go to last page'}
          data-type="last"
        >
          <Icon name="chevrons-right" />
        </button>
      )}
    </nav>
  );
};

export default Pagination;
