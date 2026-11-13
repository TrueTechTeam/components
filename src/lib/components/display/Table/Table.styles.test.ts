/** @jest-environment node */
import path from 'path';
import { compile } from 'sass';

// jsdom does not apply SCSS modules, so check the compiled stylesheet.
describe('Table styles', () => {
  const css = compile(path.join(__dirname, 'Table.module.scss'), {
    loadPaths: [path.join(__dirname, '../../../styles')],
  }).css;

  it('positions the scroller so absolutely positioned cell content stays inside it', () => {
    // Visually hidden text (position: absolute) in a wide table would otherwise escape the
    // scroller and widen the whole page on a phone.
    const match = /(?:^|\n)\.table\s*\{([^}]*)\}/.exec(css);
    if (!match) {
      throw new Error('No .table rule in the compiled stylesheet');
    }
    expect(match[1]).toMatch(/overflow: auto;/);
    expect(match[1]).toMatch(/position: relative;/);
  });
});
