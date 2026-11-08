# Worked Example: Marketing Campaigns

One run from start to finish: an outline and a sample response become a filled page brief, and
the brief becomes a `DataTablePage` (with a detail panel) and a `DetailsPage`. The code
type-checks against the real exports. Copy the approach, not the field names.

## 1. The inputs

**Outline (from the user):**

> Marketing managers need a campaigns page. They check it a few times a day on a laptop to see
> which campaigns are running, how much they've spent and how they're performing, pause or
> archive campaigns, and open one to see its details, history and creative assets. Some users are
> read-only. Only admins can archive.

**Sample response** (`GET /api/campaigns?page=1&per_page=25`):

```json
{
  "data": [
    {
      "id": "cmp_8f2k1",
      "name": "Spring Sale 2026",
      "status": "active",
      "channel": "email",
      "owner": { "id": "usr_12", "name": "Dana Ruiz", "email": "dana@example.com" },
      "budget_cents": 1250000,
      "spend_cents": 482350,
      "ctr": 0.0342,
      "conversions": 1284,
      "start_date": "2026-03-01",
      "end_date": "2026-04-15",
      "landing_page_url": "https://example.com/spring",
      "tags": ["seasonal", "promo"],
      "description": "Seasonal promotion for the spring catalogue, sent to opted-in subscribers in three waves.",
      "created_at": "2026-02-10T14:22:05Z",
      "updated_at": "2026-03-04T09:12:44Z",
      "internal_version": 7
    }
  ],
  "meta": { "total": 137, "page": 1, "per_page": 25 }
}
```

The API also documents `status ∈ draft | scheduled | active | paused | completed | archived`,
`channel ∈ email | social | search | display`, sorting by `name`, `spend_cents`, `ctr` and
`end_date` (`sort=-end_date` for descending), filters `status` (comma list) and `channel`, text
search `q`, `GET /api/campaigns/:id` (404 when missing), `/:id/activity`, `/:id/assets`, and
`POST /:id/pause` and `/:id/archive`.

## 2. The filled brief

