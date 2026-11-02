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

| Key                      | English default                         |
| ------------------------ | --------------------------------------- |
| `common.close`           | Close                                   |
| `common.loading`         | Loading…                                |
| `unsavedChanges.confirm` | You have unsaved changes. Leave anyway? |
