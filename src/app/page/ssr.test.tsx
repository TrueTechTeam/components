/** @jest-environment node */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppProvider } from '../AppProvider';
import { Loadable, Page, Section, type QueryLike } from './index';

function query(overrides: Partial<QueryLike> = {}): QueryLike {
  return {
    isPending: false,
    isError: false,
    error: null,
    isFetching: false,
    data: undefined,
    dataUpdatedAt: 0,
    refetch: () => Promise.resolve(undefined),
    ...overrides,
  } as QueryLike;
}

describe('Page without a DOM (server rendering)', () => {
  it('renders AppProvider + Page + Section with renderToString without touching window', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
    let html = '';
    expect(() => {
      html = renderToString(
        <AppProvider debug={false}>
          <Page title="Orders" description="All orders" reducer={(s: unknown) => s}>
            <p>Page body</p>
            <Section title="Recent" queries={[query({ data: [1], isFetching: true })]}>
              <p>Recent orders</p>
            </Section>
            <Section title="Loading" queries={[query({ isPending: true })]}>
              <p>Loading structure</p>
              <Loadable shape="table">{() => <p>Loaded rows</p>}</Loadable>
            </Section>
          </Page>
        </AppProvider>
      );
    }).not.toThrow();
    expect(html).toContain('Page body');
    expect(html).toContain('Recent orders');
    expect(html).toContain('Refreshing…');
    expect(html).toContain('Loading structure');
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain('Loaded rows');
  });
});
