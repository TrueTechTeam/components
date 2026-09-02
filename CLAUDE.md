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

Releases run automatically on push to `master` via `.github/workflows/publish.yml`
(semantic-release: versions from Conventional Commits, publishes to npm using OIDC trusted
publishing — no `NPM_TOKEN` secret). To release manually:

```bash
npx semantic-release --no-ci
```
