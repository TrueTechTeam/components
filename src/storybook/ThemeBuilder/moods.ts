import { rotateHue } from '../../lib/utils/colorUtils';
import { DEFAULT_INPUTS, type Harmony, type Mood, type ThemeInputs } from './types';

export interface MoodProfile {
  /** OKLCH chroma range for primary candidates */
  chroma: [number, number];
  /** OKLCH lightness range for primary candidates */
  lightness: [number, number];
  harmony: Harmony;
  look: Partial<Pick<ThemeInputs, 'radius' | 'shadowDepth' | 'density' | 'fontStack'>>;
}

const SERIF_STACK = "Georgia, 'Times New Roman', serif";
const TECH_STACK = "'Inter', system-ui, sans-serif";

export const MOODS: Record<Mood, MoodProfile & { label: string }> = {
  calm: {
    label: 'Calm',
    chroma: [0.06, 0.1],
    lightness: [0.55, 0.65],
    harmony: 'analogous',
    look: { radius: 10, shadowDepth: 'subtle', density: 'comfortable' },
  },
  bold: {
    label: 'Bold',
    chroma: [0.18, 0.24],
    lightness: [0.5, 0.6],
    harmony: 'complementary',
    look: { radius: 6, shadowDepth: 'medium' },
  },
  professional: {
    label: 'Professional',
    chroma: [0.08, 0.13],
    lightness: [0.45, 0.55],
    harmony: 'split-complementary',
    look: { radius: 6, shadowDepth: 'subtle', fontStack: DEFAULT_INPUTS.fontStack },
  },
  playful: {
    label: 'Playful',
    chroma: [0.16, 0.22],
    lightness: [0.6, 0.7],
    harmony: 'triadic',
    look: { radius: 14, shadowDepth: 'medium', density: 'spacious' },
  },
  luxury: {
    label: 'Luxury',
    chroma: [0.05, 0.09],
    lightness: [0.3, 0.42],
    harmony: 'monochrome',
    look: { radius: 2, shadowDepth: 'deep', fontStack: SERIF_STACK },
  },
  techy: {
    label: 'Techy',
    chroma: [0.14, 0.2],
    lightness: [0.55, 0.65],
    harmony: 'complementary',
    look: { radius: 4, shadowDepth: 'flat', density: 'compact', fontStack: TECH_STACK },
  },
  earthy: {
    label: 'Earthy',
    chroma: [0.07, 0.12],
    lightness: [0.45, 0.58],
    harmony: 'analogous',
    look: { radius: 8, shadowDepth: 'subtle' },
  },
};

const HARMONY_OFFSETS: Record<Harmony, number[]> = {
  complementary: [180],
  analogous: [-30, 30],
  triadic: [120, 240],
  'split-complementary': [150, 210],
  monochrome: [0],
};

/** Candidate secondary hues for a primary hue, normalised to [0, 360). */
export function harmonyHues(hue: number, harmony: Harmony): number[] {
  return HARMONY_OFFSETS[harmony].map((offset) => rotateHue(hue, offset));
}
