import type { LabelKey } from '../../lib/contexts/LabelsContext';

/** Updates newer than this read "just now" instead of "0 seconds ago" / "in 2 seconds". */
export const JUST_NOW_MS = 45_000;

type Translate = (key: string, vars?: Record<string, string | number>) => string;

/**
 * "Updated just now" for updates under 45 s old (and for timestamps in the future, clock skew),
 * otherwise `label` with the relative time.
 */
export function updatedText(
  t: Translate,
  relativeTime: (value: number) => string,
  updatedAt: number,
  label: LabelKey,
  now = Date.now()
): string {
  return now - updatedAt < JUST_NOW_MS
    ? t('lastUpdated.justNow')
    : t(label, { time: relativeTime(updatedAt) });
}
