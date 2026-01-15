# CSS Variable Pattern

This document explains how to use CSS custom properties (CSS variables) in component styles.

## Why CSS Variables?

CSS variables enable:
1. **Runtime Customization**: Change values without recompiling
2. **Theme Integration**: Automatic light/dark mode support
3. **Variant Overrides**: Change colors/sizes per variant
4. **Component Customization**: Users can override via style prop
5. **Scoped Styling**: Component-level variables don't leak

## Basic Pattern

### Step 1: Define Variables with Defaults

```scss
.badge {
  // Define CSS variables with default values
  --badge-bg: var(--theme-primary-100);
  --badge-color: var(--theme-primary-700);
  --badge-padding: var(--spacing-sm);
  --badge-font-size: var(--font-size-sm);
  --badge-border-radius: var(--radius-sm);

  // Use variables in properties
  background: var(--badge-bg);
  color: var(--badge-color);
  padding: var(--badge-padding);
  font-size: var(--badge-font-size);
  border-radius: var(--badge-border-radius);
}
```

### Step 2: Override in Variants

```scss
.badge {
  --badge-bg: var(--theme-primary-100);
  --badge-color: var(--theme-primary-700);

  background: var(--badge-bg);
  color: var(--badge-color);

  // Override for secondary variant
  &[data-variant='secondary'] {
    --badge-bg: var(--theme-secondary-100);
    --badge-color: var(--theme-secondary-700);
  }

  // Override for success variant
  &[data-variant='success'] {
    --badge-bg: var(--theme-success-100);
    --badge-color: var(--theme-success-700);
  }
}
```

### Step 3: Override in Sizes

```scss
.badge {
  --badge-padding: var(--spacing-sm);
  --badge-font-size: var(--font-size-sm);

  padding: var(--badge-padding);
  font-size: var(--badge-font-size);

  // Override for small size
  &[data-size='sm'] {
    --badge-padding: 2px var(--spacing-xs);
    --badge-font-size: var(--font-size-xs);
  }

  // Override for large size
  &[data-size='lg'] {
    --badge-padding: var(--spacing-sm) var(--spacing-md);
    --badge-font-size: var(--font-size-base);
  }
}
```

## CRITICAL: Spacing in CSS Variables

⚠️ **MOST COMMON MISTAKE**: Using `spacing()` function in CSS variables

### The Problem

```scss
.badge {
  // ❌ WRONG - spacing() is NOT evaluated in CSS variables
  --badge-padding: spacing(2);

  padding: var(--badge-padding);
  // Results in: padding: spacing(2);  (literal string, not 8px!)
}
```

**Why This Fails**:
- `spacing()` is an SCSS function
- SCSS functions are evaluated at **build time**
- CSS variables are evaluated at **runtime**
- Build-time functions cannot be used in runtime values

### The Solution

```scss
.badge {
  // ✅ CORRECT - Use pre-defined spacing variables
  --badge-padding: var(--spacing-sm);  // 8px

  // ✅ CORRECT - Use calc() with spacing unit
  --badge-padding: calc(var(--spacing-unit) * 2);  // 8px

  padding: var(--badge-padding);
}
```

### When You CAN Use spacing()

```scss
.badge {
  // ✅ CORRECT - Direct CSS properties CAN use spacing()
  padding: spacing(2);  // Compiles to: padding: 8px;
  margin: spacing(1);   // Compiles to: margin: 4px;

  // ❌ WRONG - CSS variables CANNOT use spacing()
  --badge-padding: spacing(2);

  // ✅ CORRECT - CSS variables use pre-defined variables
  --badge-padding: var(--spacing-sm);
}
```

### Available Pre-defined Spacing Variables

```scss
--spacing-xs:   4px   // spacing(1)
--spacing-sm:   8px   // spacing(2)
--spacing-md:   16px  // spacing(4)
--spacing-lg:   24px  // spacing(6)
--spacing-xl:   32px  // spacing(8)
--spacing-xxl:  48px  // spacing(12)
--spacing-unit: 4px   // Base unit for calc()
```

