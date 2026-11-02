# Labels (translatable built-in text)

Every piece of text the library renders itself (button labels, aria-labels, messages) comes from a
flat key such as `common.close`. English defaults ship in `DEFAULT_LABELS`; apps can override or
translate them. `useLabels()` works without any provider and then returns the English defaults.

## Resolution order

For `t(key, vars)`:

1. `translate('ui.' + key, vars)` - the app's translate function. Used only if the result is
   non-empty and not equal to `'ui.' + key` (a "missing translation" echo).
2. `labels[key]` - the `labels` prop override.
3. `DEFAULT_LABELS[key]` - English default.
4. The key itself.

`labels` values and defaults are interpolated: `{name}` is replaced from `vars`; unknown
placeholders are left as-is. Nested providers: inner `labels` merge over outer; the inner
`translate` wins.

## Usage

```tsx
<GlobalProvider labels={{ 'common.close': 'Dismiss' }} translate={(k, v) => i18n.t(k, v)}>
  <App />
</GlobalProvider>
```

In a component: `const t = useLabels(); <button aria-label={t('common.close')} />`.
Build translation files from the exported `DEFAULT_LABELS` (prefix each key with `ui.`).

## Keys

| Key                                     | English default                                                 |
| --------------------------------------- | --------------------------------------------------------------- |
| `common.close`                          | Close                                                           |
| `common.loading`                        | Loading…                                                        |
| `unsavedChanges.confirm`                | You have unsaved changes. Leave anyway?                         |
| `accordionContainer.expandAll`          | Expand All                                                      |
| `accordionContainer.collapseAll`        | Collapse All                                                    |
| `alert.ok`                              | OK                                                              |
| `alert.confirm`                         | Confirm                                                         |
| `alert.cancel`                          | Cancel                                                          |
| `carousel.label`                        | Carousel                                                        |
| `carousel.roleDescription`              | carousel                                                        |
| `carousel.slideRoleDescription`         | slide                                                           |
| `carousel.previous`                     | Previous slide                                                  |
| `carousel.next`                         | Next slide                                                      |
| `carousel.slideOf`                      | Slide {n} of {total}                                            |
| `carousel.navigation`                   | Carousel navigation                                             |
| `carousel.goToSlide`                    | Go to slide {n}                                                 |
| `chip.remove`                           | Remove                                                          |
| `dialog.close`                          | Close dialog                                                    |
| `flipCard.flip`                         | Flip card                                                       |
| `list.searchPlaceholder`                | Search...                                                       |
| `list.empty`                            | No items to display                                             |
| `list.noResults`                        | No results found for "{query}"                                  |
| `list.selectAll`                        | Select all items                                                |
| `list.selectItem`                       | Select item {key}                                               |
| `list.collapse`                         | Collapse                                                        |
| `list.expand`                           | Expand                                                          |
| `pageMessages.loading.title`            | Loading...                                                      |
| `pageMessages.error.title`              | Something went wrong                                            |
| `pageMessages.error.description`        | An unexpected error occurred. Please try again.                 |
| `pageMessages.forbidden.title`          | Access Denied                                                   |
| `pageMessages.forbidden.description`    | You don't have permission to access this page.                  |
| `pageMessages.notFound.title`           | Page Not Found                                                  |
| `pageMessages.notFound.description`     | The page you're looking for doesn't exist or has been moved.    |
| `pageMessages.unauthorized.title`       | Authentication Required                                         |
| `pageMessages.unauthorized.description` | Please log in to access this page.                              |
| `pageMessages.maintenance.title`        | Under Maintenance                                               |
| `pageMessages.maintenance.description`  | We're performing scheduled maintenance. Please check back soon. |
| `pageMessages.offline.title`            | You're Offline                                                  |
| `pageMessages.offline.description`      | Please check your internet connection and try again.            |
| `pageMessages.timeout.title`            | Request Timed Out                                               |
| `pageMessages.timeout.description`      | The server took too long to respond. Please try again.          |
| `pageMessages.empty.title`              | No Data                                                         |
| `pageMessages.empty.description`        | There's nothing here yet.                                       |
| `pageMessages.tryAgain`                 | Try Again                                                       |
| `pageMessages.logIn`                    | Log In                                                          |
| `pageMessages.goBack`                   | Go Back                                                         |
| `pageMessages.goHome`                   | Go Home                                                         |
| `pageMessages.retry`                    | Retry                                                           |
| `pill.remove`                           | Remove                                                          |
| `spinner.loading`                       | Loading...                                                      |
| `statusIndicator.label`                 | Status: {status}                                                |
| `statusIndicator.online`                | online                                                          |
| `statusIndicator.offline`               | offline                                                         |
| `statusIndicator.away`                  | away                                                            |
| `statusIndicator.busy`                  | busy                                                            |
| `statusIndicator.success`               | success                                                         |
| `statusIndicator.warning`               | warning                                                         |
| `statusIndicator.error`                 | error                                                           |
| `statusIndicator.info`                  | info                                                            |
| `statusIndicator.neutral`               | neutral                                                         |
| `statusIndicator.processing`            | processing                                                      |
| `table.searchPlaceholder`               | Search...                                                       |
| `table.clearSearch`                     | Clear search                                                    |
| `table.empty`                           | No data available                                               |
| `table.rowsPerPage`                     | Rows per page                                                   |
| `table.expand`                          | Expand                                                          |
| `table.selectAll`                       | Select all rows                                                 |
| `table.deselectAll`                     | Deselect all rows                                               |
| `table.selection`                       | Selection                                                       |
| `table.collapseRow`                     | Collapse row                                                    |
| `table.expandRow`                       | Expand row                                                      |
| `tag.remove`                            | Remove {name}                                                   |
| `toast.dismiss`                         | Dismiss toast                                                   |
| `toast.notifications`                   | Notifications                                                   |
| `bottomNavigation.label`                | Bottom navigation                                               |
| `breadcrumbs.label`                     | Breadcrumb                                                      |
| `collapsibleSidebar.label`              | Sidebar navigation                                              |
| `collapsibleSidebar.expand`             | Expand sidebar                                                  |
| `collapsibleSidebar.collapse`           | Collapse sidebar                                                |
| `navbar.label`                          | Main navigation                                                 |
| `navbar.openMenu`                       | Open menu                                                       |
| `navbar.closeMenu`                      | Close menu                                                      |
| `pagination.label`                      | Pagination                                                      |
| `pagination.first`                      | Go to first page                                                |
| `pagination.previous`                   | Go to previous page                                             |
| `pagination.next`                       | Go to next page                                                 |
| `pagination.last`                       | Go to last page                                                 |
| `pagination.page`                       | Page {n}                                                        |
| `sideNav.label`                         | Side navigation                                                 |
| `stepper.label`                         | Progress steps                                                  |
