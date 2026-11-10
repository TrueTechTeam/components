// Helpers to render a guideline file (imported with Vite's `?raw`) with the docs `Markdown` block,
// so the guides stay a single source of truth in `guidelines/app/`. Relative links point to the
// file on GitHub. Story-only; not part of the library build.
import React, { type AnchorHTMLAttributes } from 'react';

/** Where `guidelines/app/*.md` lives on GitHub. */
export const GUIDES_URL = 'https://github.com/TrueTechTeam/components/blob/master/guidelines/app/';

/**
 * A relative guideline link (`states.md#app-state-1`) as an absolute GitHub URL; a Storybook
 * link (`?path=/docs/...`) as a manager URL.
 */
export function guideHref(href: string): string {
  if (href.startsWith('?path=')) {
    // A Storybook page: the manager lives next to the preview iframe.
    return `./${href}`;
  }
  if (href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return href;
  }
  return new URL(href, GUIDES_URL).href;
}

function GuideLink({ href = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const target = guideHref(href);
  const storybook = href.startsWith('?path=');
  const external = !storybook && !target.startsWith('#');
  return (
    <a
      {...rest}
      href={target}
      target={storybook ? '_top' : external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

/** `Markdown` block options: guideline links point to GitHub, Storybook links to the manager. */
export const guideOptions = { overrides: { a: { component: GuideLink } } };

const lineBreak = /\r?\n/;

/**
 * The text from the line starting with `start` up to (not including) the line starting with
 * `end`, or to the end of the file. Throws when `start` is missing, so a renamed heading fails the
 * Storybook build instead of silently rendering nothing.
 */
export function section(markdown: string, start: string, end?: string): string {
  const lines = markdown.split(lineBreak);
  const from = lines.findIndex((line) => line.startsWith(start));
  if (from === -1) {
    throw new Error(`Guide section not found: ${start}`);
  }
  const rest = lines.slice(from + 1);
  const to = end === undefined ? -1 : rest.findIndex((line) => line.startsWith(end));
  return (to === -1 ? rest : rest.slice(0, to)).join('\n').trim();
}

/** Drops the leading `# Title` line (the docs page supplies its own heading). */
export function withoutTitle(markdown: string): string {
  return markdown.replace(/^# .*\r?\n/, '').trim();
}

/** The inside of an excerpt that is one fenced block (a filled brief in a `md` fence). */
export function unfence(markdown: string): string {
  const lines = markdown.trim().split(lineBreak);
  const fence = '```';
  const fenced =
    lines.length > 1 && lines[0].startsWith(fence) && lines[lines.length - 1] === fence;
  return fenced ? lines.slice(1, -1).join('\n') : markdown;
}
