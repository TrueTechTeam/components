import React from 'react';
import {
  ButtonToggleGroup,
  ButtonToggleGroupItem,
} from '../../../lib/components/buttons/ButtonToggleGroup';
import type { ThemeMode } from '../../../lib/types/theme.types';
import type { BuilderAction } from '../builderState';
import type { Density, ShadowDepth, ThemeInputs } from '../types';
import styles from './Editor.module.scss';

const SHADOWS: ShadowDepth[] = ['flat', 'subtle', 'medium', 'deep'];
const DENSITIES: Density[] = ['compact', 'comfortable', 'spacious'];
const MODES: ThemeMode[] = ['light', 'dark'];

export interface DepthSectionProps {
  inputs: ThemeInputs;
  dispatch: React.Dispatch<BuilderAction>;
}

export function DepthSection({ inputs, dispatch }: DepthSectionProps) {
  return (
    <div className={styles.sectionBody}>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Shadow depth</span>
        <ButtonToggleGroup
          aria-label="Shadow depth"
          value={inputs.shadowDepth}
          onChange={(value) =>
            dispatch({ type: 'setInput', key: 'shadowDepth', value: value as ShadowDepth })
          }
        >
          {SHADOWS.map((v) => (
            <ButtonToggleGroupItem key={v} value={v}>
              {v}
            </ButtonToggleGroupItem>
          ))}
        </ButtonToggleGroup>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Density</span>
        <ButtonToggleGroup
          aria-label="Density"
          value={inputs.density}
          onChange={(value) =>
            dispatch({ type: 'setInput', key: 'density', value: value as Density })
          }
        >
          {DENSITIES.map((v) => (
            <ButtonToggleGroupItem key={v} value={v}>
              {v}
            </ButtonToggleGroupItem>
          ))}
        </ButtonToggleGroup>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Default mode</span>
        <ButtonToggleGroup
          aria-label="Default mode"
          value={inputs.defaultMode}
          onChange={(value) =>
            dispatch({ type: 'setInput', key: 'defaultMode', value: value as ThemeMode })
          }
        >
          {MODES.map((v) => (
            <ButtonToggleGroupItem key={v} value={v}>
              {v}
            </ButtonToggleGroupItem>
          ))}
        </ButtonToggleGroup>
      </div>
    </div>
  );
}
