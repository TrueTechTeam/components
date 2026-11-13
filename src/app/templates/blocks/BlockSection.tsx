import React, { useContext, type ReactNode } from 'react';
import { PageMessages } from '../../../lib/components/display/PageMessages';
import { LoadingContext } from '../../page/LoadingContext';
import { Section, type SectionProps } from '../../page/Section';
import type { QueryLike } from '../../page/PageContext';
import type { FieldKind, FieldOptions } from '../fields';

/** Props every detail block takes: the Section props, plus the query that feeds it. */
export type BlockSectionProps = Omit<SectionProps, 'children' | 'queries'> & {
  /** Drives the block's loading, error and empty states. `data` / `items` / `rows` win over it. */
  query?: QueryLike;
};

export interface FieldDef<T> extends FieldOptions {
  key: keyof T & string;
  label: string;
  kind: FieldKind;
  /** Reads the value when it is not simply `row[key]`. */
  get?: (row: T) => unknown;
  /** `PropertyList`: 2 spans both columns. @default 1 */
  span?: 1 | 2;
}

/** The raw value of `field` in `row`. */
export function fieldValueOf<T>(row: T, field: FieldDef<T>): unknown {
  return field.get ? field.get(row) : (row as Record<string, unknown>)[field.key];
}

/** The `FieldValue` options of a field (everything but the definition's own props). */
export function fieldOptionsOf<T>(field: FieldDef<T>): FieldOptions {
  const { key: _key, label: _label, kind: _kind, get: _get, span: _span, ...options } = field;
  return options;
}

type EmptyConfig = SectionProps['empty'];

function messageLevel(title: string | undefined, headingLevel: number) {
  return title ? (Math.min(headingLevel + 1, 6) as 3 | 4 | 5) : (headingLevel as 2 | 3 | 4);
}

/**
 * Shows the empty state in place of `children` once loaded. For blocks without a `query`, whose
 * Section has no `isEmpty` data to evaluate, and for `Notes`, which keeps its form beside it.
 */
export function EmptyOr({
  show,
  empty,
  title,
  headingLevel = 2,
  children,
}: {
  show: boolean;
  empty?: EmptyConfig;
  title?: string;
  headingLevel?: number;
  children: ReactNode;
}) {
  const { pending } = useContext(LoadingContext);
  if (show && !pending) {
    return (
      <PageMessages
        empty
        emptyConfig={empty}
        size="sm"
        headingLevel={messageLevel(title, headingLevel)}
      />
    );
  }
  return children;
}

/** True while the nearest Page or Section that owns queries is pending. */
export function usePending(): boolean {
  return useContext(LoadingContext).pending;
}

/** A `Section` for a block: follows `query`, and shows the empty state when `emptyWhen`. */
export function BlockSection({
  query,
  emptyWhen,
  children,
  ...section
}: Omit<BlockSectionProps, 'query'> & {
  query?: QueryLike;
  /** True when there is nothing to show. Evaluated once loaded. */
  emptyWhen?: () => boolean;
  children: ReactNode;
}) {
  const inline = query === undefined && emptyWhen !== undefined;
  return (
    <Section
      {...section}
      queries={query ? [query] : undefined}
      isEmpty={query && emptyWhen ? () => emptyWhen() : section.isEmpty}
    >
      {inline ? (
        <EmptyOr
          show={emptyWhen()}
          empty={section.empty}
          title={section.title}
          headingLevel={section.headingLevel}
        >
          {children}
        </EmptyOr>
      ) : (
        children
      )}
    </Section>
  );
}
