/** @jest-environment node */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppProvider, useAppConfig, type RouterAdapter } from './index';

describe('/app without a DOM (server rendering)', () => {
  it('renders AppProvider and navigate is a no-op', () => {
    expect(typeof window).toBe('undefined');
    let router: RouterAdapter | undefined;
    function Probe() {
      router = useAppConfig().router;
      return <span>{router.pathname}</span>;
    }
    let html = '';
    expect(() => {
      html = renderToString(
        <AppProvider debug={false}>
          <Probe />
        </AppProvider>
      );
    }).not.toThrow();
    expect(html).toContain('<span>/</span>');
    expect(router?.searchParams.toString()).toBe('');
    expect(() => router?.navigate('/elsewhere')).not.toThrow();
    expect(() => router?.setSearchParams(new URLSearchParams('a=1'))).not.toThrow();
  });
});
