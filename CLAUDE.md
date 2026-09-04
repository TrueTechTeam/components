# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the ui-components library.

## Commands

```bash
npm run build                    # Build library
npm run build:production         # Production build
npm test                         # Run tests
npm run test:watch               # Watch mode
npm run lint                     # Lint
npm run lint:fix                 # Lint with auto-fix
npm run storybook                # Start Storybook (localhost:6006)
npm run storybook:build          # Build static Storybook
npm run typecheck                # Type check
```

## Directory Structure

```
src/lib/
├── components/          # UI components organized by category
│   ├── buttons/         # Button, IconButton, ToggleButton, ButtonToggleGroup
│   ├── display/         # Icon, Avatar, Badge, Chip, Pill, Tag, Table, List, KPI, Stat, etc.
│   ├── inputs/          # Input, Select, Checkbox, Radio, Toggle, DatePicker, etc.
│   ├── overlays/        # Portal, Popover, Tooltip, Dropdown, Menu
│   ├── navigation/      # Tabs, Stepper, Breadcrumbs, Navbar, SideNav, Pagination
│   ├── layout/          # Panes, ResponsiveStack, AdaptiveGrid, MasonryLayout
│   ├── forms/           # FormBuilder
│   ├── filters/         # FilterProvider, FilterBar, TextFilter, SelectFilter, etc.
│   └── dnd/             # SortableList, SortableGrid, KanbanBoard, ResizablePanels
├── styles/              # SCSS themes and utilities
│   ├── theme/           # _variables.scss, _colors.scss
│   ├── global/          # Global styles
│   └── mixins/          # SCSS mixins
├── hooks/               # React hooks (useDialog, useAlert, useToast, etc.)
├── contexts/            # ThemeProvider, PageMessagesProvider
├── providers/           # GlobalProvider
├── utils/               # Theme utils, color utils, date utils, validation
├── types/               # TypeScript type definitions
└── assets/              # Icons and static assets
```

## Component Development Guidelines

### File Structure for New Components

Each component should have its own directory:

```
ComponentName/
├── ComponentName.tsx           # Main component
├── ComponentName.module.scss   # Styles (SCSS Module)
├── ComponentName.spec.tsx      # Tests
├── ComponentName.stories.tsx   # Storybook stories
└── index.ts                    # Re-export
```

### Styling Pattern

Use SCSS Modules with CSS custom properties:

```tsx
// ComponentName.module.scss
.container {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--theme-surface);
  color: var(--theme-on-surface);
}

// ComponentName.tsx
import styles from './ComponentName.module.scss';
<div className={styles.container}>...</div>
```

### Export Pattern

1. Export from the component's `index.ts`
2. Add to the category's `index.ts` (e.g., `components/buttons/index.ts`)
3. Category is already re-exported from `components/index.ts`
4. Components are exported via `src/index.ts`

### Props Pattern

Extend base props and use consistent naming:

```tsx
import type { BaseComponentProps, ComponentSize } from '../../types';

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: ComponentSize; // 'sm' | 'md' | 'lg'
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}
```

### Storybook Stories

Use CSF3 format with autodocs:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
};
```

## CSS Custom Properties

Available in `styles/theme/_variables.scss`:

- **Spacing**: `--spacing-xs` (4px) to `--spacing-xxl` (48px)
- **Radius**: `--radius-none`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`
- **Typography**: `--font-size-xs` to `--font-size-4xl`, `--font-weight-light` to `--font-weight-bold`
- **Transitions**: `--transition-fast`, `--transition-normal`, `--transition-slow`
- **Z-index**: `--z-dropdown`, `--z-sticky`, `--z-modal`, `--z-popover`, `--z-tooltip`

## Testing

- Use React Testing Library
- Test user interactions, not implementation details
- Test accessibility with `@testing-library/jest-dom`

## Publishing

