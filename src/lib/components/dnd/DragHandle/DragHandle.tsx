/**
 * DragHandle component - Explicit drag handle for draggable items
 */

import React, { type CSSProperties } from 'react';
import type { BaseComponentProps, ExtendedComponentSize } from '../../../types/component.types';
import styles from './DragHandle.module.scss';

export interface DragHandleProps
  extends Omit<BaseComponentProps, 'children'>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  /**
   * Size of the handle
   * @default 'md'
   */
  size?: ExtendedComponentSize;

  /**
   * Visual variant
   * @default 'dots'
   */
  variant?: 'dots' | 'lines' | 'grip';

  /**
   * Whether handle is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Accessible label
   * @default 'Drag handle'
   */
  label?: string;

  /**
   * Custom styles
   */
  style?: CSSProperties;
}

/**
 * DragHandle component for drag and drop interactions
 *
 * @example
 * ```tsx
 * <SortableItem>
 *   <DragHandle {...dragHandleProps} />
 *   <span>Item content</span>
 * </SortableItem>
 * ```
 */
export const DragHandle = ({
  ref,
  size = 'md',
  variant = 'dots',
  disabled = false,
  label = 'Drag handle',
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
  ...rest
}: DragHandleProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const containerClasses = [styles.dragHandle, className].filter(Boolean).join(' ');

  return (
    <div
      {...rest}
      ref={ref}
      className={containerClasses}
      style={style}
      data-testid={dataTestId}
      data-size={size}
      data-variant={variant}
      data-disabled={disabled || undefined}
      aria-label={ariaLabel || label}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {variant === 'dots' && (
        <span className={styles.dotsIcon}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
      )}
      {variant === 'lines' && (
        <span className={styles.linesIcon}>
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </span>
      )}
      {variant === 'grip' && (
        <span className={styles.gripIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="5" r="1" fill="currentColor" />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="9" cy="19" r="1" fill="currentColor" />
            <circle cx="15" cy="5" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="19" r="1" fill="currentColor" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default DragHandle;
