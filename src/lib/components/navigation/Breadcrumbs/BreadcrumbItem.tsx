import React from 'react';
import type { BaseComponentProps } from '../../../types';
import { Icon, type IconName } from '../../display/Icon';
import styles from './Breadcrumbs.module.scss';

export interface BreadcrumbItemProps extends BaseComponentProps {
  /**
   * Link href
   */
  href?: string;

  /**
   * Whether this is the current page
   */
  current?: boolean;

  /**
   * Icon to display
   */
  icon?: React.ReactNode | IconName;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void;

  /**
   * Item content
   */
  children: React.ReactNode;
}

/**
 * BreadcrumbItem - Individual breadcrumb item
 *
 * @example
 * ```tsx
 * <BreadcrumbItem href="/">Home</BreadcrumbItem>
 * <BreadcrumbItem href="/products">Products</BreadcrumbItem>
 * <BreadcrumbItem current>Electronics</BreadcrumbItem>
 * ```
 */
export const BreadcrumbItem = ({
  ref,
  href,
  current = false,
  icon,
  onClick,
  children,
  className,
  'data-testid': testId,
  style,
  ...restProps
}: BreadcrumbItemProps & {
  ref?: React.Ref<HTMLElement>;
}) => {
  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    if (typeof icon === 'string') {
      return <Icon name={icon as IconName} className={styles.itemIcon} />;
    }

    return <span className={styles.itemIcon}>{icon}</span>;
  };

  const componentClasses = [styles.item, className].filter(Boolean).join(' ');

  const content = (
    <>
      {renderIcon()}
      <span className={styles.itemText}>{children}</span>
    </>
  );

  if (current || !href) {
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={componentClasses}
        data-component="breadcrumb-item"
        data-current={current || undefined}
        data-testid={testId}
        aria-current={current ? 'page' : undefined}
        style={style}
        {...restProps}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      className={componentClasses}
      onClick={onClick}
      data-component="breadcrumb-item"
      data-testid={testId}
      style={style}
      {...restProps}
    >
      {content}
    </a>
  );
};

export default BreadcrumbItem;
