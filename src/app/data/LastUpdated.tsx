import React, { useEffect, useState } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { IconButton } from '../../lib/components/buttons/IconButton';
import { useLabels } from '../../lib/contexts/LabelsContext';
import { useFormatters } from '../AppProvider/hooks';
import styles from './LastUpdated.module.scss';

export interface LastUpdatedProps {
  query: Pick<UseQueryResult, 'dataUpdatedAt' | 'isFetching' | 'refetch'>;
  /** Show the refresh button. @default true */
  refreshable?: boolean;
  className?: string;
}

const TICK_MS = 30_000;
/** Updates newer than this read "just now" instead of "0 seconds ago" / "in 2 seconds". */
const JUST_NOW_MS = 45_000;

/**
 * "Updated 3 minutes ago" with an optional refresh button. Updates under 45 s old read "Updated
 * just now"; timestamps in the future (clock skew) are treated as now.
 */
export function LastUpdated({ query, refreshable = true, className }: LastUpdatedProps) {
  const t = useLabels();
  const { relativeTime } = useFormatters();
  const [, setTick] = useState(0);
  const { dataUpdatedAt, isFetching, refetch } = query;

  useEffect(() => {
    if (!dataUpdatedAt) {
      return undefined;
    }
    const id = setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [dataUpdatedAt]);

  if (!dataUpdatedAt) {
    return null;
  }

  return (
    <span className={[styles.root, className].filter(Boolean).join(' ')}>
      <span className={styles.text}>
        {Date.now() - dataUpdatedAt < JUST_NOW_MS
          ? t('lastUpdated.justNow')
          : t('lastUpdated.text', { time: relativeTime(dataUpdatedAt) })}
      </span>
      {refreshable && (
        <span className={styles.refresh} data-fetching={isFetching || undefined}>
          <IconButton
            icon="refresh"
            size="sm"
            aria-label={t('lastUpdated.refresh')}
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
          />
        </span>
      )}
    </span>
  );
}
