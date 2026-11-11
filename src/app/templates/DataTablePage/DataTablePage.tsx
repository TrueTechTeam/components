import React, { useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import {
  ButtonToggleGroup,
  ButtonToggleGroupItem,
} from '../../../lib/components/buttons/ButtonToggleGroup';
import { IconButton } from '../../../lib/components/buttons/IconButton';
import { Card } from '../../../lib/components/display/Card';
import { PageMessages } from '../../../lib/components/display/PageMessages';
import {
  ActiveFilters,
  FilterField,
  FilterPopover,
  FilterProvider,
  type FilterDefinition,
  type FilterValue,
} from '../../../lib/components/filters';
import { Input } from '../../../lib/components/inputs/Input';
import { Select } from '../../../lib/components/inputs/Select';
import { Pagination } from '../../../lib/components/navigation/Pagination';
import { Menu, MenuItem, MenuList } from '../../../lib/components/overlays/Menu';
import { DataTable } from '../../../lib/components/patterns/DataTable';
import { getDefaultFilterValue } from '../../../lib/components/patterns/DataTable/DataTable.utils';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { useBreakpoint } from '../../../lib/hooks/useBreakpoint';
import { useAuth } from '../../AppProvider/hooks';
import { useMutationFeedback } from '../../data/useMutationFeedback';
import { LastUpdated } from '../../data/LastUpdated';
import { Loadable } from '../../page/Loadable';
import { Page } from '../../page/Page';
import { LoadingContext, type LoadingContextValue } from '../../page/LoadingContext';
import { useAppNavigate } from '../../router/useAppNavigate';
import { fieldOptionsOf, fieldValueOf, type FieldDef } from '../blocks/BlockSection';
import { FieldValue, fieldAlign } from '../fields';
import { PageHeader, type Crumb, type PageAction } from '../PageHeader';
import { DetailView } from './DetailView';
import { useTableState, type TableState, type TableView } from './useTableState';
import styles from './DataTablePage.module.scss';

export interface RowAction<T> {
  id: string;
  label: string;
  danger?: boolean;
  /** Asked with `window.confirm` before running; declining cancels. */
  confirm?: string;
  run: (row: T) => Promise<unknown>;
  /** Success toast. @default the `dataTablePage.actionDone` label */
  success?: string;
  /** Error toast. @default the `mutation.error` label */
  error?: string;
  /** Hidden (not disabled) when `auth.can(action, subject)` is false. */
  permission?: { action: string; subject?: string };
}

/** A table column: a `FieldDef` rendered with `FieldValue`, optionally sortable on the server. */
export type DataTableColumn<T> = FieldDef<T> & {
  /** Header click sorts by this key (`?sort=key:asc`). @default false */
  sortable?: boolean;
};

export interface DataTableQueryResult<T> {
  rows: T[];
  total: number;
}

export interface DataTablePageProps<T> {
  title: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  headerActions?: PageAction[];
  /** Header primary action and the empty-collection action. */
  create?: { label: string; onClick?: () => void; href?: string };
  /** Rendered with `FieldValue`, aligned by `fieldAlign`. */
  columns: Array<DataTableColumn<T>>;
  rowKey: (row: T) => string;
  /**
   * Query for the current state; called with `placeholderData: keepPreviousData`. The first
   * `queryKey` element must identify the collection (e.g. `['issues', state.page, ...]`): after a
   * row action every query whose key starts with it is invalidated, so all pages, sorts and
   * filters refetch. Don't share it with unrelated queries, and don't start with the state.
   */
  queryOptions: (state: TableState) => UseQueryOptions<DataTableQueryResult<T>>;
  filters?: FilterDefinition[];
  /** @default true */
  searchable?: boolean;
  /** Views offered by the toggle; the first is the default. @default ['table'] */
  views?: TableView[];
  /**
   * Card for the grid and list views. With `detail`, an "Open details" control is stretched over
   * the card so the whole card opens it; give interactive elements inside the card
   * `position: relative; z-index: 1` to keep them reachable by pointer.
   */
  renderCard?: (row: T) => ReactNode;
  rowActions?: Array<RowAction<T>>;
  detail?: {
    /** @default 'panel' */
    mode?: 'panel' | 'dialog' | 'page';
    title?: (id: string) => ReactNode;
    render: (id: string, ctx: { close: () => void }) => ReactNode;
    fullPageHref?: (id: string) => string;
  };
  /** @default [10, 25, 50] */
  pageSizes?: number[];
  defaultSort?: TableState['sort'];
  emptyTitle?: string;
  emptyDescription?: string;
  /** Stable page id (see `Page`). */
  id?: string;
}

const DEFAULT_PAGE_SIZES = [10, 25, 50];
const SEARCH_DEBOUNCE_MS = 300;
const MAX_SKELETON_ROWS = 10;

/** Values that mean "no filter": dropped from the URL. */
function isInactive(value: FilterValue | undefined, filter: FilterDefinition): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object' && !(value instanceof Date)) {
    return Object.values(value).every((v) => v === undefined || v === null);
  }
  return JSON.stringify(value) === JSON.stringify(getDefaultFilterValue(filter));
}

