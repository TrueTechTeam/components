import React, { useMemo } from 'react';
import { Accordion } from '../../../lib/components/display/Accordion';
import {
  ButtonToggleGroup,
  ButtonToggleGroupItem,
} from '../../../lib/components/buttons/ButtonToggleGroup';
import type { ThemeMode } from '../../../lib/types/theme.types';
import type { BuilderAction, BuilderState } from '../builderState';
import { generateTheme } from '../generateTheme';
import { PreviewFrame } from '../preview/PreviewFrame';
import { ColorsSection } from './ColorsSection';
import { ContrastReport } from './ContrastReport';
import { DepthSection } from './DepthSection';
import { ExportPanel } from './ExportPanel';
import { ShapeSection } from './ShapeSection';
import { TypographySection } from './TypographySection';
import styles from './Editor.module.scss';

export interface EditorProps {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  /** Rendered above the editor (import warnings). */
  banner?: React.ReactNode;
}

export function Editor({ state, dispatch, banner }: EditorProps) {
  const { inputs, overrides, previewMode, openSections } = state;
  const config = useMemo(() => generateTheme(inputs, overrides), [inputs, overrides]);
  const colors = config.theme?.modes?.[previewMode]?.colors ?? {};

  const sections = [
    {
      id: 'colors',
      title: 'Colors',
      body: (
        <ColorsSection
          inputs={inputs}
          overrides={overrides}
          mode={previewMode}
          colors={colors}
          dispatch={dispatch}
        />
      ),
    },
    {
      id: 'typography',
      title: 'Typography',
      body: <TypographySection inputs={inputs} config={config} dispatch={dispatch} />,
    },
    {
      id: 'shape',
      title: 'Shape & spacing',
      body: <ShapeSection inputs={inputs} dispatch={dispatch} />,
    },
    {
      id: 'depth',
      title: 'Depth & density',
      body: <DepthSection inputs={inputs} dispatch={dispatch} />,
    },
  ];

  return (
    <div className={styles.editor}>
      {banner}
      <div className={styles.layout}>
        <div className={styles.sections}>
          {sections.map((section) => (
            <Accordion
              key={section.id}
              id={`theme-builder-${section.id}`}
              header={section.title}
              isOpen={openSections.includes(section.id)}
              onOpenChange={() => dispatch({ type: 'toggleSection', id: section.id })}
              bordered
            >
              {section.body}
            </Accordion>
          ))}
        </div>
        <div className={styles.right}>
          <ButtonToggleGroup
            aria-label="Preview mode"
            value={previewMode}
            onChange={(mode) => dispatch({ type: 'setPreviewMode', mode: mode as ThemeMode })}
          >
            <ButtonToggleGroupItem value="light">Light</ButtonToggleGroupItem>
            <ButtonToggleGroupItem value="dark">Dark</ButtonToggleGroupItem>
          </ButtonToggleGroup>
          <div className={styles.preview}>
            <PreviewFrame config={config} mode={previewMode} />
          </div>
          <ContrastReport colors={colors} mode={previewMode} dispatch={dispatch} />
          <ExportPanel config={config} />
        </div>
      </div>
    </div>
  );
}
