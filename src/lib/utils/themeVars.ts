import type { ThemeMode, ThemeOverride } from '../types';

/** `surfaceElevated` -> `surface-elevated`, `primary500` -> `primary-500` */
function kebab(key: string): string {
  return key.replace(/([A-Z]|\d+)/g, '-$1').toLowerCase();
}

type Entries = Record<string, string | number | undefined> | undefined;

function addGroup(out: Record<string, string>, prefix: string, group: Entries, kebabKeys = false) {
  if (!group) {
    return;
  }
  for (const [key, value] of Object.entries(group)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    out[`${prefix}${kebabKeys ? kebab(key) : key}`] = String(value);
  }
}

/**
 * Convert a ThemeOverride into a flat map of CSS custom properties for the given mode.
 * Per-mode colors win over shared `colors`.
 */
export function themeOverrideToCssVars(
  override: ThemeOverride | undefined,
  mode: ThemeMode
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!override) {
    return out;
  }

  addGroup(out, '--theme-', override.colors, true);
  addGroup(out, '--theme-', override.modes?.[mode]?.colors, true);

  const { unit, ...spacing } = override.spacing ?? {};
  if (typeof unit === 'number') {
    out['--spacing-unit'] = `${unit}px`;
  }
  addGroup(out, '--spacing-', spacing);

  const typography = override.typography;
  addGroup(out, '--font-family-', typography?.fontFamily);
  addGroup(out, '--font-size-', typography?.fontSize);
  addGroup(out, '--font-weight-', typography?.fontWeight);
  addGroup(out, '--line-height-', typography?.lineHeight);

  addGroup(out, '--radius-', override.borderRadius);
  addGroup(out, '--theme-shadow-', override.shadows);
  return out;
}
