# Spacing System

This document explains the 4px grid spacing system used throughout the component library.

## Overview

The library uses a **4px base unit** for all spacing to ensure visual consistency and a harmonious layout rhythm.

## Grid System

**Base Unit**: 4px

All spacing values are multiples of 4px:
- 1 unit = 4px
- 2 units = 8px
- 3 units = 12px
- 4 units = 16px
- 6 units = 24px
- 8 units = 32px
- 12 units = 48px

## Pre-defined Spacing Variables

Use these CSS variables for consistent spacing:

```scss
--spacing-xs:   4px    // 1 unit
--spacing-sm:   8px    // 2 units
--spacing-md:   16px   // 4 units
--spacing-lg:   24px   // 6 units
--spacing-xl:   32px   // 8 units
--spacing-xxl:  48px   // 12 units
--spacing-unit: 4px    // Base unit for calc() operations
```

## Usage Methods

### Method 1: Direct CSS Variables (Recommended in CSS Variables)

```scss
.component {
  // ✅ CORRECT - Use in CSS variables
  --component-padding: var(--spacing-sm);
  --component-margin: var(--spacing-md);

  padding: var(--component-padding);  // 8px
  margin: var(--component-margin);    // 16px
}
```

### Method 2: spacing() Function (Direct Properties Only)

```scss
.component {
  // ✅ CORRECT - Use in direct CSS properties
  padding: spacing(2);   // Compiles to: padding: 8px;
  margin: spacing(4);    // Compiles to: margin: 16px;

  // ❌ WRONG - Do NOT use in CSS variables
  --component-padding: spacing(2);  // NOT evaluated!
}
```

### Method 3: Spacing Mixins

```scss
@use '../../../styles/mixins/spacing' as *;

.component {
  // Padding mixins
  @include px(4);  // padding-left: 16px; padding-right: 16px;
  @include py(2);  // padding-top: 8px; padding-bottom: 8px;
  @include p(3);   // padding: 12px;

  // Margin mixins
  @include mx(4);  // margin-left: 16px; margin-right: 16px;
  @include my(2);  // margin-top: 8px; margin-bottom: 8px;
  @include m(3);   // margin: 12px;
}
```

### Method 4: calc() with spacing-unit

```scss
.component {
  // ✅ CORRECT - Use for custom calculations in CSS variables
  --component-padding: calc(var(--spacing-unit) * 2);   // 8px
  --component-margin: calc(var(--spacing-unit) * 3);    // 12px
  --custom-spacing: calc(var(--spacing-unit) * 2.5);    // 10px

  padding: var(--component-padding);
  margin: var(--component-margin);
}
```

## Critical Rules

### Rule 1: CSS Variables Must Use Pre-defined Variables or calc()

```scss
// ❌ WRONG - spacing() not evaluated in CSS variables
.component {
  --component-padding: spacing(2);
  padding: var(--component-padding);  // Results in literal "spacing(2)"
}

// ✅ CORRECT - Use pre-defined variable
.component {
  --component-padding: var(--spacing-sm);
  padding: var(--component-padding);  // Results in 8px
}

// ✅ CORRECT - Use calc()
.component {
  --component-padding: calc(var(--spacing-unit) * 2);
  padding: var(--component-padding);  // Results in 8px
}
```

### Rule 2: Direct Properties Can Use spacing() Function

```scss
// ✅ CORRECT - spacing() works in direct properties
.component {
  padding: spacing(2);   // ✅ Compiles to 8px
  margin: spacing(4);    // ✅ Compiles to 16px
  gap: spacing(3);       // ✅ Compiles to 12px
}
```

### Rule 3: Never Hardcode Pixel Values

```scss
// ❌ WRONG - Hardcoded pixels
.component {
  padding: 8px;
  margin: 16px;
}

// ✅ CORRECT - Use spacing system
.component {
  padding: spacing(2);          // or var(--spacing-sm)
  margin: spacing(4);           // or var(--spacing-md)
}

// ✅ CORRECT - Use mixins
.component {
  @include px(2);  // padding-left/right: 8px
  @include my(4);  // margin-top/bottom: 16px
}
```

## Available Mixins

### Padding Mixins

