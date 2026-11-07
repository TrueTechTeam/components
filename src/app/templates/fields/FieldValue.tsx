import React from 'react';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { Badge } from '../../../lib/components/display/Badge';
import { Tag } from '../../../lib/components/display/Tag';
import { IconButton } from '../../../lib/components/buttons/IconButton';
import { useClipboard } from '../../../lib/hooks/useClipboard';
import { useFormatters } from '../../AppProvider';
import { linkClassName } from '../../router/linkClassName';
import { safeHttpUrl, safeImageSrc } from '../shared/safeUrl';
import styles from './FieldValue.module.scss';

export type FieldKind =
  | 'text'
  | 'longText'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'relative'
  | 'boolean'
  | 'status'
  | 'email'
  | 'url'
  | 'phone'
  | 'id'
  | 'image'
  | 'fileSize'
  | 'list'
  | 'tags';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface FieldOptions {
  /** Currency code for `currency` (default `'USD'`). */
  currency?: string;
  /** Fraction digits for number, currency, percent and fileSize. */
  fractionDigits?: number;
  /** `status`: value to tone. Unknown values are `'neutral'`. */
  statusTones?: Record<string, StatusTone>;
  /** `status`: value to display text (default: the humanized value). */
  statusLabels?: Record<string, string>;
  /** `date` / `datetime` / `relative` override. */
  dateOptions?: Intl.DateTimeFormatOptions;
  /** `longText`: characters before an ellipsis (the `title` holds the full text). */
  truncate?: number;
  /** `image`: alt text; omitted means decorative (empty alt). */
  imageAlt?: string;
  /** `image`: thumbnail size in px (default 40). */
  imageSize?: number;
}

export interface FieldValueProps extends FieldOptions {
  kind: FieldKind;
  value: unknown;
  className?: string;
}

const END_ALIGNED: ReadonlySet<FieldKind> = new Set(['number', 'currency', 'percent', 'fileSize']);

/** Numeric kinds are end-aligned in tables so digits line up; everything else starts. */
export function fieldAlign(kind: FieldKind): 'start' | 'end' {
  return END_ALIGNED.has(kind) ? 'end' : 'start';
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toDate(value: unknown): Date | null {
  if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) {
    return null;
  }
  if (value === '') {
    return null;
  }
  // A date-only string is a calendar day, not an instant: parse it as local midnight so it never
  // shifts to the previous day west of UTC.
  const dateOnly = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  const d = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

function toText(value: unknown): string | null {
  if (typeof value === 'string') {
    return value.trim() === '' ? null : value;
  }
  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }
  return null;
}

function toStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((v) => (v === null || v === undefined ? '' : String(v))).filter((v) => v !== '')
    : [];
}

/** True when the value has nothing displayable for the kind (rendered as an em dash). */
export function isEmptyFieldValue(kind: FieldKind, value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  switch (kind) {
    case 'number':
    case 'currency':
    case 'percent':
    case 'fileSize':
      return toNumber(value) === null;
    case 'date':
    case 'datetime':
    case 'relative':
      return toDate(value) === null;
    case 'boolean':
      return typeof value !== 'boolean';
    case 'url':
      return safeHttpUrl(value) === null;
    case 'image':
      return safeImageSrc(value) === undefined;
    case 'phone':
      return !/\d/.test(toText(value) ?? '');
    case 'list':
    case 'tags':
      return toStringList(value).length === 0;
    default:
      return toText(value) === null;
  }
}

