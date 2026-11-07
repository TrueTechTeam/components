import React from 'react';
import { DataTable } from '../../../lib/components/patterns/DataTable';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { Loadable } from '../../page/Loadable';
import { AppLink } from '../../router/AppLink';
import { FieldValue, fieldAlign } from '../fields';
import {
  BlockSection,
  fieldOptionsOf,
  fieldValueOf,
  type BlockSectionProps,
  type FieldDef,
} from './BlockSection';
import styles from './blocks.module.scss';

export type RelatedRecordsProps<T> = BlockSectionProps & {
  rows?: T[];
  columns: Array<FieldDef<T>>;
  /** Makes the first column a link to the record. */
  rowHref?: (row: T) => string;
  /** Total related records, when `rows` is only the first page. @default rows.length */
  total?: number;
  /** Where "View all" goes; shown when there are more records than the rows displayed. */
  viewAllHref?: string;
};

const MAX_ROWS = 5;

/** A compact table of up to five related records, with a "View all (N)" link. */
export function RelatedRecords<T>({
  rows: rowsProp,
  columns,
  rowHref,
  total,
  viewAllHref,
  query,
  ...section
}: RelatedRecordsProps<T>) {
  const t = useLabels();
  const rows = rowsProp ?? (query?.data as T[] | undefined) ?? [];
  const shown = rows.slice(0, MAX_ROWS);
  const count = total ?? rows.length;

  const tableColumns = columns.map((field, index) => ({
    key: field.key,
    header: field.label,
    align: fieldAlign(field.kind) === 'end' ? ('right' as const) : ('left' as const),
    render: (_value: unknown, row: unknown) => {
      const value = (
        <FieldValue
          kind={field.kind}
          value={fieldValueOf(row as T, field)}
          {...fieldOptionsOf(field)}
        />
      );
      return index === 0 && rowHref ? <AppLink href={rowHref(row as T)}>{value}</AppLink> : value;
    },
  }));

  return (
    <BlockSection {...section} query={query} emptyWhen={() => rows.length === 0}>
      <Loadable shape="table" rows={3} columns={columns.length}>
        {() => (
          <div className={styles.related}>
            <DataTable<Record<string, unknown>>
              data={shown as Array<Record<string, unknown>>}
              columns={tableColumns}
              rowKey={(row, i) => String(row.id ?? i)}
              size="sm"
              aria-label={section.title ?? t('blocks.relatedRecords')}
            />
            {viewAllHref && count > shown.length && (
              <AppLink href={viewAllHref}>{t('blocks.viewAll', { count })}</AppLink>
            )}
          </div>
        )}
      </Loadable>
    </BlockSection>
  );
}