/** Shows the `Loadable`s inside as loading when `loading`, else follows the Page. */
function ContentLoading({ loading, children }: { loading: boolean; children: ReactNode }) {
  const inherited = useContext(LoadingContext);
  const value = useMemo<LoadingContextValue>(
    () => (loading ? { pending: true, busyAncestor: inherited.busyAncestor } : inherited),
    [loading, inherited]
  );
  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

function SearchBox({ value, onSearch }: { value: string; onSearch: (q: string) => void }) {
  const t = useLabels();
  const [text, setText] = useState(value);
  const latest = useRef(onSearch);
  latest.current = onSearch;

  // Follow outside changes (Clear all, back/forward).
  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (text === value) {
      return undefined;
    }
    const timer = setTimeout(() => latest.current(text), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce typing only
  }, [text]);

  return (
    <Input
      type="search"
      value={text}
      onChange={(event) => setText(event.target.value)}
      onEnterPress={() => onSearch(text)}
      startIcon="search"
      showClearButton
      onClear={() => {
        setText('');
        onSearch('');
      }}
      placeholder={t('dataTablePage.search')}
      aria-label={t('dataTablePage.search')}
      className={styles.search}
    />
  );
}

function Filters({
  filters,
  values,
  onChange,
}: {
  filters: FilterDefinition[];
  values: Record<string, FilterValue>;
  onChange: (values: Record<string, FilterValue>) => void;
}) {
  // FilterProvider needs a value for every filter (range filters crash without one).
  const controlled = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.id, values[f.id] ?? getDefaultFilterValue(f)])),
    [filters, values]
  );
  return (
    <FilterProvider
      filters={filters}
      values={controlled}
      onChange={(next) => {
        const active: Record<string, FilterValue> = {};
        for (const filter of filters) {
          if (!isInactive(next[filter.id], filter)) {
            active[filter.id] = next[filter.id];
          }
        }
        onChange(active);
      }}
      size="sm"
    >
      {/* Wide enough for number-range inputs, never wider than a phone screen. */}
      <FilterPopover
        width="min(380px, calc(100vw - 2 * var(--spacing-md)))"
        showActiveFilters={false}
      >
        <div className={styles.filterFields}>
          {filters.map((f) => (
            <FilterField key={f.id} filterId={f.id} showLabel />
          ))}
        </div>
      </FilterPopover>
      <ActiveFilters maxVisible={5} />
    </FilterProvider>
  );
}

