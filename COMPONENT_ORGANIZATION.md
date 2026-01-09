# Component Organization Structure

## Overview

This document outlines the organizational structure for the `@true-tech-team/ui-components` library. The structure is designed to be intuitive, scalable, and easy to maintain.

## Design Principles

1. **Group by Function** - Components are organized by their primary purpose
2. **Flat Where Possible** - Avoid deep nesting; prefer flat structures within categories
3. **Consistent Naming** - All folders use PascalCase matching component names
4. **Co-location** - Related files (component, styles, tests, stories) stay together
5. **Clear Exports** - Each category has a barrel export for clean imports

## Folder Structure

```
libs/ui-components/src/lib/
├── components/
│   ├── buttons/              # Action & trigger components
│   │   └── Button/
│   ├── overlays/             # Floating UI elements
│   │   ├── Popover/
│   │   ├── Tooltip/
│   │   ├── Dropdown/
│   │   ├── Menu/
│   │   └── Portal/
│   ├── inputs/               # Form input components
│   │   ├── Input/
│   │   ├── Textarea/
│   │   ├── NumberInput/
│   │   ├── PhoneInput/
│   │   ├── TagInput/
│   │   ├── Select/
│   │   ├── Autocomplete/
│   │   ├── Checkbox/
│   │   ├── Radio/
│   │   ├── Toggle/
│   │   ├── Slider/
│   │   ├── Rating/
│   │   ├── ColorPicker/
│   │   ├── DatePicker/
│   │   ├── DateRangePicker/
│   │   └── FilePicker/
│   ├── forms/                # Form composition & utilities
│   │   └── FormBuilder/
│   ├── display/              # Content display components
│   │   └── Icon/
│   └── index.ts              # Main export barrel
├── hooks/                    # Custom React hooks
│   ├── useTheme/
│   ├── usePortal/
│   ├── useClickOutside/
│   ├── useEscapeKey/
│   ├── useFocusTrap/
│   ├── usePopoverPosition/
│   ├── useHover/
│   ├── useDebounce/
│   ├── useFormState/
│   ├── useFormValidation/
│   ├── useRadioGroup/
│   └── index.ts
├── contexts/                 # React contexts
│   ├── ThemeContext/
│   └── index.ts
├── providers/                # Global providers
│   ├── GlobalProvider/
│   └── index.ts
├── types/                    # Shared TypeScript types
│   ├── theme.types.ts
│   ├── component.types.ts
│   └── index.ts
├── utils/                    # Utility functions
│   └── index.ts
├── styles/                   # Global styles & SCSS
│   ├── _reset.scss
│   ├── _global.scss
│   ├── _spacing-classes.scss
│   ├── _flex-classes.scss
│   ├── _theme-classes.scss
│   ├── _component.scss
│   ├── _flex.scss
│   ├── _spacing.scss
│   └── index.scss
└── assets/                   # Static assets
    └── index.ts
```

## Component Categories

### 1. Buttons (`components/buttons/`)
**Purpose:** Interactive action triggers

- **Button** - Primary call-to-action component with multiple variants

### 2. Overlays (`components/overlays/`)
**Purpose:** Floating UI elements that appear above other content

- **Popover** - Contextual floating content container
- **Tooltip** - Hover-triggered information display
- **Dropdown** - Dropdown menu trigger and content
- **Menu** - Composite menu system (Menu, MenuItem, MenuList, MenuGroup, MenuDivider)
- **Portal** - Renders children outside DOM hierarchy (utility for overlays)

### 3. Inputs (`components/inputs/`)
**Purpose:** User input collection components

#### Basic Text Inputs
- **Input** - Standard text input with validation
- **Textarea** - Multi-line text input
- **NumberInput** - Numeric-only input
- **PhoneInput** - International phone number input
- **TagInput** - Multiple tag entry

#### Selection Inputs
- **Select** - Dropdown selection
- **Autocomplete** - Searchable dropdown with filtering
- **Checkbox** - Multi-select boolean input
- **Radio/RadioGroup** - Single-select from options
- **Toggle** - Boolean switch

#### Specialized Inputs
- **Slider** - Range selection with marks
- **Rating** - Star/numeric rating input
- **ColorPicker** - Color selection with format options
- **DatePicker** - Single date selection
- **DateRangePicker** - Date range selection with presets
- **FilePicker** - File upload component

