import React, { useMemo, useState, type ReactNode } from 'react';
import { Button } from '../../../lib/components/buttons/Button';
import { Avatar } from '../../../lib/components/display/Avatar';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { useFormatters } from '../../AppProvider';
import { Loadable } from '../../page/Loadable';
import { BlockSection, type BlockSectionProps } from './BlockSection';
import styles from './blocks.module.scss';

export interface ActivityItem {
  id: string;
  at: string | Date;
  actor?: { name: string; avatarUrl?: string };
  text: ReactNode;
  icon?: ReactNode;
}

export type ActivityTimelineProps = BlockSectionProps & {
  items?: ActivityItem[];
  /** Items shown before "Show all". @default 5 */
  limit?: number;
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

/** Newest-first list of what happened, with relative times. */
export function ActivityTimeline({
  items: itemsProp,
  limit = 5,
  query,
  ...section
}: ActivityTimelineProps) {
  const items = itemsProp ?? (query?.data as ActivityItem[] | undefined);
  const t = useLabels();
  const { relativeTime } = useFormatters();
  const [expanded, setExpanded] = useState(false);
  const sorted = useMemo(
    () => [...(items ?? [])].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [items]
  );
  const visible = expanded ? sorted : sorted.slice(0, limit);

  return (
    <BlockSection {...section} query={query} emptyWhen={() => sorted.length === 0}>
      <Loadable shape="text" lines={4}>
        {() => (
          <div className={styles.activity}>
            <ol className={styles.timeline}>
              {visible.map((item) => {
                const at = new Date(item.at);
                const valid = Number.isFinite(at.getTime());
                return (
                  <li key={item.id} className={styles.timelineItem}>
                    <span className={styles.timelineMark} aria-hidden="true">
                      {item.icon ??
                        (item.actor && (
                          <Avatar
                            size="sm"
                            src={item.actor.avatarUrl}
                            alt=""
                            initials={initialsOf(item.actor.name)}
                          />
                        ))}
                    </span>
                    <div className={styles.timelineBody}>
                      <div>
                        {item.actor && <strong>{item.actor.name} </strong>}
                        {item.text}
                      </div>
                      {valid && (
                        <time className={styles.muted} dateTime={at.toISOString()}>
                          {relativeTime(at)}
                        </time>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {!expanded && sorted.length > limit && (
              <Button variant="ghost" size="sm" onClick={() => setExpanded(true)}>
                {t('blocks.showAll', { count: sorted.length })}
              </Button>
            )}
          </div>
        )}
      </Loadable>
    </BlockSection>
  );
}
