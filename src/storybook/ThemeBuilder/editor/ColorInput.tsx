import React, { useState } from 'react';
import { Input } from '../../../lib/components/inputs/Input';
import { parseColorToOklch } from '../../../lib/utils/colorUtils';
import styles from './Editor.module.scss';

export interface ColorInputProps {
  value: string;
  /** Called only with text that parses as a color. */
  onCommit: (value: string) => void;
  label?: string;
  'aria-label'?: string;
  autoFocus?: boolean;
  /** Escape pressed (draft already dropped). */
  onCancel?: () => void;
  /** Field lost focus (draft already dropped). */
  onDone?: () => void;
}

/**
 * Text input (hex/rgb/oklch) with a swatch. Invalid text shows the error state and is never
 * committed; the draft is dropped on blur so the field falls back to the real value.
 */
export function ColorInput({
  value,
  onCommit,
  label,
  'aria-label': ariaLabel,
  autoFocus,
  onCancel,
  onDone,
}: ColorInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? value;
  const invalid = draft !== null && parseColorToOklch(draft) === null;

  return (
    <div
      className={styles.colorInput}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && onCancel) {
          event.stopPropagation();
          setDraft(null);
          onCancel();
        }
      }}
    >
      <span
        className={styles.swatch}
        style={{ background: invalid ? 'transparent' : text }}
        aria-hidden="true"
      />
      <Input
        label={label}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        value={text}
        error={invalid}
        errorMessage={invalid ? 'Enter a hex, rgb() or oklch() color' : undefined}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (parseColorToOklch(next) !== null) {
            onCommit(next);
          }
        }}
        onBlur={() => {
          setDraft(null);
          onDone?.();
        }}
      />
    </div>
  );
}
