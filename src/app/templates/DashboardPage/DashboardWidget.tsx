import React, { useId, type ReactNode } from 'react';
import { Card } from '../../../lib/components/display/Card';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { LastUpdated } from '../../data/LastUpdated';
import { useFormatters } from '../../AppProvider/hooks';
import type { QueryLike } from '../../page/PageContext';
import { Section, type SectionProps } from '../../page/Section';
import styles from './DashboardPage.module.scss';

export interface DashboardWidgetProps extends Omit<SectionProps, 'queries'> {
  title: string;
  /** Drives the widget's own loading, error, empty and refresh states. */
  query?: QueryLike;
  /** Static "As of" time for the header when there is no `query`. */
  asOf?: Date | number;
  /** Header control, e.g. a link or menu. */
  action?: ReactNode;
  /** `lg` gives the widget more room. @default 'md' */
  size?: 'md' | 'lg';
  children: ReactNode;
}

/**
 * A dashboard card: heading, last-updated (or "As of") and an optional action, over a `Section`
 * that owns the widget's loading, error, empty and refresh states, so one failing widget never
 * blanks the others. Read data through `Loadable` function children.
 */
export function DashboardWidget({
  title,
  query,
  asOf,
  action,
  size = 'md',
  headingLevel = 2,
  id,
  children,
  ...stateProps
}: DashboardWidgetProps) {
  const t = useLabels();
  const { dateTime } = useFormatters();
  const generatedId = useId();
  const headingId = `${id ?? generatedId}-title`;
  const Heading = `h${headingLevel}` as const;
  // The Section has no title of its own, so its state messages nest under this heading.
  const stateLevel = Math.min(headingLevel + 1, 4) as 3 | 4;
  return (
    <Card
      padding="md"
      className={[styles.widget, size === 'lg' && styles.widgetLg].filter(Boolean).join(' ')}
    >
      <div className={styles.widgetHeader}>
        <Heading id={headingId} className={styles.widgetTitle}>
          {title}
        </Heading>
        <div className={styles.widgetMeta}>
          {query ? (
            <LastUpdated query={query} />
          ) : (
            asOf !== undefined && (
              <span className={styles.muted}>{t('dashboard.asOf', { time: dateTime(asOf) })}</span>
            )
          )}
          {action}
        </div>
      </div>
      <Section
        {...stateProps}
        id={id}
        headingLevel={stateLevel}
        queries={query ? [query] : undefined}
      >
        {children}
      </Section>
    </Card>
  );
}
