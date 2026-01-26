import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './Breadcrumbs.module.scss';

export interface BreadcrumbSeparatorProps extends BaseComponentProps {
  /**
   * Custom separator content
   * @default "/"
   */
  children?: React.ReactNode;
}

/**
 * BreadcrumbSeparator - Separator between breadcrumb items
 *
 * @example
 * ```tsx
 * <BreadcrumbSeparator>/</BreadcrumbSeparator>
 * <BreadcrumbSeparator>
 *   <ChevronRight />
 * </BreadcrumbSeparator>
 * ```
 */
export const BreadcrumbSeparator = forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  ({ children = '/', className, 'data-testid': testId, style, ...restProps }, ref) => {
    const componentClasses = [styles.separator, className].filter(Boolean).join(' ');

    return (
      <span
        ref={ref}
        className={componentClasses}
        data-component="breadcrumb-separator"
        data-testid={testId}
        aria-hidden="true"
        style={style}
        {...restProps}
      >
        {children}
      </span>
    );
  }
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export default BreadcrumbSeparator;
