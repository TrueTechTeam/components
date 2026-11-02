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
 * A replacement for `fg` that passes every pair it takes part in (not just the one that was
 * clicked), so one fix never trades a pass on one background for a fail on another.
 */
export function fixForeground(colors: ThemeColorOverrides, fg: TokenKey): string | null {
  let current: string | undefined = colors[fg];
  if (!current) {
    return null;
  }
  for (let i = 0; i < 8; i++) {
    const failing: ContrastCheck[] = auditContrast({ ...colors, [fg]: current }).filter(
      (c) => c.fg === fg && !c.pass
    );
    if (failing.length === 0) {
      return current;
    }
    const next: string | undefined = failing[0].suggestion;
    if (!next || next === current) {
      break;
    }
    current = next;
  }
  for (const extreme of ['#ffffff', '#000000']) {
    if (auditContrast({ ...colors, [fg]: extreme }).every((c) => c.fg !== fg || c.pass)) {
      return extreme;
    }
  }
  return null;
}

export interface ContrastReportProps {
  colors: ThemeColorOverrides;
  mode: ThemeMode;
  dispatch: React.Dispatch<BuilderAction>;
}

export function ContrastReport({ colors, mode, dispatch }: ContrastReportProps) {
  const failing = useMemo(() => auditContrast(colors).filter((c) => !c.pass), [colors]);

  return (
    <section className={styles.panel} aria-label="Contrast report">
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Contrast ({mode})</h3>
        {failing.length === 0 ? (
          <Badge variant="success">All pairs pass AA</Badge>
        ) : (
          <Badge variant="danger">
            {failing.length} {failing.length === 1 ? 'pair fails' : 'pairs fail'}
          </Badge>
        )}
      </div>
      {failing.length > 0 && (
        <ul className={styles.failList}>
          {failing.map((check) => {
            const fix = fixForeground(colors, check.fg);
            return (
              <li key={`${check.fg}-${check.bg}`} className={styles.failRow}>
                <span>
                  {check.fg} on {check.bg}: {check.ratio.toFixed(1)}:1 (needs {check.min}:1)
                </span>
                {fix && (
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label={`Apply fix for ${check.fg} on ${check.bg}`}
                    onClick={() =>
                      dispatch({ type: 'setOverride', mode, key: check.fg, value: fix })
                    }
                  >
                    Apply fix
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
