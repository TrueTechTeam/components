/** @jest-environment node */
import path from 'path';
import { compile } from 'sass';

// jsdom does not apply SCSS modules or media queries, so check the compiled stylesheet.
describe('Dialog styles', () => {
  const css = compile(path.join(__dirname, 'Dialog.module.scss'), {
    loadPaths: [path.join(__dirname, '../../../styles')],
  }).css;

  /** The declarations of the full-size content rule inside the phone media query. */
  function phoneFullRule(): string {
    const media = css.slice(css.indexOf('@media (width <= 640px)'));
    const match = /\.dialogContent\[data-size=full\]\s*\{([^}]*)\}/.exec(media);
    if (!match) {
      throw new Error('No full-size dialog rule in the phone media query');
    }
    return match[1];
  }

  it('pads the backdrop with the spacing the phone full-size dialog cancels', () => {
    expect(css).toMatch(/\.dialogBackdrop\s*\{[^}]*padding: var\(--spacing-lg\);/);
  });

  it('makes a full-size dialog on a phone cover the screen edge to edge', () => {
    const rule = phoneFullRule();
    expect(rule).toMatch(/width: 100vw !important;/);
    // Negative margins equal to the backdrop padding: the dialog fills the screen instead of
    // starting 24px in and running off the right edge.
    expect(rule).toMatch(/margin: calc\(-1 \* var\(--spacing-lg\)\);/);
  });
});
