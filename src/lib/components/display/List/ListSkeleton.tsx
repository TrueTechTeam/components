import React from 'react';
import type { ComponentSize } from '../../../types';
import { Skeleton } from '../Skeleton';
import styles from './List.module.scss';

export interface ListSkeletonProps {
  /**
   * Number of skeleton rows to display
   * @default 5
   */
  rows?: number;

  /**
   * Whether to show avatar placeholder
   * @default true
   */
  showAvatar?: boolean;

  /**
   * Whether to show secondary text placeholder
   * @default true
   */
  showSecondaryText?: boolean;

  /**
   * Size variant (affects dimensions)
   */
  size?: ComponentSize;
}

const avatarSizes: Record<ComponentSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

export function ListSkeleton({
  rows = 5,
  showAvatar = true,
  showSecondaryText = true,
  size = 'md',
}: ListSkeletonProps) {
  const avatarSize = avatarSizes[size];

  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={styles.skeletonItem} aria-hidden="true">
          {showAvatar && <Skeleton variant="circular" width={avatarSize} height={avatarSize} />}
          <div className={styles.skeletonContent}>
            <Skeleton variant="text" width="75%" />
            {showSecondaryText && <Skeleton variant="text" width="50%" />}
          </div>
        </div>
      ))}
    </>
  );
}

export default ListSkeleton;