### 4. Forms (`components/forms/`)
**Purpose:** Form composition and state management

- **FormBuilder** - Advanced form composition with validation and state management
  - Includes: hooks (useFormState, useFormValidation) and types

### 5. Display (`components/display/`)
**Purpose:** Content presentation components

- **Icon** - SVG-based icon system (21 icons)

## Import Patterns

### Category-Based Imports (Recommended)
```tsx
// Import from specific category
import { Button } from '@true-tech-team/ui-components/buttons';
import { Popover, Tooltip, Menu } from '@true-tech-team/ui-components/overlays';
import { Input, Select, DatePicker } from '@true-tech-team/ui-components/inputs';
import { FormBuilder, useFormState } from '@true-tech-team/ui-components/forms';
import { Icon } from '@true-tech-team/ui-components/display';
```

### Root-Level Imports (Also Supported)
```tsx
// Import from package root
import { Button, Input, Icon, Tooltip } from '@true-tech-team/ui-components';
```

### Hook Imports
```tsx
import { useTheme, useClickOutside, useDebounce } from '@true-tech-team/ui-components/hooks';
```

### Type Imports
```tsx
import type { ButtonProps, InputProps } from '@true-tech-team/ui-components';
```

## File Organization Per Component

Each component follows a consistent pattern:

```
ComponentName/
├── ComponentName.tsx              # Main component implementation
├── ComponentName.module.scss      # Component-scoped styles
├── ComponentName.stories.tsx      # Storybook documentation
├── ComponentName.test.tsx         # Jest unit tests (optional)
└── index.ts                       # Barrel export
```

### Composite Components (e.g., Menu)
```
Menu/
├── Menu.tsx                       # Main container component
├── MenuItem.tsx                   # Subcomponent
├── MenuList.tsx                   # Subcomponent
├── MenuGroup.tsx                  # Subcomponent
├── MenuDivider.tsx                # Subcomponent
├── MenuContext.tsx                # Shared context
├── Menu.module.scss               # Main styles
├── MenuItem.module.scss           # Subcomponent styles
├── MenuGroup.module.scss          # Subcomponent styles
├── MenuDivider.module.scss        # Subcomponent styles
├── Menu.stories.tsx               # Storybook documentation
├── Menu.test.tsx                  # Tests
└── index.ts                       # Export all parts
```

## Benefits of This Structure

### 1. **Intuitive Navigation**
Developers can quickly find components based on their purpose:
- Need a button? → `components/buttons/`
- Need a form input? → `components/inputs/`
- Need a tooltip or menu? → `components/overlays/`

### 2. **Scalability**
Easy to add new components to existing categories or create new categories as needed.

### 3. **Clear Separation of Concerns**
- Components are separate from hooks
- Contexts and providers have dedicated locations
- Shared utilities and types are centralized

### 4. **Flexible Import Options**
Supports both category-specific imports (tree-shaking friendly) and root-level imports (convenience).

### 5. **Consistent Patterns**
Every component follows the same file structure, making onboarding easier.

### 6. **Maintainability**
Related components are grouped together, making bulk updates and refactoring easier.

## Migration Guide

When adding a new component, follow these steps:

1. **Identify the Category** - Determine if it's a button, overlay, input, form, or display component
2. **Create Component Folder** - Use PascalCase matching the component name
3. **Add Required Files**:
   - `ComponentName.tsx` (required)
   - `ComponentName.module.scss` (required)
   - `ComponentName.stories.tsx` (required)
   - `ComponentName.test.tsx` (recommended)
   - `index.ts` (required)
4. **Export from Category** - Add to category's `index.ts`
5. **Export from Root** - Add to main `components/index.ts`

## Future Category Considerations

As the library grows, consider adding these categories:

- **`components/layout/`** - Grid, Flex, Stack, Spacer, Divider
- **`components/feedback/`** - Alert, Toast, Spinner, Progress, Badge
- **`components/navigation/`** - Tabs, Breadcrumb, Pagination, Stepper
- **`components/data-display/`** - Table, List, Card, Avatar, Tag
- **`components/modals/`** - Modal, Dialog, Drawer, Sheet

## Version

- **Structure Version:** 1.0.0
- **Last Updated:** 2026-01-04
- **Library Version:** 0.0.1
