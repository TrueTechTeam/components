# Page Plumbing

Where state lives, how fresh data stays, how permissions and mutation feedback show up, and how
to set the providers up, including in Next.js.

## APP-PLUMB-1 - Where state lives (MUST)

| State                                                                                                       | Store                                                                 | Why                                                               |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| What the user is looking at: filters, search, sort, page, page size, view, selected record, tab, time range | **URL**: `usePageParams` / `usePreference` (default `storage: 'url'`) | Survives reload, works with Back/Forward, can be shared as a link |
| Personal display preferences that are meaningless to share: sidebar collapsed, density, hidden columns      | **This browser**: `usePreference(key, def, { storage: 'local' })`     | Remembered per user, without changing shared links                |
| Transient UI shared by several sections of one page: bulk selection, a draft step, a highlighted item       | **Page store**: `Page reducer` + `usePageStore()`                     | Lives as long as the page and is reset when the user leaves       |
| One component's ephemeral UI: open menu, hover, an input's text before debounce                             | `useState`                                                            | No one else needs it                                              |
| Server data                                                                                                 | **Query cache** (`useQuery`)                                          | One source of truth, cached, refetched and invalidated            |

- The templates already put their state in the URL: `DataTablePage` (`useTableState`: `page`,
  `size`, `sort`, `q`, `f`, `view`, `selected`), `DetailsPage` and `PageHeader` tabs (`?tab=`,
  `usePageTab`), `DashboardPage` (`?range=`, `useTimeRange`). Don't mirror them in `useState`.
- Never copy query data into `useState` or the page store. Derive from `query.data`, and change it
  with mutations plus invalidation.
- Extra URL state uses typed codecs: `usePageParams({ owner: param.string(''), archived:
param.boolean(false) })`. Malformed values fall back to the default, so links never crash.

## APP-PLUMB-2 - Polling by freshness

The default `AppProvider` query client uses `staleTime: 30_000`, `retry: 1` and
`refetchOnWindowFocus: true`. Add polling only when users watch the data change:

| Data                                                         | `refetchInterval`                   | Notes                                                                                             |
| ------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| Live operations (queues, running jobs, sends in progress)    | 5_000–15_000                        | Only while the state is live: `refetchInterval: (q) => (isRunning(q.state.data) ? 5_000 : false)` |
| Monitoring dashboards, live campaign metrics                 | 30_000–60_000                       | Show `LastUpdated`; the templates do                                                              |
| Business records people edit (campaigns, orders, customers)  | none                                | Focus refetch and invalidation after mutations keep them fresh                                    |
| Reports, daily aggregates, reference data (countries, plans) | none; raise `staleTime` to 5–60 min | Avoids refetching on every focus                                                                  |

- TanStack Query pauses intervals in background tabs by default. Keep it that way.
- Never poll faster than the server updates the data. Ask for the update cadence in the brief.

## APP-PLUMB-3 - Query keys and `keepPreviousData` (MUST)

- `DataTablePage` calls your `queryOptions(state)` with `placeholderData: keepPreviousData`, so
  changing page, sort, search or filters keeps the current rows (and focus) until the next result
  arrives. For your own paginated or filtered queries, pass `placeholderData: keepPreviousData`
  yourself.
- Key list queries on **what changes the result only**: `page`, `pageSize`, `sort`, `search`,
  `filters`. Leave `view` and `selected` out. Opening a detail must not refetch the list.
- Use one key prefix per resource: `['campaigns', 'list', {...}]`, `['campaigns', 'detail', id]`.
  A `DataTablePage` row action invalidates everything under the list key's first segment
  (`['campaigns']`), so lists and details both refresh. The panel and the details page share the
  detail key (`APP-3`).
- Dashboard widgets put the range in their key (`['dashboard', 'spend', range]` from
  `useTimeRange()`), and `queryKeyPrefix={['dashboard']}` turns on "Refresh all".

## APP-PLUMB-4 - After a mutation

- Invalidate the resource prefix (`queryClient.invalidateQueries({ queryKey: ['campaigns'] })`).
  `DataTablePage` does it for row actions.
