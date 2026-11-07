import React from 'react';
import { Loadable } from '../../page/Loadable';
import { DashboardWidget, type DashboardWidgetProps } from './DashboardWidget';
import styles from './DashboardPage.module.scss';

export interface ChartWidgetProps extends DashboardWidgetProps {
  /** Chart area height in px. @default 240 */
  height?: number;
  /** Text alternative describing what the chart shows (its trend and key values). Required. */
  summary: string;
}

/**
 * A `DashboardWidget` holding any chart element. The chart itself is hidden from assistive
 * technology; `summary` is its text alternative (a visually hidden `figcaption`).
 */
export function ChartWidget({ height = 240, summary, children, ...widget }: ChartWidgetProps) {
  return (
    <DashboardWidget {...widget}>
      <Loadable shape="box" height={height}>
        <figure className={styles.figure}>
          <div className={styles.chart} style={{ height }} aria-hidden="true">
            {children}
          </div>
          <figcaption className={styles.visuallyHidden}>{summary}</figcaption>
        </figure>
      </Loadable>
    </DashboardWidget>
  );
}
