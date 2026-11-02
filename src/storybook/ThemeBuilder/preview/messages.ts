import type { ThemeConfig, ThemeMode } from '../../../lib/types/theme.types';

/** Sent by the preview iframe to its parent once it is listening. */
export const MSG_READY = 'ttt-theme-builder:ready';
/** Sent by the builder to the preview iframe with the in-progress theme. */
export const MSG_CONFIG = 'ttt-theme-builder:config';

export type PreviewMessage =
  | { type: typeof MSG_READY }
  | { type: typeof MSG_CONFIG; config: ThemeConfig; mode: ThemeMode };

/** Storybook story id of the hidden preview story (title + export name, slugged). */
export const PREVIEW_STORY_ID = 'theme-builder-internal-preview--default';
