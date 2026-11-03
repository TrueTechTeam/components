import React, { useEffect, type ReactNode } from 'react';
import { Button } from '../../lib/components/buttons/Button';
import { PageMessages, type PageMessagesProps } from '../../lib/components/display/PageMessages';
import { useLabels } from '../../lib/contexts/LabelsContext';
import { useAuth } from '../AppProvider/hooks';
import type { PageContextValue, QueryLike } from './PageContext';
import styles from './Page.module.scss';

/** State props shared by `Page` and `Section`. */
export interface StateProps {
  /** Query results that drive the loading, error, empty and refreshing states. */
  queries?: QueryLike[];
  /**
   * Receives each query's `data`, in order. Evaluated only when every query has data: all
   * succeeded, or a background refetch failed and the last loaded data is still shown.
   */
  isEmpty?: (data: unknown[]) => boolean;
  /** Shown while any query is pending. @default a Skeleton block (Page) / 3 text lines (Section) */
  skeleton?: ReactNode;
  /** Empty-state configuration passed to `PageMessages` as `emptyConfig`. */
  empty?: PageMessagesProps['emptyConfig'];
  /** Checked with `AppProvider` `auth.can`; when it fails the forbidden state is shown. */
  permission?: { action: string; subject?: string };
  /**
   * Show a failed query's error message in the error state. Off by default: raw messages can be
   * technical or leak server details, so end users see the generic error text.
   * @default false
   */
  showErrorDetails?: boolean;
  children: ReactNode;
}

interface PageStateProps extends StateProps {
  size: 'md' | 'sm';
  /** Heading level of PageMessages titles. */
  headingLevel: PageMessagesProps['headingLevel'];
  defaultSkeleton: ReactNode;
}

function messageError(error: unknown): Error | string | true {
  return error instanceof Error || typeof error === 'string' ? error : true;
}

/**
 * Renders the first matching state (STATE-1): forbidden, skeleton, error (retry refetches every
 * errored query), empty, then `children`. A failed background refetch of a query that still has
 * data keeps the content and shows a compact inline alert with Retry above it (R8); only errored
 * queries without data show the full error state. A refreshing bar overlays the top while any
 * query fetches in the background.
 */
export function PageState({
  queries = [],
  isEmpty,
  skeleton,
  empty,
  permission,
  showErrorDetails = false,
  size,
  headingLevel,
  defaultSkeleton,
  children,
}: PageStateProps) {
  const t = useLabels();
  const { can } = useAuth();

  if (permission && !can(permission.action, permission.subject)) {
    return <PageMessages forbidden size={size} headingLevel={headingLevel} />;
  }

  if (queries.some((query) => query.isPending)) {
    return (
      <div
        className={styles.skeleton}
        role="status"
        aria-busy="true"
        aria-label={t('common.loading')}
      >
        {skeleton ?? defaultSkeleton}
      </div>
    );
  }

  const errored = queries.filter((query) => query.isError);
  const retry = () => {
    errored.forEach((query) => void query.refetch());
  };
  const failedWithoutData = errored.find((query) => query.data === undefined);
  let content: ReactNode = children;
  if (failedWithoutData) {
    content = (
      <PageMessages
        error={showErrorDetails ? messageError(failedWithoutData.error) : true}
        onRetry={retry}
        size={size}
        headingLevel={headingLevel}
      />
    );
  } else if (isEmpty?.(queries.map((query) => query.data))) {
    content = <PageMessages empty emptyConfig={empty} size={size} headingLevel={headingLevel} />;
  }
  const staleError =
    !failedWithoutData && errored.length > 0 ? (
      <div className={styles.refetchError} role="alert">
        <span className={styles.refetchErrorText}>{t('page.refetchError')}</span>
        <Button size="sm" variant="outline" onClick={retry}>
          {t('pageMessages.retry')}
        </Button>
      </div>
    ) : null;

  const refreshing = queries.some((query) => query.isFetching);
  return (
    <div className={styles.content}>
      {refreshing && (
        <div className={styles.refreshing} role="progressbar" aria-label={t('page.refreshing')} />
      )}
      {staleError}
      {content}
    </div>
  );
}

// Status fields only: `data` and `refetch` may be new objects every render (derived data, wrapped
// results), and comparing them would make a `usePage()` consumer that renders Sections loop.
// `dataUpdatedAt` changes whenever fresh data arrives.
const STATUS_FIELDS = ['isPending', 'isError', 'error', 'isFetching', 'dataUpdatedAt'] as const;

/** True when both lists hold queries in the same state (query results are new objects per render). */
export function sameQueries(a: QueryLike[] | undefined, b: QueryLike[]): boolean {
  return (
    a !== undefined &&
    a.length === b.length &&
    a.every((query, i) => STATUS_FIELDS.every((field) => Object.is(query[field], b[i][field])))
  );
}

/**
 * Keeps `queries` registered under `ownerId` in the page registry while mounted. Registration
 * happens once per owner; later renders upsert, which is a no-op while the state is unchanged, so
 * registering never re-renders the page in a loop.
 */
export function useRegisterQueries(
  register: PageContextValue['registerQueries'] | undefined,
  ownerId: string,
  queries: QueryLike[] | undefined
): void {
  const hasQueries = queries !== undefined;
  useEffect(() => {
    if (!register || !queries) {
      return undefined;
    }
    return register(ownerId, queries);
    // Registered once per owner; the effect below keeps the list current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, ownerId, hasQueries]);

  useEffect(() => {
    if (register && queries) {
      register(ownerId, queries);
    }
  });
}
