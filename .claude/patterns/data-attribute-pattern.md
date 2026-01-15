# Data Attribute Pattern

This document explains the modern data attribute pattern used throughout the component library.

## Why Data Attributes?

The library uses data attributes instead of className concatenation for variants, sizes, and states.

### Benefits

1. **Cleaner Code**: No complex className string manipulation
2. **Better Performance**: Simpler diffing for React
3. **More Semantic**: HTML attributes are self-documenting
4. **Easier Debugging**: Inspect element shows clear `data-variant="primary"`
5. **Modern Pattern**: Follows contemporary React best practices

## Old Pattern (DON'T USE)

```tsx
// ❌ DON'T DO THIS - Old class concatenation pattern
const Badge = ({ variant, size, disabled, className }: BadgeProps) => {
  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
    disabled && styles['badge--disabled'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>Content</span>;
};
```

**Problems**:
- Complex string manipulation
- Hard to read and maintain
- Potential for undefined className keys
- Larger bundle size with many variant/size combinations
- Harder to override in consumer code

## Modern Pattern (USE THIS)

```tsx
// ✅ DO THIS - Modern data attribute pattern
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', disabled = false, className, children, ...restProps }, ref) => {
    const componentClasses = [styles.badge, className].filter(Boolean).join(' ');

    return (
      <span
        ref={ref}
        className={componentClasses}
        data-component="badge"
        data-variant={variant}
        data-size={size}
        data-disabled={disabled || undefined}
        {...restProps}
      >
        {children}
      </span>
    );
  }
);
```

**Advantages**:
- Clean, simple code
- Self-documenting HTML
- Easy to inspect in DevTools
- Simple to test
- Easy to override with CSS

## TSX Usage

### Basic Usage

```tsx
<div
  className={styles.component}
  data-component="myComponent"
  data-variant={variant}
  data-size={size}
>
  Content
</div>
```

### With Optional Props

```tsx
<div
  className={styles.component}
  data-variant={variant}
  data-size={size}
  data-state={state || undefined}  // Only adds if state exists
>
  Content
</div>
```

### Boolean Attributes (IMPORTANT)

```tsx
// ✅ CORRECT - Use || undefined
<div data-disabled={disabled || undefined}>
  Content
</div>
// When disabled=false, attribute is not added
// When disabled=true, attribute is data-disabled="true"

// ❌ WRONG - Creates data-disabled="false"
<div data-disabled={disabled}>
  Content
</div>
// When disabled=false, attribute is data-disabled="false"
// In CSS, data-disabled="false" is truthy! (any value is truthy)
```

**Why This Matters**: In CSS attribute selectors, any value (including `"false"`) matches. Only undefined/null prevents the attribute from being added.

```scss
// This selector matches BOTH data-disabled="true" AND data-disabled="false"
&[data-disabled] {
  opacity: 0.6;  // Applied even when disabled={false}!
}

// To avoid this, always use || undefined for booleans
```

### Multiple Data Attributes

```tsx
<button
  className={styles.button}
  data-component="button"
  data-variant={variant}
  data-size={size}
  data-disabled={disabled || undefined}
  data-loading={isLoading || undefined}
  data-full-width={fullWidth || undefined}
>
  {children}
</button>
```

## SCSS Selectors

### Basic Variant Selectors

```scss
.badge {
  // Base styles
  display: inline-flex;
  align-items: center;

  // Variant styles
  &[data-variant='primary'] {
    background: var(--theme-primary-100);
    color: var(--theme-primary-700);
  }

  &[data-variant='secondary'] {
    background: var(--theme-secondary-100);
    color: var(--theme-secondary-700);
  }

  &[data-variant='success'] {
    background: var(--theme-success-100);
    color: var(--theme-success-700);
  }
}
```

### Size Selectors

```scss
.badge {
  // Size styles
  &[data-size='sm'] {
    font-size: var(--font-size-xs);
    padding: 2px var(--spacing-xs);
  }

  &[data-size='md'] {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  &[data-size='lg'] {
    font-size: var(--font-size-base);
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
```

### State Selectors

```scss
.badge {
  // Disabled state
  &[data-disabled='true'] {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  // Loading state
  &[data-loading='true'] {
    pointer-events: none;
  }

  // Selected state
  &[data-selected='true'] {
    box-shadow: 0 0 0 2px var(--theme-primary-500);
  }
}
```

