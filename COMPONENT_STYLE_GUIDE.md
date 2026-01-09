# Component Styling Guide

This guide documents the styling patterns and best practices for all components in the `@true-tech-team/ui-components` library.

## Table of Contents

1. [Data Attribute Pattern](#data-attribute-pattern)
2. [CSS Variable Pattern](#css-variable-pattern)
3. [Spacing System](#spacing-system)
4. [SCSS Function Limitations](#scss-function-limitations)
5. [Component Structure](#component-structure)
6. [Examples](#examples)

---

## Data Attribute Pattern

### Overview

All components use **data attributes** for styling variants, sizes, and states instead of dynamically joining CSS class names.

### Why Data Attributes?

✅ **Cleaner Code**: No runtime overhead for class-joining
✅ **Better Performance**: Simple prop assignment instead of array operations
✅ **More Semantic**: Self-documenting HTML attributes
✅ **Modern Standard**: Aligns with React best practices (Radix UI, Chakra UI, MUI v5)
✅ **Easier Maintenance**: Clear separation between structure and styling

### Pattern

**TypeScript/JSX:**

```tsx
return (
  <button
    className={styles.button}
    data-variant={variant}
    data-size={size}
    data-full-width={fullWidth || undefined}
    data-state={getState()}
  >
```

**SCSS:**

```scss
.button {
  // Base styles

  // Variants
  &[data-variant='primary'] {
  }
  &[data-variant='secondary'] {
  }

  // Sizes
  &[data-size='sm'] {
  }
  &[data-size='md'] {
  }
  &[data-size='lg'] {
  }

  // Modifiers
  &[data-full-width='true'] {
    width: 100%;
  }

  // States
  &[data-state='focused'] {
  }
  &[data-state='error'] {
  }
  &[data-state='disabled'] {
  }
}
```

### Rules

1. **Always use data attributes** for:

   - Variants (`data-variant`)
   - Sizes (`data-size`)
   - States (`data-state`)
   - Boolean modifiers (`data-full-width`, `data-icon-only`)

2. **Use `|| undefined`** for boolean attributes to avoid `data-attr="false"` in the DOM:

   ```tsx
   data-full-width={fullWidth || undefined}
   ```

3. **Keep `className` prop** for user-provided custom classes:

   ```tsx
   const classes = [styles.component, className].filter(Boolean).join(' ');
   ```

4. **Always include `data-component`** attribute for component identification:
   ```tsx
   data-component="button"
   data-component="input"
   ```

---

## CSS Variable Pattern

### Overview

Use CSS custom properties (variables) to create flexible, themeable components.

### Pattern

**SCSS:**

```scss
.button {
  // Define default CSS variable values
  --button-bg: var(--theme-primary);
  --button-bg-hover: var(--theme-primary-hover);
  --button-color: var(--theme-text-on-primary);
  --button-gap: var(--spacing-sm);
  --button-radius: var(--radius-md);

  // Apply variables in styles
  background-color: var(--button-bg);
  color: var(--button-color);
  gap: var(--button-gap);
  border-radius: var(--button-radius);

  &:hover {
    background-color: var(--button-bg-hover);
  }

  // Override variables in variants
  &[data-variant='secondary'] {
    --button-bg: var(--theme-secondary);
    --button-bg-hover: var(--theme-secondary-hover);
  }
}
```

### Benefits

- Theme values can be changed globally
- Variants only need to override specific variables
- Reduces CSS duplication
- Easier to maintain consistent styling

---

## Spacing System

### Available Spacing Values

The spacing system uses a 4px base unit:

```scss
--spacing-unit: 4px
--spacing-xs: 4px     // 1 × 4px
--spacing-sm: 8px     // 2 × 4px
--spacing-md: 16px    // 4 × 4px
--spacing-lg: 24px    // 6 × 4px
--spacing-xl: 32px    // 8 × 4px
--spacing-xxl: 48px   // 12 × 4px
```

### Usage in Components

**For CSS Properties (Direct Usage) ✅:**

```scss
gap: spacing(2); // Compiles to 8px
padding: spacing(3); // Compiles to 12px
margin: spacing(4) spacing(2); // Compiles to 16px 8px
```

**For CSS Custom Properties ❌ WRONG:**

```scss
// DON'T DO THIS - spacing() won't be evaluated
--input-gap: spacing(2); // ❌ Outputs literal "spacing(2)"
```

**For CSS Custom Properties ✅ CORRECT:**

```scss
// Use pre-defined variables
--input-gap: var(--spacing-sm); // ✅ 8px

// Or use calc() for custom values
--input-padding-x: calc(var(--spacing-unit) * 3); // ✅ 12px
```

### Spacing Mixins

Use spacing mixins for padding/margin:

```scss
@include px(4); // padding-left and padding-right: 16px
@include py(2); // padding-top and padding-bottom: 8px
@include mx(3); // margin-left and margin-right: 12px
@include my(1); // margin-top and margin-bottom: 4px
```

---

## SCSS Function Limitations

### The Problem

SCSS functions (like `spacing()`) are **compile-time** constructs. CSS custom properties are **runtime** variables. They cannot be mixed.

### ❌ WRONG - Function in CSS Variable

```scss
.button {
  --button-gap: spacing(2); // ❌ Outputs literal "spacing(2)"
  gap: var(--button-gap); // Browser receives invalid CSS
}
```

### ✅ CORRECT - Solutions

**Option 1: Use Pre-defined Spacing Variables**

```scss
.button {
  --button-gap: var(--spacing-sm); // ✅ 8px
  gap: var(--button-gap);
}
```

**Option 2: Use calc() for Custom Values**

```scss
.button {
  --button-gap: calc(var(--spacing-unit) * 2.5); // ✅ 10px
  gap: var(--button-gap);
}
```

**Option 3: Direct Function Call (No Variable)**

```scss
.button {
  gap: spacing(2); // ✅ Compiles directly to 8px
}
```

### Rule of Thumb

- **CSS custom property value?** → Use `var(--spacing-*)` or `calc()`
- **Direct CSS property?** → Use `spacing()` function or mixin

---

## Component Structure

### File Organization

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.scss
│   ├── Button.stories.tsx
│   └── index.ts
```

### TypeScript Component Template

```tsx
import React, { forwardRef } from 'react';
import type { ComponentSize, ComponentVariant, BaseComponentProps } from '../../types';
import styles from './Component.module.scss';

export interface ComponentProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  // ... other props
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      'data-testid': testId,
      style,
      children,
      ...restProps
    },
    ref
  ) => {
    const classes = [styles.component, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        data-component="component"
        data-variant={variant}
        data-size={size}
        data-testid={testId || 'component'}
        style={style}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = 'Component';
```

### SCSS Component Template

```scss
@use '../../styles/mixins/component' as *;
@use '../../styles/mixins/spacing' as *;

.component {
  @include component-reset;

  // Define CSS variables with defaults
  --component-bg: var(--theme-background-primary);
  --component-color: var(--theme-text-primary);
  --component-gap: var(--spacing-sm);
  --component-radius: var(--radius-md);

  // Base styles
  display: flex;
  align-items: center;
  gap: var(--component-gap);
  background-color: var(--component-bg);
  color: var(--component-color);
  border-radius: var(--component-radius);

  // Size variants
  &[data-size='sm'] {
    @include px(3);
    @include py(1.5);
    font-size: var(--font-size-sm);
  }

  &[data-size='md'] {
    @include px(4);
    @include py(2);
    font-size: var(--font-size-base);
  }

  &[data-size='lg'] {
    @include px(6);
    @include py(3);
    font-size: var(--font-size-lg);
  }

  // Variant styles
  &[data-variant='primary'] {
    --component-bg: var(--theme-primary);
    --component-color: var(--theme-text-on-primary);
  }

  &[data-variant='secondary'] {
    --component-bg: var(--theme-secondary);
    --component-color: var(--theme-text-contrast);
  }

  // State styles
  &[data-state='disabled'] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[data-state='error'] {
    --component-bg: var(--theme-error);
  }

  // Modifier styles
  &[data-full-width='true'] {
    width: 100%;
  }
}
```

---

## Examples

### Button Component

**Button.tsx:**

```tsx
const buttonClasses = [styles.button, className].filter(Boolean).join(' ');

return (
  <button
    ref={ref}
    className={buttonClasses}
    data-component="button"
    data-variant={variant}
    data-size={size}
    data-full-width={fullWidth || undefined}
    disabled={disabled}
    {...restProps}
  >
    {children}
  </button>
);
```

**Button.module.scss:**

```scss
.button {
  --button-bg: var(--theme-primary);
  --button-gap: var(--spacing-sm);

  display: inline-flex;
  gap: var(--button-gap);
  background-color: var(--button-bg);

  &[data-size='sm'] {
    @include px(3);
    @include py(1.5);
  }

  &[data-variant='secondary'] {
    --button-bg: var(--theme-secondary);
  }

  &[data-full-width='true'] {
    width: 100%;
  }
}
```

### Input Component

**Input.tsx:**

```tsx
<div className={styles.inputWrapper}>
  <div
    className={styles.inputContainer}
    data-component="input"
    data-variant={variant}
    data-size={size}
    data-state={getInputState()}
  >
    <input className={styles.inputField} {...inputProps} />
  </div>
</div>
```

**Input.module.scss:**

```scss
.inputContainer {
  --input-padding-x: calc(var(--spacing-unit) * 3); // 12px
  --input-padding-y: var(--spacing-sm); // 8px
  --input-gap: var(--spacing-sm); // 8px

  display: flex;
  align-items: center;
  gap: var(--input-gap);
  padding: var(--input-padding-y) var(--input-padding-x);

  &[data-size='sm'] {
    --input-padding-x: calc(var(--spacing-unit) * 2.5); // 10px
    --input-padding-y: calc(var(--spacing-unit) * 1.5); // 6px
  }

  &[data-state='focused'] {
    border-color: var(--theme-primary);
  }

  &[data-state='error'] {
    border-color: var(--theme-error);
  }
}
```

---

## Quick Reference

### Do's ✅

- Use data attributes for variants, sizes, and states
- Use CSS variables for themeable values
- Use pre-defined spacing variables in CSS custom properties
- Use `spacing()` function directly in CSS properties
- Use `calc()` for custom spacing calculations in CSS variables
- Include `data-component` attribute for all components
- Use `|| undefined` for boolean data attributes

### Don'ts ❌

- Don't use class-joining arrays for variants/sizes
- Don't use `spacing()` function in CSS custom property values
- Don't create `data-attr="false"` (use `|| undefined` instead)
- Don't mix compile-time SCSS functions with runtime CSS variables
- Don't skip the `data-component` attribute

---

## Migration Checklist

When refactoring an existing component:

- [ ] Replace class-joining logic with simple className construction
- [ ] Add data attributes for variant, size, state
- [ ] Update SCSS selectors from `&.variant` to `&[data-variant='variant']`
- [ ] Convert nested class selectors to combined attribute selectors
- [ ] Replace `spacing()` in CSS variables with `var(--spacing-*)` or `calc()`
- [ ] Ensure boolean attributes use `|| undefined`
- [ ] Test all variants, sizes, and states in Storybook
- [ ] Verify no visual regressions

---

## Questions?

For questions or suggestions about this style guide, please open an issue or discussion in the repository.