The npm package name is `@true-tech-team/react-components` (the published name — a historical
mismatch with the `ui-components` name used in imports and this repo's name). Consumers install
it under the `ui-components` name via an npm alias:

```json
"dependencies": {
  "@true-tech-team/ui-components": "npm:@true-tech-team/react-components@^1.0.1"
}
```

so `import { Button } from '@true-tech-team/ui-components'` keeps working without changes.

**Consumers must explicitly import the compiled stylesheet once**, near the app root:

```ts
import '@true-tech-team/ui-components/index.css';
```

This didn't used to be necessary inside the monorepo, where apps resolved this package straight
from `src/index.ts` and rode along on its internal `import './lib/styles/index.scss'` side effect.
A real npm install doesn't carry that side effect — Vite's library build extracts styles into a
separate `dist/index.css`, so it needs a real import.

**Every component here is client-only** (`src/index.ts` starts with `'use client';`), but Vite's
library build strips that directive from the compiled output. `vite.config.ts` restores it via
`rollupOptions.output.banner`. Without it, Next.js App Router consumers fail at build time with
`TypeError: (0, e.createContext) is not a function` — the RSC pipeline treats the module as a
Server Component and calling client-only React APIs (`createContext`, hooks) blows up. If you ever
split this library into server-safe and client-only entry points, only the client entry needs the
banner.

Releases run automatically on push to `master` via `.github/workflows/publish.yml`. See
**Deployment & Releases** below for the full mechanics.

## Before Committing

Run these and make sure they all pass — the same checks CI runs on every PR:

```bash
npm run lint          # eslint . --max-warnings=0
npm run typecheck     # tsc --noEmit -p tsconfig.lib.json
npm test              # jest
npm run build         # vite build
```

`npx lint-staged` also runs automatically on `git commit` via Husky (Prettier + ESLint on staged
files) — don't bypass it with `--no-verify`.

## Commit Messages

[Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint
(`commitlint.config.js` → `@commitlint/config-conventional`) on every PR via
`.github/workflows/pr.yml`. Format: `type(scope): subject`.

```
feat(button): add loading state
fix(dialog): correct focus trap on close
chore(deps): bump vite to 7.3.6
```

Commit messages matter here beyond style — semantic-release parses them to decide the next
version number and to write the changelog (`feat` → minor, `fix` → patch, `BREAKING CHANGE:` in
the body or `!` after the type → major). A vague message produces a vague changelog entry.

## Pull Requests

Target `master`. `.github/workflows/pr.yml` runs commitlint on the PR title/commits plus lint,
typecheck, test, and build — all must pass before merging. There's no separate deploy step tied
to PRs; nothing publishes until the PR is merged and lands on `master`.

## Deployment & Releases

Two independent things happen on every push to `master`:

**1. npm package** (`.github/workflows/publish.yml`, via [semantic-release](https://semantic-release.gitbook.io/)):

- Dry-runs versioning first; if there are no releasable commits (no `feat`/`fix`/`BREAKING CHANGE`
  since the last release), the rest of the job is skipped.
- `@semantic-release/commit-analyzer` + `release-notes-generator` determine the next version and
  changelog from commit messages; `@semantic-release/changelog` writes `CHANGELOG.md`.
- `@semantic-release/npm` (`npmPublish: false`) writes that version into `dist/package.json` —
  it does **not** handle authentication or publishing itself.
- `@semantic-release/exec` runs the actual `npm publish` from `dist/`, relying on npm's OIDC
  trusted publishing (the workflow has `permissions: id-token: write`, no `NPM_TOKEN` secret).
  This split exists because `@semantic-release/npm`'s own publish step insists on a working
  `npm whoami` first, which OIDC-only auth doesn't support (there's no persistent token to check) —
  a plain `npm publish` invocation performs the OIDC exchange itself and works fine.
- `@semantic-release/git` commits the version bump + changelog back to `master` and tags it.
- `@semantic-release/github` creates a GitHub Release.

To release manually (e.g. to debug the pipeline), run `npx semantic-release --no-ci` with a valid
`GITHUB_TOKEN` in the environment.

**2. Storybook** deploys to Netlify via Netlify's own git integration (not GitHub Actions) — it
watches `master` directly per `netlify.toml` (`npm run storybook:build`, publishes
`dist/storybook`). No repo-side action needed; it just happens on push.
