import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '../../../lib/components/display/Badge';
import { Button } from '../../../lib/components/buttons/Button';
import type { ThemeColorTokens, ThemeMode, ThemeShadeKey } from '../../../lib/types/theme.types';
import type { BuilderAction } from '../builderState';
import type { ColorOverrides, ThemeInputs } from '../types';
import { ColorInput } from './ColorInput';
import styles from './Editor.module.scss';

type TokenKey = keyof ThemeColorTokens;
type Colors = Partial<ThemeColorTokens> & Partial<Record<ThemeShadeKey, string>>;

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const TOKEN_GROUPS: ReadonlyArray<{ title: string; keys: TokenKey[] }> = [
  {
    title: 'Brand',
    keys: [
      'primary',
      'primaryHover',
      'primaryActive',
      'primaryDisabled',
      'secondary',
      'secondaryHover',
      'secondaryActive',
      'secondaryDisabled',
    ],
  },
  { title: 'Status', keys: ['success', 'warning', 'error', 'info'] },
  {
    title: 'Backgrounds & surfaces',
    keys: [
      'backgroundPrimary',
      'backgroundSecondary',
      'backgroundTertiary',
      'surfacePrimary',
      'surfaceSecondary',
      'surfaceElevated',
    ],
  },
  {
    title: 'Text',
    keys: ['textPrimary', 'textSecondary', 'textTertiary', 'textDisabled', 'textOnPrimary'],
  },
  { title: 'Borders', keys: ['borderPrimary', 'borderSecondary', 'borderFocus'] },
  {
    title: 'Inputs & controls',
    keys: [
      'inputBg',
      'inputBgDisabled',
      'inputBorder',
      'inputBorderHover',
      'inputBorderFocus',
      'inputText',
      'inputPlaceholder',
      'controlBg',
      'controlBgChecked',
      'controlBorder',
      'controlBorderHover',
    ],
  },
];

function ShadeStrip({ name, colors }: { name: 'primary' | 'secondary'; colors: Colors }) {
  return (
    <div className={styles.shadeStrip} role="img" aria-label={`${name} shades 50 to 900`}>
      {SHADES.map((shade) => (
        <span
          key={shade}
          className={styles.shade}
          style={{ background: colors[`${name}${shade}` as ThemeShadeKey] }}
          title={`${name} ${shade}`}
        />
      ))}
    </div>
  );
}

interface TokenRowProps {
  token: TokenKey;
  value: string;
  overridden: boolean;
  onOverride: (value: string) => void;
  onAuto: () => void;
}

function TokenRow({ token, value, overridden, onOverride, onAuto }: TokenRowProps) {
  const [editing, setEditing] = useState(false);
  const showInput = editing || overridden;
  const overrideButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  // The Override button is unmounted while editing; hand focus back once it returns.
  useEffect(() => {
    if (restoreFocus.current && !showInput) {
      restoreFocus.current = false;
      overrideButton.current?.focus();
    }
  }, [showInput]);

  const cancelEdit = () => {
    restoreFocus.current = true;
    setEditing(false);
  };
  return (
    <li className={styles.tokenRow}>
      <span className={styles.swatch} style={{ background: value }} aria-hidden="true" />
      <span className={styles.tokenName}>{token}</span>
      {showInput ? (
        <ColorInput
          aria-label={`${token} override`}
          value={value}
          onCommit={onOverride}
          autoFocus={editing && !overridden}
          onCancel={overridden ? undefined : cancelEdit}
          onDone={() => {
            if (!overridden) {
              setEditing(false);
            }
          }}
        />
      ) : (
        <code className={styles.tokenValue}>{value}</code>
      )}
      {overridden && (
        <Badge variant="info" size="sm">
          edited
        </Badge>
      )}
      {overridden ? (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Auto ${token}`}
          onClick={() => {
            cancelEdit();
            onAuto();
          }}
        >
          Auto
        </Button>
      ) : (
        !editing && (
          <Button
            ref={overrideButton}
            variant="ghost"
            size="sm"
            aria-label={`Override ${token}`}
            onClick={() => setEditing(true)}
          >
            Override
          </Button>
        )
      )}
    </li>
  );
}

export interface ColorsSectionProps {
  inputs: ThemeInputs;
  overrides: ColorOverrides;
  mode: ThemeMode;
  /** Resolved colors (generated + overrides) for `mode`. */
  colors: Colors;
  dispatch: React.Dispatch<BuilderAction>;
}

export function ColorsSection({ inputs, overrides, mode, colors, dispatch }: ColorsSectionProps) {
  return (
    <div className={styles.sectionBody}>
      <ColorInput
        label="Primary color"
        value={inputs.primary}
        onCommit={(value) => dispatch({ type: 'setInput', key: 'primary', value })}
      />
      <ShadeStrip name="primary" colors={colors} />
      <ColorInput
        label="Secondary color"
        value={inputs.secondary}
        onCommit={(value) => dispatch({ type: 'setInput', key: 'secondary', value })}
      />
      <ShadeStrip name="secondary" colors={colors} />

      <h3 className={styles.groupHeading}>Derived tokens ({mode} mode)</h3>
      {TOKEN_GROUPS.map((group) => (
        <div key={group.title}>
          <h4 className={styles.subHeading}>{group.title}</h4>
          <ul className={styles.tokenList}>
            {group.keys.map((key) => (
              <TokenRow
                key={`${mode}-${key}`}
                token={key}
                value={colors[key] ?? ''}
                overridden={key in overrides[mode]}
                onOverride={(value) => dispatch({ type: 'setOverride', mode, key, value })}
                onAuto={() => dispatch({ type: 'setOverride', mode, key, value: null })}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
