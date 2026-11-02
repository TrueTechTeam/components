/**
 * English defaults for every piece of built-in text in the library.
 * Flat `component.key` → English string. `{name}` placeholders are interpolated.
 * Export these so apps can build translation files.
 */
export const DEFAULT_LABELS = {
  'common.close': 'Close',
  'common.loading': 'Loading…',
  'unsavedChanges.confirm': 'You have unsaved changes. Leave anyway?',
} as const satisfies Record<string, string>;

export type LabelKey = keyof typeof DEFAULT_LABELS;