```md
## Page brief: Campaigns

**Outline:** Marketing managers, a few times a day, laptop. Find running campaigns, compare
spend and performance, pause or archive, open one for details, history and assets.
**Data:** GET /api/campaigns (paginated, total in meta.total); GET /api/campaigns/:id.

### 1. Template

- Template: DataTablePage (list) + DetailsPage (one campaign).
- Configuration: views ['table']; detail mode 'panel' + fullPageHref; page sizes [25, 50, 100];
  default sort end_date desc; 3 tabs on the details page (Overview, Activity, Assets).
- Rationale: many records compared across attributes and acted on → DataTablePage (APP-1, APP-2,
  DATA-1 table). Quick look without losing the list, plus a rich record with history and assets →
  panel + full page (APP-3, HIER-4). History and assets are distinct tasks → tabs (HIER-5).

### 2. Fields

| Field            | Kind                | Where                   | Options                        | Sort / filter       |
| ---------------- | ------------------- | ----------------------- | ------------------------------ | ------------------- |
| name             | text                | column 1, title         | -                              | sort                |
| status           | status              | column 2, header status | statusTones: STATUS_TONES      | filter multi-select |
| channel          | text + get label    | column 3, detail        | CHANNEL_LABELS                 | filter select       |
| owner.name       | text + get          | column 4, side          | -                              | -                   |
| spend_cents      | currency + get /100 | column 5, fact          | USD, fractionDigits 0          | sort                |
| ctr              | percent             | column 6, fact          | ratio; fractionDigits 1        | sort                |
| end_date         | date                | column 7, fact          | -                              | sort (default desc) |
| budget_cents     | currency + get /100 | summary (fact, panel)   | USD, fractionDigits 0          | -                   |
| conversions      | number              | summary (fact)          | -                              | -                   |
| start_date       | date                | detail                  | -                              | -                   |
| landing_page_url | url                 | detail                  | -                              | -                   |
| tags             | tags                | detail                  | -                              | -                   |
| description      | longText            | detail-only             | span 2                         | -                   |
| id               | id                  | detail-only (side)      | copy                           | -                   |
| created_at       | datetime            | detail-only (side)      | -                              | -                   |
| updated_at       | relative            | detail-only (side)      | -                              | -                   |
| owner.id         | -                   | hidden                  | shown by name instead          | -                   |
| owner.email      | -                   | hidden                  | not needed to manage campaigns | -                   |
| internal_version | -                   | hidden                  | internal concurrency counter   | -                   |

Visible columns: 7 (FIELD-7). First column: name.

### 3. States

- Loading: structure first; table skeleton; title and facts skeleton on the details page.
- Nothing yet: "No campaigns yet" / "Create a campaign to start reaching your audience." / New campaign.
- No results: built in (Clear all).
- Error: generic + Retry; not found: ApiError status 404 → DetailsPage notFound.
- Forbidden: read:campaign → Page permission (APP-STATE-5).
- Refreshing / partial: built in; activity and assets are their own blocks.

### 4. URL state

- Template defaults only (page, size, sort, q, f, selected, tab).

### 5. Permissions

| Surface                 | Check            | Hide or disable |
| ----------------------- | ---------------- | --------------- |
| Page                    | read:campaign    | forbidden state |
| New campaign, Duplicate | create:campaign  | hide            |
| Pause, Edit campaign    | update:campaign  | hide            |
| Archive                 | archive:campaign | hide            |

### 6. Live data

| Query           | refetchInterval  | staleTime | Invalidated by       |
| --------------- | ---------------- | --------- | -------------------- |
| campaigns list  | none             | default   | row actions (prefix) |
| campaign detail | 60s (live spend) | default   | row actions (prefix) |

### 7. Mutations

| Action  | Feedback                  | Confirm      | Optimistic |
| ------- | ------------------------- | ------------ | ---------- |
| Pause   | toast "Campaign paused"   | no           | no         |
| Archive | toast "Campaign archived" | yes (danger) | no         |

### 8. Open questions

- Is the currency always USD? The response has no currency field (FIELD-9).
- Is ctr always a ratio (0–1)? Confirmed from one value only (FIELD-5).
- Does `q` search names only, or descriptions too? (Search placeholder copy.)
```

## 3. The code

The four parts below form one module (that is how it was type-checked). When you split them into
files, import between them as usual. Imports use the package entries: core types from
`@true-tech-team/ui-components`, everything else from `/app`.

```tsx
import React from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { FilterDefinition } from '@true-tech-team/ui-components';
import {
  ActivityTimeline,
  DataTablePage,
  DetailsPage,
  MediaGallery,
  Page,
  PropertyList,
  useAppNavigate,
  useCan,
  type ActivityItem,
  type DataTableColumn,
  type DataTableQueryResult,
  type FieldDef,
  type MediaItem,
  type RowAction,
  type StatusTone,
  type TableState,
} from '@true-tech-team/ui-components/app';
```

### Data access (`api.ts`)

The list key holds only what changes the result, so opening a detail never refetches the list
(`APP-PLUMB-3`). Every key starts with `'campaigns'`, so a row action's invalidation refreshes
lists and details alike.

