// Realistic page compositions shared by the template stories (and the AppShell app). Story-only.
import React, { useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../../lib/components/display/Card';
import type { FilterDefinition } from '../../../lib/components/filters';
import {
  ActivityTimeline,
  ChartWidget,
  DashboardPage,
  DashboardWidget,
  DataTablePage,
  DetailsPage,
  FieldValue,
  KpiWidget,
  Loadable,
  MediaGallery,
  Notes,
  PropertyList,
  RelatedRecords,
  Section,
  useFormatters,
  useTimeRange,
  type DataTableColumn,
  type DetailsTab,
  type FieldDef,
  type TableView,
} from '../../index';
import {
  ASSET_STATUS_TONES,
  ASSET_TYPE_LABELS,
  ASSETS,
  CAMPAIGN_STATUS_TONES,
  MARKETING_ACTIVITY,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
  PROJECTS,
  RANGE_DAYS,
  RELEASE,
  RELEASE_ACTIVITY,
  RELEASE_FILES,
  RELEASE_NOTES,
  RELEASE_STATUS_LABELS,
  RELEASE_STATUS_TONES,
  ISSUE_PRIORITY_TONES,
  TOP_CAMPAIGNS,
  channelSpend,
  conversionSeries,
  issuesFor,
  kpisFor,
  type Asset,
  type CampaignRow,
  type ChannelSpend,
  type Issue,
  type Point,
  type Project,
  type Release,
} from './fixtures';
import { queryRows, respond, useFetchControl, type FetchArgs } from './templateKit';
import styles from './templates.module.scss';

// =============================================================================================
// Projects (software) - DataTablePage with filters, search, row actions and a detail panel
// =============================================================================================

const PROJECT_COLUMNS: Array<DataTableColumn<Project>> = [
  { key: 'name', label: 'Project', kind: 'text', sortable: true },
  {
    key: 'status',
    label: 'Status',
    kind: 'status',
    statusTones: PROJECT_STATUS_TONES,
    statusLabels: PROJECT_STATUS_LABELS,
  },
  { key: 'lead', label: 'Lead', kind: 'text', sortable: true },
  { key: 'openIssues', label: 'Issues', kind: 'number', sortable: true },
  { key: 'targetDate', label: 'Target date', kind: 'date', sortable: true },
  { key: 'updatedAt', label: 'Updated', kind: 'relative', sortable: true },
];

const PROJECT_FILTERS: FilterDefinition[] = [
  {
    id: 'status',
    type: 'multi-select',
    label: 'Status',
    options: Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    id: 'team',
    type: 'select',
    label: 'Team',
    placeholder: 'Any team',
    options: ['Platform', 'Web', 'Mobile', 'Data'].map((team) => ({ value: team, label: team })),
  },
];

const PROJECT_FIELDS: Array<FieldDef<Project>> = [
  { key: 'description', label: 'About', kind: 'longText', span: 2 },
  {
    key: 'status',
    label: 'Status',
    kind: 'status',
    statusTones: PROJECT_STATUS_TONES,
    statusLabels: PROJECT_STATUS_LABELS,
  },
  { key: 'team', label: 'Team', kind: 'text' },
  { key: 'lead', label: 'Lead', kind: 'text' },
  { key: 'nextRelease', label: 'Next release', kind: 'text' },
  { key: 'targetDate', label: 'Target date', kind: 'date' },
  { key: 'progress', label: 'Progress', kind: 'percent' },
  { key: 'repo', label: 'Repository', kind: 'url' },
  { key: 'key', label: 'Key', kind: 'id' },
  { key: 'labels', label: 'Labels', kind: 'tags', span: 2 },
];

const ISSUE_COLUMNS: Array<FieldDef<Issue>> = [
  { key: 'title', label: 'Issue', kind: 'text' },
  { key: 'priority', label: 'Priority', kind: 'status', statusTones: ISSUE_PRIORITY_TONES },
  { key: 'assignee', label: 'Assignee', kind: 'text' },
];

function ProjectDetail({ id, control }: { id: string; control: { current: FetchArgs } }) {
  const project = useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: () =>
      respond({ current: { ...control.current, fail: false } }, () => {
        const found = PROJECTS.find((p) => p.id === id);
        if (!found) {
          throw new Error('Not found');
        }
        return found;
      }),
  });
  const issues = useQuery({
    queryKey: ['projects', 'issues', id],
    queryFn: () =>
      respond({ current: { ...control.current, fail: false } }, () => {
        const found = PROJECTS.find((p) => p.id === id);
        return found ? issuesFor(found) : [];
      }),
  });
  return (
    <>
      <PropertyList<Project> fields={PROJECT_FIELDS} query={project} columns={2} />
      <RelatedRecords<Issue>
        title="Open issues"
        headingLevel={3}
        query={issues}
        columns={ISSUE_COLUMNS}
        total={project.data?.openIssues}
        empty={{ title: 'No open issues', description: 'Everything in this project is closed.' }}
      />
    </>
  );
}

