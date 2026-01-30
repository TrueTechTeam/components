/**
 * Menu component - Interactive menu with keyboard navigation and selection
 */

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { Popover, type PopoverProps } from '../Popover';
import { MenuContext, type SelectionMode } from './MenuContext';
import { useFocusTrap } from '../../../hooks';
import styles from './Menu.module.scss';

/**
 * Menu component props
 */
export interface MenuProps extends Omit<PopoverProps, 'children' | 'width'> {
  /**
   * Menu items (MenuList, MenuItem, etc.)
   */
  children: ReactNode;

  /**
   * Selection mode
   * @default 'none'
   */
  selectionMode?: SelectionMode;

  /**
   * Selected item keys (controlled)
   */
  selectedKeys?: string[];

  /**
   * Default selected keys (uncontrolled)
   * @default []
   */
  defaultSelectedKeys?: string[];

  /**
   * Callback when selection changes
   */
  onSelectionChange?: (keys: string[]) => void;

  /**
   * Callback when item is selected
   */
  onAction?: (key: string) => void;

  /**
   * Width configuration for menu
   * - 'trigger': Match trigger element width
   * - 'auto': Use natural content width
   * - 'content': Use content width (fit-content)
   * - 'max-content': Use maximum content width (takes width of widest item and target)
   * - number: Fixed width in pixels
   * @default 'max-content'
   */
  width?: PopoverProps['width'];

  /**
   * Whether to automatically focus the first menu item when opened
   * @default true
   */
  autoFocusFirstItem?: boolean;

  /**
   * Whether to scroll to the selected item when menu opens
   * @default false
   */
  scrollToSelected?: boolean;

  /**
   * Enable keyboard type-ahead navigation
   * When enabled, typing characters will jump to/cycle through matching items
   * @default false
   */
  enableTypeAhead?: boolean;

  /**
   * Delay in milliseconds before resetting the type-ahead search string
   * @default 500
   */
  typeAheadDelay?: number;
}

/**
 * Menu component
 * Provides context and keyboard navigation for menu items
 */
