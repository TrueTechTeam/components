# UI Components Design Guidelines

Design rules and decision trees for **`@true-tech-team/ui-components`**, written for coding agents
first and humans second. They cover two audiences:

- **Consumers.** Apps that import this library and need to pick components, lay out screens, choose
  colors and spacing, and stay accessible.
- **Contributors.** Agents and developers changing or adding components inside the library.

Every rule comes from a published standard (WCAG 2.2, WAI-ARIA APG), peer-reviewed or industry UX
research (Nielsen Norman Group, Baymard Institute), or a mature design system (Material 3, Carbon,
Atlassian, Apple HIG). Citations are listed in [sources.md](sources.md).

## How to use these guidelines (agents read this first)

1. Start at **[decision-tree.md](decision-tree.md)**. It routes any UI task to the file that
   answers it.
2. Follow the tree to a leaf and **apply the rule exactly as written**. Do not invent a new
   pattern when a rule already covers the case.
3. When two rules seem to conflict, use this precedence:
   1. Accessibility (WCAG 2.2 AA) - [foundations/accessibility.md](foundations/accessibility.md)
   2. Explicit rules in these guidelines (MUST / MUST NOT)
   3. Existing component behaviour and props in this library
   4. SHOULD-level recommendations
   5. Your own taste. Use it only when nothing above applies, and say so in your summary.
4. Never hardcode a value that a token covers: color, spacing, radius, font size, shadow, z-index,
   duration or easing. See [foundations/tokens.md](foundations/tokens.md).

### Rule vocabulary

These keywords follow RFC 2119:

| Keyword                 | Meaning                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| **MUST / MUST NOT**     | Required. Breaking it is a bug or an accessibility failure.       |
| **SHOULD / SHOULD NOT** | Default. Deviate only for a reason you can state in one sentence. |
| **MAY**                 | Optional. Use judgment.                                           |

Rule IDs (for example `COLOR-3`, `CHOOSE-INPUT-2`) are stable, so you can cite them in code
review comments, commit messages and PR descriptions.

## Index

| File                                                                       | Answers                                                                        |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [decision-tree.md](decision-tree.md)                                       | **Start here.** Routes a task to the right rule set.                           |
| [components/choosing.md](components/choosing.md)                           | Which component to use: actions, inputs, feedback, overlays, nav, data, labels |
| [components/catalog.md](components/catalog.md)                             | Every exported component: purpose, use-when, avoid-when, key props             |
| [foundations/tokens.md](foundations/tokens.md)                             | All CSS custom properties and when to use each                                 |
| [foundations/color.md](foundations/color.md)                               | Color roles, contrast, semantic colors, dark mode, color-picking               |
| [foundations/typography.md](foundations/typography.md)                     | Type scale, hierarchy, line length, line height, weights                       |
| [foundations/spacing-layout.md](foundations/spacing-layout.md)             | 4px grid, spacing choice, grouping, page layout, breakpoints, density          |
| [foundations/elevation-shape.md](foundations/elevation-shape.md)           | Borders, radius, shadows, z-index, surface layering                            |
| [foundations/motion.md](foundations/motion.md)                             | Durations, easing, reduced motion, what to animate                             |
| [foundations/accessibility.md](foundations/accessibility.md)               | Contrast, target size, focus, keyboard, ARIA, screen readers                   |
| [foundations/labels.md](foundations/labels.md)                             | Translatable built-in text: resolution order, `ui.` prefix, keys               |
| [patterns/forms.md](patterns/forms.md)                                     | Form layout, labels, validation, errors, buttons                               |
| [patterns/data-display.md](patterns/data-display.md)                       | Tables vs lists vs cards, filtering, pagination, KPIs, alignment               |
| [patterns/feedback-states.md](patterns/feedback-states.md)                 | Loading, empty, error and success states; notifications; confirmations         |
| [patterns/page-layout.md](patterns/page-layout.md)                         | App shells, navigation structure, dashboards, responsive behaviour             |
| [app/README.md](app/README.md)                                             | Building a page from an outline + sample response with the `/app` templates    |
| [app/page-brief.md](app/page-brief.md)                                     | The brief to fill before building a page                                       |
| [app/choosing-a-page.md](app/choosing-a-page.md)                           | Data table vs details vs dashboard vs form page, and how to configure each     |
| [app/field-display.md](app/field-display.md)                               | API field types → `FieldKind`; column vs summary vs detail-only                |
| [app/hierarchy.md](app/hierarchy.md)                                       | Priority, primary action, above the fold, progressive disclosure, tabs         |
| [app/states.md](app/states.md)                                             | Required states per template and widget                                        |
| [app/plumbing.md](app/plumbing.md)                                         | URL vs local vs page state, polling, permissions, feedback, providers, Next.js |
| [app/example.md](app/example.md)                                           | Worked example: campaigns list and details page, from outline to code          |
| [contributing/component-checklist.md](contributing/component-checklist.md) | Design and quality bar for creating or updating a component in the library     |
| [sources.md](sources.md)                                                   | Research citations                                                             |

## Setup reminder for consumers

```tsx
// Once, at the app root
import '@true-tech-team/ui-components/index.css';
import { GlobalProvider } from '@true-tech-team/ui-components';

<GlobalProvider themeConfig={{ mode: 'light' }}>
  <App />
</GlobalProvider>;
```

Without the CSS import, components render unstyled. Every component is client-only. In the Next.js
App Router, import them from files marked `'use client'`. The package build already adds this
directive.