export interface ProjectsPageProps {
  fetch: FetchArgs;
  detailMode?: 'panel' | 'dialog';
}

export function ProjectsPage({ fetch, detailMode = 'panel' }: ProjectsPageProps) {
  const control = useFetchControl(fetch);
  // Row actions change this copy; Archive removes the row.
  const store = useRef<Project[]>(PROJECTS);
  return (
    <DataTablePage<Project>
      id="projects"
      title="Projects"
      description="Every active project with its status, lead and open issues. Select a project to see its details."
      breadcrumbs={[
        { label: 'Acme', href: '/' },
        { label: 'Engineering', href: '/' },
        { label: 'Projects' },
      ]}
      create={{ label: 'New project', onClick: () => undefined }}
      headerActions={[{ id: 'export', label: 'Export CSV', onClick: () => undefined }]}
      columns={PROJECT_COLUMNS}
      rowKey={(p) => p.id}
      defaultSort={{ key: 'updatedAt', direction: 'desc' }}
      filters={PROJECT_FILTERS}
      queryOptions={(state) => ({
        queryKey: ['projects', 'list', state],
        queryFn: () =>
          respond(control, () =>
            control.current.empty
              ? { rows: [], total: 0 }
              : queryRows(store.current, state, ['name', 'key', 'lead'])
          ),
      })}
      rowActions={[
        {
          id: 'duplicate',
          label: 'Duplicate',
          run: async (p) => {
            await new Promise((r) => setTimeout(r, 400));
            store.current = [
              {
                ...p,
                id: `${p.id}-copy`,
                name: `${p.name} (copy)`,
                updatedAt: new Date().toISOString(),
              },
              ...store.current,
            ];
          },
          success: 'Project duplicated',
        },
        {
          id: 'archive',
          label: 'Archive',
          danger: true,
          confirm: 'Archive this project? Its issues become read-only.',
          run: async (p) => {
            await new Promise((r) => setTimeout(r, 400));
            store.current = store.current.filter((row) => row.id !== p.id);
          },
          success: 'Project archived',
        },
      ]}
      detail={{
        mode: detailMode,
        title: (id) => store.current.find((p) => p.id === id)?.name ?? 'Project',
        render: (id) => <ProjectDetail id={id} control={control} />,
      }}
      emptyTitle="No projects yet"
      emptyDescription="Projects group the issues and releases of one piece of work. Create the first one to start planning."
    />
  );
}

// =============================================================================================
// Assets (graphic design) - DataTablePage in grid view with thumbnails
// =============================================================================================

const ASSET_COLUMNS: Array<DataTableColumn<Asset>> = [
  { key: 'name', label: 'Asset', kind: 'text', sortable: true },
  { key: 'thumbnail', label: 'Preview', kind: 'image', imageSize: 40 },
  { key: 'type', label: 'Type', kind: 'text', get: (a) => ASSET_TYPE_LABELS[a.type] },
  { key: 'client', label: 'Client', kind: 'text', sortable: true },
  { key: 'status', label: 'Status', kind: 'status', statusTones: ASSET_STATUS_TONES },
  { key: 'size', label: 'Size', kind: 'fileSize', sortable: true },
  { key: 'updatedAt', label: 'Updated', kind: 'relative', sortable: true },
];

