import { getContrastRatio } from '../../lib/utils/colorUtils';
import { auditContrast, CONTRAST_PAIRS, suggestPassingColor } from './contrast';

describe('auditContrast', () => {
  it('flags a failing pair and suggests a passing replacement', () => {
    const [check] = auditContrast({ textPrimary: '#999999', backgroundPrimary: '#ffffff' });
    expect(check.pass).toBe(false);
    expect(getContrastRatio(check.suggestion!, '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('passes a good pair without a suggestion', () => {
    const [check] = auditContrast({ textPrimary: '#111111', backgroundPrimary: '#ffffff' });
    expect(check.pass).toBe(true);
    expect(check.suggestion).toBeUndefined();
  });

  it('skips pairs whose colors are missing', () => expect(auditContrast({})).toEqual([]));

  it('skips pairs whose colors do not parse', () =>
    expect(auditContrast({ textPrimary: 'nope', backgroundPrimary: '#ffffff' })).toEqual([]));

  it('lists the eleven audited pairs', () => expect(CONTRAST_PAIRS).toHaveLength(11));
});

describe('suggestPassingColor', () => {
  it('can lighten a color on a dark background', () => {
    expect(
      getContrastRatio(suggestPassingColor('#444444', '#111111', 4.5), '#111111')
    ).toBeGreaterThanOrEqual(4.5);
  });
});
