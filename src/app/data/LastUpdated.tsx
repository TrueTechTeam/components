import React, { useEffect, useState } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { IconButton } from '../../lib/components/buttons/IconButton';
import { useLabels } from '../../lib/contexts/LabelsContext';
import { useFormatters } from '../AppProvider/hooks';
import { updatedText } from './updatedText';
import styles from './LastUpdated.module.scss';

export interface LastUpdatedProps {
  query: Pick<UseQueryResult<unknown, unknown>, 'dataUpdatedAt' | 'isFetching'> & {
    refetch: () => unknown;
  };
  /** Show the refresh button. @default true */
  refreshable?: boolean;
  className?: string;
}

const TICK_MS = 30_000;

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
        {updatedText(t, relativeTime, dataUpdatedAt, 'lastUpdated.text')}
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
