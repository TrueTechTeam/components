import { oklchToHex, rotateHue } from '../../lib/utils/colorUtils';
import { MOODS, harmonyHues, type MoodProfile } from './moods';
import type { Harmony, Mood } from './types';

export interface PaletteSuggestion {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  look: MoodProfile['look'];
}

const COUNT = 6;
const MONOCHROME_LIGHTNESS_SHIFT = -0.2;
const MONOCHROME_CHROMA_FACTOR = 0.5;

const PALETTE_NAMES = [
  'Ember',
  'Lagoon',
  'Moss',
  'Dusk',
  'Saffron',
  'Slate',
  'Orchid',
  'Harbor',
  'Cobalt',
  'Sienna',
  'Juniper',
  'Mist',
  'Coral',
  'Onyx',
  'Meadow',
  'Indigo',
  'Amber',
  'Glacier',
  'Plum',
  'Willow',
  'Rust',
  'Zenith',
  'Opal',
  'Tundra',
];

/** Small deterministic PRNG returning floats in [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = ([min, max]: [number, number], t: number): number => min + (max - min) * t;

/** Average numeric ranges across moods; the first mood decides harmony and look. */
function resolveProfile(moods: Mood[]): MoodProfile {
  const profiles = (moods.length > 0 ? moods : (['professional'] as Mood[])).map((m) => MOODS[m]);
  const [first] = profiles;
  const avg = (pick: (p: MoodProfile) => [number, number]): [number, number] => [
    profiles.reduce((sum, p) => sum + pick(p)[0], 0) / profiles.length,
    profiles.reduce((sum, p) => sum + pick(p)[1], 0) / profiles.length,
  ];
  return {
    chroma: avg((p) => p.chroma),
    lightness: avg((p) => p.lightness),
    harmony: first.harmony,
    look: first.look,
  };
}

export function suggestPalettes(args: {
  moods: Mood[];
  hue: number;
  harmony: Harmony;
  seed: number;
}): PaletteSuggestion[] {
  const { moods, hue, harmony, seed } = args;
  const profile = resolveProfile(moods);
  const rand = mulberry32(seed);
  const primaryHue = rotateHue(hue, 0);
  const secondaryHues = harmonyHues(primaryHue, harmony);
  const names = [...PALETTE_NAMES];

  return Array.from({ length: COUNT }, (_, i) => {
    const l = lerp(profile.lightness, rand());
    const c = lerp(profile.chroma, rand());
    const secondaryHue = secondaryHues[i % secondaryHues.length];
    const secondary =
      harmony === 'monochrome'
        ? { l: l + MONOCHROME_LIGHTNESS_SHIFT, c: c * MONOCHROME_CHROMA_FACTOR, h: secondaryHue }
        : { l, c, h: secondaryHue };
    const name = names.splice(Math.floor(rand() * names.length), 1)[0];
    return {
      id: `${seed}-${i}`,
      name,
      primary: oklchToHex({ l, c, h: primaryHue }),
      secondary: oklchToHex(secondary),
      look: profile.look,
    };
  });
}

export { harmonyHues };
