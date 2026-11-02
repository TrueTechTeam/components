import React, { useMemo } from 'react';
import { Badge } from '../../../lib/components/display/Badge';
import { Button } from '../../../lib/components/buttons/Button';
import type {
  ThemeColorOverrides,
  ThemeColorTokens,
  ThemeMode,
} from '../../../lib/types/theme.types';
import type { BuilderAction } from '../builderState';
import { auditContrast, type ContrastCheck } from '../contrast';
import styles from './Editor.module.scss';

type TokenKey = keyof ThemeColorTokens;

/**
 * A replacement for `fg` that passes every pair it is the foreground of, and keeps passing every
 * pair it is the background of that passed before (so fixing `primary` cannot break
 * `textOnPrimary` on `primary`).
 */
export function fixForeground(colors: ThemeColorOverrides, fg: TokenKey): string | null {
  const start = colors[fg];
  if (!start) {
    return null;
  }
  const keptPassing = new Set(
    auditContrast(colors)
      .filter((c) => c.bg === fg && c.pass)
      .map((c) => c.fg)
  );
  const acceptable = (candidate: string) =>
    auditContrast({ ...colors, [fg]: candidate }).every(
      (c) => (c.fg !== fg || c.pass) && (c.bg !== fg || c.pass || !keptPassing.has(c.fg))
    );

  let current: string = start;
  for (let i = 0; i < 8; i++) {
    if (acceptable(current)) {
      return current;
    }
    const failing: ContrastCheck[] = auditContrast({ ...colors, [fg]: current }).filter(
      (c) => c.fg === fg && !c.pass
    );
    const next: string | undefined = failing[0]?.suggestion;
    if (!next || next === current) {
      break;
    }
    current = next;
  }
  return ['#ffffff', '#000000'].find(acceptable) ?? null;
}

export interface ContrastReportProps {
  colors: ThemeColorOverrides;
  mode: ThemeMode;
  dispatch: React.Dispatch<BuilderAction>;
}

export function ContrastReport({ colors, mode, dispatch }: ContrastReportProps) {
  const { checks, fixes } = useMemo(() => {
    const all = auditContrast(colors);
    const byFg = new Map<TokenKey, string | null>();
    for (const check of all) {
      if (!check.pass && !byFg.has(check.fg)) {
        byFg.set(check.fg, fixForeground(colors, check.fg));
      }
    }
    return { checks: all, fixes: byFg };
  }, [colors]);
  const failCount = checks.filter((c) => !c.pass).length;

  return (
    <section className={styles.panel} aria-label="Contrast report">
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Contrast ({mode})</h3>
        {failCount === 0 ? (
          <Badge variant="success">All pairs pass AA</Badge>
        ) : (
          <Badge variant="danger">
            {failCount} {failCount === 1 ? 'pair fails' : 'pairs fail'}
          </Badge>
        )}
      </div>
      <ul className={styles.failList}>
        {checks.map((check) => {
          const fix = check.pass ? null : fixes.get(check.fg);
          return (
            <li key={`${check.fg}-${check.bg}`} className={styles.failRow}>
              <span>
                {check.fg} on {check.bg}: {check.ratio.toFixed(1)}:1 (needs {check.min}:1)
              </span>
              <Badge variant={check.pass ? 'success' : 'danger'} size="sm">
                {check.pass ? 'AA' : 'Fail'}
              </Badge>
              {fix && (
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Apply fix for ${check.fg} on ${check.bg}`}
                  onClick={() => dispatch({ type: 'setOverride', mode, key: check.fg, value: fix })}
                >
                  Apply fix
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
