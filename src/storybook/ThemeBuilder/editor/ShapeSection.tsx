import React from 'react';
import { Select } from '../../../lib/components/inputs/Select';
import { Slider } from '../../../lib/components/inputs/Slider';
import type { BuilderAction } from '../builderState';
import type { ThemeInputs } from '../types';
import styles from './Editor.module.scss';

const UNIT_OPTIONS = [4, 5, 6].map((n) => ({ value: String(n), label: `${n} px` }));

export interface ShapeSectionProps {
  inputs: ThemeInputs;
  dispatch: React.Dispatch<BuilderAction>;
}

export function ShapeSection({ inputs, dispatch }: ShapeSectionProps) {
  return (
    <div className={styles.sectionBody}>
      <div>
        <Slider
          id="theme-builder-radius"
          label="Corner radius"
          min={0}
          max={16}
          step={1}
          showValue
          value={inputs.radius}
          onChange={(value) => {
            const radius = Array.isArray(value) ? value[0] : value;
            if (Number.isFinite(radius) && radius >= 0 && radius <= 16) {
              dispatch({ type: 'setInput', key: 'radius', value: radius });
            }
          }}
        />
        <div className={styles.sliderEnds} aria-hidden="true">
          <span>Sharp</span>
          <span>Round</span>
        </div>
      </div>
      <Select
        label="Spacing unit"
        options={UNIT_OPTIONS}
        value={String(inputs.spacingUnit)}
        onChange={(value) => {
          const unit = Number(value);
          if ([4, 5, 6].includes(unit)) {
            dispatch({ type: 'setInput', key: 'spacingUnit', value: unit });
          }
        }}
      />
    </div>
  );
}
