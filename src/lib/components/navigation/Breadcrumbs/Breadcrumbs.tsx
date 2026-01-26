import React, { forwardRef, useMemo } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import { Icon, type IconName } from '../../display/Icon';
import { BreadcrumbItem, type BreadcrumbItemProps } from './BreadcrumbItem';
import { BreadcrumbSeparator } from './BreadcrumbSeparator';
import styles from './Breadcrumbs.module.scss';

export interface BreadcrumbItemConfig {
  /**
   * Display label
   */
  label: string;

  /**
   * Link href
   */
  href?: string;

  /**
   * Icon to display
   */
  icon?: React.ReactNode | IconName;

  /**
   * Whether this is the current/active page
   */
  current?: boolean;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void;
}

export interface BreadcrumbsProps extends BaseComponentProps {
  /**
   * Custom separator element
   * @default "/"
   */
  separator?: React.ReactNode;

  /**
   * Maximum items before collapsing
   */
  maxItems?: number;

  /**
   * Number of items to show at start when collapsed
   * @default 1
   */
  itemsBeforeCollapse?: number;

  /**
   * Number of items to show at end when collapsed
   * @default 2
   */
  itemsAfterCollapse?: number;

  /**
   * Show home icon for first item
   * @default false
   */
  showHomeIcon?: boolean;

  /**
   * Size variant
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Breadcrumb items (declarative API)
   */
  items?: BreadcrumbItemConfig[];

  /**
   * Children (compound API - BreadcrumbItem components)
   */
  children?: React.ReactNode;
}

/**
 * Breadcrumbs - Show current location in navigation hierarchy
 *
 * @example
 * ```tsx
 * // Declarative API with items prop
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Electronics', current: true },
 *   ]}
 * />
 *
 * // Compound API with children
 * <Breadcrumbs>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/products">Products</BreadcrumbItem>
 *   <BreadcrumbItem current>Electronics</BreadcrumbItem>
 * </Breadcrumbs>
 *
 * // With collapse
 * <Breadcrumbs
 *   items={items}
 *   maxItems={4}
 *   itemsBeforeCollapse={1}
 *   itemsAfterCollapse={2}
 * />
 * ```
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      separator = '/',
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 2,
      showHomeIcon = false,
      size = 'md',
      items,
      children,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      style,
      ...restProps
    },
    ref
  ) => {
    // Convert items to rendered elements
    const renderedItems = useMemo(() => {
      if (items) {
        return items.map((item, index) => (
          <BreadcrumbItem
            key={index}
            href={item.href}
            icon={index === 0 && showHomeIcon ? 'home' : item.icon}
            current={item.current ?? index === items.length - 1}
            onClick={item.onClick}
          >
            {item.label}
          </BreadcrumbItem>
        ));
      }

      // Process children, injecting home icon if needed
      return React.Children.map(children, (child, index) => {
        if (index === 0 && showHomeIcon && React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<BreadcrumbItemProps>, {
            icon: (child as React.ReactElement<BreadcrumbItemProps>).props.icon || 'Home',
          });
        }
        return child;
      });
    }, [items, children, showHomeIcon]);

    // Handle collapsing
    const displayedItems = useMemo(() => {
      if (!renderedItems) {
        return [];
      }

      const itemArray = React.Children.toArray(renderedItems);

      if (!maxItems || itemArray.length <= maxItems) {
        return itemArray;
      }

      const beforeItems = itemArray.slice(0, itemsBeforeCollapse);
      const afterItems = itemArray.slice(-itemsAfterCollapse);

      return [
        ...beforeItems,
        <span key="ellipsis" className={styles.ellipsis}>
          <Icon name="more" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        </span>,
        ...afterItems,
      ];
    }, [renderedItems, maxItems, itemsBeforeCollapse, itemsAfterCollapse, size]);

    const componentClasses = [styles.breadcrumbs, className].filter(Boolean).join(' ');

    return (
      <nav
        ref={ref}
        className={componentClasses}
        data-component="breadcrumbs"
        data-size={size}
        data-testid={testId}
        aria-label={ariaLabel || 'Breadcrumb'}
        style={style}
        {...restProps}
      >
        <ol className={styles.list}>
          {displayedItems?.map((item, index) => (
            <li key={index} className={styles.listItem}>
              {item}
              {index < displayedItems.length - 1 && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