```tsx
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived';
export type CampaignChannel = 'email' | 'social' | 'search' | 'display';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  channel: CampaignChannel;
  owner: { id: string; name: string; email: string } | null;
  budget_cents: number;
  spend_cents: number;
  ctr: number;
  conversions: number;
  start_date: string;
  end_date: string | null;
  landing_page_url: string | null;
  tags: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface CampaignListResponse {
  data: Campaign[];
  meta: { total: number; page: number; per_page: number };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }
  return (await res.json()) as T;
}

/** Query string for the list endpoint: only what changes the result set. */
function listSearch(state: TableState): string {
  const q = new URLSearchParams({ page: String(state.page), per_page: String(state.pageSize) });
  if (state.search) {
    q.set('q', state.search);
  }
  if (state.sort) {
    q.set('sort', `${state.sort.direction === 'desc' ? '-' : ''}${state.sort.key}`);
  }
  const status = state.filters.status;
  if (Array.isArray(status) && status.length > 0) {
    q.set('status', status.join(','));
  }
  if (typeof state.filters.channel === 'string') {
    q.set('channel', state.filters.channel);
  }
  return q.toString();
}

export const campaignKeys = {
  all: ['campaigns'] as const,
  list: (state: TableState) =>
    [
      'campaigns',
      'list',
      {
        page: state.page,
        pageSize: state.pageSize,
        sort: state.sort,
        search: state.search,
        filters: state.filters,
      },
    ] as const,
  detail: (id: string) => ['campaigns', 'detail', id] as const,
  activity: (id: string) => ['campaigns', 'detail', id, 'activity'] as const,
  assets: (id: string) => ['campaigns', 'detail', id, 'assets'] as const,
};

export const campaignQuery = (id: string) => ({
  queryKey: campaignKeys.detail(id),
  queryFn: () => request<Campaign>(`/api/campaigns/${encodeURIComponent(id)}`),
});
```

### Field definitions (`campaign-fields.ts`)

Defined once and reused by the columns, the panel, the key facts and the property lists, so
labels and formatting match everywhere (`FIELD-10`, `FIELD-11`).

```tsx
export const STATUS_TONES: Record<CampaignStatus, StatusTone> = {
  draft: 'neutral',
  scheduled: 'info',
  active: 'success',
  paused: 'warning',
  completed: 'neutral',
  archived: 'neutral',
};

const CHANNEL_LABELS: Record<CampaignChannel, string> = {
  email: 'Email',
  social: 'Social',
  search: 'Search',
  display: 'Display',
};

const money = (cents: number | null | undefined) => (cents == null ? null : cents / 100);

export const fields = {
  name: { key: 'name', label: 'Name', kind: 'text' },
  status: { key: 'status', label: 'Status', kind: 'status', statusTones: STATUS_TONES },
  channel: {
    key: 'channel',
    label: 'Channel',
    kind: 'text',
    get: (c) => CHANNEL_LABELS[c.channel],
  },
  owner: { key: 'owner', label: 'Owner', kind: 'text', get: (c) => c.owner?.name },
  budget: {
    key: 'budget_cents',
    label: 'Budget',
    kind: 'currency',
    fractionDigits: 0,
    get: (c) => money(c.budget_cents),
  },
  spend: {
    key: 'spend_cents',
    label: 'Spend',
    kind: 'currency',
    fractionDigits: 0,
    get: (c) => money(c.spend_cents),
  },
  ctr: { key: 'ctr', label: 'CTR', kind: 'percent', fractionDigits: 1 },
  conversions: { key: 'conversions', label: 'Conversions', kind: 'number' },
  start: { key: 'start_date', label: 'Starts', kind: 'date' },
  end: { key: 'end_date', label: 'Ends', kind: 'date' },
  landingPage: { key: 'landing_page_url', label: 'Landing page', kind: 'url' },
  tags: { key: 'tags', label: 'Tags', kind: 'tags' },
  description: { key: 'description', label: 'Description', kind: 'longText', span: 2 },
  id: { key: 'id', label: 'Campaign ID', kind: 'id' },
  created: { key: 'created_at', label: 'Created', kind: 'datetime' },
  updated: { key: 'updated_at', label: 'Last changed', kind: 'relative' },
} satisfies Record<string, FieldDef<Campaign>>;
```

### The list (`CampaignsPage.tsx`)

