import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ErrorInfo,
  type Reducer,
} from 'react';
import { PageMessages } from '../../lib/components/display/PageMessages';
import { DebugPanel } from '../debug';
import { useAppConfig, useLogger, useTrack } from '../AppProvider/hooks';
import { PageIdContext } from '../params/PageIdContext';
import { ErrorBoundary } from './ErrorBoundary';
import {
  PageContext,
  PageStoreContext,
  type PageContextValue,
  type PageStoreValue,
  type QueryLike,
} from './PageContext';
import {
  PageState,
  PendingFallback,
  sameQueries,
  useRegisterQueries,
  type StateProps,
} from './PageState';
import { usePageMeta } from './usePageMeta';
import styles from './Page.module.scss';

export interface PageProps extends StateProps {
  /** Page title: sets `document.title` (through `titleTemplate`) and names the page in analytics. */
  title: string;
  /** Sets `<meta name="description">` while mounted. */
  description?: string;
  /**
   * Stable page id: namespaces preferences, keys the `page_view` event and the error boundary
   * reset, and names the page in the debug panel. Pass it when the title is dynamic or
   * translated, so the id doesn't change with the title or the language.
   * @default slug of `title`
   */
  id?: string;
  /** Name sent with the `page_view` event. @default `title` */
  analyticsName?: string;
  /** Reducer for the page store read with `usePageStore()`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any reducer shape is accepted
  reducer?: Reducer<any, any>;
  /** Initial page store state. */
  initialState?: unknown;
}

/** `'Open Orders & Returns'` → `'open-orders-returns'`; `'page'` when nothing usable remains. */
export function slugify(text: string): string {
  const slug = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'page';
}

const keepState = (state: unknown) => state;

/**
 * A routed page: built-in forbidden/loading/error/empty/refreshing states driven by `queries`,
 * an error boundary around its content, `document.title`/description, one `page_view` event per
 * mount, a page store (`reducer`) and the query registry its Sections report to. It renders no
 * heading of its own; render the page heading (an `h1`) in `children` or use a template.
 *
 * Loading: children render while `queries` are pending (structure first), inside a disabled,
 * `aria-busy` region. Read query data through `Loadable` function children or guard it with
 * `?.`; a child that throws before its data exists is retried once loading finishes. Only native
 * controls (`button`, `input`, …) are disabled while pending. For paginated or filtered queries
 * pass `placeholderData: keepPreviousData` so a key change keeps the current content instead of
 * going back to skeletons (and dropping focus).
 *
 * The id defaults to a slug of `title`; pass `id` when the title is dynamic or translated.
 */
export function Page({
  title,
  description,
  id,
  analyticsName,
  reducer,
  initialState,
  queries,
  isEmpty,
  skeleton,
  empty,
  permission,
  showErrorDetails,
  children,
}: PageProps) {
  const pageId = id ?? slugify(title);
  const logger = useLogger(`page:${pageId}`);
  const track = useTrack();
  const { debug } = useAppConfig();
  usePageMeta({ title, description });

  const trackedId = useRef<string | null>(null);
  const pageName = analyticsName ?? title;
  useEffect(() => {
    // Keyed on the page id so StrictMode's effect replay doesn't send a second page_view.
    if (trackedId.current === pageId) {
      return;
    }
    trackedId.current = pageId;
    track('page_view', { page: pageName });
  }, [pageId, pageName, track]);

  const [state, dispatch] = useReducer(reducer ?? keepState, initialState);
  const store = useMemo<PageStoreValue>(
    () => (reducer ? [state, dispatch] : null),
    [reducer, state]
  );

  const [registry, setRegistry] = useState<Record<string, QueryLike[]>>({});
  const registerQueries = useCallback((ownerId: string, list: QueryLike[]) => {
    setRegistry((prev) => (sameQueries(prev[ownerId], list) ? prev : { ...prev, [ownerId]: list }));
    return () => {
      setRegistry((prev) => {
        if (!(ownerId in prev)) {
          return prev;
        }
        const next = { ...prev };
        delete next[ownerId];
        return next;
      });
    };
  }, []);
  useRegisterQueries(registerQueries, pageId, queries);
  const pending = queries?.some((query) => query.isPending) ?? false;

  const page = useMemo<PageContextValue>(
    () => ({ id: pageId, title, description, registerQueries, queries: registry }),
    [pageId, title, description, registerQueries, registry]
  );

  const onError = useCallback(
    (error: Error, info: ErrorInfo) => {
      logger.error('Page render error', error, info.componentStack);
    },
    [logger]
  );

  return (
    <PageIdContext.Provider value={pageId}>
      <PageContext.Provider value={page}>
        <PageStoreContext.Provider value={store}>
          <div className={styles.page} data-page-id={pageId}>
            <ErrorBoundary
              onError={onError}
              // `pending`: children render while loading and may throw before their data exists;
              // the boundary retries them once loading finishes. A crash after that still shows.
              resetKeys={[pageId, pending]}
              // Generic text only (R9): the raw error goes to logger.error, never to the screen.
              fallback={(_error, reset) =>
                pending ? (
                  <PendingFallback />
                ) : (
                  <PageMessages error onRetry={reset} headingLevel={2} />
                )
              }
            >
              <PageState
                queries={queries}
                isEmpty={isEmpty}
                skeleton={skeleton}
                empty={empty}
                permission={permission}
                showErrorDetails={showErrorDetails}
                size="md"
                headingLevel={2}
                ownsLoading
              >
                {children}
              </PageState>
            </ErrorBoundary>
            {debug && <DebugPanel />}
          </div>
        </PageStoreContext.Provider>
      </PageContext.Provider>
    </PageIdContext.Provider>
  );
}