**Usage**:
```scss
.component {
  // Direct property - can use spacing()
  padding: spacing(2);  // ✅ 8px

  // CSS variable - use pre-defined variable
  --component-padding: var(--spacing-sm);  // ✅ 8px

  // CSS variable - or use calc()
  --component-padding: calc(var(--spacing-unit) * 2);  // ✅ 8px
}
```

## Pattern Examples

### Example 1: Simple Badge

```scss
.badge {
  // Variables with defaults
  --badge-bg: var(--theme-primary-100);
  --badge-color: var(--theme-primary-700);
  --badge-padding: var(--spacing-xs) var(--spacing-sm);
  --badge-font-size: var(--font-size-sm);

  // Apply variables
  display: inline-flex;
  align-items: center;
  background: var(--badge-bg);
  color: var(--badge-color);
  padding: var(--badge-padding);
  font-size: var(--badge-font-size);
  border-radius: var(--radius-sm);

  // Variant overrides
  &[data-variant='danger'] {
    --badge-bg: var(--theme-error-100);
    --badge-color: var(--theme-error-700);
  }

  // Size overrides
  &[data-size='sm'] {
    --badge-padding: 2px var(--spacing-xs);
    --badge-font-size: var(--font-size-xs);
  }

  // State overrides
  &:hover:not([data-disabled='true']) {
    --badge-bg: var(--theme-primary-200);  // Darker on hover
  }
}
```

### Example 2: Button with Multiple Variables

```scss
.button {
  // Background variables
  --button-bg: var(--theme-primary);
  --button-bg-hover: var(--theme-primary-hover);
  --button-bg-active: var(--theme-primary-active);

  // Text variables
  --button-color: var(--theme-text-on-primary);

  // Border variables
  --button-border-color: transparent;
  --button-border-width: 0;

  // Spacing variables
  --button-padding-x: var(--spacing-md);
  --button-padding-y: var(--spacing-sm);

  // Size variables
  --button-font-size: var(--font-size-base);
  --button-min-height: 40px;

  // Apply variables
  background: var(--button-bg);
  color: var(--button-color);
  border: var(--button-border-width) solid var(--button-border-color);
  padding: var(--button-padding-y) var(--button-padding-x);
  font-size: var(--button-font-size);
  min-height: var(--button-min-height);

  &:hover {
    background: var(--button-bg-hover);
  }

  &:active {
    background: var(--button-bg-active);
  }

  // Outline variant
  &[data-variant='outline'] {
    --button-bg: transparent;
    --button-bg-hover: var(--theme-primary-50);
    --button-color: var(--theme-primary);
    --button-border-color: var(--theme-primary);
    --button-border-width: 1px;
  }
}
```

### Example 3: Interactive Chip with States

```scss
.chip {
  // Base variables
  --chip-bg: var(--theme-primary-100);
  --chip-color: var(--theme-primary-700);
  --chip-padding: var(--spacing-xs) var(--spacing-sm);
  --chip-transition: all 0.15s ease;

  // Apply variables
  background: var(--chip-bg);
  color: var(--chip-color);
  padding: var(--chip-padding);
  transition: var(--chip-transition);

  // Hover state
  &:hover:not([data-disabled='true']) {
    --chip-bg: var(--theme-primary-200);
  }

  // Selected state
  &[data-selected='true'] {
    --chip-bg: var(--theme-primary-500);
    --chip-color: var(--theme-text-on-primary);
  }

  // Disabled state
  &[data-disabled='true'] {
    --chip-bg: var(--theme-neutral-100);
    --chip-color: var(--theme-text-disabled);
  }
}
```

## Theme Integration

CSS variables automatically inherit theme colors:

```scss
.badge {
  // These variables change automatically in dark mode
  --badge-bg: var(--theme-primary-100);     // Light: #dbeafe, Dark: #1e3a8a
  --badge-color: var(--theme-primary-700);  // Light: #1d4ed8, Dark: #bfdbfe
  --badge-text: var(--theme-text-primary);  // Light: #111827, Dark: #f9fafb

  background: var(--badge-bg);
  color: var(--badge-color);
}
```

