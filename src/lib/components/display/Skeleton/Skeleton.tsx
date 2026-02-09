import React from 'react';
import styles from './Skeleton.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the Skeleton component
 */
export interface SkeletonProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Visual variant of the component
   * @default 'primary'
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';

  /**
   * Width of the skeleton
   * @default '100%'
   */
  width?: string | number;

  /**
   * Height of the skeleton
   */
  height?: string | number;

  /**
   * Whether to animate the skeleton
   * @default true
   */
  animated?: boolean;

  /**
   * Number of lines for text variant
   * @default 1
   */
  lines?: number;
}

/**
 * Skeleton - Loading placeholder component for content that is loading
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width="200px" />
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton variant="circular" width={40} height={40} />
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton variant="rectangular" width="100%" height="200px" />
 * ```
 */
export const Skeleton = ({
  ref,
  variant = 'text',
  width = '100%',
  height,
  animated = true,
  lines = 1,
  className,
  style,
  ...restProps
}: SkeletonProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  // Merge className with component styles
  const componentClasses = [styles.skeleton, className].filter(Boolean).join(' ');

  // Default heights based on variant
  const defaultHeight =
    height ||
    (variant === 'text'
      ? '1em'
      : variant === 'circular'
        ? width
        : variant === 'rounded'
          ? '200px'
          : '100px');

  // Merge styles
  const mergedStyle: React.CSSProperties = {
    width,
    height: defaultHeight,
    ...style,
  };

  // Render multiple lines for text variant
  if (variant === 'text' && lines > 1) {
    return (
      <div
        ref={ref}
        className={styles.skeletonGroup}
        data-component="skeleton-group"
        {...restProps}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={componentClasses}
            data-component="skeleton"
            data-variant={variant}
            data-animated={animated || undefined}
            style={{
              width: index === lines - 1 ? '80%' : '100%',
              height: defaultHeight,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-component="skeleton"
      data-variant={variant}
      data-animated={animated || undefined}
      style={mergedStyle}
      {...restProps}
    />
  );
};

export default Skeleton;
