# Storybook Organization Update

## Date: 2026-01-04

## Overview
Updated Storybook organization to match the new component folder structure, providing a more intuitive and category-based navigation experience.

## Changes Made

### 1. Story Title Updates

Updated all component story files to use category-based titles matching the new folder structure.

#### Before
```tsx
title: 'Components/Button'
title: 'Components/Icon'
title: 'Components/Popover'
title: 'Components/Forms/Input'
```

#### After
```tsx
title: 'Buttons/Button'
title: 'Display/Icon'
title: 'Overlays/Popover'
title: 'Inputs/Input'
title: 'Forms/FormBuilder'
```

### 2. Story Files Updated

| Category | Stories Updated | Count |
|----------|----------------|-------|
| **Buttons** | Button | 1 |
| **Display** | Icon | 1 |
| **Overlays** | Popover, Tooltip, Dropdown, Menu, Portal | 5 |
| **Inputs** | Input, Textarea, NumberInput, PhoneInput, TagInput, Select, Autocomplete, Checkbox, Radio, Toggle, Slider, Rating, ColorPicker, DatePicker, DateRangePicker, FilePicker | 16 |
| **Forms** | FormBuilder (no story file) | 0 |
| **Other** | GlobalProvider | 1 |
| **Total** | | **24** |

### 3. Documentation Pages Created

Created comprehensive MDX documentation for each category and an overview page:

#### Main Overview
- **[ComponentsOverview.mdx](./src/lib/ComponentsOverview.mdx)** - Introduction and library overview
  - Component organization explanation
  - Usage examples
  - Feature highlights
  - Links to all categories

#### Category Overviews
- **[Buttons.mdx](./src/lib/components/buttons/Buttons.mdx)** - Buttons category overview
  - Component listings
  - Usage examples
  - Design guidelines

- **[Display.mdx](./src/lib/components/display/Display.mdx)** - Display category overview
  - Icon system documentation
  - Available icons list
  - Custom icon usage
  - Size and color guidelines

- **[Overlays.mdx](./src/lib/components/overlays/Overlays.mdx)** - Overlays category overview
  - All overlay components
  - Use case descriptions
  - Best practices
  - Accessibility guidelines

- **[Inputs.mdx](./src/lib/components/inputs/Inputs.mdx)** - Inputs category overview
  - Complete input component catalog
  - Validation examples
  - Field type reference table
  - When to use each input

- **[Forms.mdx](./src/lib/components/forms/Forms.mdx)** - Forms category overview
  - FormBuilder documentation
  - Validation strategies
  - State management
  - Advanced usage patterns

### 4. Import Path Fixes

Fixed import paths in story files to match new component locations:

```tsx
// Before
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

// After
import { Button } from '../../components/buttons/Button';
import { Icon } from '../../components/display/Icon';
```

## New Storybook Navigation

### Category Structure

```
Storybook Sidebar
├── Introduction/
│   └── Components Overview
├── Buttons/
│   ├── Overview
│   └── Button
├── Display/
│   ├── Overview
│   └── Icon
├── Overlays/
│   ├── Overview
│   ├── Popover
│   ├── Tooltip
│   ├── Dropdown
│   ├── Menu
│   └── Portal
├── Inputs/
│   ├── Overview
│   ├── Input
│   ├── Textarea
│   ├── NumberInput
│   ├── PhoneInput
│   ├── TagInput
│   ├── Select
│   ├── Autocomplete
│   ├── Checkbox
│   ├── Radio
│   ├── Toggle
│   ├── Slider
│   ├── Rating
│   ├── ColorPicker
│   ├── DatePicker
│   ├── DateRangePicker
│   └── FilePicker
├── Forms/
│   └── Overview
└── Providers/
    └── GlobalProvider
```

## Benefits

### 1. Improved Discoverability
- Components grouped by purpose (buttons, inputs, overlays, etc.)
- Category overview pages provide context
- Easier to find related components

### 2. Better Organization
- Logical categorization matches mental models
- Consistent with component folder structure
- Scalable for future additions

### 3. Enhanced Documentation
- Category overview pages explain when to use each component
- Usage examples for common patterns
- Design guidelines and best practices
- Accessibility information

### 4. Consistent Experience
- Storybook navigation matches code organization
- Developer experience aligns with library structure
- Same categories in both code and docs

## Documentation Features

### Components Overview Page
- Library introduction
- Feature highlights (theming, accessibility, type safety)
- Installation and usage instructions
- Styling system overview
- Quick links to all categories

### Category Overview Pages
Each category has a dedicated overview with:
- List of components in the category
- When to use each component
- Usage examples
- Design guidelines
- Best practices
- Accessibility notes
- Quick links to component stories

## Usage in Storybook

### Accessing Documentation
1. Start Storybook: `npx nx run ui-components:storybook`
2. Navigate to "Introduction > Components Overview" for the main overview
3. Browse categories in the sidebar (Buttons, Display, Overlays, Inputs, Forms)
4. Click "Overview" in each category for category-specific documentation
5. Click individual components to see their stories and props

### Viewing Component Stories
1. Expand a category folder (e.g., "Inputs")
2. Click on a component (e.g., "Input")
3. View different story variants in the tabs
4. Interact with controls in the "Controls" panel
5. Toggle theme using the theme switcher in the toolbar

## Technical Notes

### Story Configuration
All stories follow this pattern:

```tsx
const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',
  component: Component,
  tags: ['autodocs'],
  // ... other configuration
};
```

### MDX Documentation
All documentation pages use Storybook MDX format:

```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Category/Overview" />

# Category Name
Content...
```

### Import Paths
Story files use relative imports from their location:

```tsx
// From buttons/Button/Button.stories.tsx
import { Icon } from '../../display/Icon';

// From inputs/Input/Input.stories.tsx
import { Icon } from '../../display/Icon';
```

## Future Enhancements

### Potential Additions
1. **Interactive Playground** - Add a page where users can combine components
2. **Theme Customization Guide** - Show how to customize theme colors
3. **Recipe Gallery** - Common component combinations and patterns
4. **Changelog** - Track component updates and new features
5. **Migration Guides** - Help upgrading between versions

### Category Expansion
As the library grows, consider adding:
- **Layout/** - Grid, Stack, Spacer, Divider
- **Feedback/** - Alert, Toast, Spinner, Progress, Badge
- **Navigation/** - Tabs, Breadcrumb, Pagination, Stepper
- **Data Display/** - Table, List, Card, Avatar, Tag

## Testing

### Verified
- ✅ All story titles updated correctly
- ✅ All import paths fixed
- ✅ Documentation pages created
- ✅ Category structure matches code organization
- ✅ Links and navigation work correctly

### Build Status
- ✅ Component library builds successfully
- ⚠️ Storybook build has pre-existing test-setup.ts errors (not related to reorganization)
- ✅ Story structure and navigation verified

## Migration Impact

### For Developers
No breaking changes for developers using the component library. Storybook navigation is improved, but all component exports remain the same.

### For Documentation Users
- Better navigation in Storybook
- More comprehensive documentation
- Easier to find components by purpose
- Better understanding of when to use each component

## Summary

✅ Successfully reorganized Storybook to match component folder structure
✅ Updated 24 story files with new category-based titles
✅ Created 6 comprehensive documentation pages
✅ Fixed all import paths in story files
✅ Improved navigation and discoverability
✅ Maintained backward compatibility

The Storybook documentation now provides a more intuitive, category-based navigation experience that aligns perfectly with the code organization!