function RowActionsMenu<T>({
  row,
  name,
  actions,
  pendingAction,
  onRun,
}: {
  row: T;
  /** Names the row in the trigger label. */
  name: string;
  actions: Array<RowAction<T>>;
  /** Id of this row's action that is running. */
  pendingAction?: string;
  onRun: (action: RowAction<T>, row: T) => void;
}) {
  const t = useLabels();
  const [open, setOpen] = useState(false);
  return (
    // Menu items render in a portal; React still bubbles their clicks to the row.
    <span className={styles.rowActions} onClick={(event) => event.stopPropagation()}>
      <Menu
        isOpen={open}
        onOpenChange={setOpen}
        position="bottom-right"
        trigger={
          <IconButton
            icon="more"
            variant="ghost"
            size="sm"
            aria-label={t('dataTablePage.rowActionsFor', { name })}
            aria-haspopup="menu"
          />
        }
      >
        <MenuList>
          {actions.map((action) => (
            <MenuItem
              key={action.id}
              itemKey={action.id}
              disabled={pendingAction === action.id}
              className={action.danger ? styles.danger : undefined}
              onClick={() => {
                setOpen(false);
                onRun(action, row);
              }}
            >
              {action.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </span>
  );
}

/**
 * Data table with details view: header (title, create action), toolbar (search, filters, view
 * toggle, last updated), the rows as a table, card grid or list, and pagination. Search,
 * filters, sort, page, page size, view and the selected record live in the URL (`useTableState`).
 *
 * Empty states: an empty collection shows "nothing yet" with the create action; no matches for
 * the current search or filters shows "No results" with Clear all. A `?page=` past the last page
 * is clamped. The detail opens from a row (click, or the first cell's button by keyboard) as an
 * inline side panel on laptop and up, a Dialog below that or with `mode: 'dialog'`, or navigates
 * to `fullPageHref` with `mode: 'page'`. It renders from the `?selected=` id, so deep links open
 * it even when the record is not on the current page.
 */
export function DataTablePage<T>({
  title,
  description,
  breadcrumbs,
  headerActions = [],
  create,
  columns,
  rowKey,
  queryOptions,
  filters = [],
  searchable = true,
  views = ['table'],
  renderCard,
  rowActions = [],
  detail,
  pageSizes = DEFAULT_PAGE_SIZES,
  defaultSort,
  emptyTitle,
  emptyDescription,
  id,
}: DataTablePageProps<T>) {
  const t = useLabels();
  const { can } = useAuth();
  const navigate = useAppNavigate();
  const { up } = useBreakpoint();
  const queryClient = useQueryClient();
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useTableState({
    defaultPageSize: pageSizes[0],
    defaultSort,
    views,
    pageSizes,
  });
  const options = queryOptions(state);
  const query = useQuery({ ...options, placeholderData: keepPreviousData });

  // Review focus 1: a page past the end (stale link, or the result shrank) jumps to the last page.
  const total = query.data?.total;
  // Shown by the pagination, also while the previous result stands in for the next page.
  const pageCount =
    total === undefined ? undefined : Math.max(1, Math.ceil(total / state.pageSize));
  // Clamping only trusts a result fetched for the current state.
  const lastPage = query.isPlaceholderData ? undefined : pageCount;
  const outOfRange = lastPage !== undefined && state.page > lastPage;
  useEffect(() => {
    if (outOfRange) {
      setState({ page: lastPage });
    }
  }, [outOfRange, lastPage, setState]);
  // The content shows its skeleton instead of a wrong empty state while clamping, or while an
  // empty result from the previous search/filters stands in for the next one (it would read as
  // "nothing yet"). Only the content: the toolbar stays enabled so typing keeps focus.
  const staleEmpty =
    query.isPlaceholderData && (total === 0 || (query.data?.rows.length ?? 0) === 0);
  const contentLoading = outOfRange || staleEmpty;
  // The page and size the shown rows were fetched for: the range text stays right while the
  // previous page stands in for the next one.
  const settled = useRef({ page: state.page, pageSize: state.pageSize });
  useEffect(() => {
    if (!query.isPlaceholderData && query.data) {
      settled.current = { page: state.page, pageSize: state.pageSize };
    }
  });
  const shownPage = query.isPlaceholderData ? settled.current : state;

  // ---- Detail ----
  const mode = detail?.mode ?? 'panel';
  const laptop = up('laptop');
  const close = () => setState({ selected: null });
  // Deep-linked details don't take focus on load; details the user opens do.
  const userOpened = useRef(false);
  const openDetail = (key: string) => {
    if (!detail) {
      return;
    }
    userOpened.current = true;
    if (mode === 'page' && detail.fullPageHref) {
      navigate(detail.fullPageHref(key));
    } else {
      setState({ selected: key });
    }
  };
  // Focus returns to the row's trigger when the detail closes (close button, Escape, Back).
  const previous = useRef<string | null>(null);
  useEffect(() => {
    const was = previous.current;
    previous.current = state.selected;
    if (was !== null && state.selected === null) {
      const triggers = rootRef.current?.querySelectorAll<HTMLElement>('[data-detail-id]') ?? [];
      const trigger = Array.from(triggers).find((el) => el.dataset.detailId === was);
      // The record may not be on this page (deep link): fall back to the content region.
      (trigger ?? mainRef.current)?.focus();
    }
  }, [state.selected]);

  // ---- Row actions ----
  const visibleActions = rowActions.filter(
    (a) => !a.permission || can(a.permission.action, a.permission.subject)
  );
  // Prefix: every page, sort and filter of this collection is stale after an action.
  const queryKeyPrefix = options.queryKey.slice(0, 1);
  const mutation = useMutation({
    mutationFn: ({ action, row }: { action: RowAction<T>; row: T }) => action.run(row),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeyPrefix }),
  });
  const pendingFor = (row: T) =>
    mutation.isPending && mutation.variables && rowKey(mutation.variables.row) === rowKey(row)
      ? mutation.variables.action.id
      : undefined;
  const feedback = useMutationFeedback(mutation, {
    success: (_data, { action }) => action.success ?? t('dataTablePage.actionDone'),
    error: (_err, { action }) => action.error ?? t('mutation.error'),
  });
  const runAction = (action: RowAction<T>, row: T) => {
    // eslint-disable-next-line no-alert -- RowAction.confirm is a native confirm by contract
    if (action.confirm && !window.confirm(action.confirm)) {
      return;
    }
    feedback.mutate({ action, row });
  };

  // ---- Header ----
  const actions: PageAction[] = create
    ? [
        ...headerActions,
        {
          id: 'create',
          label: create.label,
          onClick: create.onClick,
          href: create.href,
          variant: 'primary',
        },
      ]
    : headerActions;

  const filtered = state.search !== '' || Object.keys(state.filters).length > 0;
  const clearAll = () => setState({ search: '', filters: {}, page: 1 });

  // ---- Content ----
  const firstValue = (row: T, field: DataTableColumn<T>) => (
    <FieldValue kind={field.kind} value={fieldValueOf(row, field)} {...fieldOptionsOf(field)} />
  );
  /** Plain-text name of a row for labels: the first column's text, else its key. */
  const rowName = (row: T) => {
    const value = columns[0] ? fieldValueOf(row, columns[0]) : undefined;
    return typeof value === 'string' || typeof value === 'number' ? String(value) : rowKey(row);
  };
  const rowActionsMenu = (row: T) => (
    <RowActionsMenu
      row={row}
      name={rowName(row)}
      actions={visibleActions}
      pendingAction={pendingFor(row)}
      onRun={runAction}
    />
  );

  const tableColumns = [
    ...columns.map((field, index) => ({
      key: field.key,
      header: field.label,
      align: fieldAlign(field.kind) === 'end' ? ('right' as const) : ('left' as const),
      sortable: field.sortable ?? false,
      // The server already sorted the rows: keep their order.
      sortFn: () => 0,
      render: (_value: unknown, record: Record<string, unknown>) => {
        const row = record as T;
        const value = firstValue(row, field);
        if (index !== 0 || !detail) {
          return value;
        }
        const key = rowKey(row);
        return (
          <button
            type="button"
            className={styles.rowLink}
            data-detail-id={key}
            aria-current={state.selected === key || undefined}
            onClick={() => openDetail(key)}
          >
            {value}
          </button>
        );
      },
    })),
    ...(visibleActions.length > 0
      ? [
          {
            key: '__actions',
            header: <span className={styles.visuallyHidden}>{t('dataTablePage.rowActions')}</span>,
            align: 'right' as const,
            width: '3.5rem',
            render: (_value: unknown, record: Record<string, unknown>) =>
              rowActionsMenu(record as T),
          },
        ]
      : []),
  ];

  const renderCards = (rows: T[]) => (
    <ul className={styles.cards} data-view={state.view}>
      {rows.map((row) => {
        const key = rowKey(row);
        const selected = state.selected === key || undefined;
        const title = firstValue(row, columns[0]);
        const card = renderCard ? (
          renderCard(row)
        ) : (
          <Card padding="md" className={styles.defaultCard}>
            {detail ? (
              // The title is the control; its stretched ::after makes the whole card clickable.
              <button
                type="button"
                className={`${styles.cardTitle} ${styles.cardOpen}`}
                data-detail-id={key}
                aria-current={selected}
                onClick={() => openDetail(key)}
              >
                {title}
              </button>
            ) : (
              <span className={styles.cardTitle}>{title}</span>
            )}
            <dl className={styles.cardFields}>
              {columns.slice(1).map((field) => (
                <div key={field.key} className={styles.cardField}>
                  <dt>{field.label}</dt>
                  <dd>{firstValue(row, field)}</dd>
                </div>
              ))}
            </dl>
          </Card>
        );
        return (
          <li key={key} className={styles.cardItem} data-selected={selected}>
            {card}
            {detail && renderCard && (
              // A dedicated control stretched over the card; the card stays normal content.
              <button
                type="button"
                className={styles.cardOverlay}
                data-detail-id={key}
                aria-current={selected}
                onClick={() => openDetail(key)}
              >
                <span className={styles.visuallyHidden}>
                  {t('dataTablePage.openDetails', { name: rowName(row) })}
                </span>
              </button>
            )}
            {visibleActions.length > 0 && rowActionsMenu(row)}
          </li>
        );
      })}
    </ul>
  );

  const renderContent = (data: DataTableQueryResult<T>) => {
    if (data.total === 0) {
      return filtered ? (
        <PageMessages
          empty
          size="md"
          headingLevel={2}
          data-testid="data-table-page-no-results"
          emptyConfig={{
            title: t('dataTablePage.noResultsTitle'),
            description: t('dataTablePage.noResultsDescription'),
            icon: 'search',
            primaryAction: { label: t('dataTablePage.clearAll'), onClick: clearAll },
          }}
        />
      ) : (
        <PageMessages
          empty
          size="md"
          headingLevel={2}
          emptyConfig={{
            title: emptyTitle ?? t('dataTablePage.emptyTitle'),
            description: emptyDescription ?? t('dataTablePage.emptyDescription'),
            primaryAction: create && {
              label: create.label,
              onClick: () => (create.href ? navigate(create.href) : create.onClick?.()),
            },
          }}
        />
      );
    }

    const start = (shownPage.page - 1) * shownPage.pageSize + 1;
    const end = Math.min(data.total, start + data.rows.length - 1);
    return (
      <>
        {state.view === 'table' ? (
          <DataTable<Record<string, unknown>>
            data={data.rows as Array<Record<string, unknown>>}
            columns={tableColumns}
            rowKey={(record) => rowKey(record as T)}
            mode="server"
            filterLayout="none"
            showActiveFilters={false}
            sort={{
              column: state.sort?.key ?? null,
              direction: state.sort?.direction ?? null,
            }}
            onSortChange={(sort) =>
              setState({
                sort:
                  sort.column && sort.direction
                    ? { key: sort.column, direction: sort.direction }
                    : undefined,
              })
            }
            selectionMode={detail ? 'single' : 'none'}
            showSelectionControls={false}
            selectedKeys={state.selected ? [state.selected] : []}
            onRowClick={detail ? (record) => openDetail(rowKey(record as T)) : undefined}
            aria-label={title}
          />
        ) : (
          renderCards(data.rows)
        )}
        <div className={styles.footer}>
          <span className={styles.range} role="status">
            {t('dataTablePage.range', { start, end, total: data.total })}
          </span>
          <div className={styles.paging}>
            {pageSizes.length > 1 && (
              <Select
                options={pageSizes.map((n) => ({ value: String(n), label: String(n) }))}
                value={String(state.pageSize)}
                onChange={(value) => setState({ pageSize: Number(value) })}
                aria-label={t('dataTablePage.pageSize')}
                className={styles.pageSize}
              />
            )}
            {pageCount !== undefined && pageCount > 1 && (
              <Pagination
                totalPages={pageCount}
                currentPage={Math.min(state.page, pageCount)}
                onPageChange={(page) => setState({ page })}
                size="sm"
              />
            )}
          </div>
        </div>
      </>
    );
  };

  const detailOpen = detail && state.selected !== null;
  const inlinePanel = mode === 'panel' && laptop;

  return (
    <Page title={title} id={id} queries={[query]}>
      <div ref={rootRef} className={styles.root} data-component="data-table-page">
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
        <div className={styles.toolbar}>
          {searchable && (
            <SearchBox value={state.search} onSearch={(search) => setState({ search })} />
          )}
          {filters.length > 0 && (
            <Filters
              filters={filters}
              values={state.filters}
              onChange={(next) => setState({ filters: next })}
            />
          )}
          <div className={styles.toolbarEnd}>
            <LastUpdated query={query} />
            {views.length > 1 && (
              <ButtonToggleGroup
                value={state.view}
                onChange={(view) => setState({ view: view as TableView })}
                size="sm"
                aria-label={t('dataTablePage.views')}
              >
                {views.map((view) => (
                  <ButtonToggleGroupItem
                    key={view}
                    value={view}
                    icon={view === 'table' ? undefined : view}
                  >
                    {t(
                      view === 'grid'
                        ? 'dataTablePage.viewGrid'
                        : view === 'list'
                          ? 'dataTablePage.viewList'
                          : 'dataTablePage.viewTable'
                    )}
                  </ButtonToggleGroupItem>
                ))}
              </ButtonToggleGroup>
            )}
          </div>
        </div>
        <div className={styles.body} data-detail={detailOpen && inlinePanel ? 'panel' : undefined}>
          <div ref={mainRef} className={styles.main} tabIndex={-1}>
            <ContentLoading loading={contentLoading}>
              <Loadable
                shape="table"
                rows={Math.min(state.pageSize, MAX_SKELETON_ROWS)}
                columns={columns.length}
              >
                {() => (query.data ? renderContent(query.data) : null)}
              </Loadable>
            </ContentLoading>
          </div>
          {detail && state.selected !== null && (
            <DetailView
              id={state.selected}
              presentation={inlinePanel ? 'panel' : 'dialog'}
              dialogSize={laptop ? 'lg' : 'full'}
              title={detail.title?.(state.selected)}
              fullPageHref={detail.fullPageHref?.(state.selected)}
              focusOnOpen={userOpened.current}
              onClose={close}
            >
              {detail.render(state.selected, { close })}
            </DetailView>
          )}
        </div>
      </div>
    </Page>
  );
}
