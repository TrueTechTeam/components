# Agent Instructions: Component Generation Guide

This document provides complete instructions for agents generating components in the `@true-tech-team/ui-components` library.

## Table of Contents

1. [Introduction](#introduction)
2. [Component Generation Workflow](#component-generation-workflow)
3. [Reference Components by Pattern Type](#reference-components-by-pattern-type)
4. [Critical Patterns Overview](#critical-patterns-overview)
5. [Common Pitfalls](#common-pitfalls)
6. [Quality Standards](#quality-standards)
7. [File Structure and Naming](#file-structure-and-naming)
8. [Export Pattern](#export-pattern)

## Introduction

### Purpose

This documentation system enables agents to generate components that:
- Follow established patterns and conventions
- Integrate seamlessly with existing components
- Meet quality standards (70%+ test coverage, accessibility, theming)
- Work across all themes and screen sizes

### When to Use These Instructions

Use these instructions when:
- Creating new components from scratch
- Adding tests to existing components
- Creating Storybook documentation
- Understanding component patterns and conventions

### Relationship to Root Documentation

- **Root `.claude` folder** - Project-wide architecture, workflows, commands
- **This folder** - Component-specific patterns, templates, generation workflow

Refer to root documentation for:
- Project architecture decisions
- Development commands and workflows
- Testing strategies
- Theme system documentation

## Component Generation Workflow

Follow this 5-phase process when generating components:

### Phase 1: Planning

**Objective**: Understand requirements and identify reference patterns

**Actions**:
1. Read user requirements carefully
2. Identify component type (display, button-like, form input, overlay)
3. Identify 1-2 reference components to examine
4. Review relevant pattern documentation:
   - [patterns/data-attribute-pattern.md](./patterns/data-attribute-pattern.md) ⚠️ CRITICAL
   - [patterns/css-variable-pattern.md](./patterns/css-variable-pattern.md) ⚠️ CRITICAL
   - [patterns/spacing-system.md](./patterns/spacing-system.md)
5. Run [validation/pre-generation-checklist.md](./validation/pre-generation-checklist.md)

**Questions to Answer**:
- What is the component's primary purpose?
- Which reference component is most similar?
- What variants are needed? (primary, secondary, success, warning, danger, etc.)
- What sizes are needed? (sm, md, lg or xs, sm, md, lg, xl)
- Is it interactive? (onClick, onRemove, keyboard navigation)
- Does it support icons?
- What accessibility requirements? (ARIA labels, roles, keyboard support)

### Phase 2: Implementation

**Objective**: Create component files following established patterns

**Actions**:
1. **Create component directory**:
   ```
   libs/ui-components/src/lib/components/[category]/[ComponentName]/
   ```

2. **Use templates** as starting point:
   - [templates/display-component.template.tsx](./templates/display-component.template.tsx)
   - [templates/display-component.template.scss](./templates/display-component.template.scss)
   - [templates/index.template.ts](./templates/index.template.ts)

3. **Replace placeholders**:
   - `{{ComponentName}}` → PascalCase name (e.g., `Badge`, `Chip`)
   - `{{componentName}}` → camelCase name (e.g., `badge`, `chip`)
   - `{{element}}` → HTML element (e.g., `div`, `span`, `button`)
   - `{{description}}` → Component description

4. **Implement patterns**:
   - ✅ Use data attributes (`data-variant`, `data-size`)
   - ✅ Use CSS variables with defaults
   - ✅ Forward refs with `forwardRef<HTMLElement, Props>`
   - ✅ Include `data-component` attribute
   - ✅ Extend `BaseComponentProps`
   - ✅ Set `displayName`

5. **Implement all variants and sizes**:
   - Define variants in TypeScript interface
   - Implement variant styling in SCSS with data attributes
   - Define sizes in TypeScript interface
   - Implement size styling in SCSS with data attributes

**Critical Rules**:
- ❌ **NEVER** use `spacing()` function in CSS variables
- ❌ **NEVER** concatenate className strings with variants
- ❌ **NEVER** hardcode colors - use theme variables
- ❌ **NEVER** create custom styled elements when existing components can be used
- ✅ **ALWAYS** use data attributes for variants/sizes
- ✅ **ALWAYS** use pre-defined spacing variables in CSS variables
- ✅ **ALWAYS** forward refs
- ✅ **ALWAYS** use existing library components (Button, Card, Icon, Input, etc.) instead of creating custom HTML elements with inline styles

### Phase 3: Testing

**Objective**: Write comprehensive tests achieving 70%+ coverage

**Actions**:
1. **Use test template**: [templates/display-component.template.test.tsx](./templates/display-component.template.test.tsx)

2. **Implement all 7 test categories**:
   - **Rendering tests** - Default props, all props, children
   - **Variant tests** - Each variant renders with correct data attribute
   - **Size tests** - Each size renders with correct data attribute
   - **State tests** - Disabled, hover, active states
   - **Interaction tests** - onClick, onRemove handlers (if applicable)
   - **Accessibility tests** - ARIA attributes, keyboard navigation
   - **Ref forwarding test** - Ref properly forwarded

3. **Run tests**:
   ```bash
   npm run test
   ```

4. **Verify coverage**:
   ```bash
   npm run test:coverage
   ```
   - Must achieve 70%+ for branches, functions, lines, statements

**Testing Best Practices**:
- Use `screen.getByText()`, `screen.getByRole()` for queries
- Test data attributes: `expect(element).toHaveAttribute('data-variant', 'primary')`
- Use `userEvent` for interactions
- Test keyboard navigation for interactive components
- Mock external dependencies

### Phase 4: Documentation

**Objective**: Create Storybook stories for visual documentation

**Actions**:
1. **Use stories template**: [templates/display-component.template.stories.tsx](./templates/display-component.template.stories.tsx)

2. **Use existing library components in stories** ⚠️ CRITICAL:
   - **ALWAYS** import and use existing components instead of creating custom styled elements
   - Use `Card` for container/card-like demo content (not custom `<div>` with styles)
   - Use `Button` for action elements (not custom `<button>` with styles)
   - Use `Icon` for icons (not emojis or custom SVGs)
   - Use `Input`, `Select`, etc. for form demos
   - This ensures stories showcase real component integration and maintain consistency

   ```typescript
   // ✅ CORRECT - Use existing components
   import { Card } from '../Card';
   import { Button } from '../../buttons/Button';
   import { Icon } from '../Icon';

   <Reveal animation="fade">
     <Card variant="elevated" padding="lg">
       <Icon name="star" size="md" /> Featured Content
       <Button variant="primary">Action</Button>
     </Card>
   </Reveal>

   // ❌ WRONG - Custom styled elements
   <Reveal animation="fade">
     <div style={{ padding: '24px', background: '#667eea', borderRadius: '8px' }}>
       ⭐ Featured Content
       <button style={{ padding: '8px 16px' }}>Action</button>
     </div>
   </Reveal>
   ```

3. **Create minimum 5 stories**:
   - **Default** - Basic usage with default props
   - **Variants** - All variants displayed in a row
   - **Sizes** - All sizes displayed side-by-side
   - **States** - Different states (disabled, etc.)
   - **Playground** - Interactive controls for all props

3. **Additional stories** (if applicable):
   - **WithIcons** - Icon integration
   - **Interactive** - With click/remove handlers
   - **CustomStyling** - CSS variable overrides

4. **Configure meta**:
   ```typescript
   const meta: Meta<typeof Component> = {
     title: '[Category]/[ComponentName]',
     component: ComponentName,
     tags: ['autodocs'],
     argTypes: {
       // Configure controls
       variant: { control: 'select', options: [...] },
       size: { control: 'select', options: [...] },
       // Hide complex props
       className: { table: { disable: true } },
     },
   };
   ```

5. **Verify in Storybook**:
   ```bash
   npm run storybook
   ```
   - Check all stories render correctly
   - Test in light and dark modes
   - Verify controls work in Playground story

### Phase 5: Validation

**Objective**: Ensure component meets all quality standards

**Actions**:
1. **Run post-generation checklist**: [validation/post-generation-checklist.md](./validation/post-generation-checklist.md)

2. **Update exports**:
   - Add to category index: `libs/ui-components/src/lib/components/[category]/index.ts`
   - Add to main index: `libs/ui-components/src/lib/components/index.ts`

3. **Run quality gates**:
   ```bash
   # Build check
   npm run build
   # Must pass with no errors

   # Test check
   npm run test
   # Must achieve 70%+ coverage

   # Lint check
   npm run lint
   # Must pass with no errors

   # Visual check
   npm run storybook
   # Verify appearance in light and dark modes
   ```

4. **Code review checklist**: [validation/code-review-checklist.md](./validation/code-review-checklist.md)

**Validation Criteria**:
- ✅ All files created
- ✅ Patterns followed correctly
- ✅ Tests pass with 70%+ coverage
- ✅ Build succeeds
- ✅ Lint passes
- ✅ Storybook renders correctly
- ✅ Works in light and dark modes
- ✅ Responsive across screen sizes
- ✅ Accessible (ARIA, keyboard navigation)

## Reference Components by Pattern Type

Use these components as references when implementing similar patterns:

### Tag-like Components

**Reference**: [TagInput](../src/lib/components/inputs/TagInput/)

**Files to Examine**:
- `TagInput.tsx` - Props structure, component implementation
- `TagInput.module.scss` - **Lines 86-142** - Tag display styling ⭐ PRIMARY REFERENCE

**Key Patterns**:
- Variants: `primary`, `secondary`, `tertiary`
- Sizes: `sm`, `md`, `lg`
- Hover states with CSS variable overrides
- Removable functionality (close button)
- Disabled state styling

**CSS Pattern**:
```scss
.tag {
  --tag-padding: var(--spacing-sm);
  --tag-font-size: var(--font-size-sm);
  --tag-height: 28px;

  background: var(--theme-primary-100);
  color: var(--theme-primary-700);

  &[data-variant='secondary'] {
    background: var(--theme-secondary-100);
    color: var(--theme-secondary-700);
  }

  &[data-size='sm'] {
    --tag-padding: 2px var(--spacing-xs);
    --tag-font-size: var(--font-size-xs);
    --tag-height: 22px;
  }
}
```

**Use For**: Badge, Chip, Pill, Tag components

### Button-like Components

**Reference**: [Button](../src/lib/components/buttons/Button/)

**Key Patterns**:
- Comprehensive variants: `primary`, `secondary`, `outline`, `ghost`, `success`, `warning`, `danger`
- Extended sizes: `xs`, `sm`, `md`, `lg`, `xl`
- Interactive states (hover, active, focus, disabled)
- Icon integration (startIcon, endIcon)
- Loading state
- Full width option

**Use For**: Interactive components, components with icons, components with multiple states

### Simple Display Components

**Reference**: [Icon](../src/lib/components/display/Icon/)

**Key Patterns**:
- Minimal props (size, color)
- Size mapping (sm: 16px, md: 24px, lg: 32px)
- Color customization
- ARIA labels for accessibility
- Simple, focused functionality

**Use For**: Simple presentational components, display-only components

### TypeScript Patterns

**Reference**: [component.types.ts](../src/lib/types/component.types.ts)

**Key Types**:
```typescript
// Base props all components should extend
BaseComponentProps {
  className?: string;
  'data-testid'?: string;
  'aria-label'?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// Standard sizes
ComponentSize = 'sm' | 'md' | 'lg';

// Extended sizes
ExtendedComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Standard variants
ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
```

**Use For**: Understanding prop patterns, ensuring type consistency

### Form Components

**Reference**: [Input](../src/lib/components/inputs/Input/), [Select](../src/lib/components/inputs/Select/), [Checkbox](../src/lib/components/inputs/Checkbox/)

**Key Patterns**:
- Validation (regex patterns, custom validators)
- Error states and messages
- Helper text
- Labels (top/left placement)
- Required field indicators
- Disabled and readonly states

**Use For**: Form input components, components with validation

### Overlay Components

**Reference**: [Popover](../src/lib/components/overlays/Popover/), [Tooltip](../src/lib/components/overlays/Tooltip/), [Menu](../src/lib/components/overlays/Menu/)

**Key Patterns**:
- Portal rendering (render outside DOM hierarchy)
- Positioning (floating UI)
- Z-index management
- Click outside handling
- Escape key handling
- Focus trapping

**Use For**: Floating UI elements, modals, dropdowns, tooltips

## Critical Patterns Overview

### Data Attribute Pattern ⚠️ CRITICAL

**Why**: Cleaner code, better performance, more semantic HTML, easier debugging

**DON'T** - Old class concatenation pattern:
```tsx
const classes = [
  styles.component,
  styles[`component--${variant}`],
  styles[`component--${size}`],
  disabled && styles['component--disabled']
].join(' ');
```

**DO** - Modern data attribute pattern:
```tsx
<div
  className={styles.component}
  data-variant={variant}
  data-size={size}
  data-disabled={disabled || undefined}
/>
```

**SCSS Selectors**:
```scss
.component {
  // Base styles

  &[data-variant='primary'] {
    // Primary variant styles
  }

  &[data-size='md'] {
    // Medium size styles
  }

  &[data-disabled='true'] {
    // Disabled styles
  }
}
```

**Boolean Attributes**:
```tsx
// ✅ CORRECT - Use || undefined to avoid data-disabled="false"
data-disabled={disabled || undefined}

// ❌ WRONG - Creates data-disabled="false" which is truthy in CSS selectors
data-disabled={disabled}
```

**Read More**: [patterns/data-attribute-pattern.md](./patterns/data-attribute-pattern.md)

### CSS Variable Pattern ⚠️ CRITICAL

**Why**: Runtime customization, theme integration, variant overrides

**Structure**:
```scss
.component {
  // 1. Define CSS variables with defaults
  --component-bg: var(--theme-primary-100);
  --component-color: var(--theme-primary-700);
  --component-padding: var(--spacing-sm);

  // 2. Use variables in properties
  background: var(--component-bg);
  color: var(--component-color);
  padding: var(--component-padding);

  // 3. Override in variants
  &[data-variant='secondary'] {
    --component-bg: var(--theme-secondary-100);
    --component-color: var(--theme-secondary-700);
  }
}
```

**CRITICAL RULE - Spacing in CSS Variables**:
```scss
// ❌ WRONG - spacing() function NOT evaluated in CSS variables
--component-padding: spacing(2);

// ✅ CORRECT - Use pre-defined variables
--component-padding: var(--spacing-sm);

// ✅ CORRECT - Use calc() with spacing unit
--component-padding: calc(var(--spacing-unit) * 2);

// ✅ CORRECT - Direct CSS properties CAN use spacing()
padding: spacing(2);  // Compiles to 8px at build time
```

**Why This Matters**: SCSS functions like `spacing()` are evaluated at build time. CSS variables are evaluated at runtime. You cannot use build-time functions in runtime values.

**Read More**: [patterns/css-variable-pattern.md](./patterns/css-variable-pattern.md)

### Spacing System

**Grid System**: 4px base unit

**Available Variables**:
```scss
--spacing-xs:   4px
--spacing-sm:   8px
--spacing-md:   16px
--spacing-lg:   24px
--spacing-xl:   32px
--spacing-xxl:  48px
--spacing-unit: 4px  // For calc() operations
```

**Spacing Mixins**:
```scss
@include px(4);  // padding-left: 16px; padding-right: 16px;
@include py(2);  // padding-top: 8px; padding-bottom: 8px;
@include p(3);   // padding: 12px;
@include m(2);   // margin: 8px;
```

**Usage Rules**:
1. **In CSS variables** - Use pre-defined variables ONLY
   ```scss
   --component-padding: var(--spacing-sm);  // ✅
   --component-padding: spacing(2);         // ❌
   ```

2. **In direct properties** - Can use mixins or spacing() function
   ```scss
   padding: spacing(2);    // ✅ Compiles to 8px
   @include px(4);         // ✅ padding-left/right: 16px
   ```

3. **Never hardcode pixels**
   ```scss
   padding: 8px;  // ❌ Use spacing(2) or var(--spacing-sm)
   ```

**Read More**: [patterns/spacing-system.md](./patterns/spacing-system.md)

### TypeScript Patterns

**Extend BaseComponentProps**:
```typescript
import type { BaseComponentProps } from '../../../types/component.types';

export interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

**Use forwardRef**:
```typescript
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', disabled = false, className, children, ...restProps }, ref) => {
    return (
      <span ref={ref} {...restProps}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
```

**JSDoc Comments**:
```typescript
/**
 * Badge component for displaying status or counts
 *
 * @example
 * ```tsx
 * <Badge variant="primary" size="md">New</Badge>
 * <Badge variant="danger" size="sm">5</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(...);
```

### Accessibility Requirements

**ARIA Attributes**:
```tsx
<button
  aria-label="Close"           // Label for icon-only buttons
  aria-disabled={disabled}     // Disabled state
  role="button"                // Semantic role
  tabIndex={0}                 // Keyboard focusable
>
  Content
</button>
```

**Keyboard Navigation**:
- Interactive components must be keyboard accessible
- Tab to focus, Enter/Space to activate
- Escape to close overlays
- Arrow keys for navigation (menus, lists)

**Focus Management**:
- Visible focus states (`:focus-visible`)
- Focus trapping in modals
- Return focus after overlay closes

**Color Contrast**:
- Text must meet WCAG AA standards (4.5:1 for normal text)
- Use theme variables that maintain contrast in dark mode

## Common Pitfalls

### 1. Using spacing() in CSS Variables ❌

**Problem**:
```scss
.component {
  --component-padding: spacing(2);  // ❌ NOT evaluated
  padding: var(--component-padding); // Results in literal "spacing(2)"
}
```

**Solution**:
```scss
.component {
  --component-padding: var(--spacing-sm);  // ✅ Use pre-defined variable
  padding: var(--component-padding);       // Results in 8px
}
```

### 2. Concatenating className Strings ❌

**Problem**:
```tsx
const classes = [
  styles.badge,
  styles[`badge--${variant}`],  // ❌ Old pattern
  styles[`badge--${size}`]
].join(' ');
```

**Solution**:
```tsx
<div
  className={styles.badge}
  data-variant={variant}  // ✅ Modern pattern
  data-size={size}
/>
```

### 3. Not Forwarding Refs ❌

**Problem**:
```tsx
export const Badge = ({ children }: BadgeProps) => {  // ❌ No ref
  return <span>{children}</span>;
};
```

**Solution**:
```tsx
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(  // ✅ With ref
  ({ children }, ref) => {
    return <span ref={ref}>{children}</span>;
  }
);
```

### 4. Missing data-component Attribute ❌

**Problem**:
```tsx
<span className={styles.badge}>  // ❌ No identification
  {children}
</span>
```

**Solution**:
```tsx
<span
  className={styles.badge}
  data-component="badge"  // ✅ Component identification
>
  {children}
</span>
```

### 5. Hardcoding Colors ❌

**Problem**:
```scss
.badge {
  background: #3b82f6;  // ❌ Hardcoded color
  color: #ffffff;
}
```

**Solution**:
```scss
.badge {
  background: var(--theme-primary-100);  // ✅ Theme variable
  color: var(--theme-primary-700);
}
```

### 6. Boolean Data Attributes ❌

**Problem**:
```tsx
data-disabled={disabled}  // ❌ Creates data-disabled="false"
```

**Solution**:
```tsx
data-disabled={disabled || undefined}  // ✅ Only adds when true
```

### 7. Missing displayName ❌

**Problem**:
```tsx
export const Badge = forwardRef(...);  // ❌ No displayName
```

**Solution**:
```tsx
export const Badge = forwardRef(...);
Badge.displayName = 'Badge';  // ✅ For React DevTools
```

### 8. Using Custom Styled Elements Instead of Existing Components ❌

**Problem**:
```tsx
// In stories or component implementation
<div style={{ padding: '24px', background: '#667eea', borderRadius: '8px' }}>
  ⭐ Content
  <button style={{ padding: '8px 16px' }}>Click</button>
</div>
```

**Solution**:
```tsx
// Use existing library components
import { Card } from '../Card';
import { Button } from '../../buttons/Button';
import { Icon } from '../Icon';

<Card variant="elevated" padding="lg">
  <Icon name="star" size="md" /> Content
  <Button variant="primary">Click</Button>
</Card>
```

**Why This Matters**: Using existing components ensures:
- Consistent styling across the library
- Proper theming support (light/dark mode)
- Accessibility compliance
- Stories demonstrate real component integration
- Reduced maintenance burden

## Quality Standards

All components MUST meet these standards before completion:

### Code Quality
- ✅ TypeScript strict mode (no `any` types)
- ✅ No unused imports or variables
- ✅ Consistent naming (camelCase JS, kebab-case CSS)
- ✅ JSDoc comments on all public APIs
- ✅ No console.logs or debug code

### Pattern Compliance
- ✅ Data attribute pattern (not class concatenation)
- ✅ CSS variables with defaults
- ✅ Pre-defined spacing variables (not spacing() in CSS vars)
- ✅ Theme color integration
- ✅ forwardRef implementation
- ✅ data-component attribute
- ✅ displayName set

### Testing
- ✅ 70%+ coverage (branches, functions, lines, statements)
- ✅ All 7 test categories covered
- ✅ All variants tested
- ✅ All sizes tested
- ✅ Ref forwarding tested
- ✅ Accessibility tested

### Documentation
- ✅ Minimum 5 Storybook stories
- ✅ Variants story
- ✅ Sizes story
- ✅ Playground story with controls
- ✅ JSDoc comments
- ✅ Usage examples in comments

### Accessibility
- ✅ ARIA attributes where needed
- ✅ Semantic HTML elements
- ✅ Keyboard navigation (if interactive)
- ✅ Visible focus states
- ✅ Color contrast (WCAG AA)
- ✅ Screen reader compatible

### Theming
- ✅ Works in light mode
- ✅ Works in dark mode
- ✅ Uses theme variables
- ✅ CSS variable overrides supported

### Responsiveness
- ✅ Works on mobile (320px+)
- ✅ Works on tablet (768px+)
- ✅ Works on desktop (1024px+)
- ✅ No horizontal scrolling
- ✅ Touch-friendly (if interactive)

## File Structure and Naming

### Directory Structure
```
libs/ui-components/src/lib/components/[category]/[ComponentName]/
├── ComponentName.tsx              # Implementation
├── ComponentName.module.scss      # Styles
├── ComponentName.test.tsx         # Tests
├── ComponentName.stories.tsx      # Storybook
└── index.ts                       # Exports
```

### Naming Conventions
- **Component files**: PascalCase - `Badge.tsx`, `Chip.tsx`
- **Style files**: PascalCase + `.module.scss` - `Badge.module.scss`
- **Test files**: PascalCase + `.test.tsx` - `Badge.test.tsx`
- **Story files**: PascalCase + `.stories.tsx` - `Badge.stories.tsx`
- **Component names**: PascalCase - `Badge`, `NotificationChip`
- **CSS classes**: camelCase - `.badge`, `.notificationChip`
- **CSS variables**: kebab-case - `--badge-bg`, `--notification-chip-color`

### Categories
- `display/` - Presentational components (Icon, Badge, Avatar)
- `buttons/` - Action components (Button, IconButton)
- `inputs/` - Form inputs (Input, Select, Checkbox)
- `forms/` - Form composition (FormBuilder)
- `overlays/` - Floating UI (Popover, Tooltip, Menu)

## Export Pattern

### Component Index (ComponentName/index.ts)
```typescript
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
export { default } from './Badge';
```

### Category Index (display/index.ts)
```typescript
// Add to existing exports
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
```

### Main Library Index (components/index.ts)
```typescript
// Display category
export { Icon, Badge } from './display';
export type { IconProps, BadgeProps } from './display';
```

### Usage
```typescript
// Root import (recommended)
import { Badge } from '@true-tech-team/ui-components';

// Category import (better tree-shaking)
import { Badge } from '@true-tech-team/ui-components/display';
```

---

**Remember**: These instructions provide patterns and guidelines. Specific component requirements come from users. Use templates as starting points, examine reference components for examples, and follow critical patterns for consistency.

**Questions?** Refer to:
- [patterns/](./patterns/) for pattern details
- [templates/](./templates/) for code templates
- [validation/](./validation/) for checklists
- Root `.claude` folder for project-wide documentation
