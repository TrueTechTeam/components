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

export type KeyFactsProps<T> = BlockSectionProps & {
  /** Three to six facts read best. */
  fields: Array<FieldDef<T>>;
  data?: T;
};

/** A wrapping strip of the record's headline facts. */
export function KeyFacts<T>({ fields, data, query, ...section }: KeyFactsProps<T>) {
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
      <dl className={styles.facts}>
        {fields.map((field) => (
          <div key={field.key} className={styles.fact}>
            <dt className={styles.label}>{field.label}</dt>
            <dd className={styles.factValue}>
              <Loadable shape="box" width="6rem" height="1.75rem">
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