```tsx
const columns: Array<DataTableColumn<Campaign>> = [
  { ...fields.name, sortable: true },
  fields.status,
  fields.channel,
  fields.owner,
  { ...fields.spend, sortable: true },
  { ...fields.ctr, sortable: true },
  { ...fields.end, sortable: true },
];

const filters: FilterDefinition[] = [
  {
    id: 'status',
    type: 'multi-select',
    label: 'Status',
    options: (Object.keys(STATUS_TONES) as CampaignStatus[]).map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    })),
  },
  {
    id: 'channel',
    type: 'select',
    label: 'Channel',
    options: (Object.keys(CHANNEL_LABELS) as CampaignChannel[]).map((value) => ({
      value,
      label: CHANNEL_LABELS[value],
    })),
  },
];

const listQuery = (state: TableState): UseQueryOptions<DataTableQueryResult<Campaign>> => ({
  queryKey: campaignKeys.list(state),
  queryFn: async () => {
    const res = await request<CampaignListResponse>(`/api/campaigns?${listSearch(state)}`);
    return { rows: res.data, total: res.meta.total };
  },
});

const post = (path: string) => request<unknown>(path, { method: 'POST' });

const rowActions: Array<RowAction<Campaign>> = [
  {
    id: 'pause',
    label: 'Pause',
    run: (c) => post(`/api/campaigns/${c.id}/pause`),
    success: 'Campaign paused',
    permission: { action: 'update', subject: 'campaign' },
  },
  {
    id: 'archive',
    label: 'Archive',
    danger: true,
    confirm: 'Archive this campaign? It stops sending and leaves the active list.',
    run: (c) => post(`/api/campaigns/${c.id}/archive`),
    success: 'Campaign archived',
    permission: { action: 'archive', subject: 'campaign' },
  },
];

/** The panel body: the same query (and cache entry) as the full details page. */
function CampaignPreview({ id }: { id: string }) {
  const campaign = useQuery(campaignQuery(id));
  return (
    <PropertyList<Campaign>
      query={campaign}
      fields={[
        fields.status,
        fields.owner,
        fields.budget,
        fields.spend,
        fields.ctr,
        fields.start,
        fields.end,
        fields.landingPage,
      ]}
    />
  );
}

export function CampaignsPage() {
  const navigate = useAppNavigate();
  const canRead = useCan('read', 'campaign');
  const canCreate = useCan('create', 'campaign');
  if (!canRead) {
    return (
      <Page title="Campaigns" permission={{ action: 'read', subject: 'campaign' }}>
        {null}
      </Page>
    );
  }
  return (
    <DataTablePage<Campaign>
      id="campaigns"
      title="Campaigns"
      description="Every marketing campaign, newest first."
      create={canCreate ? { label: 'New campaign', href: '/campaigns/new' } : undefined}
      columns={columns}
      rowKey={(c) => c.id}
      queryOptions={listQuery}
      filters={filters}
      pageSizes={[25, 50, 100]}
      defaultSort={{ key: 'end_date', direction: 'desc' }}
      rowActions={rowActions}
      emptyTitle="No campaigns yet"
      emptyDescription="Create a campaign to start reaching your audience."
      detail={{
        mode: 'panel',
        title: () => 'Campaign',
        render: (id) => <CampaignPreview id={id} />,
        fullPageHref: (id) => `/campaigns/${encodeURIComponent(id)}`,
      }}
      headerActions={[
        { id: 'export', label: 'Export CSV', onClick: () => navigate('/campaigns/export') },
      ]}
    />
  );
}
```

### The details page (`CampaignDetailsPage.tsx`)

Activity and assets live in their own components, so their queries run only when their tab is
open, and each block owns its loading, empty and error states (`APP-4`, `APP-STATE-8`). The
Overview tab reads `campaign.data` through the blocks' `data` prop, so nothing reads the record
before it has loaded (`APP-STATE-1`).

