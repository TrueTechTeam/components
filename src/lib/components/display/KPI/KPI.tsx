import React, { forwardRef } from 'react';
import styles from './KPI.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Props for the KPI component
 */
export interface KPIProps extends BaseComponentProps {
  /**
   * Visual variant of the component
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  /**
   * Size of the component
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Title of the KPI
   */
  title: string;

  /**
   * The main metric value
   */
  value: string | number;

  /**
   * Optional subtitle or category
   */
  subtitle?: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Optional change indicator (e.g., "+12%", "-5%")
   */
  change?: string;

  /**
   * Direction of change
   */
  changeType?: 'increase' | 'decrease' | 'neutral';

  /**
   * Optional icon component
   */
  icon?: React.ReactNode;

  /**
   * Optional trend data or chart
   */
  trend?: React.ReactNode;

  /**
   * Optional footer content
   */
  footer?: React.ReactNode;
}

/**
 * KPI - Key Performance Indicator card for displaying important metrics with context
 *
 * @example
 * ```tsx
 * <KPI title="Total Revenue" value="$54,239" />
 * ```
 *
 * @example
 * ```tsx
 * <KPI
 *   title="Active Users"
 *   value="1,428"
 *   change="+12%"
 *   changeType="increase"
 *   description="Monthly active users"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <KPI
 *   title="Conversion Rate"
 *   value="3.24%"
 *   subtitle="E-commerce"
 *   variant="success"
 *   trend={<TrendChart data={data} />}
 * />
 * ```
 */
export const KPI = forwardRef<HTMLDivElement, KPIProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      title,
      value,
      subtitle,
      description,
      change,
      changeType = 'neutral',
      icon,
      trend,
      footer,
      className,
      children,
      ...restProps
    },
    ref
  ) => {
    // Merge className with component styles
    const componentClasses = [styles.kpi, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="kpi"
        data-variant={variant}
        data-size={size}
        {...restProps}
      >
        <div className={styles.kpiHeader}>
          <div className={styles.kpiHeaderContent}>
            {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}
            <h3 className={styles.kpiTitle}>{title}</h3>
          </div>
          {icon && <div className={styles.kpiIcon}>{icon}</div>}
        </div>

        <div className={styles.kpiBody}>
          <div className={styles.kpiValueWrapper}>
            <div className={styles.kpiValue}>{value}</div>
            {change && (
              <span className={styles.kpiChange} data-change-type={changeType}>
                {change}
              </span>
            )}
          </div>
          {description && <p className={styles.kpiDescription}>{description}</p>}
        </div>

        {trend && <div className={styles.kpiTrend}>{trend}</div>}

        {(footer || children) && (
          <div className={styles.kpiFooter}>{footer || children}</div>
        )}
      </div>
    );
  }
);

KPI.displayName = 'KPI';

export default KPI;
