import React from 'react';
import { Card } from '../../../lib/components/display/Card';
import { AdaptiveGrid } from '../../../lib/components/layout/AdaptiveGrid';
import { useFormatters } from '../../AppProvider';
import { Loadable } from '../../page/Loadable';
import { BlockSection, usePending, type BlockSectionProps } from './BlockSection';
import { safeHref, safeImageSrc } from './safeUrl';
import styles from './blocks.module.scss';

export interface MediaItem {
  id: string;
  src: string;
  /** Required: describes the image for screen readers. */
  alt: string;
  name?: string;
  /** Bytes. */
  size?: number;
  /** Where the thumbnail links (the full file). */
  href?: string;
}

export type MediaGalleryProps = BlockSectionProps & { items?: MediaItem[] };

const PLACEHOLDERS = [0, 1, 2, 3];

function Gallery({ items }: { items: MediaItem[] }) {
  const pending = usePending();
  const { fileSize } = useFormatters();
  return (
    <AdaptiveGrid minItemWidth={160} gap={16}>
      {pending
        ? PLACEHOLDERS.map((i) => (
            <Loadable key={i} shape="box" height="10rem">
              {null}
            </Loadable>
          ))
        : items.map((item) => {
            const src = safeImageSrc(item.src);
            const href = item.href === undefined ? undefined : safeHref(item.href);
            const img = src && (
              <img className={styles.thumb} src={src} alt={item.alt} loading="lazy" />
            );
            return (
              <Card key={item.id} padding="sm">
                {href ? (
                  <a className={styles.thumbLink} href={href}>
                    {img}
                  </a>
                ) : (
                  img
                )}
                {(item.name || item.size !== undefined) && (
                  <div className={styles.caption}>
                    {item.name && <span className={styles.captionName}>{item.name}</span>}
                    {item.size !== undefined && (
                      <span className={styles.muted}>{fileSize(item.size)}</span>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
    </AdaptiveGrid>
  );
}

/** Grid of image thumbnails with file name and size. */
export function MediaGallery({ items: itemsProp, query, ...section }: MediaGalleryProps) {
  const items = itemsProp ?? (query?.data as MediaItem[] | undefined) ?? [];
  return (
    <BlockSection {...section} query={query} emptyWhen={() => items.length === 0}>
      <Gallery items={items} />
    </BlockSection>
  );
}
