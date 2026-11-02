import React, { useState } from 'react';
import { Input } from '../../../lib/components/inputs/Input';
import { NumberInput } from '../../../lib/components/inputs/NumberInput';
import { Select } from '../../../lib/components/inputs/Select';
import type { ThemeConfig } from '../../../lib/types/theme.types';
import type { BuilderAction } from '../builderState';
import { DEFAULT_INPUTS, type ThemeInputs } from '../types';
import styles from './Editor.module.scss';

const FONT_PRESETS = [
  { value: 'system', label: 'System', stack: DEFAULT_INPUTS.fontStack },
  { value: 'inter', label: 'Inter', stack: "Inter, system-ui, 'Segoe UI', Arial, sans-serif" },
  {
    value: 'georgia',
    label: 'Georgia (serif)',
    stack: "Georgia, Cambria, 'Times New Roman', serif",
  },
  {
    value: 'mono',
    label: 'Mono',
    stack: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  },
];
const FONT_OPTIONS = [...FONT_PRESETS, { value: 'custom', label: 'Custom…' }];
const RATIO_OPTIONS = ['1.125', '1.2', '1.25', '1.333'].map((v) => ({ value: v, label: v }));
const RAMP = ['4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'] as const;

export interface TypographySectionProps {
  inputs: ThemeInputs;
  config: ThemeConfig;
  dispatch: React.Dispatch<BuilderAction>;
}

export function TypographySection({ inputs, config, dispatch }: TypographySectionProps) {
  const preset = FONT_PRESETS.find((p) => p.stack === inputs.fontStack);
  const [forceCustom, setForceCustom] = useState(false);
  const fontValue = preset && !forceCustom ? preset.value : 'custom';

  return (
    <div className={styles.sectionBody}>
      <Select
        label="Font stack"
        options={FONT_OPTIONS}
        value={fontValue}
        onChange={(value) => {
          const next = FONT_PRESETS.find((p) => p.value === value);
          setForceCustom(!next);
          if (next) {
            dispatch({ type: 'setInput', key: 'fontStack', value: next.stack });
          }
        }}
      />
      {fontValue === 'custom' && (
        <Input
          label="Custom font stack"
          value={inputs.fontStack}
          onChange={(event) => {
            const value = event.target.value;
            if (value.trim() !== '') {
              dispatch({ type: 'setInput', key: 'fontStack', value });
            }
          }}
        />
      )}
      <NumberInput
        label="Base size (px)"
        min={14}
        max={18}
        step={1}
        value={inputs.baseFontSize}
        onChange={(value) => {
          if (Number.isFinite(value) && value >= 14 && value <= 18) {
            dispatch({ type: 'setInput', key: 'baseFontSize', value });
          }
        }}
      />
      <Select
        label="Scale ratio"
        options={RATIO_OPTIONS}
        value={String(inputs.typeScaleRatio)}
        onChange={(value) => {
          const ratio = Number(value);
          if (Number.isFinite(ratio)) {
            dispatch({ type: 'setInput', key: 'typeScaleRatio', value: ratio });
          }
        }}
      />
      <div className={styles.ramp} role="group" aria-label="Type ramp">
        {RAMP.map((size) => (
          <div
            key={size}
            style={{
              fontSize: config.theme?.typography?.fontSize?.[size],
              fontFamily: inputs.fontStack,
            }}
          >
            {size} · The quick brown fox
          </div>
        ))}
      </div>
    </div>
  );
}
