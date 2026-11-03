import React, { useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '../../lib/components/buttons/Button';
import { Accordion } from '../../lib/components/display/Accordion';
import { Badge } from '../../lib/components/display/Badge';
import { useLabels } from '../../lib/contexts/LabelsContext';
import { useFormatters, useLogBuffer } from '../AppProvider/hooks';
import type { LogLevel } from '../AppProvider/logger';
import { PageStoreContext, usePage } from '../page/PageContext';
import { useRouterAdapter } from '../router/RouterContext';
import styles from './DebugPanel.module.scss';

const MAX_STORE_CHARS = 20 * 1024;
const MAX_LOG_LINES = 50;

const LEVEL_VARIANT = {
  debug: 'neutral',
  info: 'info',
  warn: 'warning',
  error: 'danger',
} as const satisfies Record<LogLevel, string>;

function stringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2) ?? 'undefined';
  } catch {
    return String(value);
  }
}

function formatArg(arg: unknown): string {
  if (typeof arg === 'string') {
    return arg;
  }
  if (arg instanceof Error) {
    return arg.message;
  }
  try {
    return JSON.stringify(arg) ?? String(arg);
  } catch {
    return String(arg);
  }
}

function DebugSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Accordion header={title} defaultOpen size="sm" className={styles.section}>
      <div className={styles.sectionBody}>{children}</div>
    </Accordion>
  );
}

function QueriesSection() {
  const t = useLabels();
  const { queries } = usePage();
  const { relativeTime } = useFormatters();
  const rows = Object.entries(queries).flatMap(([owner, list]) =>
    list.map((q, i) => ({ key: `${owner}:${i}`, owner, index: i, q }))
  );
  if (rows.length === 0) {
    return <p className={styles.muted}>{t('debug.empty')}</p>;
  }
  return (
    <ul className={styles.list}>
      {rows.map(({ key, owner, index, q }) => {
        const status = q.isPending ? 'pending' : q.isError ? 'error' : 'success';
        const variant =
          status === 'error' ? 'danger' : status === 'pending' ? 'warning' : 'success';
        return (
          <li key={key} className={styles.item}>
            <code>{`${owner} #${index + 1}`}</code>{' '}
            <Badge size="sm" variant={variant}>
              {t(`debug.${status}`)}
            </Badge>
            {q.isFetching && (
              <>
                {' '}
                <Badge size="sm" variant="info">
                  {t('debug.fetching')}
                </Badge>
              </>
            )}
            {q.dataUpdatedAt > 0 && (
              <span className={styles.muted}>
                {' '}
                {t('debug.updated', { time: relativeTime(q.dataUpdatedAt) })}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function StoreSection() {
  const t = useLabels();
  const store = useContext(PageStoreContext);
  if (!store) {
    return <p className={styles.muted}>{t('debug.noStore')}</p>;
  }
  const json = stringify(store[0]);
  const truncated = json.length > MAX_STORE_CHARS;
  return (
    <>
      <pre className={styles.pre}>{truncated ? json.slice(0, MAX_STORE_CHARS) : json}</pre>
      {truncated && <p className={styles.muted}>{t('debug.truncated')}</p>}
    </>
  );
}

function ParamsSection() {
  const t = useLabels();
  const adapter = useRouterAdapter();
  // Same selection as usePageParams: the adapter's reactive hook when it has one.
  const [useParams] = useState(() => adapter.useSearchParams ?? (() => adapter.searchParams));
  const entries = Array.from(useParams().entries());
  if (entries.length === 0) {
    return <p className={styles.muted}>{t('debug.empty')}</p>;
  }
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">{t('debug.param')}</th>
          <th scope="col">{t('debug.value')}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, value], i) => (
          <tr key={`${key}:${i}`}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LogSection() {
  const t = useLabels();
  const buffer = useLogBuffer();
  const lines = buffer.slice(-MAX_LOG_LINES).reverse();
  // Newest first, so the index counts back from the end of the (append-only) buffer.
  if (lines.length === 0) {
    return <p className={styles.muted}>{t('debug.empty')}</p>;
  }
  return (
    <ul className={styles.list}>
      {lines.map((entry, i) => (
        <li key={`${entry.time}:${buffer.length - i}`} className={styles.item}>
          <Badge size="sm" variant={LEVEL_VARIANT[entry.level]}>
            {entry.level}
          </Badge>{' '}
          {entry.scope && <code>{entry.scope}</code>} {entry.args.map(formatArg).join(' ')}
        </li>
      ))}
    </ul>
  );
}

/**
 * Development-only floating panel (mounted by `Page` when `AppProvider` `debug` is on) showing the
 * page's queries, page store, URL params and recent log lines. Toggle with the button or
 * `Ctrl+Shift+D`; Escape closes it.
 */
export function DebugPanel() {
  const t = useLabels();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const wasOpen = useRef(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        ref={toggleRef}
        variant="secondary"
        size="sm"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {t('debug.open')}
      </Button>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={styles.panel}
        >
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {t('debug.title')}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {t('debug.close')}
            </Button>
          </div>
          <DebugSection title={t('debug.queries')}>
            <QueriesSection />
          </DebugSection>
          <DebugSection title={t('debug.store')}>
            <StoreSection />
          </DebugSection>
          <DebugSection title={t('debug.params')}>
            <ParamsSection />
          </DebugSection>
          <DebugSection title={t('debug.log')}>
            <LogSection />
          </DebugSection>
        </div>
      )}
    </>
  );
}
