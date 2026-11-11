/** @jest-environment node */
import path from 'path';
import { compile } from 'sass';

// jsdom does no hit testing, so check the compiled stylesheet: the default card's title stretches
// an ::after over the whole card, and links or buttons in its fields must sit above it.
describe('DataTablePage card styles', () => {
  const css = compile(path.join(__dirname, 'DataTablePage.module.scss'), {
    loadPaths: [path.join(__dirname, '../../../lib/styles')],
  }).css;

  it('lifts interactive field content above the stretched open-details control', () => {
    const match = /\.cardField dd :is\(a, button[^)]*\)\s*\{([^}]*)\}/.exec(css);
    if (!match) {
      throw new Error('No rule for interactive content in card fields');
    }
    expect(match[1]).toMatch(/position: relative;/);
    expect(match[1]).toMatch(/z-index: 1;/);
  });
});
