/** @jest-environment node */
import path from 'path';
import { compile } from 'sass';

// jsdom does no layout, so check the compiled stylesheet.
describe('AppShell styles', () => {
  const css = compile(path.join(__dirname, 'AppShell.module.scss'), {
    loadPaths: [path.join(__dirname, '../../../lib/styles')],
  }).css;

  it('lets the header actions shrink so wide actions cannot overflow the navbar on a phone', () => {
    const match = /(?:^|\n)\.trailing\s*\{([^}]*)\}/.exec(css);
    if (!match) {
      throw new Error('No .trailing rule in the compiled stylesheet');
    }
    expect(match[1]).toMatch(/min-width: 0;/);
    expect(match[1]).toMatch(/flex-shrink: 1;/);
  });
});
