import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { Button } from '../../../lib/components/buttons/Button';
import {
  ButtonToggleGroup,
  ButtonToggleGroupItem,
} from '../../../lib/components/buttons/ButtonToggleGroup';
import { AdaptiveGrid } from '../../../lib/components/layout/AdaptiveGrid';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { LastUpdated } from '../../data/LastUpdated';
import { Page } from '../../page/Page';
import { param } from '../../params/codecs';
import { usePageParams } from '../../params/usePageParams';
import { PageHeader, type PageAction } from '../PageHeader';
import styles from './DashboardPage.module.scss';

export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'ytd';

const ALL_RANGES: TimeRange[] = ['24h', '7d', '30d', '90d', 'ytd'];
const DEFAULT_RANGES: TimeRange[] = ['7d', '30d', '90d'];

interface RangeContextValue {
  range: TimeRange;
  setRange: (range: TimeRange) => void;
}

/** The effective range of the enclosing `DashboardPage`, so widgets and the toggle agree. */
const RangeContext = createContext<RangeContextValue | null>(null);

/**
 * The dashboard time range, bound to the URL (`?range=`). Inside a `DashboardPage` it is the
 * page's effective range (the one the toggle shows: unknown or unoffered values fall back to the
 * page default). Elsewhere an absent or unknown value is `def`. Widgets call this to scope their
 * queries to the selected range.
 */
export function useTimeRange(def: TimeRange = '30d'): [TimeRange, (range: TimeRange) => void] {
  const [params, setParams] = usePageParams({ range: param.enum(ALL_RANGES, def) });
  const shared = useContext(RangeContext);
  return shared ? [shared.range, shared.setRange] : [params.range, (range) => setParams({ range })];
}

export interface DashboardPageProps {
  title: string;
  description?: ReactNode;
  actions?: PageAction[];
  /** Ranges offered by the toggle. @default ['7d', '30d', '90d'] */
  ranges?: TimeRange[];
  /** @default '30d' */
  defaultRange?: TimeRange;
  /** KPI widgets (3 to 5). */
  kpis?: ReactNode;
  /** Main widget(s), full width. */
  primary?: ReactNode;
  /** Widgets in a responsive grid under the primary area. */
  secondary?: ReactNode;
  /** Recent activity (e.g. `ActivityTimeline` in a `DashboardWidget`). */
  activity?: ReactNode;
  /** "Refresh all" invalidates the queries under this prefix; without it the button is hidden. */
  queryKeyPrefix?: QueryKey;
  /** Stable page id (see `Page`). */
  id?: string;
}

interface CacheSummary {
  updatedAt: number;
  fetching: boolean;
}

/** Latest `dataUpdatedAt` and fetching flag across the queries under `prefix`, kept live. */
function useCacheSummary(prefix: QueryKey | undefined): CacheSummary {
  const client = useQueryClient();
  const cache = client.getQueryCache();
  const read = useCallback((): CacheSummary => {
    if (!prefix) {
      return { updatedAt: 0, fetching: false };
    }
    const queries = cache.findAll({ queryKey: prefix });
    return {
      updatedAt: Math.max(0, ...queries.map((q) => q.state.dataUpdatedAt)),
      fetching: queries.some((q) => q.state.fetchStatus === 'fetching'),
    };
  }, [cache, prefix]);
  const [summary, setSummary] = useState(read);
  useEffect(() => {
    const update = () =>
      setSummary((prev) => {
        const next = read();
        return prev.updatedAt === next.updatedAt && prev.fetching === next.fetching ? prev : next;
      });
    update();
    return cache.subscribe(update);
  }, [cache, read]);
  return summary;
}

/**
 * Dashboard template: header with a URL-bound time range toggle and "Refresh all", a KPI row,
 * primary and secondary widgets, then activity. Every widget is its own `Section`, so each
 * owns its loading, error and refresh states and one failing widget never blanks the others.
 */
export function DashboardPage({
  title,
  description,
  actions,
  ranges = DEFAULT_RANGES,
  defaultRange = '30d',
  kpis,
  primary,
  secondary,
  activity,
  queryKeyPrefix,
  id,
}: DashboardPageProps) {
  const t = useLabels();
  const client = useQueryClient();
  // `defaultRange` must be offered; otherwise the first offered range is the default.
  const fallback = ranges.includes(defaultRange) ? defaultRange : (ranges[0] ?? defaultRange);
  const [params, setParams] = usePageParams({ range: param.enum(ALL_RANGES, fallback) });
  const range = ranges.includes(params.range) ? params.range : fallback;
  const rangeContext = useMemo<RangeContextValue>(
    () => ({ range, setRange: (next) => setParams({ range: next }) }),
    [range, setParams]
  );
  // Callers pass an inline array; key on its content so effects don't re-run every render.
  const prefixKey = JSON.stringify(queryKeyPrefix);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const prefix = useMemo(() => queryKeyPrefix, [prefixKey]);
  const { updatedAt, fetching } = useCacheSummary(prefix);
  const refreshAll = useCallback(
    () => (prefix ? client.invalidateQueries({ queryKey: prefix }) : Promise.resolve()),
    [client, prefix]
  );
  const aggregate = useMemo(
    () => ({ dataUpdatedAt: updatedAt, isFetching: fetching, refetch: refreshAll }),
    [updatedAt, fetching, refreshAll]
  );

  return (
    <Page title={title} id={id}>
      <RangeContext.Provider value={rangeContext}>
        <div className={styles.root} data-component="dashboard-page">
          <PageHeader title={title} description={description} actions={actions} />
          <div className={styles.toolbar}>
            {ranges.length > 1 && (
              <ButtonToggleGroup
                value={range}
                onChange={(next) => rangeContext.setRange(next as TimeRange)}
                size="sm"
                aria-label={t('dashboard.range')}
              >
                {ranges.map((r) => (
                  <ButtonToggleGroupItem key={r} value={r}>
                    {t(`dashboard.range.${r}`)}
                  </ButtonToggleGroupItem>
                ))}
              </ButtonToggleGroup>
            )}
            {prefix && (
              <div className={styles.toolbarEnd}>
                <LastUpdated query={aggregate} refreshable={false} />
                <Button
                  variant="outline"
                  size="sm"
                  aria-disabled={fetching || undefined}
                  aria-busy={fetching || undefined}
                  onClick={() => {
                    if (!fetching) {
                      void refreshAll();
                    }
                  }}
                >
                  {t('dashboard.refreshAll')}
                </Button>
              </div>
            )}
          </div>
          {kpis && (
            <div role="group" aria-label={t('dashboard.kpis')}>
              <AdaptiveGrid minItemWidth={160} fillMode="auto-fit" justifyItems="stretch">
                {kpis}
              </AdaptiveGrid>
            </div>
          )}
          {primary && <div className={styles.stack}>{primary}</div>}
          {secondary && (
            <AdaptiveGrid minItemWidth={300} fillMode="auto-fit" justifyItems="stretch">
              {secondary}
            </AdaptiveGrid>
          )}
          {activity && <div className={styles.stack}>{activity}</div>}
        </div>
      </RangeContext.Provider>
    </Page>
  );
}