```scss
@use '../../../styles/mixins/spacing' as *;

// Horizontal padding
@include px(4);  // padding-left: 16px; padding-right: 16px;

// Vertical padding
@include py(2);  // padding-top: 8px; padding-bottom: 8px;

// All sides padding
@include p(3);   // padding: 12px;

// Individual sides
@include pt(2);  // padding-top: 8px;
@include pr(2);  // padding-right: 8px;
@include pb(2);  // padding-bottom: 8px;
@include pl(2);  // padding-left: 8px;
```

### Margin Mixins

```scss
// Horizontal margin
@include mx(4);  // margin-left: 16px; margin-right: 16px;

// Vertical margin
@include my(2);  // margin-top: 8px; margin-bottom: 8px;

// All sides margin
@include m(3);   // margin: 12px;

// Individual sides
@include mt(2);  // margin-top: 8px;
@include mr(2);  // margin-right: 8px;
@include mb(2);  // margin-bottom: 8px;
@include ml(2);  // margin-left: 8px;
```

## Common Spacing Patterns

### Pattern: Badge/Chip Padding

```scss
.badge {
  // Small badge
  &[data-size='sm'] {
    --badge-padding: 2px var(--spacing-xs);  // 2px 4px
  }

  // Medium badge
  &[data-size='md'] {
    --badge-padding: var(--spacing-xs) var(--spacing-sm);  // 4px 8px
  }

  // Large badge
  &[data-size='lg'] {
    --badge-padding: var(--spacing-sm) var(--spacing-md);  // 8px 16px
  }
}
```

### Pattern: Button Padding

```scss
.button {
  &[data-size='sm'] {
    @include px(3);  // 12px horizontal
    @include py(1.5);  // 6px vertical
  }

  &[data-size='md'] {
    @include px(4);  // 16px horizontal
    @include py(2);  // 8px vertical
  }

  &[data-size='lg'] {
    @include px(6);  // 24px horizontal
    @include py(3);  // 12px vertical
  }
}
```

### Pattern: Container Spacing

```scss
.container {
  // Internal spacing
  --container-padding: var(--spacing-md);
  padding: var(--container-padding);

  // Item gaps
  --container-gap: var(--spacing-sm);
  gap: var(--container-gap);

  // Responsive
  @media (min-width: 768px) {
    --container-padding: var(--spacing-lg);
    --container-gap: var(--spacing-md);
  }
}
```

### Pattern: Flex/Grid Gaps

```scss
.flexContainer {
  display: flex;
  gap: var(--spacing-sm);  // 8px between items

  // Responsive gaps
  @media (min-width: 768px) {
    gap: var(--spacing-md);  // 16px on larger screens
  }
}

.gridContainer {
  display: grid;
  gap: var(--spacing-md);  // 16px between grid items
  column-gap: var(--spacing-lg);  // 24px between columns
  row-gap: var(--spacing-md);     // 16px between rows
}
```

## Spacing Scale Reference

| Variable | Value | Units | Use Case |
|----------|-------|-------|----------|
| `--spacing-xs` | 4px | 1 | Tight spacing, small badges |
| `--spacing-sm` | 8px | 2 | Compact components, small gaps |
| `--spacing-md` | 16px | 4 | Default spacing, standard gaps |
| `--spacing-lg` | 24px | 6 | Large components, section spacing |
| `--spacing-xl` | 32px | 8 | Extra large spacing, major sections |
| `--spacing-xxl` | 48px | 12 | Maximum spacing, page sections |

## When to Use Each Method

### Use Direct CSS Variables

```scss
// ✅ When defining CSS variables
.component {
  --component-padding: var(--spacing-sm);
}

// ✅ When value needs to be dynamic/themeable
.component {
  padding: var(--component-padding);  // Can be overridden
}
```

### Use spacing() Function

```scss
// ✅ When hardcoding spacing in direct properties
.component {
  padding: spacing(2);  // Static 8px
  margin: spacing(4);   // Static 16px
}

// ✅ When you need a specific value that won't change
.icon {
  width: spacing(6);   // 24px
  height: spacing(6);  // 24px
}
```

### Use Mixins

```scss
// ✅ When applying directional spacing
.component {
  @include px(4);  // Horizontal padding
  @include py(2);  // Vertical padding
}

// ✅ When spacing is static and won't be overridden
.button {
  @include px(4);
  @include py(2);
}
```

### Use calc()

