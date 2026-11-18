import React from 'react';
import { Loadable } from '../../page/Loadable';
import { FieldValue, isEmptyFieldValue } from '../fields';
import {
  BlockSection,
  fieldOptionsOf,
  fieldValueOf,
  type BlockSectionProps,
  type FieldDef,
} from './BlockSection';
import styles from './blocks.module.scss';

export type PropertyListProps<T> = BlockSectionProps & {
  fields: Array<FieldDef<T>>;
  data?: T;
  /** @default 1 */
  columns?: 1 | 2;
};

/** Label/value pairs of one record as a `<dl>`. Labels render while loading; values skeletonize. */
export function PropertyList<T>({
  fields,
  data,
  columns = 1,
  query,
  ...section
}: PropertyListProps<T>) {
  const record = (data ?? query?.data) as T | undefined;
  return (
    <BlockSection
      {...section}
      query={query}
      emptyWhen={() =>
        record === undefined ||
        record === null ||
        fields.every((field) => isEmptyFieldValue(field.kind, fieldValueOf(record, field)))
      }
    >
      <dl className={styles.properties} data-columns={columns}>
        {fields.map((field) => (
          <div
            key={field.key}
            className={styles.property}
            data-span={columns === 2 ? field.span : undefined}
          >
            <dt className={styles.label}>{field.label}</dt>
            <dd className={styles.value}>
              <Loadable shape="text">
                {() => (
                  <FieldValue
                    kind={field.kind}
                    value={record === undefined ? undefined : fieldValueOf(record, field)}
                    {...fieldOptionsOf(field)}
                  />
                )}
              </Loadable>
            </dd>
          </div>
        ))}
      </dl>
    </BlockSection>
  );
}
