import React, { useRef } from 'react';
import { Button } from '../../lib/components/buttons/Button';
import styles from './ThemeBuilder.module.scss';

export interface EntryScreenProps {
  errors: string[];
  onStart: (path: 'guided' | 'direct') => void;
  onLoadFile: (file: File) => void;
  onDismissErrors: () => void;
}

export function EntryScreen({ errors, onStart, onLoadFile, onDismissErrors }: EntryScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <section className={styles.entry} aria-labelledby="entry-heading">
      <h2 id="entry-heading" className={styles.entryHeading}>
        How would you like to start?
      </h2>

      {errors.length > 0 && (
        <div className={styles.feedbackError} role="alert">
          <div className={styles.feedbackBody}>
            <strong>Could not load that file</strong>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismissErrors}>
            Dismiss
          </Button>
        </div>
      )}

      <div className={styles.choices}>
        <button type="button" className={styles.choiceCard} onClick={() => onStart('guided')}>
          <span className={styles.choiceTitle}>✨ Help me find my theme</span>
          <span className={styles.choiceText}>
            Pick a mood and a hue, then choose from suggested palettes.
          </span>
        </button>
        <button type="button" className={styles.choiceCard} onClick={() => onStart('direct')}>
          <span className={styles.choiceTitle}>🎯 I know my theme</span>
          <span className={styles.choiceText}>Jump straight to the editor and set your own.</span>
        </button>
      </div>

      <div className={styles.loadRow}>
        <Button variant="outline" onClick={() => fileInput.current?.click()}>
          ⬆ Load theme.json
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          aria-label="Load theme.json file"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onLoadFile(file);
            }
            event.target.value = '';
          }}
        />
      </div>
    </section>
  );
}
