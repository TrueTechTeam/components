# Accessibility

The target is **WCAG 2.2 Level AA**. That is the legal baseline in most jurisdictions (ADA case law
in the US, the European Accessibility Act / EN 301 549 in the EU since June 2025) and it is also
the usability baseline. Accessibility rules override every other rule in these guidelines.

## A11Y-1 - Contrast

See COLOR-1. Summary: text 4.5:1 (large text 3:1); UI boundaries, states, focus and meaningful
icons 3:1. Never convey meaning by color alone (1.4.1).

## A11Y-2 - Keyboard (MUST)

- Every interactive element is reachable with Tab, in an order that matches the visual order
  (2.1.1, 2.4.3). Don't use positive `tabindex`.
- Composite widgets follow WAI-ARIA APG keyboard patterns: arrow keys inside Tabs, Menu, RadioGroup,
  ButtonToggleGroup, Listbox and Select; Enter/Space activate; Esc closes overlays; Home/End jump.
- Overlays: on open, move focus inside (to the first field, or to the dialog itself). Trap focus
  in modals. On close, return focus to the trigger.
- No keyboard traps (2.1.2) outside of modals.
- Provide a "Skip to content" link on app shells with repeated navigation (2.4.1).

## A11Y-3 - Focus visibility (MUST)

- Use `:focus-visible` (not `:focus`) for focus rings so mouse clicks don't show rings and keyboard
  users always see them.
- The ring is a solid `--focus-ring-width` (2px) outline in `--focus-ring-color` with
  `--focus-ring-offset`, which is `@include focus-ring` in SCSS. It MUST reach 3:1 against the
  adjacent background (1.4.11; meets the 2.4.13 AAA size rule).
- MUST NOT write `outline: none` without a replacement focus style (failure F78).
- Text inputs MAY show focus with a border color change plus a 3:1 ring or shadow (`:focus-within`
  on the wrapper).
- A focused element MUST NOT be fully hidden behind sticky headers, footers or toasts (2.4.11). Use
  `scroll-padding-top` equal to the sticky header height.

## A11Y-4 - Target size

≥ 24 × 24 CSS px for every pointer target, or enough spacing (2.5.8). Prefer 44 × 44 on touch.
Inline text links are exempt. Icon-only buttons at `size="xs"` MUST still have a 24px hit area.

## A11Y-5 - Names, roles, states

- Every control has an accessible name: a visible `label` (preferred), `aria-label` for icon-only
  controls, or `aria-labelledby`.
- The visible label text MUST be contained in the accessible name (2.5.3 Label in Name).
- Expose state: `aria-expanded` (disclosures, menus), `aria-selected` (tabs, options),
  `aria-pressed` (ToggleButton), `aria-checked`, `aria-current="page"` (nav), `aria-invalid` plus
  `aria-describedby` → error message (fields), `aria-busy` (loading regions).
- Use native elements first (`<button>`, `<a href>`, `<input>`). Use ARIA only when no native
  element fits ("No ARIA is better than bad ARIA").
- Decorative icons get `aria-hidden="true"`. Meaningful standalone icons need a text alternative.

## A11Y-6 - Announcements

- Toasts and async status changes go through a live region (`role="status"` /
  `aria-live="polite"`). Errors that block progress use `role="alert"`.
- After form submission with errors, move focus to the error summary or the first invalid field.
- Loading regions: set `aria-busy="true"` while loading, and announce completion if it is not
  obvious.

## A11Y-7 - Forms

See [../patterns/forms.md](../patterns/forms.md). Visible labels, programmatic association, errors
identified in text (3.3.1), suggestions for fixing them (3.3.3), and no relying on placeholder
text. Don't require re-entering information that was already provided in the same flow
(3.3.7 Redundant Entry). Don't use cognitive-test-only authentication (3.3.8): allow paste and
password managers.

## A11Y-8 - Structure

- One `<h1>` per page, with logical heading levels (TYPE-8).
- Landmarks: `<header>`, `<nav>` (with `aria-label` when there is more than one), `<main>` (exactly
  one), `<aside>`, `<footer>`.
- Tables of data use `<table>` semantics with `<th scope>` and a `caption` (DataTable `caption`;
  `captionHidden` keeps it for screen readers only).
- Lists of items use list semantics.

## A11Y-9 - Resilience

- Reflow at 320px and 400% zoom (1.4.10). Text resizes to 200% without loss (1.4.4). Text spacing
  overrides don't break layout (1.4.12).
- Content on hover or focus (tooltips, popovers) is dismissible (Esc), hoverable and persistent
  (1.4.13).
- Respect `prefers-reduced-motion` (MOTION-3) and `prefers-color-scheme` where the app follows the
  OS theme. Use `forced-colors: active` to keep borders and focus visible in Windows High Contrast
  (`outline` survives forced colors, `box-shadow` does not).

## A11Y-10 - Testing (contributors and consumers)

1. Storybook a11y addon (axe): zero violations on every story.
2. Keyboard-only pass: Tab through, operate everything, Esc out of everything.
3. Zoom to 200% and resize to 320px.
4. Toggle dark theme and check contrast again.
5. Screen reader smoke test (VoiceOver or NVDA) for new composite widgets.

Automated tools catch only around 30–40% of issues. Steps 2–5 are not optional for new components.
