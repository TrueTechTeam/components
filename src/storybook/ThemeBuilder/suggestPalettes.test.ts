import { hexToOklch } from '../../lib/utils/colorUtils';
import type { Harmony } from './types';
import { harmonyHues } from './moods';
import { suggestPalettes } from './suggestPalettes';

const HEX = /^#[0-9a-f]{6}$/;
const hueDistance = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

describe('suggestPalettes', () => {
  it('returns 6 valid hex palettes', () => {
    const result = suggestPalettes({ moods: ['calm'], hue: 250, harmony: 'analogous', seed: 1 });
    expect(result).toHaveLength(6);
    result.forEach((p) => {
      expect(p.primary).toMatch(HEX);
      expect(p.secondary).toMatch(HEX);
      expect(p.name).toBeTruthy();
    });
    expect(new Set(result.map((p) => p.id)).size).toBe(6);
  });

  it('is deterministic per seed and changes with a new seed', () => {
    const args = { moods: ['bold' as const], hue: 30, harmony: 'triadic' as const };
    expect(suggestPalettes({ ...args, seed: 7 })).toEqual(suggestPalettes({ ...args, seed: 7 }));
    expect(suggestPalettes({ ...args, seed: 8 })).not.toEqual(
      suggestPalettes({ ...args, seed: 7 })
    );
  });

  it('places primaries on the chosen hue (±10°) and secondaries on harmony hues (±10°)', () => {
    const harmonies: Harmony[] = [
      'complementary',
      'analogous',
      'triadic',
      'split-complementary',
      'monochrome',
    ];
    harmonies.forEach((harmony) => {
      const hue = 250;
      const targets = harmonyHues(hue, harmony);
      suggestPalettes({ moods: ['bold'], hue, harmony, seed: 3 }).forEach((p) => {
        const primary = hexToOklch(p.primary)!;
        const secondary = hexToOklch(p.secondary)!;
        expect(hueDistance(primary.h, hue)).toBeLessThanOrEqual(10);
        expect(Math.min(...targets.map((t) => hueDistance(secondary.h, t)))).toBeLessThanOrEqual(
          10
        );
      });
    });
  });

  it('applies the exact harmony offsets', () => {
    expect(harmonyHues(100, 'complementary')).toEqual([280]);
    expect(harmonyHues(10, 'analogous')).toEqual([340, 40]);
    expect(harmonyHues(0, 'triadic')).toEqual([120, 240]);
    expect(harmonyHues(0, 'split-complementary')).toEqual([150, 210]);
    expect(harmonyHues(77, 'monochrome')).toEqual([77]);
  });

  it('handles hue 359 + complementary without NaN', () => {
    const result = suggestPalettes({
      moods: ['techy'],
      hue: 359,
      harmony: 'complementary',
      seed: 5,
    });
    expect(result).toHaveLength(6);
    result.forEach((p) => {
      expect(p.primary).toMatch(HEX);
      expect(p.secondary).toMatch(HEX);
    });
  });

  it('defaults to the professional profile when no moods are selected', () => {
    // hue 250 (blue) is in gamut at professional lightness/chroma, so chroma survives gamut mapping
    const result = suggestPalettes({
      moods: [],
      hue: 250,
      harmony: 'split-complementary',
      seed: 2,
    });
    result.forEach((p) => {
      const { c } = hexToOklch(p.primary)!;
      expect(c).toBeGreaterThanOrEqual(0.08 - 0.02);
      expect(c).toBeLessThanOrEqual(0.13 + 0.02);
      expect(p.look.radius).toBe(6);
    });
  });

  it('lets the first-selected mood win the look and averages ranges', () => {
    const [first] = suggestPalettes({
      moods: ['luxury', 'playful'],
      hue: 250,
      harmony: 'triadic',
      seed: 4,
    });
    expect(first.look.radius).toBe(2);
    expect(first.look.shadowDepth).toBe('deep');
  });
});
