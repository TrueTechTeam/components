import React, { useEffect, useReducer, useState } from 'react';
import { Button } from '../../lib/components/buttons/Button';
import { Dialog } from '../../lib/components/overlays/Dialog';
import {
  builderReducer,
  clearState,
  INITIAL_STATE,
  importThemeJson,
  loadState,
  saveState,
} from './builderState';
import { EntryScreen } from './EntryScreen';
import { GuidedSteps } from './GuidedSteps';
import styles from './ThemeBuilder.module.scss';

export interface ThemeBuilderProps {
  /** Where progress is persisted. Defaults to localStorage. */
  storage?: Storage;
}

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

export function ThemeBuilder({ storage }: ThemeBuilderProps) {
  const [state, dispatch] = useReducer(builderReducer, undefined, () => loadState(storage));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);

  useEffect(() => {
    // The pristine state is never persisted, so Start over leaves storage cleared.
    if (state !== INITIAL_STATE) {
      saveState(state, storage);
    }
  }, [state, storage]);

  const handleLoadFile = async (file: File) => {
    const result = importThemeJson(await readFile(file), state);
    if (result.ok && result.state) {
      setImportErrors([]);
      setImportWarnings(result.warnings);
      dispatch({ type: 'load', state: result.state });
    } else {
      setImportWarnings([]);
      setImportErrors(result.errors);
    }
  };

  const handleStartOver = () => {
    clearState(storage);
    dispatch({ type: 'reset' });
    setImportErrors([]);
    setImportWarnings([]);
    setConfirmOpen(false);
  };

  const { step } = state;

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>Theme Builder</h1>
        <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
          ↺ Start over
        </Button>
      </header>

      <main className={styles.main}>
        {step === 'entry' && (
          <EntryScreen
            errors={importErrors}
            onStart={(path) => dispatch({ type: 'start', path })}
            onLoadFile={handleLoadFile}
            onDismissErrors={() => setImportErrors([])}
          />
        )}
        {(step === 'mood' || step === 'hue' || step === 'palette') && (
          <GuidedSteps state={state} dispatch={dispatch} step={step} />
        )}
        {step === 'editor' && (
          <div className={styles.editor}>
            {importWarnings.length > 0 && (
              <div className={styles.feedbackWarning} role="status">
                <div className={styles.feedbackBody}>
                  <strong>Imported with warnings</strong>
                  <ul>
                    {importWarnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setImportWarnings([])}>
                  Dismiss
                </Button>
              </div>
            )}
            {/* Task 9 replaces this placeholder with the editor. */}
            <h2>Colors</h2>
          </div>
        )}
      </main>

      <Dialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Start over?"
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleStartOver}>
              Start over
            </Button>
          </>
        }
      >
        Start over? This clears your saved progress.
      </Dialog>
    </div>
  );
}
