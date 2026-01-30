import React, { forwardRef, useMemo } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import type { PopoverPosition } from '../../../utils/positioning';
import type { BaseComponentProps } from '../../../types';
import styles from './TruncatedList.module.scss';

/**
 * Props for the TruncatedList component
 */
export interface TruncatedListProps<T> extends Omit<BaseComponentProps, 'children'> {
  /**
   * Items to display
   */
  items: T[];

  /**
   * Maximum number of visible items before truncation
   * @default 3
   */
  maxVisible?: number;

  /**
   * Render function for each visible item
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * Render function for the "+N more" indicator
   * If not provided, uses default indicator
   */
  renderMore?: (count: number, hiddenItems: T[]) => React.ReactNode;

  /**
   * Gap between items (px)
   * @default 8
   */
  gap?: number;

  /**
   * Direction of the list
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * Show hidden items in a tooltip on hover
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Custom tooltip content for hidden items
   * If not provided, uses renderItem for each hidden item
   */
  tooltipContent?: (hiddenItems: T[]) => React.ReactNode;

  /**
   * Tooltip position
   * @default 'top'
   */
  tooltipPosition?: PopoverPosition;

  /**
   * Maximum width of the tooltip
   * @default 300
   */
  tooltipMaxWidth?: number;

  /**
   * Callback when the "more" indicator is clicked
   */
  onMoreClick?: (hiddenItems: T[]) => void;

  /**
   * Custom key extractor for items
   * @default (item, index) => index
   */
  keyExtractor?: (item: T, index: number) => string | number;
}

/**
 * TruncatedList - Displays a limited number of items with a "+N more" indicator
 *
 * @example
 * Basic usage:
 * ```tsx
 * <TruncatedList
 *   items={['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL']}
 *   maxVisible={3}
 *   renderItem={(item) => <Badge>{item}</Badge>}
 * />
 * ```
 *
 * @example
 * With custom more indicator:
 * ```tsx
 * <TruncatedList
 *   items={users}
 *   maxVisible={4}
 *   renderItem={(user) => <Avatar src={user.avatar} />}
 *   renderMore={(count) => (
 *     <Avatar>+{count}</Avatar>
 *   )}
 * />
 * ```
 *
 * @example
 * Vertical list:
 * ```tsx
 * <TruncatedList
 *   items={tags}
 *   maxVisible={5}
 *   direction="vertical"
 *   renderItem={(tag) => <Tag>{tag}</Tag>}
 * />
 * ```
 */
function TruncatedListInner<T>(
  {
    items,
    maxVisible = 3,
    renderItem,
    renderMore,
    gap = 8,
    direction = 'horizontal',
    showTooltip = true,
    tooltipContent,
    tooltipPosition = 'bottom',
    tooltipMaxWidth = 300,
    onMoreClick,
    keyExtractor = (_, index) => index,
    className,
    style,
    'data-testid': testId,
    'aria-label': ariaLabel,
    ...restProps
  }: TruncatedListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const visibleItems = useMemo(() => items.slice(0, maxVisible), [items, maxVisible]);
  const hiddenItems = useMemo(() => items.slice(maxVisible), [items, maxVisible]);
  const hiddenCount = hiddenItems.length;
  const hasHiddenItems = hiddenCount > 0;

  const componentClasses = [styles.truncatedList, className].filter(Boolean).join(' ');

  const cssVariables = {
    '--list-gap': `${gap}px`,
    '--list-direction': direction === 'horizontal' ? 'row' : 'column',
    ...style,
  } as React.CSSProperties;

  const defaultMoreIndicator = <span className={styles.moreIndicator}>+{hiddenCount} more</span>;

  const moreElement = renderMore ? renderMore(hiddenCount, hiddenItems) : defaultMoreIndicator;

  const handleMoreClick = () => {
    onMoreClick?.(hiddenItems);
  };

  const tooltipContentElement = tooltipContent ? (
    tooltipContent(hiddenItems)
  ) : (
    <div
      className={styles.tooltipList}
      style={{ maxWidth: tooltipMaxWidth }}
      data-direction={direction}
    >
      {hiddenItems.map((item, index) => (
        <div key={keyExtractor(item, maxVisible + index)} className={styles.tooltipItem}>
          {renderItem(item, maxVisible + index)}
        </div>
      ))}
    </div>
  );

  const moreIndicatorElement = hasHiddenItems && (
    <div
      className={styles.moreWrapper}
      onClick={handleMoreClick}
      role={onMoreClick ? 'button' : undefined}
      tabIndex={onMoreClick ? 0 : undefined}
      onKeyDown={
        onMoreClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMoreClick();
              }
            }
          : undefined
      }
    >
      {showTooltip ? (
        <Tooltip content={tooltipContentElement} position={tooltipPosition}>
          {moreElement}
        </Tooltip>
      ) : (
        moreElement
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      className={componentClasses}
      style={cssVariables}
      data-component="truncated-list"
      data-direction={direction}
      data-has-hidden={hasHiddenItems || undefined}
      data-testid={testId}
      aria-label={ariaLabel}
      {...restProps}
    >
      {visibleItems.map((item, index) => (
        <div key={keyExtractor(item, index)} className={styles.item}>
          {renderItem(item, index)}
        </div>
      ))}
      {moreIndicatorElement}
    </div>
  );
}

// Properly typed forwardRef with generic support
export const TruncatedList = forwardRef(TruncatedListInner) as <T>(
  props: TruncatedListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

(TruncatedList as React.FC).displayName = 'TruncatedList';

export default TruncatedList;
