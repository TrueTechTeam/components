# Motion

Motion exists to **explain change**: where something came from, where it went, what is related
and that the system responded. Motion that explains nothing is noise and a potential
accessibility problem.

## MOTION-1 - Animate only with purpose

Good reasons to animate:

1. **Feedback.** A press, toggle or hover responded (≤ 100–150ms).
2. **Continuity.** A popover grows from its trigger, an accordion expands in place, a dialog
   enters.
3. **Orientation.** Something moved, was added or was removed (a list item collapsing out).
4. **Waiting.** A spinner, skeleton shimmer or progress.

Bad reasons: decoration, "delight" on every element, entrance animations on content users came to
read. `Reveal`, `CountUp` and `FlipCard` are for marketing and storytelling surfaces. Keep them out
of routine product screens.

## MOTION-2 - Duration and easing

| Change                                                   | Duration                     | Easing                                |
| -------------------------------------------------------- | ---------------------------- | ------------------------------------- |
| Color, background, border on hover or press              | `--duration-instant` (100ms) | `--ease-standard`                     |
| Small control state (checkbox, toggle thumb, tooltip in) | `--duration-fast` (150ms)    | `--ease-standard`                     |
| Menu, dropdown, popover, accordion, tab indicator        | `--duration-normal` (250ms)  | `--ease-enter` in / `--ease-exit` out |
| Dialog, drawer, sidebar, full-panel transitions          | `--duration-slow` (350ms)    | `--ease-enter` in / `--ease-exit` out |

- Exits SHOULD be about 20–30% shorter than entrances. Users are already moving on.
- Larger distance or area → longer duration, but MUST NOT exceed ~400ms for UI responses. Past
  that, the interface feels sluggish (Doherty threshold; NN/g 0.1s/1s limits).
- Never `linear`, except for continuous rotations (spinners) and progress.
- Animate `transform` and `opacity` only (GPU-composited). Avoid animating `width`, `height`, `top`
  or `left` on large elements. `Collapse` and `Accordion` handle height for you.
- MUST NOT use `transition: all`. List the properties explicitly so unrelated properties don't
  animate.

## MOTION-3 - Reduced motion (MUST)

Honor `prefers-reduced-motion: reduce` (WCAG 2.3.3, and vestibular disorders affect a significant
share of adults):

```scss
@media (prefers-reduced-motion: reduce) {
  .panel {
    transition-duration: 0.01ms;
    animation: none;
  }
}
```

- Remove movement (slides, zooms, parallax, flips, auto-advancing carousels). Opacity fades MAY
  stay, kept short.
- Keep spinners functional. Slow them down or swap them for a static "Loading…" plus a progress
  cue.
- The `transition()` SCSS mixin already includes this. Hand-written transitions MUST add it.

## MOTION-4 - No unexpected motion

- Nothing moves, blinks or auto-advances for more than 5s without a pause or stop control (WCAG
  2.2.2). `Carousel` autoplay MUST have pause and MUST stop on hover and focus.
- Nothing flashes more than 3 times per second (WCAG 2.3.1).
- Don't animate layout on page load in ways that move content the user is about to click (layout
  shift).
- `StatusIndicator pulse` only for live, attention-worthy states (incident in progress). Show at
  most one pulsing element per screen.
