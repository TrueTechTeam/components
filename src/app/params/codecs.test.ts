import { param } from './codecs';

describe('param codecs', () => {
  it('string: missing → default, any present value kept', () => {
    const c = param.string();
    expect(c.default).toBe('');
    expect(c.parse(null)).toBe('');
    expect(c.parse('shoes')).toBe('shoes');
    expect(param.string('all').parse(null)).toBe('all');
    expect(c.serialize('x')).toBe('x');
  });

  it.each([null, '', '   ', 'abc', 'NaN', 'Infinity', '-Infinity', '1e999', '3px'])(
    'number: %p → default',
    (raw) => {
      expect(param.number(1).parse(raw)).toBe(1);
    }
  );

  it('number: parses finite values and serializes them', () => {
    const c = param.number();
    expect(c.default).toBe(0);
    expect(c.parse('3')).toBe(3);
    expect(c.parse('-2.5')).toBe(-2.5);
    expect(c.serialize(4)).toBe('4');
    expect(c.serialize(NaN)).toBeNull();
  });

  it('boolean: true/1 → true, false/0 → false, anything else → default', () => {
    const c = param.boolean(true);
    expect(param.boolean().default).toBe(false);
    expect(c.parse('true')).toBe(true);
    expect(c.parse('1')).toBe(true);
    expect(c.parse('false')).toBe(false);
    expect(c.parse('0')).toBe(false);
    expect(c.parse('yes')).toBe(true);
    expect(param.boolean(false).parse('yes')).toBe(false);
    expect(c.parse(null)).toBe(true);
    expect(c.serialize(false)).toBe('false');
  });

  it('enum: known values pass, unknown → default', () => {
    const c = param.enum(['open', 'closed'] as const, 'open');
    expect(c.parse('closed')).toBe('closed');
    expect(c.parse('bogus')).toBe('open');
    expect(c.parse('')).toBe('open');
    expect(c.parse(null)).toBe('open');
    expect(c.serialize('closed')).toBe('closed');
  });

  it('array: comma-separated, empty string → [], missing → default', () => {
    const c = param.array(['a']);
    expect(param.array().default).toEqual([]);
    expect(c.parse('x,y')).toEqual(['x', 'y']);
    expect(c.parse('x,,y')).toEqual(['x', 'y']);
    expect(c.parse('')).toEqual([]);
    expect(c.parse(null)).toEqual(['a']);
    expect(c.serialize(['x', 'y'])).toBe('x,y');
  });
});