- Fast, low-risk, reversible changes (toggle, rename, reorder) MAY be optimistic with
  `createOptimisticHandlers(queryClient, queryKey, update)` in `useMutation` (`STATE-6`). Never
  for deletes, payments or anything with server validation.
- After a create, navigate to the new record (`useAppNavigate`) and optionally toast (`STATE-5`).

## APP-PLUMB-5 - Permissions: hide vs disable (MUST)

Follow `STATE-7`:

- **Hide** what the user can **never** do with their role: `NavItem.permission`,
  `PageAction.permission`, `RowAction.permission` (each checked with `AppProvider auth.can`), `Can`
  / `useCan` for anything else. `DataTablePage create` has no `permission` field: pass `create` only
  when `useCan('create', subject)` is true.
- **Disable**, and explain why, what is **temporarily** unavailable (`PageAction.disabled` with a
  reason nearby): a campaign that can't be edited while sending.
- Whole page: `Page permission` or the pattern in `APP-STATE-5`. Region: `Section permission`.
- Use the same `{ action, subject }` strings as the server's permission model, and list them in
  the brief.

## APP-PLUMB-6 - Mutation feedback: toast or inline

`useMutationFeedback(mutation, { success, error, via, pending })`:

| Situation                                                               | Channel                                                                                           |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Row action, header action, instant-save setting                         | Toast (default `via: 'toast'`), with the outcome in words ("Campaign paused")                     |
| Saving a form the user stays on                                         | `via: 'inline'`: show `feedback` next to the submit button; field errors on the fields (`FORM-5`) |
| Save then navigate away                                                 | Toast (it survives the navigation)                                                                |
| Long job (export, bulk send)                                            | `pending: 'Exporting…'`: a loading toast updated when it settles                                  |
| The change is visible on screen already (a toggle flipped, a row moved) | No success message; errors only (`STATE-5`)                                                       |
| Destructive                                                             | Confirm first (`RowAction.confirm`, or `useAlert().confirm`), then toast with Undo when possible  |

Error copy says what failed and what to do. The default error label is generic; pass `error` when
you know more.

## APP-PLUMB-7 - Provider order (MUST)

```tsx
import '@true-tech-team/ui-components/index.css';
import { GlobalProvider } from '@true-tech-team/ui-components';
import { AppProvider, AppShell } from '@true-tech-team/ui-components/app';

<GlobalProvider>
  <AppProvider router={useAppRouter} auth={auth} translate={i18n.t} locale={i18n.language}>
    <AppShell brand="Acme Marketing" nav={nav}>
      <Routes />
    </AppShell>
  </AppProvider>
</GlobalProvider>;
```

- `GlobalProvider` **outside**, `AppProvider` **inside**. Reversed, `AppLink` and unsaved-changes
  guards silently stop working (`AppProvider` warns in development).
- `AppShell` goes inside `AppProvider` (it reads the router and auth), once, around all routes.
- Pass `auth={{ user, can }}` so every `permission` field works. Without it, everything is allowed.
- Use `AppLink` and `useAppNavigate` for in-app navigation, never a bare `<a>` or `router.push`,
  so unsaved-changes guards run.

## APP-PLUMB-8 - Next.js App Router

- Put the providers in a `'use client'` component used by `app/layout.tsx`. Build the router
  adapter once at module scope with `createNextRouter({ useRouter, usePathname, useSearchParams,
Link })`.
- `AppProvider` and `AppShell` need no `<Suspense>`. Components that **read URL params** do, per
  Next's rules for `useSearchParams` in statically rendered routes. That covers `DataTablePage`,
  `DetailsPage`, `DashboardPage`, `PageHeader` with `tabs`, and anything calling `usePageParams`
  or `usePreference` with URL storage. Wrap the page component in `<Suspense>` in its `page.tsx`.
- Next.js cannot block navigation. Unsaved-changes guards (`FormBuilder guardUnsaved`,
  `useUnsavedChanges`) cover `AppLink`, `useAppNavigate`, Dialog close and tab close or reload,
  but **not** the browser Back button or your own `router.push`.
- Route params (`/campaigns/[id]`) come from Next (`useParams()` or the page's `params`). Pass the
  id to the page component as a prop.
