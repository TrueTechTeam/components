/**
 * Dropdown component - Menu with integrated button trigger
 */

import { useState, useMemo, type ReactNode, type ReactElement } from 'react';
import { Menu, type MenuProps, MenuItem, MenuList, MenuDivider } from '../Menu';
import { Button } from '../../buttons/Button';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import type { ComponentVariant, ComponentSize } from '../../../types';
import styles from './Dropdown.module.scss';

/**
 * Dropdown item definition
 */
export interface DropdownItem {
  /**
   * Unique key for the item
   */
  itemKey: string;

  /**
   * Label to display
   */
  label: ReactNode;

  /**
   * Optional icon (icon name or React element)
   */
  icon?: ReactNode | IconName;

  /**
   * Whether the item is disabled
   */
  disabled?: boolean;

  /**
   * Whether this is a divider (renders MenuDivider instead of MenuItem)
   */
  divider?: boolean;

  /**
   * Click handler for the item
   */
  onClick?: () => void;
}

/**
 * Dropdown option for extracting labels (deprecated, use DropdownItem)
 */
export interface DropdownOption {
  itemKey: string;
  children: ReactNode;
}

/**
 * Dropdown component props
 */
export interface DropdownProps extends Omit<MenuProps, 'trigger' | 'children'> {
  /**
   * Button text (shown when nothing is selected)
   */
  label: ReactNode;

  /**
   * Button variant
   * @default 'outline'
   */
  variant?: ComponentVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Show chevron icon
   * @default true
   */
  showChevron?: boolean;

  /**
   * Button icon
   */
  icon?: ReactNode | IconName;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Array of items to render as menu items
   * If provided, children will be ignored
   */
  items?: DropdownItem[];

  /**
   * Custom children (menu items)
   * Only used if items prop is not provided
   */
  children?: ReactNode;
}

/**
 * Dropdown component
 * Menu with an integrated button trigger
 */
/**
 * Extract menu items from children
 */
function extractMenuItems(children: ReactNode): Map<string, ReactNode> {
  const itemsMap = new Map<string, ReactNode>();

  const processChild = (child: ReactNode): void => {
    if (!child) {return;}

    if (Array.isArray(child)) {
      child.forEach(processChild);
      return;
    }

    const element = child as ReactElement;
    if (element?.type === MenuItem && element.props?.itemKey) {
      itemsMap.set(element.props.itemKey, element.props.children);
    }

    // Recursively process children (for MenuList, MenuGroup, etc.)
    if (element?.props?.children) {
      processChild(element.props.children);
    }
  };

  processChild(children);
  return itemsMap;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  variant = 'outline',
  size = 'md',
  showChevron = true,
  icon,
  fullWidth = false,
  items,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  selectedKeys,
  ...menuProps
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  // Build items map from items prop or children
  const itemsMap = useMemo(() => {
    if (items) {
      // Create map from items array
      const map = new Map<string, ReactNode>();
      items.forEach((item) => {
        if (!item.divider) {
          map.set(item.itemKey, item.label);
        }
      });
      return map;
    }
    // Fallback to extracting from children
    return extractMenuItems(children);
  }, [items, children]);

  // Generate display label based on selection
  const displayLabel = useMemo(() => {
    if (!selectedKeys || selectedKeys.length === 0) {
      return label;
    }

    const selectedLabels = selectedKeys
      .map((key) => itemsMap.get(key))
      .filter(Boolean);

    if (selectedLabels.length === 0) {
      return label;
    }

    // Show comma-separated list of selected items
    return selectedLabels.map((item, index) => (
      <span key={index}>
        {item}
        {index < selectedLabels.length - 1 && ', '}
      </span>
    ));
  }, [selectedKeys, itemsMap, label]);

  // Render menu content from items array or children
  const menuContent = useMemo(() => {
    if (items) {
      return (
        <MenuList>
          {items.map((item) => {
            if (item.divider) {
              return <MenuDivider key={item.itemKey} />;
            }
            return (
              <MenuItem
                key={item.itemKey}
                itemKey={item.itemKey}
                startIcon={item.icon}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.label}
              </MenuItem>
            );
          })}
        </MenuList>
      );
    }
    return children;
  }, [items, children]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    if (controlledIsOpen === undefined) {
      setUncontrolledIsOpen(newIsOpen);
    }
    onOpenChange?.(newIsOpen);
  };

  const iconElement =
    typeof icon === 'string' ? <Icon name={icon as IconName} size={20} /> : icon;

  return (
    <Menu
      position="bottom-left"
      width="trigger"
      {...menuProps}
      selectedKeys={selectedKeys}
      trigger={
        <Button
          variant={variant}
          size={size}
          onClick={handleToggle}
          fullWidth={fullWidth}
          startIcon={iconElement}
          endIcon={
            showChevron ? (
              <Icon
                name="chevron-down"
                size={16}
                className={styles.dropdownChevron}
                data-open={isOpen || undefined}
              />
            ) : undefined
          }
        >
          {displayLabel}
        </Button>
      }
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (controlledIsOpen === undefined) {
          setUncontrolledIsOpen(open);
        }
        onOpenChange?.(open);
      }}
    >
      {menuContent}
    </Menu>
  );
};

Dropdown.displayName = 'Dropdown';
