/** @jest-environment node */
import path from 'path';
import { compile } from 'sass';

// jsdom does not apply SCSS modules, so check the compiled stylesheet: every link rule has zero
// specificity, so a consumer's single-class `className` (e.g. `.nav { color: red }`) overrides
// the library color in any stylesheet order, for normal and visited links alike.
describe('AppLink link styles', () => {
  const css = compile(path.join(__dirname, 'AppLink.module.scss'), {
    loadPaths: [path.join(__dirname, '../../lib/styles')],
  }).css;

  it('wraps every link selector in :where()', () => {
    // Rule preludes, minus at-rules (`@media ...`).
    const selectors = [...css.matchAll(/(^|[{};])\s*([^{};]+?)\s*\{/g)]
      .map((m) => m[2])
      .filter((sel) => !sel.startsWith('@'));
    expect(selectors.length).toBeGreaterThan(0);
    selectors.forEach((sel) =>
      sel.split(',').forEach((part) => expect(part.trim()).toMatch(/^:where\(/))
    );
  });

  it('does not give visited links their own color rule', () => {
    expect(css).not.toMatch(/:visited/);
  });
});