const ASSET_FIELDS: Array<FieldDef<Asset>> = [
  { key: 'status', label: 'Status', kind: 'status', statusTones: ASSET_STATUS_TONES },
  { key: 'type', label: 'Type', kind: 'text', get: (a) => ASSET_TYPE_LABELS[a.type] },
  { key: 'format', label: 'Format', kind: 'text' },
  { key: 'width', label: 'Dimensions', kind: 'text', get: (a) => `${a.width} × ${a.height} px` },
  { key: 'size', label: 'File size', kind: 'fileSize' },
  { key: 'owner', label: 'Owner', kind: 'text' },
  { key: 'client', label: 'Client', kind: 'text' },
  { key: 'updatedAt', label: 'Updated', kind: 'datetime' },
  { key: 'tags', label: 'Tags', kind: 'tags', span: 2 },
];

const ASSET_FILTERS: FilterDefinition[] = [
  {
    id: 'type',
    type: 'multi-select',
    label: 'Type',
    options: Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Any status',
    options: [
      { value: 'approved', label: 'Approved' },
      { value: 'in_review', label: 'In review' },
      { value: 'draft', label: 'Draft' },
      { value: 'archived', label: 'Archived' },
    ],
  },
];

function AssetCard({ asset }: { asset: Asset }) {
  return (
    <Card padding="sm" className={styles.assetCard}>
      <div className={styles.assetHead}>
        <span className={styles.assetName}>{asset.name}</span>
        <span className={styles.assetClient}>{asset.client}</span>
      </div>
      <img className={styles.assetThumb} src={asset.thumbnail} alt="" loading="lazy" />
      <div className={styles.assetMeta}>
        <span>
          {ASSET_TYPE_LABELS[asset.type]} · {asset.format} ·{' '}
          <FieldValue kind="fileSize" value={asset.size} />
        </span>
        <FieldValue kind="status" value={asset.status} statusTones={ASSET_STATUS_TONES} />
      </div>
    </Card>
  );
}

function AssetDetail({ id }: { id: string }) {
  const asset = ASSETS.find((a) => a.id === id);
  if (!asset) {
    return <p>This asset no longer exists.</p>;
  }
  return (
    <>
      <img
        className={styles.assetThumb}
        src={asset.thumbnail}
        alt={`${asset.name}, ${ASSET_TYPE_LABELS[asset.type].toLowerCase()} preview`}
      />
      <PropertyList<Asset> fields={ASSET_FIELDS} data={asset} columns={2} />
    </>
  );
}

export function AssetsPage({
  fetch,
  views = ['grid', 'table'],
}: {
  fetch: FetchArgs;
  views?: TableView[];
}) {
  const control = useFetchControl(fetch);
  return (
    <DataTablePage<Asset>
      id="assets"
      title="Assets"
      description="Logos, posters, icons and photos for every client, with their review status."
      create={{ label: 'Upload asset', onClick: () => undefined }}
      columns={ASSET_COLUMNS}
      rowKey={(a) => a.id}
      views={views}
      renderCard={(asset) => <AssetCard asset={asset} />}
      filters={ASSET_FILTERS}
      pageSizes={[12, 24, 48]}
      defaultSort={{ key: 'updatedAt', direction: 'desc' }}
      queryOptions={(state) => ({
        queryKey: ['assets', 'list', state],
        queryFn: () =>
          respond(control, () =>
            control.current.empty
              ? { rows: [], total: 0 }
              : queryRows(ASSETS, state, ['name', 'client', 'owner'])
          ),
      })}
      rowActions={[
        {
          id: 'download',
          label: 'Download',
          run: () => Promise.resolve(),
          success: 'Download started',
        },
        {
          id: 'archive',
          label: 'Archive',
          danger: true,
          confirm: 'Archive this asset?',
          run: () => Promise.resolve(),
          success: 'Asset archived',
        },
      ]}
      detail={{
        title: (id) => ASSETS.find((a) => a.id === id)?.name ?? 'Asset',
        render: (id) => <AssetDetail id={id} />,
      }}
      emptyTitle="No assets yet"
      emptyDescription="Upload logos, artwork and photos to share them with clients and keep track of their review status."
    />
  );
}

// =============================================================================================
// Campaign performance (marketing) - DashboardPage
// =============================================================================================

/** A round axis maximum for four equal intervals (steps of 1, 2, 2.5 or 5 × 10ⁿ). */
function niceMax(value: number, intervals = 4) {
  const raw = Math.max(value, 1) / intervals;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  return step * intervals;
}

