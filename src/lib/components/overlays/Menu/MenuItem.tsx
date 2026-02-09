/**
 * MenuItem component - Individual menu item with selection and keyboard support
 */

import {
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type MouseEvent,
  useState,
  isValidElement,
} from 'react';
import { useMenuContext } from './MenuContext';
import type { BaseComponentProps } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import styles from './MenuItem.module.scss';

/**
 * Extract text content from ReactNode for type-ahead search
 */
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }
  if (typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children) {
    return extractTextContent(node.props.children);
  }
  return '';
}

/**
 * MenuItem component props
 */
export interface MenuItemProps extends BaseComponentProps {
  /**
   * Unique key for this item
   */
  itemKey: string;

  /**
   * Whether item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display before text
   */
  startIcon?: ReactNode | IconName;

  /**
   * Icon to display after text
   */
  endIcon?: ReactNode | IconName;

  /**
   * Keyboard shortcut text to display
   */
  shortcut?: string;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Item content
   */
  children: ReactNode;
}

/**
 * MenuItem component
 * Interactive menu item with selection, hover, and keyboard support
 */
export const MenuItem: React.FC<MenuItemProps> = ({
  itemKey,
  disabled = false,
  startIcon,
  endIcon,
  shortcut,
  onClick,
  children,
  className,
  'data-testid': testId,
  ...restProps
}) => {
  const {
    selectedKeys,
    toggleSelection,
    selectionMode,
    focusedIndex,
    registerItem,
    scrollToSelected,
    enableTypeAhead,
    registerItemLabel,
  } = useMenuContext();

  const isSelected = selectedKeys.has(itemKey);
  const itemRef = useRef<HTMLLIElement>(null);

  // Get unique index from menu context
  const [itemIndex, setItemIndex] = useState<number>();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Register this item and get assigned index
  useEffect(() => {
    if (itemIndex === undefined) {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setItemIndex(registerItem());
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [registerItem, itemIndex]);

  // Scroll to selected item when menu opens
  useEffect(() => {
    if (scrollToSelected && isSelected && itemRef.current && !hasScrolled) {
      // Use a small timeout to ensure the menu is fully rendered
      const timeoutId = setTimeout(() => {
        itemRef.current?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
        setHasScrolled(true);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [scrollToSelected, isSelected, hasScrolled]);

  // Reset hasScrolled when menu closes
  useEffect(() => {
    if (!scrollToSelected) {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setHasScrolled(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [scrollToSelected]);

  // Register label for type-ahead search
  useEffect(() => {
    if (enableTypeAhead && itemIndex !== undefined) {
      const labelText = extractTextContent(children);
      registerItemLabel(itemIndex, labelText);
    }
  }, [enableTypeAhead, itemIndex, children, registerItemLabel]);

  // Scroll to focused item when focus changes
  const isFocused = focusedIndex === itemIndex;
  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isFocused]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (disabled) {
        return;
      }

      event.preventDefault();
      toggleSelection(itemKey);
      onClick?.();
    },
    [disabled, toggleSelection, itemKey, onClick]
  );

  const classes = [styles.menuItem, className].filter(Boolean).join(' ');

  // Render start icon
  const startIconElement =
    startIcon &&
    (typeof startIcon === 'string' ? <Icon name={startIcon as IconName} size={16} /> : startIcon);

  // Render end icon
  const endIconElement =
    endIcon &&
    (typeof endIcon === 'string' ? <Icon name={endIcon as IconName} size={16} /> : endIcon);

  // Show checkmark for selected items in single/multi mode
  const showCheckmark = selectionMode !== 'none' && isSelected;
  const hasSelectionMode = selectionMode !== 'none';

  return (
    <li
      ref={itemRef}
      role="menuitem"
      className={classes}
      data-component="menu-item"
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={disabled || undefined}
      data-has-selection={hasSelectionMode || undefined}
      data-testid={testId || `menu-item-${itemKey}`}
      onClick={handleClick}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      {...restProps}
    >
      {hasSelectionMode &&
        (showCheckmark ? (
          <Icon name="check" size={16} className={styles.menuItemCheck} />
        ) : (
          <span className={styles.menuItemCheckPlaceholder} aria-hidden="true" />
        ))}
      {startIconElement && <span className={styles.menuItemStartIcon}>{startIconElement}</span>}
      <span className={styles.menuItemContent}>{children}</span>
      {shortcut && <span className={styles.menuItemShortcut}>{shortcut}</span>}
      {endIconElement && <span className={styles.menuItemEndIcon}>{endIconElement}</span>}
    </li>
  );
};
