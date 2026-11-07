import React, { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../../lib/components/buttons/Button';
import { Textarea } from '../../../lib/components/inputs/Textarea';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { useFormatters } from '../../AppProvider';
import { useMutationFeedback } from '../../data/useMutationFeedback';
import { Loadable } from '../../page/Loadable';
import { BlockSection, EmptyOr, type BlockSectionProps } from './BlockSection';
import styles from './blocks.module.scss';

export interface NoteItem {
  id: string;
  author: string;
  at: string | Date;
  body: string;
}

export type NotesProps = BlockSectionProps & {
  items?: NoteItem[];
  /** Saves a note. Reject to show the error and keep the text. */
  onAdd?: (body: string) => Promise<void> | void;
  /** Hide the add form (e.g. read-only users). @default true */
  canAdd?: boolean;
};

function AddNote({ onAdd }: { onAdd: (body: string) => Promise<void> | void }) {
  const t = useLabels();
  const [text, setText] = useState('');
  const mutation = useMutation({
    mutationFn: async (body: string) => {
      await onAdd(body);
    },
  });
  const { mutateAsync, isPending, feedback, clearFeedback } = useMutationFeedback(mutation, {
    success: t('blocks.noteAdded'),
    via: 'inline',
  });
  const body = text.trim();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body || isPending) {
      return;
    }
    try {
      await mutateAsync(body);
      setText('');
    } catch {
      // Shown as inline feedback; the text stays so nothing is lost.
    }
  };

  return (
    <form className={styles.noteForm} onSubmit={submit}>
      <Textarea
        label={t('blocks.noteLabel')}
        value={text}
        rows={3}
        onChange={(e) => {
          setText(e.target.value);
          clearFeedback();
        }}
      />
      <div className={styles.noteActions}>
        <Button type="submit" size="sm" disabled={!body} loading={isPending}>
          {t('blocks.addNote')}
        </Button>
        {/* Always mounted so screen readers announce the text when it is filled in. */}
        <span className={styles.muted} role="status">
          {feedback?.type === 'success' ? feedback.message : ''}
        </span>
        <span className={styles.error} role="alert">
          {feedback?.type === 'error' ? feedback.message : ''}
        </span>
      </div>
    </form>
  );
}

/** Notes on a record, newest first as given, with an optional add form. */
export function Notes({ items: itemsProp, onAdd, canAdd = true, query, ...section }: NotesProps) {
  const items = itemsProp ?? (query?.data as NoteItem[] | undefined) ?? [];
  const { relativeTime } = useFormatters();
  return (
    <BlockSection {...section} query={query}>
      <div className={styles.notes}>
        <EmptyOr
          show={items.length === 0}
          empty={section.empty}
          title={section.title}
          headingLevel={section.headingLevel}
        >
          <Loadable shape="text" lines={4}>
            {() => (
              <ul className={styles.noteList}>
                {items.map((note) => {
                  const at = new Date(note.at);
                  return (
                    <li key={note.id} className={styles.note}>
                      <div className={styles.noteHead}>
                        <strong>{note.author}</strong>
                        {Number.isFinite(at.getTime()) && (
                          <time className={styles.muted} dateTime={at.toISOString()}>
                            {relativeTime(at)}
                          </time>
                        )}
                      </div>
                      <p className={styles.noteBody}>{note.body}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Loadable>
        </EmptyOr>
        {onAdd && canAdd && <AddNote onAdd={onAdd} />}
      </div>
    </BlockSection>
  );
}
