import React, { useEffect, useId, useRef, type ReactNode } from 'react';
import { IconButton } from '../../../lib/components/buttons/IconButton';
import { Dialog } from '../../../lib/components/overlays/Dialog';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { AppLink } from '../../router/AppLink';
import styles from './DataTablePage.module.scss';

export interface DetailViewProps {
  /** The selected record id. The detail renders from it, not from a row on the current page. */
  id: string;
  /** `panel`: an inline side column; `dialog`: a modal Dialog. */
  presentation: 'panel' | 'dialog';
  /** Dialog size when `presentation` is `dialog`. */
  dialogSize: 'lg' | 'full';
  title?: ReactNode;
  fullPageHref?: string;
  onClose: () => void;
  children: ReactNode;
}

function FullPageLink({ href }: { href?: string }) {
  const t = useLabels();
  return href ? (
    <AppLink href={href} className={styles.fullPageLink}>
      {t('dataTablePage.openFullPage')}
    </AppLink>
  ) : null;
}

/**
 * The record detail of a `DataTablePage`: an inline side panel (laptop and up) or a Dialog.
 * The panel moves focus to its heading when it opens and closes with Escape.
 */
export function DetailView({
  id,
  presentation,
  dialogSize,
  title,
  fullPageHref,
  onClose,
  children,
}: DetailViewProps) {
  const t = useLabels();
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const heading = title ?? t('dataTablePage.details');

  useEffect(() => {
    if (presentation === 'panel') {
      headingRef.current?.focus();
    }
  }, [id, presentation]);

  if (presentation === 'dialog') {
    return (
      <Dialog isOpen onClose={onClose} title={heading} size={dialogSize}>
        <div className={styles.detailBody}>
          <FullPageLink href={fullPageHref} />
          {children}
        </div>
      </Dialog>
    );
  }

  return (
    <aside
      className={styles.detail}
      aria-labelledby={titleId}
      data-component="data-table-page-detail"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className={styles.detailHeader}>
        <h2 id={titleId} ref={headingRef} tabIndex={-1} className={styles.detailTitle}>
          {heading}
        </h2>
        <IconButton
          icon="close"
          variant="ghost"
          size="sm"
          aria-label={t('dataTablePage.closeDetail')}
          onClick={onClose}
        />
      </div>
      <FullPageLink href={fullPageHref} />
      <div className={styles.detailBody}>{children}</div>
    </aside>
  );
}