```scss
// ✅ When creating custom spacing values in CSS variables
.component {
  --custom-spacing: calc(var(--spacing-unit) * 2.5);  // 10px
  --dynamic-padding: calc(var(--spacing-sm) + 2px);   // 10px
}

// ✅ When combining spacing with other values
.component {
  width: calc(100% - var(--spacing-md) * 2);  // Full width minus padding
}
```

## Component Size Guidelines

### Small Components
- Padding: `--spacing-xs` to `--spacing-sm` (4-8px)
- Gaps: `--spacing-xs` (4px)
- Examples: Small badges, compact chips, tight lists

### Medium Components (Default)
- Padding: `--spacing-sm` to `--spacing-md` (8-16px)
- Gaps: `--spacing-sm` to `--spacing-md` (8-16px)
- Examples: Standard buttons, input fields, cards

### Large Components
- Padding: `--spacing-md` to `--spacing-lg` (16-24px)
- Gaps: `--spacing-md` to `--spacing-lg` (16-24px)
- Examples: Large buttons, feature cards, sections

### Containers
- Padding: `--spacing-md` to `--spacing-xl` (16-32px)
- Gaps: `--spacing-md` to `--spacing-lg` (16-24px)
- Examples: Page containers, modal content, panels

## Examples

### Example 1: Badge Component

```scss
.badge {
  // Use CSS variables for themeable spacing
  --badge-padding: var(--spacing-xs) var(--spacing-sm);

  padding: var(--badge-padding);
  gap: var(--spacing-xs);

  // Size overrides
  &[data-size='sm'] {
    --badge-padding: 2px var(--spacing-xs);
  }

  &[data-size='lg'] {
    --badge-padding: var(--spacing-sm) var(--spacing-md);
  }
}
```

### Example 2: Card Component

```scss
.card {
  // Static padding using mixin
  @include p(4);  // 16px all sides

  // Dynamic gap using variable
  --card-gap: var(--spacing-md);
  gap: var(--card-gap);

  // Header padding
  .cardHeader {
    @include px(4);
    @include py(3);
  }

  // Content padding
  .cardContent {
    @include px(4);
    @include py(4);
  }
}
```

### Example 3: List Component

```scss
.list {
  // Container padding
  padding: spacing(4);  // Static 16px

  // Item gaps
  --list-gap: var(--spacing-sm);
  gap: var(--list-gap);

  // Compact variant
  &[data-variant='compact'] {
    --list-gap: var(--spacing-xs);
    padding: spacing(2);
  }
}
```

## Common Mistakes

### Mistake 1: Using spacing() in CSS Variables

```scss
// ❌ WRONG
.component {
  --component-padding: spacing(2);
}

// ✅ CORRECT
.component {
  --component-padding: var(--spacing-sm);
}
```

### Mistake 2: Hardcoding Pixel Values

```scss
// ❌ WRONG
.component {
  padding: 8px;
  margin: 16px;
}

// ✅ CORRECT
.component {
  padding: var(--spacing-sm);
  margin: var(--spacing-md);
}
```

### Mistake 3: Using Non-Grid Values

```scss
// ❌ WRONG - Not on 4px grid
.component {
  padding: 10px;  // Should be 8px or 12px
  margin: 14px;   // Should be 12px or 16px
}

// ✅ CORRECT - On 4px grid
.component {
  padding: spacing(2);  // 8px
  margin: spacing(3);   // 12px
}
```

## Summary

**Key Rules**:
1. ✅ Use 4px grid system for all spacing
2. ✅ Use CSS variables (`var(--spacing-*)`) in CSS variables
3. ✅ Use `spacing()` function in direct CSS properties
4. ✅ Use mixins for directional spacing
5. ✅ Use `calc()` for custom calculations
6. ❌ NEVER use `spacing()` in CSS variables
7. ❌ NEVER hardcode pixel values
8. ❌ NEVER use values not on 4px grid

**Benefits**:
- Visual consistency
- Harmonious rhythm
- Predictable spacing
- Easy maintenance
- Themeable spacing
- Responsive scaling

For more patterns, see:
- [data-attribute-pattern.md](./data-attribute-pattern.md) - Data attribute usage
- [css-variable-pattern.md](./css-variable-pattern.md) - CSS variable usage
- [reference-components.md](./reference-components.md) - Component examples
