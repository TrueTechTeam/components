import React, { forwardRef, useCallback, useMemo, useRef, type MouseEvent, type KeyboardEvent, type ReactNode } from 'react';
import { useListContextStrict } from './ListContext';
import { Checkbox } from '../../inputs/Checkbox';
import { Dropdown } from '../../overlays/Dropdown';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Collapse } from '../Collapse';
import type { ListItemRenderContext } from './types';

// Local type matching Dropdown's item interface
interface DropdownItemLocal {
  itemKey: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}
import styles from './List.module.scss';

export interface ListItemProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The item data
   */
  item: T;

  /**
   * Index of the item in the list
   */
  index: number;

  /**
   * Actual index in filtered data (may differ due to grouping)
   */
  filteredIndex: number;
}

function ListItemInner<T extends Record<string, unknown>>(
  { item, index, filteredIndex }: ListItemProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const context = useListContextStrict<T>();
  const itemRef = useRef<HTMLDivElement>(null);

  const {
    getItemKey,
    isItemDisabled,
    size,
    selectionMode,
    selectedKeys,
    onSelectItem,
    showSelectionControls,
    selectionControlPosition,
    expandedKeys,
    onExpandItem,
    renderExpandedContent,
    expandTrigger,
    itemActions,
    itemActionsPosition,
    itemActionsTrigger,
    focusedIndex,
    setFocusedIndex,
    onItemClick,
    onItemAction,
    renderItem,
    primaryTextField,
    secondaryTextField,
    avatarField,
    listId,
  } = context;

  const itemKey = getItemKey(item, index);
  const isSelected = selectedKeys.has(itemKey);
  const isDisabled = isItemDisabled(item, index);
  const isFocused = focusedIndex === filteredIndex;
  const isExpanded = expandedKeys.has(itemKey);
  const hasExpandedContent = !!renderExpandedContent;

  // Create render context for custom render
  const renderContext: ListItemRenderContext = useMemo(
    () => ({
      isSelected,
      isDisabled,
      isFocused,
      isExpanded,
      toggleSelection: () => onSelectItem(itemKey, !isSelected),
      toggleExpand: () => onExpandItem(itemKey),
      itemKey,
    }),
    [isSelected, isDisabled, isFocused, isExpanded, itemKey, onSelectItem, onExpandItem]
  );

  // Handle item click
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (isDisabled) {return;}

      // Set focus
      setFocusedIndex(filteredIndex);

      // If expand trigger is click and we have expandable content
      if (expandTrigger === 'click' && hasExpandedContent) {
        onExpandItem(itemKey);
      }

      // Toggle selection on row click when in selection mode
      if (selectionMode !== 'none') {
        onSelectItem(itemKey, !isSelected);
      }

      onItemClick?.(item, index, event);
    },
    [
      isDisabled,
      filteredIndex,
      setFocusedIndex,
      expandTrigger,
      hasExpandedContent,
      onExpandItem,
      itemKey,
      selectionMode,
      onSelectItem,
      isSelected,
      onItemClick,
      item,
      index,
    ]
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isDisabled) {return;}

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onItemAction?.(item, index, event);
      }
    },
    [isDisabled, onItemAction, item, index]
  );

  // Handle selection toggle
  const handleSelectionChange = useCallback(
    (checked: boolean) => {
      onSelectItem(itemKey, checked);
    },
    [itemKey, onSelectItem]
  );

  // Handle expand toggle
  const handleExpandClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      onExpandItem(itemKey);
    },
    [itemKey, onExpandItem]
  );

  // Convert item actions to dropdown items
  const dropdownItems = useMemo<DropdownItemLocal[]>(() => {
    if (!itemActions) {return [];}

    return itemActions.map((action) => ({
      itemKey: action.id,
      label: action.label,
      icon: action.icon,
      disabled:
        typeof action.disabled === 'function'
          ? action.disabled(item)
          : action.disabled,
      divider: action.divider,
      onClick: () => action.onAction(item, index),
    }));
  }, [itemActions, item, index]);

  // Render selection control
  const renderSelectionControl = () => {
    if (selectionMode === 'none' || !showSelectionControls) {return null;}

    if (selectionMode === 'single') {
      return (
        <div className={styles.selectionControl}>
          <button
            type="button"
            className={styles.radioButton}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectionChange(true);
            }}
            disabled={isDisabled}
            aria-pressed={isSelected}
          >
            <span
              className={styles.radioIndicator}
              data-selected={isSelected || undefined}
            />
          </button>
        </div>
      );
    }

    return (
      <div
        className={styles.selectionControl}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={handleSelectionChange}
          disabled={isDisabled}
          size={size === 'lg' ? 'md' : 'sm'}
          aria-label={`Select item ${itemKey}`}
        />
      </div>
    );
  };

  // Render expand control
  const renderExpandControl = () => {
    if (!hasExpandedContent || expandTrigger !== 'icon') {return null;}

    return (
      <div className={styles.expandControl}>
        <button
          type="button"
          className={styles.expandButton}
          onClick={handleExpandClick}
          disabled={isDisabled}
          data-expanded={isExpanded || undefined}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <Icon name="chevron-right" size={size === 'lg' ? 'md' : 'sm'} />
        </button>
      </div>
    );
  };

  // Render item actions
  const renderItemActions = () => {
    if (!itemActions || itemActions.length === 0) {return null;}

    return (
      <div className={styles.itemActions}>
        <Dropdown
          label={<Icon name="more" size="sm" />}
          items={dropdownItems}
          variant="ghost"
          size="sm"
          showChevron={false}
          width={180}
        />
      </div>
    );
  };

  // Render default content
  const renderDefaultContent = () => {
    const primaryValue = primaryTextField ? String(item[primaryTextField] ?? '') : '';
    const secondaryValue = secondaryTextField ? String(item[secondaryTextField] ?? '') : '';
    const avatarValue = avatarField ? item[avatarField] : undefined;

    return (
      <>
        {avatarValue && (
          <div className={styles.itemAvatar}>
            {typeof avatarValue === 'string' ? (
              avatarValue.startsWith('http') || avatarValue.startsWith('/') ? (
                <img src={avatarValue as string} alt="" />
              ) : (
                <Avatar initials={avatarValue as string} size={size} />
              )
            ) : (
              avatarValue as ReactNode
            )}
          </div>
        )}
        <div className={styles.itemContent}>
          {primaryValue && (
            <span className={styles.itemPrimaryText}>{primaryValue}</span>
          )}
          {secondaryValue && (
            <span className={styles.itemSecondaryText}>{secondaryValue}</span>
          )}
        </div>
      </>
    );
  };

  // Determine what to render for the item content
  const itemContent = renderItem
    ? renderItem(item, index, renderContext)
    : renderDefaultContent();

  const isClickable =
    !!onItemClick ||
    selectionMode !== 'none' ||
    (expandTrigger === 'click' && hasExpandedContent);

  return (
    <>
      <div
        ref={ref || itemRef}
        className={styles.listItem}
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
        data-focused={isFocused || undefined}
        data-clickable={isClickable || undefined}
        data-actions-trigger={itemActionsTrigger}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={selectionMode !== 'none' ? 'option' : 'listitem'}
        aria-selected={selectionMode !== 'none' ? isSelected : undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isFocused ? 0 : -1}
        id={`${listId}-item-${itemKey}`}
      >
        {selectionControlPosition === 'start' && renderSelectionControl()}
        {renderExpandControl()}

        {itemActionsPosition === 'start' && renderItemActions()}

        {itemContent}

        {itemActionsPosition === 'end' && renderItemActions()}
        {selectionControlPosition === 'end' && renderSelectionControl()}
      </div>

      {/* Expanded content */}
      {hasExpandedContent && (
        <Collapse isOpen={isExpanded}>
          <div className={styles.expandedContent}>
            {renderExpandedContent(item, index)}
          </div>
        </Collapse>
      )}
    </>
  );
}

export const ListItem = forwardRef(ListItemInner) as <
  T extends Record<string, unknown> = Record<string, unknown>
>(
  props: ListItemProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

(ListItem as React.FC).displayName = 'ListItem';

export default ListItem;