```tsx
function CampaignActivity({ id }: { id: string }) {
  const activity = useQuery({
    queryKey: campaignKeys.activity(id),
    queryFn: () => request<ActivityItem[]>(`/api/campaigns/${encodeURIComponent(id)}/activity`),
  });
  return <ActivityTimeline title="Activity" query={activity} limit={10} />;
}

function CampaignAssets({ id }: { id: string }) {
  const assets = useQuery({
    queryKey: campaignKeys.assets(id),
    queryFn: () => request<MediaItem[]>(`/api/campaigns/${encodeURIComponent(id)}/assets`),
  });
  return (
    <MediaGallery
      title="Creative assets"
      query={assets}
      empty={{ title: 'No assets yet', description: 'Upload creative from the campaign editor.' }}
    />
  );
}

export function CampaignDetailsPage({ id }: { id: string }) {
  const navigate = useAppNavigate();
  const campaign = useQuery({ ...campaignQuery(id), refetchInterval: 60_000 });
  const record = campaign.data;
  return (
    <DetailsPage<Campaign>
      id="campaign-details"
      query={campaign}
      title={(c) => c.name}
      status={(c) => ({
        label: c.status.charAt(0).toUpperCase() + c.status.slice(1),
        tone: STATUS_TONES[c.status],
      })}
      breadcrumbs={[
        { label: 'Marketing', href: '/' },
        { label: 'Campaigns', href: '/campaigns' },
        { label: record?.name ?? 'Campaign' },
      ]}
      actions={[
        {
          id: 'duplicate',
          label: 'Duplicate',
          onClick: () => navigate(`/campaigns/new?from=${encodeURIComponent(id)}`),
          permission: { action: 'create', subject: 'campaign' },
        },
        {
          id: 'edit',
          label: 'Edit campaign',
          href: `/campaigns/${encodeURIComponent(id)}/edit`,
          variant: 'primary',
          permission: { action: 'update', subject: 'campaign' },
        },
      ]}
      facts={[fields.spend, fields.budget, fields.ctr, fields.conversions, fields.end]}
      notFound={(error) => error instanceof ApiError && error.status === 404}
      tabs={[
        {
          value: 'overview',
          label: 'Overview',
          main: (
            <PropertyList<Campaign>
              title="Details"
              data={record}
              columns={2}
              fields={[
                fields.channel,
                fields.start,
                fields.end,
                fields.landingPage,
                fields.tags,
                fields.description,
              ]}
            />
          ),
          side: (
            <PropertyList<Campaign>
              title="Ownership"
              data={record}
              fields={[fields.owner, fields.id, fields.created, fields.updated]}
            />
          ),
          sideLabel: 'Ownership',
        },
        {
          value: 'activity',
          label: 'Activity',
          layout: 'single',
          main: <CampaignActivity id={id} />,
        },
        { value: 'assets', label: 'Assets', layout: 'single', main: <CampaignAssets id={id} /> },
      ]}
    />
  );
}
```

## 4. Wiring the routes

React Router or the History API: render `<CampaignsPage />` at `/campaigns` and
`<CampaignDetailsPage id={id} />` at `/campaigns/:id`, inside `AppShell` (`APP-PLUMB-7`).

Next.js App Router: these pages read URL params, so wrap them in `<Suspense>` (`APP-PLUMB-8`):

```tsx
// app/campaigns/[id]/page.tsx
import { Suspense } from 'react';
import { CampaignDetailsPage } from './CampaignDetailsPage'; // a 'use client' module

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <CampaignDetailsPage id={id} />
    </Suspense>
  );
}
```

## 5. What to check before shipping

- Open `/campaigns?selected=cmp_8f2k1` directly: the panel opens even if that row isn't on page 1.
- Filter to a status with no campaigns: you see "No results" with Clear all, not "No campaigns
  yet".
- Open a campaign, then reload on `?tab=activity`: the Activity tab is selected.
- Sign in as a read-only user: no New campaign, Pause, Archive, Duplicate or Edit.
- Visit `/campaigns/does-not-exist`: the not-found state, not an error with Retry.
- Run the final review in [../decision-tree.md](../decision-tree.md).
