import React, { useState, type ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Card } from '../../lib/components/display/Card';
import { AppProvider, type AppProviderProps } from '../AppProvider';
import styles from './storyHelpers.module.scss';

/** A QueryClient for stories: no retries, so failures show immediately. */
export function createStoryQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 0 } } });
}

/**
 * `AppProvider` for stories. Storybook's `provider` global decorator already supplies
 * `GlobalProvider`, which must stay the outer provider.
 */
export function StoryApp({
  children,
  ...props
}: Omit<AppProviderProps, 'children'> & { children: ReactNode }) {
  const [client] = useState(createStoryQueryClient);
  return (
    <AppProvider queryClient={client} debug={false} {...props}>
      {children}
    </AppProvider>
  );
}

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: 'paid' | 'pending' | 'refunded';
}

export const ORDERS: Order[] = [
  { id: 1001, customer: 'Ada Lovelace', total: 129.5, status: 'paid' },
  { id: 1002, customer: 'Grace Hopper', total: 48, status: 'pending' },
  { id: 1003, customer: 'Alan Turing', total: 312.25, status: 'paid' },
  { id: 1004, customer: 'Katherine Johnson', total: 75, status: 'refunded' },
];

export const ORDER_STATUS_BADGE = {
  paid: 'success',
  pending: 'warning',
  refunded: 'secondary',
} as const;

export interface StoryHeaderProps {
  /** The page heading (`h1`). */
  title: string;
  /** One or two sentences under the title. */
  description?: ReactNode;
  /** Buttons aligned with the title. */
  actions?: ReactNode;
}

/** Page title area: `h1`, short description and grouped actions. */
export function StoryHeader({ title, description, actions }: StoryHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}

export interface StoryFrameProps extends Partial<StoryHeaderProps> {
  /** `page` (default) for dashboards and tables, `form` for form-centric stories. */
  width?: 'page' | 'form';
  children?: ReactNode;
}

/**
 * Centered story column with page padding and a consistent vertical rhythm. With a `title` it
 * renders the header; without one it is only the column (wrap a `Page` that renders its own
 * `StoryHeader`, so error/empty states stay inside the padded column).
 */
export function StoryFrame({
  title,
  description,
  actions,
  width = 'page',
  children,
}: StoryFrameProps) {
  return (
    <div className={styles.frame} data-width={width}>
      {title && <StoryHeader title={title} description={description} actions={actions} />}
      {children}
    </div>
  );
}

export interface DemoPanelProps {
  title?: string;
  description?: ReactNode;
  /** Heading level of the title. @default 2 */
  headingLevel?: 2 | 3;
  children: ReactNode;
}

/** A demo area: a `Card` with an optional titled header. */
export function DemoPanel({ title, description, headingLevel = 2, children }: DemoPanelProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Card
      variant="outlined"
      padding="lg"
      header={
        title ? (
          <div className={styles.panelHeader}>
            <Heading className={styles.panelTitle}>{title}</Heading>
            {description && <p className={styles.panelDescription}>{description}</p>}
          </div>
        ) : undefined
      }
    >
      <div className={styles.panelBody}>{children}</div>
    </Card>
  );
}

/** A row of grouped controls that wraps on narrow screens. */
export function ActionRow({
  justify,
  children,
}: {
  justify?: 'between' | 'center';
  children: ReactNode;
}) {
  return (
    <div className={styles.row} data-justify={justify}>
      {children}
    </div>
  );
}

/** Code or JSON in a token-styled monospace block. */
export function CodeBlock({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <pre className={styles.code} aria-label={label} tabIndex={0}>
      <code>{children}</code>
    </pre>
  );
}

/** Inline `code` inside story text. */
export function Code({ children }: { children: ReactNode }) {
  return <code className={styles.inlineCode}>{children}</code>;
}

/** A short explanatory note (info accent). */
export function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}

/** Secondary, smaller text. */
export function Muted({ children }: { children: ReactNode }) {
  return <span className={styles.muted}>{children}</span>;
}

export const storyStyles = styles;
