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

## Locale

`locale` (on `GlobalProvider`, `AppProvider` or `LabelsProvider`, inherited by nested providers)
sets the language of built-in date text such as DatePicker and DateRangePicker month and weekday
names. `useLocale()` returns the nearest provider's `locale`, else `en-US`: built-in text stays
English unless the app passes a locale, even when the browser's language differs. The `/app`
formatters (`useFormatters`) and `useAppTranslation().locale` instead fall back to the browser
locale (`navigator.language`) when no locale is provided.

## Keys

| Key                                     | English default                                                 |
| --------------------------------------- | --------------------------------------------------------------- |
| `common.close`                          | Close                                                           |
| `common.loading`                        | Loading…                                                        |
| `unsavedChanges.confirm`                | You have unsaved changes. Leave anyway?                         |
| `page.loading`                          | Loading…                                                        |
| `page.refreshing`                       | Refreshing…                                                     |
| `page.refetchError`                     | Couldn't refresh. Showing the last loaded data.                 |
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
| `table.selectRow`                       | Select row {n}                                                  |
| `truncatedList.more`                    | +{count} more                                                   |
| `list.selectedCount`                    | {count} of {total} selected                                     |
| `filters.apply`                         | Apply                                                           |
| `filters.clear`                         | Clear                                                           |
| `filters.reset`                         | Reset                                                           |
| `filterBar.moreFilters`                 | More Filters                                                    |
| `filters.title`                         | Filters                                                         |
| `filterModal.apply`                     | Apply Filters                                                   |
| `filterModal.clearAll`                  | Clear All                                                       |
| `filterModal.cancel`                    | Cancel                                                          |
| `filterSidebar.expand`                  | Expand filters                                                  |
| `filterSidebar.collapse`                | Collapse filters                                                |
| `dateFilter.placeholder`                | Select date                                                     |
| `filters.selectPlaceholder`             | Select {label}                                                  |
| `filters.enterPlaceholder`              | Enter {label}                                                   |
| `filters.selectedCount`                 | {count} selected                                                |
| `filters.searchPlaceholder`             | Search...                                                       |
| `select.noResults`                      | No results found                                                |
| `select.noOptions`                      | No options available                                            |
| `filters.selectAll`                     | Select all                                                      |
| `filters.loadMore`                      | Load more...                                                    |
| `numberRangeFilter.min`                 | Min                                                             |
| `numberRangeFilter.max`                 | Max                                                             |
| `activeFilters.clearAll`                | Clear all                                                       |
| `activeFilters.removeFilter`            | Remove {label} filter                                           |
| `activeFilters.showLess`                | Show less                                                       |
| `filters.yes`                           | Yes                                                             |
| `filters.no`                            | No                                                              |
| `rating.stars`                          | {n} stars                                                       |
| `filters.notFound`                      | Filter not found                                                |
| `formBuilder.submit`                    | Submit                                                          |
| `formBuilder.reset`                     | Reset                                                           |
| `formBuilder.required`                  | This field is required                                          |
| `formBuilder.invalidFormat`             | Invalid format                                                  |
| `formBuilder.minLength`                 | Minimum length is {count} characters                            |
| `formBuilder.maxLength`                 | Maximum length is {count} characters                            |
| `formBuilder.min`                       | Minimum value is {min}                                          |
| `formBuilder.max`                       | Maximum value is {max}                                          |
| `filters.loadFailed`                    | Failed to load options                                          |
| `dragHandle.label`                      | Drag handle                                                     |
| `kanbanBoard.label`                     | Kanban board                                                    |
| `resizablePanels.label`                 | Resizable panels                                                |
| `resizablePanels.handle`                | Resize handle                                                   |
| `sortableGrid.label`                    | Sortable grid                                                   |
| `sortableList.label`                    | Sortable list                                                   |
| `autocomplete.noOptions`                | No options                                                      |
| `autocomplete.loading`                  | Loading...                                                      |
| `filePicker.choose`                     | Choose Files                                                    |
| `filePicker.dropzone`                   | or drag and drop files here                                     |
| `filePicker.label`                      | File picker                                                     |
| `filePicker.upload`                     | Upload files                                                    |
| `filePicker.maxFiles`                   | Maximum {count} file(s) allowed                                 |
| `filePicker.maxSize`                    | File size exceeds {size}                                        |
| `filePicker.invalidType`                | File type not accepted. Accepted types: {accept}                |
| `colorPicker.open`                      | Open color picker                                               |
| `colorPicker.selectColor`               | Select color {color}                                            |
| `colorPicker.value`                     | Color value                                                     |
| `colorPicker.alpha`                     | Alpha                                                           |
| `colorPicker.presets`                   | Presets                                                         |
| `input.required`                        | required                                                        |
| `input.clear`                           | Clear input                                                     |
| `input.hidePassword`                    | Hide password                                                   |
| `input.showPassword`                    | Show password                                                   |
| `numberInput.decrease`                  | Decrease value                                                  |
| `numberInput.increase`                  | Increase value                                                  |
| `phoneInput.searchCountries`            | Search countries...                                             |
| `phoneInput.placeholder`                | Enter phone number                                              |
| `phoneInput.label`                      | Phone number                                                    |
| `phoneInput.selectCountry`              | Select country                                                  |
| `rating.star`                           | {n} star                                                        |
| `select.placeholder`                    | Select an option                                                |
| `select.searchPlaceholder`              | Search...                                                       |
| `select.clear`                          | Clear selection                                                 |
| `tagInput.placeholder`                  | Add a tag...                                                    |
| `tagInput.label`                        | Tag input                                                       |
| `textarea.invalid`                      | Invalid input                                                   |
| `datePicker.label`                      | Date picker                                                     |
| `datePicker.previousMonth`              | Previous month                                                  |
| `datePicker.nextMonth`                  | Next month                                                      |
| `dateRangePicker.label`                 | Date range picker                                               |
| `dateRangePicker.today`                 | Today                                                           |
| `dateRangePicker.last7Days`             | Last 7 Days                                                     |
| `dateRangePicker.last30Days`            | Last 30 Days                                                    |
| `dateRangePicker.thisMonth`             | This Month                                                      |
| `dateRangePicker.lastMonth`             | Last Month                                                      |
| `listSelectFilter.loading`              | Loading...                                                      |
| `listSelectFilter.noOptions`            | No options found                                                |
| `kanbanColumn.empty`                    | Drop items here                                                 |
| `filterAccordion.general`               | General                                                         |
| `mutation.error`                        | Something went wrong. Please try again.                         |
| `lastUpdated.text`                      | Updated {time}                                                  |
| `lastUpdated.justNow`                   | Updated just now                                                |
| `lastUpdated.refresh`                   | Refresh                                                         |
| `debug.open`                            | Open debug panel                                                |
| `debug.close`                           | Close                                                           |
| `debug.title`                           | Debug panel                                                     |
| `debug.queries`                         | Queries                                                         |
| `debug.store`                           | Page store                                                      |
| `debug.params`                          | URL params                                                      |
| `debug.log`                             | Log                                                             |
| `debug.empty`                           | Nothing to show                                                 |
| `debug.pending`                         | Pending                                                         |
| `debug.error`                           | Error                                                           |
| `debug.success`                         | Success                                                         |
| `debug.fetching`                        | Fetching                                                        |
| `debug.updated`                         | Updated {time}                                                  |
| `debug.truncated`                       | Truncated at 20 kB                                              |
| `debug.noStore`                         | This page has no store                                          |
| `debug.param`                           | Param                                                           |
| `debug.value`                           | Value                                                           |
| `field.yes`                             | Yes                                                             |
| `field.no`                              | No                                                              |
| `field.empty`                           | Not set                                                         |
| `field.copy`                            | Copy                                                            |