function humanize(value: string): string {
  const spaced = value.replace(/[_-]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function CopyId({ id, className }: { id: string; className?: string }) {
  const t = useLabels();
  const { copy, copied } = useClipboard();
  return (
    <span className={[styles.id, className].filter(Boolean).join(' ')}>
      <span className={styles.mono}>{id}</span>
      <IconButton
        icon={copied ? 'check' : 'copy'}
        variant="ghost"
        size="xs"
        aria-label={t('field.copy')}
        onClick={() => void copy(id)}
        type="button"
      />
    </span>
  );
}

/**
 * Renders a schema field value consistently by kind: locale-aware numbers, dates and lists,
 * toned status badges, safe links, copyable ids and thumbnails. Empty or invalid values render
 * an em dash with a visually hidden "Not set".
 */
export function FieldValue({
  kind,
  value,
  className,
  currency = 'USD',
  fractionDigits,
  statusTones,
  statusLabels,
  dateOptions,
  truncate,
  imageAlt,
  imageSize = 40,
}: FieldValueProps) {
  const t = useLabels();
  const fmt = useFormatters();

  if (isEmptyFieldValue(kind, value)) {
    return (
      <span className={[styles.empty, className].filter(Boolean).join(' ')}>
        <span aria-hidden="true">&mdash;</span>
        <span className={styles.hidden}>{t('field.empty')}</span>
      </span>
    );
  }

  const numeric = [styles.numeric, className].filter(Boolean).join(' ');
  const digits =
    fractionDigits === undefined
      ? undefined
      : { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits };

  switch (kind) {
    case 'number':
      return <span className={numeric}>{fmt.number(toNumber(value) as number, digits)}</span>;
    case 'currency':
      return (
        <span className={numeric}>{fmt.currency(toNumber(value) as number, currency, digits)}</span>
      );
    case 'percent':
      return (
        <span className={numeric}>
          {fmt.percent(toNumber(value) as number, { fractionDigits })}
        </span>
      );
    case 'fileSize':
      return (
        <span className={numeric}>
          {fmt.fileSize(toNumber(value) as number, { fractionDigits })}
        </span>
      );
    case 'date':
      return (
        <span className={className}>
          {fmt.dateTime(toDate(value) as Date, dateOptions ?? { dateStyle: 'medium' })}
        </span>
      );
    case 'datetime':
      return (
        <span className={className}>
          {fmt.dateTime(
            toDate(value) as Date,
            dateOptions ?? { dateStyle: 'medium', timeStyle: 'short' }
          )}
        </span>
      );
    case 'relative': {
      const d = toDate(value) as Date;
      return (
        <time
          className={className}
          dateTime={d.toISOString()}
          title={fmt.dateTime(d, dateOptions ?? { dateStyle: 'medium', timeStyle: 'short' })}
        >
          {fmt.relativeTime(d)}
        </time>
      );
    }
    case 'boolean':
      return <span className={className}>{value === true ? t('field.yes') : t('field.no')}</span>;
    case 'status': {
      const raw = String(value);
      return (
        <Badge variant={statusTones?.[raw] ?? 'neutral'} size="sm" className={className}>
          {statusLabels?.[raw] ?? humanize(raw)}
        </Badge>
      );
    }
    case 'email': {
      const email = String(value).trim();
      return (
        <a className={linkClassName(className)} href={`mailto:${email}`}>
          {email}
        </a>
      );
    }
    case 'phone': {
      const phone = String(value).trim();
      return (
        <a className={linkClassName(className)} href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
          {phone}
        </a>
      );
    }
    case 'url': {
      const url = safeHttpUrl(value) as URL;
      return (
        <a
          className={linkClassName(className)}
          href={url.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.host.replace(/^www\./, '')}
        </a>
      );
    }
    case 'id':
      return <CopyId id={String(value)} className={className} />;
    case 'image':
      return (
        <img
          className={[styles.image, className].filter(Boolean).join(' ')}
          src={safeImageSrc(value) as string}
          alt={imageAlt ?? ''}
          width={imageSize}
          height={imageSize}
          loading="lazy"
        />
      );
    case 'list':
      return <span className={className}>{fmt.list(toStringList(value))}</span>;
    case 'tags':
      return (
        <span className={[styles.tags, className].filter(Boolean).join(' ')}>
          {toStringList(value).map((tag, i) => (
            <Tag key={`${tag}-${i}`} size="sm" variant="secondary">
              {tag}
            </Tag>
          ))}
        </span>
      );
    case 'longText': {
      const text = String(value);
      const cut = truncate !== undefined && text.length > truncate;
      return (
        <span
          className={[styles.longText, className].filter(Boolean).join(' ')}
          title={cut ? text : undefined}
        >
          {cut ? `${text.slice(0, truncate)}…` : text}
        </span>
      );
    }
    default:
      return <span className={className}>{String(value)}</span>;
  }
}
