import { safeHref, safeHttpUrl, safeImageSrc } from './safeUrl';

const bad = [
  'javascript:alert(1)',
  'JAVASCRIPT:alert(1)',
  'java\tscript:alert(1)',
  'java\nscript:alert(1)',
  '\u0001javascript:alert(1)',
  '  javascript:alert(1)',
  'vbscript:msgbox(1)',
  'data:text/html,<script>alert(1)</script>',
];

describe('safeUrl', () => {
  it.each(bad)('rejects %j everywhere', (value) => {
    expect(safeHref(value)).toBeUndefined();
    expect(safeImageSrc(value)).toBeUndefined();
    expect(safeHttpUrl(value)).toBeNull();
  });

  it('allows relative and http(s) hrefs', () => {
    expect(safeHref('/files/a.pdf')).toBe('/files/a.pdf');
    expect(safeHref('a/b.png')).toBe('a/b.png');
    expect(safeHref('https://x.test/a')).toBe('https://x.test/a');
    expect(safeHref('http://x.test/a')).toBe('http://x.test/a');
  });

  it('rejects blob and data hrefs', () => {
    expect(safeHref('blob:https://x.test/1')).toBeUndefined();
    expect(safeHref('data:image/png;base64,AAAA')).toBeUndefined();
  });

  it('allows image sources: relative, http(s), blob and data:image', () => {
    expect(safeImageSrc('/a.png')).toBe('/a.png');
    expect(safeImageSrc('https://x.test/a.png')).toBe('https://x.test/a.png');
    expect(safeImageSrc('blob:https://x.test/1')).toBe('blob:https://x.test/1');
    expect(safeImageSrc('data:image/png;base64,AAAA')).toBe('data:image/png;base64,AAAA');
  });

  it('rejects empty and non-string values', () => {
    expect(safeHref('')).toBeUndefined();
    expect(safeImageSrc(undefined)).toBeUndefined();
    expect(safeHttpUrl(42)).toBeNull();
  });

  it('safeHttpUrl accepts only absolute http(s)', () => {
    expect(safeHttpUrl('https://www.x.test/a')?.host).toBe('www.x.test');
    expect(safeHttpUrl('/relative')).toBeNull();
    expect(safeHttpUrl('ftp://x.test')).toBeNull();
  });
});