### Combining Selectors

```scss
.badge {
  // Combine variant and size
  &[data-variant='primary'][data-size='lg'] {
    // Large primary badge specific styles
  }

  // Combine variant and state
  &[data-variant='danger'][data-disabled='true'] {
    background: var(--theme-error-200);  // Lighter when disabled
  }

  // Exclude disabled from hover
  &:hover:not([data-disabled='true']) {
    transform: scale(1.05);
  }
}
```

### Using CSS Variables with Data Attributes

```scss
.badge {
  // Define variables that change with data attributes
  --badge-bg: var(--theme-primary-100);
  --badge-color: var(--theme-primary-700);

  background: var(--badge-bg);
  color: var(--badge-color);

  // Override variables in variants
  &[data-variant='secondary'] {
    --badge-bg: var(--theme-secondary-100);
    --badge-color: var(--theme-secondary-700);
  }

  &[data-variant='success'] {
    --badge-bg: var(--theme-success-100);
    --badge-color: var(--theme-success-700);
  }
}
```

## Testing Data Attributes

### With Testing Library

```tsx
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with correct variant', () => {
    render(<Badge variant="primary">Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).toHaveAttribute('data-variant', 'primary');
  });

  it('renders with correct size', () => {
    render(<Badge size="lg">Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).toHaveAttribute('data-size', 'lg');
  });

  it('adds disabled attribute when disabled', () => {
    render(<Badge disabled>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).toHaveAttribute('data-disabled', 'true');
  });

  it('does not add disabled attribute when not disabled', () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).not.toHaveAttribute('data-disabled');
  });
});
```

## Common Mistakes

### Mistake 1: Not Using || undefined for Booleans

```tsx
// ❌ WRONG
<div data-disabled={disabled}>

// ✅ CORRECT
<div data-disabled={disabled || undefined}>
```

### Mistake 2: Using Class Concatenation

```tsx
// ❌ WRONG
className={[styles.badge, styles[`badge--${variant}`]].join(' ')}

// ✅ CORRECT
className={styles.badge}
data-variant={variant}
```

### Mistake 3: Forgetting data-component Attribute

```tsx
// ❌ WRONG - Missing data-component
<div className={styles.badge} data-variant={variant}>

// ✅ CORRECT - Includes data-component for identification
<div className={styles.badge} data-component="badge" data-variant={variant}>
```

### Mistake 4: Not Filtering Boolean Attributes in SCSS

```scss
// ❌ WRONG - Matches both true and false
&[data-disabled] {
  opacity: 0.6;
}

// ✅ CORRECT - Only matches true (assuming || undefined used in TSX)
&[data-disabled='true'] {
  opacity: 0.6;
}
```

## Migration Guide

If you have existing components using className concatenation:

### Before (Old Pattern)

```tsx
const Badge = ({ variant, size }: BadgeProps) => {
  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`]
  ].join(' ');

  return <span className={classes}>Content</span>;
};
```

```scss
.badge {
  // Base styles
}

.badge--primary {
  background: blue;
}

.badge--sm {
  font-size: 12px;
}
```

### After (New Pattern)

```tsx
const Badge = ({ variant, size }: BadgeProps) => {
  return (
    <span
      className={styles.badge}
      data-component="badge"
      data-variant={variant}
      data-size={size}
    >
      Content
    </span>
  );
};
```

```scss
.badge {
  // Base styles

  &[data-variant='primary'] {
    background: blue;
  }

  &[data-size='sm'] {
    font-size: 12px;
  }
}
```

## Summary

**Key Rules**:
1. ✅ Use data attributes for variants, sizes, and states
2. ✅ Use `|| undefined` for boolean data attributes
3. ✅ Include `data-component` attribute for identification
4. ✅ Use `&[data-variant='value']` selectors in SCSS
5. ✅ Combine with `:not()` for excluding states (`:not([data-disabled='true'])`)
6. ❌ Never concatenate className strings with variants
7. ❌ Never use boolean values directly in data attributes without `|| undefined`

**Benefits**:
- Clean, maintainable code
- Self-documenting HTML
- Easy to test
- Easy to style
- Easy to override
- Modern React patterns

For more patterns, see:
- [css-variable-pattern.md](./css-variable-pattern.md) - CSS variable usage
- [spacing-system.md](./spacing-system.md) - Spacing guidelines
- [reference-components.md](./reference-components.md) - Component examples
