import React, { useMemo } from 'react';
import { Button } from '../../../lib/components/buttons/Button';
import { useClipboard } from '../../../lib/hooks/useClipboard';
import type { ThemeConfig } from '../../../lib/types/theme.types';
import styles from './Editor.module.scss';

const USAGE = `import theme from './theme.json';
<GlobalProvider themeConfig={theme}>…</GlobalProvider>;`;

/** Copy feedback is a transient inline "Copied" status (no toast provider needed). */
export function ExportPanel({ config }: { config: ThemeConfig }) {
  const json = useMemo(() => JSON.stringify(config, null, 2), [config]);
  const { copy, copied } = useClipboard();

  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'theme.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className={styles.panel} aria-label="Export">
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Export</h3>
        <div className={styles.actions}>
          <Button size="sm" variant="outline" onClick={() => void copy(json)}>
            Copy JSON
          </Button>
          <Button size="sm" onClick={download}>
            Download theme.json
          </Button>
          <span aria-live="polite">{copied ? 'Copied' : ''}</span>
        </div>
      </div>
      <pre className={styles.json} tabIndex={0}>
        {json}
      </pre>
      <pre className={styles.usage}>{USAGE}</pre>
    </section>
  );
}