export const Menu: React.FC<MenuProps> = ({
  children,
  selectionMode = 'none',
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  onAction,
  isOpen,
  onOpenChange,
  width = 'max-content',
  autoFocusFirstItem = true,
  scrollToSelected = false,
  enableTypeAhead = false,
  typeAheadDelay = 500,
  ...popoverProps
}) => {
  // Controlled/uncontrolled selection state
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useState<Set<string>>(
    new Set(defaultSelectedKeys)
  );

  const selectedKeys =
    controlledSelectedKeys !== undefined
      ? new Set(controlledSelectedKeys)
      : uncontrolledSelectedKeys;

  // Focus state
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [itemsCount, setItemsCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const nextIndexRef = useRef(0);

  // Type-ahead state
  const [itemLabels, setItemLabels] = useState<Map<number, string>>(new Map());
  const [searchString, setSearchString] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs to maintain stable event handler
  const searchStringRef = useRef('');
  const focusedIndexRef = useRef(-1);
  const itemLabelsRef = useRef<Map<number, string>>(new Map());

  // Keep refs synced with state
  useEffect(() => {
    searchStringRef.current = searchString;
  }, [searchString]);

  useEffect(() => {
    focusedIndexRef.current = focusedIndex;
  }, [focusedIndex]);

  // Focus trap when menu is open
  // Disable auto-focus in useFocusTrap since we'll handle it ourselves
  useFocusTrap(menuRef, isOpen ?? false, false);

  // Custom focus management for menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) {
      return;
    }

    // Blur any currently focused element (like the trigger button)
    // then focus the menu container for proper keyboard event handling
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Small delay to ensure blur completes and menu is fully mounted
    const timeoutId = setTimeout(() => {
      menuRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Set initial focused index when items are registered
  useEffect(() => {
    if (isOpen && autoFocusFirstItem && itemsCount > 0 && focusedIndex === -1) {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setFocusedIndex(0);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, autoFocusFirstItem, itemsCount, focusedIndex]);

  const handleSelectionChange = useCallback(
    (newKeys: Set<string>) => {
      if (controlledSelectedKeys === undefined) {
        setUncontrolledSelectedKeys(newKeys);
      }
      onSelectionChange?.(Array.from(newKeys));
    },
    [controlledSelectedKeys, onSelectionChange]
  );

  const toggleSelection = useCallback(
    (key: string) => {
      const newKeys = new Set(selectedKeys);

      if (selectionMode === 'single') {
        newKeys.clear();
        newKeys.add(key);
        handleSelectionChange(newKeys);
        // Close menu after single selection
        if (isOpen !== undefined) {
          onOpenChange?.(false);
        }
      } else if (selectionMode === 'multi') {
        if (newKeys.has(key)) {
          newKeys.delete(key);
        } else {
          newKeys.add(key);
        }
        handleSelectionChange(newKeys);
      }

      onAction?.(key);
    },
    [selectedKeys, selectionMode, handleSelectionChange, onAction, isOpen, onOpenChange]
  );

  const closeMenu = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const registerItem = useCallback(() => {
    const index = nextIndexRef.current++;
    setItemsCount((prev) => Math.max(prev, index + 1));
    return index;
  }, []);

  // Register item label for type-ahead search
  const registerItemLabel = useCallback((index: number, label: string) => {
    // Update ref directly for stable event handler
    itemLabelsRef.current.set(index, label);
    // Still update state for legacy compatibility if needed
    setItemLabels((prev) => {
      const newMap = new Map(prev);
      newMap.set(index, label);
      return newMap;
    });
  }, []);

  // Reset search string after delay
  const resetSearchString = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setSearchString('');
  }, []);

  // Stable find matching item function (no dependencies)
  const findMatchingItemStable = useCallback(
    (searchStr: string, currentIndex: number, labels: Map<number, string>) => {
      const searchLower = searchStr.toLowerCase();
      const items = Array.from(labels.entries());

      if (searchStr.length === 1) {
        // Single character - cycle through matches
        const matches = items.filter(([_, label]) => label.toLowerCase().startsWith(searchLower));

        if (matches.length === 0) {
          return -1;
        }

        // Find next match after current index (wrap around)
        const currentMatchIndex = matches.findIndex(([index]) => index === currentIndex);
        const nextMatchIndex = (currentMatchIndex + 1) % matches.length;
        return matches[nextMatchIndex][0];
      } else {
        // Multiple characters - jump to first match
        const match = items.find(([_, label]) => label.toLowerCase().startsWith(searchLower));
        return match ? match[0] : -1;
      }
    },
    [] // No dependencies - stable!
  );

  // Find matching item based on search string
  const findMatchingItem = useCallback(
    (searchStr: string, currentIndex: number) => {
      const searchLower = searchStr.toLowerCase();
      const items = Array.from(itemLabels.entries());

      if (searchStr.length === 1) {
        // Single character - cycle through matches
        // Find all items starting with this character
        const matches = items.filter(([_, label]) => label.toLowerCase().startsWith(searchLower));

        if (matches.length === 0) {
          return -1;
        }

        // Find next match after current index (wrap around)
        const currentMatchIndex = matches.findIndex(([index]) => index === currentIndex);
        const nextMatchIndex = (currentMatchIndex + 1) % matches.length;
        return matches[nextMatchIndex][0];
      } else {
        // Multiple characters - jump to first match
        const match = items.find(([_, label]) => label.toLowerCase().startsWith(searchLower));
        return match ? match[0] : -1;
      }
    },
    [itemLabels]
  );

  // Handle type-ahead key press
  const handleTypeAheadKeyPress = useCallback(
    (key: string) => {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Append character to search string
      const newSearchString = searchString + key;
      setSearchString(newSearchString);

      // Find matching item
      const matchIndex = findMatchingItem(newSearchString, focusedIndex);

      if (matchIndex !== -1) {
        setFocusedIndex(matchIndex);
      }

      // Set timeout to reset search string
      searchTimeoutRef.current = setTimeout(() => {
        resetSearchString();
      }, typeAheadDelay);
    },
    [searchString, focusedIndex, findMatchingItem, resetSearchString, typeAheadDelay]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      console.log(event.key);
      // Handle type-ahead if enabled
      if (enableTypeAhead && event.key.length === 1) {
        // Only handle printable characters (not modifier keys)
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
          const char = event.key;
          // Only process alphanumeric and space
          if (/^[a-zA-Z0-9\s]$/.test(char)) {
            event.preventDefault();

            // Read from refs instead of closure variables
            const currentSearch = searchStringRef.current;
            const currentFocus = focusedIndexRef.current;
            const labels = itemLabelsRef.current;

            // Clear existing timeout
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }

            // Update search string (both state and ref)
            const newSearchString = currentSearch + char;
            setSearchString(newSearchString);
            searchStringRef.current = newSearchString;

            // Find matching item using ref
            const matchIndex = findMatchingItemStable(newSearchString, currentFocus, labels);

            if (matchIndex !== -1) {
              setFocusedIndex(matchIndex);
              focusedIndexRef.current = matchIndex;
            }

            // Set timeout to reset search string
            searchTimeoutRef.current = setTimeout(() => {
              setSearchString('');
              searchStringRef.current = '';
            }, typeAheadDelay);

            return;
          }
        }
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => {
            // If nothing is focused, start at first item
            if (prev === -1) {
              return 0;
            }
            const next = (prev + 1) % itemsCount;
            focusedIndexRef.current = next;
            return next;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => {
            // If nothing is focused, start at last item
            if (prev === -1) {
              return itemsCount - 1;
            }
            const next = (prev - 1 + itemsCount) % itemsCount;
            focusedIndexRef.current = next;
            return next;
          });
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          focusedIndexRef.current = 0;
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(itemsCount - 1);
          focusedIndexRef.current = itemsCount - 1;
          break;
      }
    },
    [enableTypeAhead, itemsCount, typeAheadDelay, findMatchingItemStable]
  );

  // Attach keyboard event listener using native DOM API to ensure it captures events
  // even when child elements (MenuItems) have focus
  useEffect(() => {
    if (!isOpen || !menuRef.current) {
      return;
    }

    const container = menuRef.current;

    // Create handler that converts native Event to React KeyboardEvent type
    const handler = (event: Event) => {
      handleKeyDown(event as unknown as KeyboardEvent);
    };

    // Use capture phase to ensure we get the event before it reaches focused children
    container.addEventListener('keydown', handler, true);

    return () => {
      container.removeEventListener('keydown', handler, true);
    };
  }, [isOpen, handleKeyDown]);

  // Reset focus and item registration when menu opens/closes
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        setFocusedIndex(-1);
        focusedIndexRef.current = -1;
        nextIndexRef.current = 0;
        setItemsCount(0);
      } else {
        // Reset type-ahead state when menu closes
        resetSearchString();
        setItemLabels(new Map());
        itemLabelsRef.current = new Map();
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [isOpen, resetSearchString]);

  const contextValue = {
    selectedKeys,
    toggleSelection,
    selectionMode,
    closeMenu,
    focusedIndex,
    setFocusedIndex,
    itemsCount,
    registerItem,
    onItemAction: onAction,
    scrollToSelected,
    enableTypeAhead,
    registerItemLabel,
  };

  return (
    <Popover {...popoverProps} isOpen={isOpen} onOpenChange={onOpenChange} width={width}>
      <div ref={menuRef} tabIndex={0} className={styles.menuWrapper}>
        <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
      </div>
    </Popover>
  );
};

Menu.displayName = 'Menu';
