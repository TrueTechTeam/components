import React, { useContext, type ReactNode } from 'react';
import { PageMessages } from '../../../lib/components/display/PageMessages';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { LoadingContext } from '../../page/LoadingContext';
import { Page } from '../../page/Page';
import type { QueryLike } from '../../page/PageContext';
import { KeyFacts, type FieldDef } from '../blocks';
import type { StatusTone } from '../fields';
import { PageHeader, getPageTabId, usePageTab, type Crumb, type PageAction } from '../PageHeader';
import styles from './DetailsPage.module.scss';

export interface DetailsTab {
  value: string;
  label: string;
  /** `main-side` puts `side` in a second column from the laptop breakpoint up. @default 'main-side' */
  layout?: 'main-side' | 'single';
  main: ReactNode;
  side?: ReactNode;
}

export interface DetailsPageProps<T> {
  /** The record; page-level loading, error and empty (404) states come from it. */
  query: QueryLike & { data?: T };
  /** Page heading and `document.title`; a skeleton stands in for it while pending. */
  title: (record: T) => string;
  breadcrumbs?: Crumb[];
  status?: (record: T) => { label: string; tone: StatusTone } | undefined;
  actions?: PageAction[];
  /** Key facts strip under the header (three to six read best). */
  facts?: Array<FieldDef<T>>;
  /** One tab renders no tab bar. The selected tab is bound to `?tab=`. */
  tabs: DetailsTab[];
  /** When it returns true for a failed query's error, the not-found state replaces the error. */
  notFound?: (error: unknown) => boolean;
  /** Stable page id (see `Page`). */
  id?: string;
}

/** The heading text. A `span`, not a Loadable, so nothing block-level lands inside the `h1`. */
function TitleText({ text }: { text: string | undefined }) {
  const t = useLabels();
  const { pending } = useContext(LoadingContext);
  if (pending) {
    return (
      <>
        <span className={styles.titleSkeleton} data-loadable="heading" aria-hidden="true" />
        <span className={styles.visuallyHidden}>{t('common.loading')}</span>
      </>
    );
  }
  return text ?? t('details.title');
}

function Body<T>({
  record,
  tabs,
  facts,
  tabParam = 'tab',
  title,
  status,
  breadcrumbs,
  actions,
}: {
  record: T | undefined;
  tabs: DetailsTab[];
  facts?: Array<FieldDef<T>>;
  tabParam?: string;
  title: ReactNode;
  status?: { label: string; tone: StatusTone };
  breadcrumbs?: Crumb[];
  actions?: PageAction[];
}) {
  const [active] = usePageTab(tabs, tabParam);
  const tab = tabs.find((candidate) => candidate.value === active) ?? tabs[0];
  const multiple = tabs.length > 1;
  const layout = tab?.layout ?? 'main-side';
  const side = layout === 'main-side' ? tab?.side : undefined;
  return (
    <div className={styles.root} data-component="details-page">
      <PageHeader
        title={title}
        status={status}
        breadcrumbs={breadcrumbs}
        actions={actions}
        tabs={multiple ? tabs.map(({ value, label }) => ({ value, label })) : undefined}
        tabParam={tabParam}
      />
      {facts && facts.length > 0 && <KeyFacts<T> fields={facts} data={record} />}
      {tab && (
        <div
          className={styles.body}
          data-layout={layout}
          role={multiple ? 'tabpanel' : undefined}
          aria-labelledby={multiple ? getPageTabId(tab.value, tabParam) : undefined}
        >
          <div className={styles.main}>{tab.main}</div>
          {side && <aside className={styles.side}>{side}</aside>}
        </div>
      )}
    </div>
  );
}

function Content<T>({ query, title, status, ...rest }: DetailsPageProps<T>) {
  const record = query.data;
  return (
    <Body<T>
      record={record}
      tabs={rest.tabs}
      facts={rest.facts}
      breadcrumbs={rest.breadcrumbs}
      actions={rest.actions}
      title={<TitleText text={record === undefined ? undefined : title(record)} />}
      status={record === undefined ? undefined : status?.(record)}
    />
  );
}

/**
 * Full-record page: header (breadcrumbs, title with status, actions), a key facts strip, URL-bound
 * tabs and a body of `main` plus an optional `side` column that stacks under it below the laptop
 * breakpoint. The structure renders while the record loads; only the title and facts skeletonize.
 * A failed query shows the not-found state when `notFound(error)` is true, else the error state.
 */
export function DetailsPage<T>(props: DetailsPageProps<T>) {
  const t = useLabels();
  const { query, title, notFound, id } = props;
  const record = query.data;
  const pageTitle = record === undefined ? t('details.title') : title(record);
  if (query.isError && record === undefined && notFound?.(query.error)) {
    return (
      <Page title={pageTitle} id={id}>
        <PageMessages notFound headingLevel={2} />
      </Page>
    );
  }
  return (
    <Page title={pageTitle} id={id} queries={[query]}>
      <Content<T> {...props} />
    </Page>
  );
}
