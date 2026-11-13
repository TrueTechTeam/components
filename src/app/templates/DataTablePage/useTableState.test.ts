import { filtersCodec, sortCodec } from './useTableState';

describe('sortCodec', () => {
  it('parses key:direction and falls back to the default for malformed values', () => {
    const codec = sortCodec({ key: 'name', direction: 'asc' });
    expect(codec.parse('points:desc')).toEqual({ key: 'points', direction: 'desc' });
    expect(codec.parse('a:b:asc')).toEqual({ key: 'a:b', direction: 'asc' });
    expect(codec.parse(null)).toEqual({ key: 'name', direction: 'asc' });
    expect(codec.parse('points:sideways')).toEqual({ key: 'name', direction: 'asc' });
    expect(codec.parse(':asc')).toEqual({ key: 'name', direction: 'asc' });
  });

  it('keeps "unsorted" distinct from the default sort', () => {
    const withDefault = sortCodec({ key: 'name', direction: 'asc' });
    expect(withDefault.serialize(null)).toBe('');
    expect(withDefault.parse('')).toBeNull();
    const noDefault = sortCodec();
    expect(noDefault.serialize(null)).toBeNull();
    expect(noDefault.parse(null)).toBeNull();
  });
});

describe('filtersCodec', () => {
  it('round-trips filters, reviving ISO dates', () => {
    const start = new Date('2026-01-02T00:00:00.000Z');
    const value = { status: 'open', created: { startDate: start, endDate: null } };
    const parsed = filtersCodec.parse(filtersCodec.serialize(value));
    expect(parsed).toEqual(value);
    expect((parsed.created as { startDate: Date }).startDate).toBeInstanceOf(Date);
  });

  it('removes the param for no filters and ignores malformed JSON', () => {
    expect(filtersCodec.serialize({})).toBeNull();
    expect(filtersCodec.parse('{oops')).toEqual({});
    expect(filtersCodec.parse('[1,2]')).toEqual({});
    expect(filtersCodec.parse('null')).toEqual({});
  });
});
