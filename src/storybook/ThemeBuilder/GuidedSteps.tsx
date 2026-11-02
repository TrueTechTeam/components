import React, { useMemo } from 'react';
import { Button } from '../../lib/components/buttons/Button';
import {
  ButtonToggleGroup,
  ButtonToggleGroupItem,
} from '../../lib/components/buttons/ButtonToggleGroup';
import { Chip } from '../../lib/components/display/Chip';
import { Slider } from '../../lib/components/inputs/Slider';
import { Step, Stepper } from '../../lib/components/navigation/Stepper';
import { oklchToHex } from '../../lib/utils/colorUtils';
import type { BuilderAction, BuilderState, Step as BuilderStep } from './builderState';
import { MOODS, harmonyHues } from './moods';
import { suggestPalettes } from './suggestPalettes';
import type { Harmony, Mood } from './types';
import styles from './ThemeBuilder.module.scss';

const GUIDED_ORDER = ['mood', 'hue', 'palette'] as const;
const MOOD_KEYS = Object.keys(MOODS) as Mood[];
const HARMONY_OPTIONS: Array<{ value: Harmony; label: string }> = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split-complementary', label: 'Split-complementary' },
  { value: 'monochrome', label: 'Monochrome' },
];

const hueToHex = (hue: number) => oklchToHex({ l: 0.62, c: 0.15, h: hue });

export interface GuidedStepsProps {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  step: 'mood' | 'hue' | 'palette';
}

type PartProps = Pick<GuidedStepsProps, 'state' | 'dispatch'>;

export function GuidedSteps({ state, dispatch, step }: GuidedStepsProps) {
  const index = GUIDED_ORDER.indexOf(step);
  const goto = (target: BuilderStep) => dispatch({ type: 'goto', step: target });

  return (
    <section className={styles.guided} aria-label="Guided setup">
      <Stepper currentStep={index} size="sm">
        <Step title="Mood" />
        <Step title="Hue & harmony" />
        <Step title="Pick a palette" />
      </Stepper>

      <div className={styles.stepBody}>
        {step === 'mood' && <MoodStep state={state} dispatch={dispatch} />}
        {step === 'hue' && <HueStep state={state} dispatch={dispatch} />}
        {step === 'palette' && <PaletteStep state={state} dispatch={dispatch} />}
      </div>

      <div className={styles.stepNav}>
        <Button
          variant="ghost"
          onClick={() => goto(index === 0 ? 'entry' : GUIDED_ORDER[index - 1])}
        >
          Back
        </Button>
        {step !== 'palette' && <Button onClick={() => goto(GUIDED_ORDER[index + 1])}>Next</Button>}
      </div>
    </section>
  );
}

function MoodStep({ state, dispatch }: PartProps) {
  return (
    <div>
      <h2 className={styles.stepHeading}>What mood fits your product?</h2>
      <p className={styles.hint}>Choose any that apply, or skip this step.</p>
      <div className={styles.chipRow}>
        {MOOD_KEYS.map((mood) => {
          const selected = state.moods.includes(mood);
          return (
            <button
              key={mood}
              type="button"
              className={styles.chipButton}
              aria-pressed={selected}
              onClick={() => dispatch({ type: 'toggleMood', mood })}
            >
              <Chip variant={selected ? 'primary' : 'neutral'}>{MOODS[mood].label}</Chip>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HueStep({ state, dispatch }: PartProps) {
  const swatches = [state.hue, ...harmonyHues(state.hue, state.harmony)];
  return (
    <div>
      <h2 className={styles.stepHeading}>Pick a hue and a harmony</h2>
      <div className={styles.hueTrack} aria-hidden="true" />
      <Slider
        label="Hue"
        min={0}
        max={359}
        step={1}
        value={Math.round(state.hue) % 360}
        showValue
        onChange={(value) => {
          const next = Array.isArray(value) ? value[0] : value;
          if (Number.isFinite(next)) {
            dispatch({ type: 'setHue', hue: next });
          }
        }}
      />
      <ButtonToggleGroup
        aria-label="Harmony"
        value={state.harmony}
        onChange={(value) => dispatch({ type: 'setHarmony', harmony: value as Harmony })}
      >
        {HARMONY_OPTIONS.map((option) => (
          <ButtonToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ButtonToggleGroupItem>
        ))}
      </ButtonToggleGroup>
      <div className={styles.swatchRow} aria-label="Harmony preview" role="img">
        {swatches.map((hue, i) => (
          <span key={i} className={styles.swatch} style={{ background: hueToHex(hue) }} />
        ))}
      </div>
    </div>
  );
}

function PaletteStep({ state, dispatch }: PartProps) {
  const palettes = useMemo(
    () =>
      suggestPalettes({
        moods: state.moods,
        hue: state.hue,
        harmony: state.harmony,
        seed: state.shuffleSeed,
      }),
    [state.moods, state.hue, state.harmony, state.shuffleSeed]
  );

  return (
    <div>
      <div className={styles.paletteHeader}>
        <h2 className={styles.stepHeading}>Pick a palette</h2>
        <Button variant="outline" size="sm" onClick={() => dispatch({ type: 'shuffle' })}>
          🎲 Shuffle
        </Button>
      </div>
      <div className={styles.paletteGrid}>
        {palettes.map((palette) => (
          <button
            key={palette.id}
            type="button"
            data-testid="palette-card"
            className={styles.paletteCard}
            onClick={() => dispatch({ type: 'applyPalette', palette })}
          >
            <span className={styles.paletteName}>{palette.name}</span>
            <span className={styles.swatchRowInline} aria-hidden="true">
              <span className={styles.swatch} style={{ background: palette.primary }} />
              <span className={styles.swatch} style={{ background: palette.secondary }} />
            </span>
            <span className={styles.sample} aria-hidden="true">
              <span className={styles.sampleButton} style={{ background: palette.primary }}>
                Button
              </span>
              <span style={{ color: palette.secondary }}>Sample text</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