/** A single-series line chart in inline SVG with HTML axis labels (sizes to its container). */
export function LineChart({ points, unit }: { points: Point[]; unit: string }) {
  const { number, dateTime } = useFormatters();
  const max = niceMax(Math.max(...points.map((p) => p.value)) * 1.05);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const n = points.length - 1;
  const x = (i: number) => (n === 0 ? 0 : (i / n) * 100);
  const y = (v: number) => 100 - (v / max) * 100;
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.value)}`).join(' ');
  const area = `${line} L100,100 L0,100 Z`;
  const last = points[points.length - 1];
  const label = (date: string) =>
    dateTime(new Date(`${date}T00:00:00`), { month: 'short', day: 'numeric' });
  return (
    <div className={styles.lineChart}>
      <div className={styles.yAxis}>
        {ticks.map((t) => (
          <span key={t} className={styles.yTick} style={{ top: `${y(t)}%` }}>
            {number(t)}
          </span>
        ))}
      </div>
      <div className={styles.plot}>
        {ticks.map((t) => (
          <div
            key={t}
            className={styles.gridLine}
            style={{ top: `${y(t)}%` }}
            data-baseline={t === 0 || undefined}
          />
        ))}
        <svg className={styles.plotSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className={styles.area} d={area} />
          <path className={styles.line} d={line} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className={styles.endDot} style={{ left: '100%', top: `${y(last.value)}%` }} />
        <span className={styles.endLabel} style={{ left: '100%', top: `${y(last.value)}%` }}>
          {number(last.value)} {unit}
        </span>
      </div>
      <div className={styles.xAxis}>
        <span>{label(points[0].date)}</span>
        <span>{label(points[Math.floor(n / 2)].date)}</span>
        <span>{label(last.date)}</span>
      </div>
    </div>
  );
}

function SpendBars({ rows }: { rows: ChannelSpend[] }) {
  const { currency } = useFormatters();
  const max = Math.max(...rows.map((r) => r.spend));
  return (
    <ul className={styles.bars}>
      {rows.map((r) => (
        <li key={r.channel} className={styles.barRow}>
          <span className={styles.barLabel}>{r.channel}</span>
          <span className={styles.barTrack}>
            <span
              className={styles.bar}
              style={{ width: `${(r.spend / max) * 100}%`, display: 'block' }}
            />
          </span>
          <span className={styles.barValue}>
            {currency(r.spend, 'USD', { maximumFractionDigits: 0, notation: 'compact' })}
          </span>
        </li>
      ))}
    </ul>
  );
}

const CAMPAIGN_COLUMNS: Array<FieldDef<CampaignRow>> = [
  { key: 'name', label: 'Campaign', kind: 'text' },
  { key: 'status', label: 'Status', kind: 'status', statusTones: CAMPAIGN_STATUS_TONES },
  { key: 'spend', label: 'Spend', kind: 'currency', fractionDigits: 0 },
];

interface EmailStats {
  sent: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

function useMarketing<T>(
  name: string,
  control: { current: FetchArgs },
  value: (days: number) => T,
  fail = false
) {
  const [range] = useTimeRange();
  const days = RANGE_DAYS[range] ?? 30;
  return useQuery({
    queryKey: ['marketing', name, range],
    queryFn: () =>
      respond({ current: { ...control.current, fail: control.current.fail || fail } }, () =>
        value(days)
      ),
  });
}

function Kpis({ control }: { control: { current: FetchArgs } }) {
  const kpis = useMarketing('kpis', control, kpisFor);
  return (
    <>
      <KpiWidget
        label="Ad spend"
        query={kpis}
        value={() => <FieldValue kind="currency" value={kpis.data?.spend} fractionDigits={0} />}
        delta={() => ({ value: 8.2, direction: 'up' })}
        hint="vs previous period"
      />
      <KpiWidget
        label="Conversions"
        query={kpis}
        kind="number"
        value={() => kpis.data?.conversions}
        delta={() => ({ value: 14.6, direction: 'up', good: true })}
        hint="vs previous period"
      />
      <KpiWidget
        label="Cost per acquisition"
        query={kpis}
        value={() => <FieldValue kind="currency" value={kpis.data?.cpa} fractionDigits={2} />}
        delta={() => ({ value: 5.7, direction: 'down', good: true })}
        hint="lower is better"
      />
      <KpiWidget
        label="Return on ad spend"
        query={kpis}
        value={() => `${kpis.data?.roas.toFixed(1)}×`}
        delta={() => ({ value: 2.1, direction: 'down', good: false })}
        hint="revenue ÷ spend"
      />
    </>
  );
}

function ConversionsChart({ control }: { control: { current: FetchArgs } }) {
  const series = useMarketing('conversions', control, conversionSeries);
  const { number } = useFormatters();
  const summary = useMemo(() => {
    const points = series.data;
    if (!points?.length) {
      return 'Conversions per day are loading.';
    }
    const peak = points.reduce((a, b) => (b.value > a.value ? b : a));
    return `Conversions per day over the last ${points.length} days: ${number(points[0].value)} on the first day, ${number(points[points.length - 1].value)} on the last, peaking at ${number(peak.value)} on ${peak.date}. Weekends dip by about 40 a day.`;
  }, [series.data, number]);
  return (
    <ChartWidget
      title="Conversions per day"
      query={series}
      summary={summary}
      size="lg"
      height={300}
    >
      <Loadable shape="box" height={300}>
        {() => <LineChart points={series.data ?? []} unit="today" />}
      </Loadable>
    </ChartWidget>
  );
}

function Secondary({
  control,
  failEmail,
}: {
  control: { current: FetchArgs };
  failEmail: boolean;
}) {
  const spend = useMarketing('spend', control, channelSpend);
  const top = useMarketing('top', control, () => TOP_CAMPAIGNS);
  const email = useMarketing<EmailStats>(
    'email',
    control,
    (days) => ({ sent: days * 4_100, openRate: 0.412, clickRate: 0.067, unsubscribeRate: 0.0018 }),
    failEmail
  );
  const { currency } = useFormatters();
  const spendSummary = spend.data
    ? `Ad spend by channel, largest first: ${spend.data.map((r) => `${r.channel} ${currency(r.spend, 'USD', { maximumFractionDigits: 0 })}`).join(', ')}.`
    : 'Ad spend by channel is loading.';
  return (
    <>
      <ChartWidget title="Spend by channel" query={spend} summary={spendSummary} height={200}>
        <Loadable shape="box" height={200}>
          {() => <SpendBars rows={spend.data ?? []} />}
        </Loadable>
      </ChartWidget>
      <DashboardWidget title="Top campaigns" query={top}>
        <RelatedRecords<CampaignRow> rows={top.data} columns={CAMPAIGN_COLUMNS} />
      </DashboardWidget>
      <DashboardWidget title="Email engagement" query={email}>
        <PropertyList<EmailStats>
          data={email.data}
          columns={2}
          fields={[
            { key: 'sent', label: 'Emails sent', kind: 'number' },
            { key: 'openRate', label: 'Open rate', kind: 'percent', fractionDigits: 1 },
            { key: 'clickRate', label: 'Click rate', kind: 'percent', fractionDigits: 1 },
            { key: 'unsubscribeRate', label: 'Unsubscribes', kind: 'percent', fractionDigits: 2 },
          ]}
        />
      </DashboardWidget>
    </>
  );
}

function Activity({ control }: { control: { current: FetchArgs } }) {
  const activity = useMarketing('activity', control, () => MARKETING_ACTIVITY);
  return (
    <DashboardWidget title="Recent activity" query={activity}>
      <ActivityTimeline items={activity.data} limit={4} />
    </DashboardWidget>
  );
}

export interface CampaignDashboardProps {
  fetch: FetchArgs;
  /** Make only the "Email engagement" widget fail. */
  failWidget?: boolean;
}

export function CampaignDashboard({ fetch, failWidget = false }: CampaignDashboardProps) {
  const control = useFetchControl(fetch);
  return (
    <DashboardPage
      id="campaign-performance"
      title="Campaign performance"
      description="Spend, conversions and return across every paid and owned channel."
      actions={[
        { id: 'export', label: 'Export report', onClick: () => undefined },
        { id: 'new', label: 'New campaign', onClick: () => undefined, variant: 'primary' },
      ]}
      queryKeyPrefix={['marketing']}
      kpis={<Kpis control={control} />}
      primary={<ConversionsChart control={control} />}
      secondary={<Secondary control={control} failEmail={failWidget} />}
      activity={<Activity control={control} />}
    />
  );
}

// =============================================================================================
// Release (software) - DetailsPage
// =============================================================================================

class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}

const RELEASE_FACTS: Array<FieldDef<Release>> = [
  { key: 'releaseDate', label: 'Release date', kind: 'date' },
  { key: 'rollout', label: 'Rollout', kind: 'percent' },
  { key: 'issuesClosed', label: 'Issues closed', kind: 'number' },
  { key: 'crashFreeRate', label: 'Crash-free sessions', kind: 'percent', fractionDigits: 2 },
  { key: 'buildSize', label: 'Build size', kind: 'fileSize', fractionDigits: 1 },
];

const RELEASE_PROPERTIES: Array<FieldDef<Release>> = [
  { key: 'version', label: 'Version', kind: 'text' },
  { key: 'id', label: 'Release ID', kind: 'id' },
  { key: 'project', label: 'Project', kind: 'text' },
  { key: 'owner', label: 'Owner', kind: 'text', get: (r) => r.owner?.name },
  { key: 'owner', label: 'Owner email', kind: 'email', get: (r) => r.owner?.email },
  { key: 'platforms', label: 'Platforms', kind: 'tags' },
  { key: 'approvers', label: 'Approved by', kind: 'list' },
  { key: 'changelogUrl', label: 'Changelog', kind: 'url' },
  { key: 'createdAt', label: 'Created', kind: 'datetime' },
  { key: 'updatedAt', label: 'Last updated', kind: 'relative' },
];

export interface ReleasePageProps {
  fetch: FetchArgs;
  /** Respond with a 404 instead of the record. */
  notFound?: boolean;
}

export function ReleasePage({ fetch, notFound = false }: ReleasePageProps) {
  const control = useFetchControl(fetch);
  const release = useQuery({
    queryKey: ['release', RELEASE.id],
    queryFn: () =>
      respond(control, () => {
        if (notFound) {
          throw new HttpError(404);
        }
        return RELEASE;
      }),
  });
  const issues = useQuery({
    queryKey: ['release', RELEASE.id, 'issues'],
    queryFn: () => respond(control, () => issuesFor(PROJECTS[0])),
  });
  const notes = useRef(RELEASE_NOTES);

  const tabs: DetailsTab[] = [
    {
      value: 'overview',
      label: 'Overview',
      sideLabel: 'Release details',
      main: (
        <div className={styles.stack}>
          <Section title="Summary">
            <Loadable shape="text" lines={3}>
              {() => <p className={styles.prose}>{release.data?.description}</p>}
            </Loadable>
          </Section>
          <RelatedRecords<Issue>
            title="Issues in this release"
            query={issues}
            columns={ISSUE_COLUMNS}
            total={42}
            viewAllHref="/releases/v3.4.0/issues"
          />
          <Notes
            title="Notes"
            items={notes.current}
            onAdd={async (body) => {
              await new Promise((r) => setTimeout(r, 500));
              notes.current = [
                { id: `n${Date.now()}`, author: 'You', at: new Date().toISOString(), body },
                ...notes.current,
              ];
            }}
          />
        </div>
      ),
      side: (
        <PropertyList<Release> title="Details" fields={RELEASE_PROPERTIES} data={release.data} />
      ),
    },
    {
      value: 'activity',
      label: 'Activity',
      layout: 'single',
      main: <ActivityTimeline title="Activity" items={RELEASE_ACTIVITY} limit={10} />,
    },
    {
      value: 'files',
      label: 'Files',
      layout: 'single',
      main: <MediaGallery title="Files" items={RELEASE_FILES} />,
    },
  ];

  return (
    <DetailsPage<Release>
      id="release"
      query={release}
      title={(r) => `${r.name} (${r.version})`}
      status={(r) => ({
        label: RELEASE_STATUS_LABELS[r.status],
        tone: RELEASE_STATUS_TONES[r.status],
      })}
      breadcrumbs={[
        { label: 'Projects', href: '/projects' },
        { label: 'Checkout redesign', href: '/projects/prj-001' },
        { label: 'v3.4.0' },
      ]}
      actions={[
        { id: 'edit', label: 'Edit', onClick: () => undefined },
        { id: 'pause', label: 'Pause rollout', onClick: () => undefined },
        { id: 'promote', label: 'Promote to 60%', onClick: () => undefined, variant: 'primary' },
      ]}
      facts={RELEASE_FACTS}
      tabs={tabs}
      notFound={(error) => error instanceof HttpError && error.status === 404}
    />
  );
}
