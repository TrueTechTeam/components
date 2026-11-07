import React, { type ReactNode } from 'react';
import { Card } from '../../../lib/components/display/Card';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { useFormatters } from '../../AppProvider/hooks';
import { Loadable } from '../../page/Loadable';
import type { QueryLike } from '../../page/PageContext';
import { Section } from '../../page/Section';
import { FieldValue, type FieldKind } from '../fields';
import styles from './DashboardPage.module.scss';

export interface KpiDelta {
  /** Magnitude of the change in percent; the sign comes from `direction`. */
  value: number;
  direction: 'up' | 'down';
  /** Whether this change is good news. Independent of `direction` (churn going down is good). */
  good?: boolean;
}

export interface KpiWidgetProps {
  label: string;
  query?: QueryLike;
  /** Called once the data has loaded. With `kind`, a primitive result is formatted by `FieldValue`. */
  value: () => ReactNode;
  delta?: () => KpiDelta;
  kind?: FieldKind;
  hint?: string;
}

function Delta({ delta }: { delta: KpiDelta }) {
  const t = useLabels();
  const { number } = useFormatters();
  const tone = delta.good === undefined ? 'neutral' : delta.good ? 'success' : 'danger';
  const magnitude = number(Math.abs(delta.value), { maximumFractionDigits: 1 });
  return (
    <span className={styles.delta} data-tone={tone} data-direction={delta.direction}>
      <span aria-hidden="true">{delta.direction === 'up' ? '▲' : '▼'}</span>{' '}
      <span className={styles.visuallyHidden}>
        {t(delta.direction === 'up' ? 'dashboard.deltaUp' : 'dashboard.deltaDown')}{' '}
      </span>
      {magnitude}%
    </span>
  );
}

function renderValue(raw: ReactNode, kind?: FieldKind): ReactNode {
  const primitive =
    raw === null || raw === undefined || ['string', 'number', 'boolean'].includes(typeof raw);
  return kind && primitive ? <FieldValue kind={kind} value={raw} /> : raw;
}

/**
 * A KPI tile: label, large value, optional change indicator and hint. The label and hint render
 * immediately; only the value and delta skeletonize while loading.
 */
export function KpiWidget({ label, query, value, delta, kind, hint }: KpiWidgetProps) {
  return (
    <Section queries={query ? [query] : undefined}>
      <Card padding="md" className={styles.kpi}>
        <p className={styles.kpiLabel}>{label}</p>
        <div className={styles.kpiValue}>
          <Loadable shape="heading" width="60%">
            {() => renderValue(value(), kind)}
          </Loadable>
        </div>
        {(delta || hint) && (
          <div className={styles.kpiFoot}>
            {delta && (
              <Loadable shape="text" width="4rem">
                {() => <Delta delta={delta()} />}
              </Loadable>
            )}
            {hint && <span className={styles.muted}>{hint}</span>}
          </div>
        )}
      </Card>
    </Section>
  );
}