**Available Theme Variables**:
```scss
// Colors
--theme-primary, --theme-primary-hover, --theme-primary-active
--theme-secondary, --theme-secondary-hover, --theme-secondary-active
--theme-success, --theme-warning, --theme-error, --theme-info

// Text
--theme-text-primary, --theme-text-secondary, --theme-text-tertiary
--theme-text-disabled, --theme-text-on-primary

// Backgrounds
--theme-background-primary, --theme-background-secondary, --theme-surface-primary

// Borders
--theme-border-primary, --theme-border-secondary, --theme-border-focus

// Color shades (100-900)
--theme-primary-100, --theme-primary-200, ... --theme-primary-900
--theme-secondary-100, ... --theme-secondary-900
```

## User Customization

Users can override CSS variables via style prop:

```tsx
// User code
<Badge
  style={{
    '--badge-bg': '#ff0000',
    '--badge-color': '#ffffff',
    '--badge-padding': '4px 12px'
  } as React.CSSProperties}
>
  Custom Badge
</Badge>
```

Component should support this pattern:

```tsx
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={styles.badge}
        style={style}  // User can override CSS variables
        {...props}
      />
    );
  }
);
```

## Responsive Variables

CSS variables can change with media queries:

```scss
.badge {
  --badge-padding: var(--spacing-xs) var(--spacing-sm);
  --badge-font-size: var(--font-size-sm);

  padding: var(--badge-padding);
  font-size: var(--badge-font-size);

  @media (min-width: 768px) {
    --badge-padding: var(--spacing-sm) var(--spacing-md);
    --badge-font-size: var(--font-size-base);
  }
}
```

## calc() with CSS Variables

You can use `calc()` with CSS variables:

```scss
.badge {
  --badge-size: 24px;
  --badge-icon-size: calc(var(--badge-size) * 0.6);

  height: var(--badge-size);
  width: var(--badge-size);

  .icon {
    font-size: var(--badge-icon-size);  // 14.4px
  }
}
```

With spacing unit:

```scss
.badge {
  --badge-padding: calc(var(--spacing-unit) * 2);  // 8px
  --badge-margin: calc(var(--spacing-unit) * 3);   // 12px

  padding: var(--badge-padding);
  margin: var(--badge-margin);
}
```

## Common Patterns

### Pattern: Hover State Override

```scss
.component {
  --component-bg: var(--theme-primary-100);
  background: var(--component-bg);

  &:hover:not([data-disabled='true']) {
    --component-bg: var(--theme-primary-200);  // Darker on hover
  }
}
```

### Pattern: Multiple States

```scss
.component {
  --component-opacity: 1;
  --component-cursor: pointer;

  opacity: var(--component-opacity);
  cursor: var(--component-cursor);

  &[data-disabled='true'] {
    --component-opacity: 0.6;
    --component-cursor: not-allowed;
  }

  &[data-loading='true'] {
    --component-cursor: wait;
  }
}
```

### Pattern: Computed Values

```scss
.component {
  --component-size: 40px;
  --component-padding: calc(var(--component-size) * 0.25);
  --component-border-radius: calc(var(--component-size) * 0.1);

  height: var(--component-size);
  padding: var(--component-padding);    // 10px
  border-radius: var(--component-border-radius);  // 4px
}
```

## Debugging CSS Variables

In browser DevTools:

```css
/* View computed values */
.badge {
  --badge-bg: var(--theme-primary-100);
  /* Computed: --badge-bg: #dbeafe */

  background: var(--badge-bg);
  /* Computed: background: rgb(219, 234, 254) */
}
```

You can inspect and modify CSS variables in real-time in DevTools.

## Summary

**Key Rules**:
1. ✅ Define CSS variables with defaults
2. ✅ Override in variants, sizes, and states
3. ✅ Use pre-defined spacing variables (NOT `spacing()`)
4. ✅ Use theme color variables for automatic theming
5. ✅ Support user customization via style prop
6. ✅ Use `calc()` for computed values
7. ❌ NEVER use `spacing()` or other SCSS functions in CSS variables
8. ❌ NEVER hardcode colors - use theme variables

**Benefits**:
- Runtime customization
- Automatic dark mode support
- Easy variant overrides
- User customization
- Responsive values
- Scoped styling

For more patterns, see:
- [data-attribute-pattern.md](./data-attribute-pattern.md) - Data attribute usage
- [spacing-system.md](./spacing-system.md) - Spacing guidelines
- [reference-components.md](./reference-components.md) - Component examples
