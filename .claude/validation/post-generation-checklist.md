# Post-Generation Checklist

Use this checklist AFTER generating a component to ensure all requirements are met.

## Files Created

- [ ] `ComponentName.tsx` exists in correct directory
- [ ] `ComponentName.module.scss` exists
- [ ] `ComponentName.test.tsx` exists
- [ ] `ComponentName.stories.tsx` exists
- [ ] `index.ts` exists in component directory

## TypeScript Implementation

### Props Interface
- [ ] Extends `BaseComponentProps` from component.types.ts
- [ ] All props have JSDoc comments with `@default` tags
- [ ] Variant prop defined with all options
- [ ] Size prop defined with all options
- [ ] Props interface exported

### Component Implementation
- [ ] Uses `forwardRef<HTMLElement, Props>`
- [ ] Default values set for variant, size, disabled
- [ ] className merging uses `[styles.x, className].filter(Boolean).join(' ')`
- [ ] Spreads remaining props with `{...restProps}`
- [ ] Component exported
- [ ] displayName is set (e.g., `Badge.displayName = 'Badge'`)

### Type Safety
- [ ] No `any` types used
- [ ] All imports have proper types
- [ ] Props interface is complete
- [ ] forwardRef types are correct

## JSX Implementation

### Data Attributes
- [ ] Includes `data-component="componentName"` attribute
- [ ] Uses `data-variant={variant}`
- [ ] Uses `data-size={size}`
- [ ] Boolean attributes use `|| undefined` pattern (e.g., `data-disabled={disabled || undefined}`)
- [ ] No className concatenation with variants

### HTML Structure
- [ ] Semantic HTML element used when appropriate
- [ ] Ref forwarded to root element
- [ ] RestProps spread on root element
- [ ] Children rendered correctly

## SCSS Implementation

### CSS Variables
- [ ] CSS variables defined with defaults
- [ ] Uses pre-defined spacing variables (NOT `spacing()` function)
- [ ] Uses theme color variables (--theme-primary-100, etc.)
- [ ] Variables use `var(--spacing-sm)` NOT `spacing(2)`

### Selectors
- [ ] Uses data attribute selectors (`&[data-variant='primary']`)
- [ ] All variants implemented
- [ ] All sizes implemented
- [ ] Hover states implemented (with `:not([data-disabled='true'])`)
- [ ] Disabled styles implemented

### Styling Quality
- [ ] Uses spacing mixins (@include px(4), @include py(2))
- [ ] Includes transitions for smooth interactions
- [ ] No hardcoded pixel values (uses spacing system)
- [ ] No hardcoded colors (uses theme variables)
- [ ] Uses 4px grid system

## Testing

### Test File Structure
- [ ] All 7 test categories present:
  1. Rendering tests
  2. Variant tests
  3. Size tests
  4. State tests
  5. Interaction tests (if applicable)
  6. Accessibility tests
  7. Ref forwarding test

### Rendering Tests
- [ ] Renders with default props
- [ ] Renders with all props
- [ ] Renders children correctly

### Variant Tests
- [ ] Tests default variant
- [ ] Tests each variant with data-variant attribute
- [ ] All variants covered

### Size Tests
- [ ] Tests default size
- [ ] Tests each size with data-size attribute
- [ ] All sizes covered

### State Tests
- [ ] Tests disabled state (data-disabled="true")
- [ ] Tests disabled attribute not present when false
- [ ] Other states tested (selected, loading, etc.)

### Interaction Tests (if applicable)
- [ ] onClick handler tested
- [ ] onRemove handler tested (if removable)
- [ ] Keyboard interactions tested
- [ ] Click prevented when disabled

### Accessibility Tests
- [ ] ARIA label tested
- [ ] data-component attribute tested
- [ ] Role attribute tested (if applicable)
- [ ] Keyboard navigation tested (if interactive)

### Ref Forwarding Test
- [ ] Ref properly forwarded to DOM element
- [ ] Ref.current is correct element type

### Test Quality
- [ ] No skipped tests (`it.skip`, `describe.skip`)
- [ ] No commented-out tests
- [ ] Descriptive test names
- [ ] Proper use of describe blocks

## Storybook

### Story File Structure
- [ ] Meta includes `title: 'Category/ComponentName'`
- [ ] Meta includes `tags: ['autodocs']`
- [ ] ArgTypes configured with controls
- [ ] Complex props hidden (className, data-testid, style)

### Required Stories (minimum 8)
- [ ] Default story
- [ ] Variants story (all variants shown)
- [ ] Sizes story (all sizes shown)
- [ ] States story (default, disabled, etc.)
- [ ] With Long Content story
- [ ] Custom Styling story (CSS variable examples)
- [ ] All Combinations story (grid of variants × sizes)
- [ ] Playground story (interactive controls)

### Story Quality
- [ ] Demo stories have `parameters: { controls: { disable: true } }`
- [ ] Playground story has all controls enabled
- [ ] Consistent spacing (gap: '16px')
- [ ] Story descriptions added

## Exports

### Component Index (ComponentName/index.ts)
- [ ] Component exported: `export { ComponentName } from './ComponentName';`
- [ ] Types exported: `export type { ComponentNameProps } from './ComponentName';`

### Category Index (category/index.ts)
- [ ] Component added to exports
- [ ] Types added to exports
- [ ] Alphabetically ordered

### Main Index (components/index.ts)
- [ ] Component added to category exports
- [ ] Types added to category type exports
- [ ] Alphabetically ordered within category

## Quality Gates

### Build Check
- [ ] Run `npm run build`
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No missing dependencies

### Test Check
- [ ] Run `npm run test`
- [ ] All tests pass
- [ ] Run `npm run test:coverage`
- [ ] Coverage ≥ 70% for branches
- [ ] Coverage ≥ 70% for functions
- [ ] Coverage ≥ 70% for lines
- [ ] Coverage ≥ 70% for statements

### Lint Check
- [ ] Run `npm run lint`
- [ ] No ESLint errors
- [ ] No ESLint warnings (or acceptable warnings only)
- [ ] No unused imports
- [ ] No console.logs

### Storybook Check
- [ ] Run `npm run storybook`
- [ ] All stories render without errors
- [ ] Component displays correctly in light mode
- [ ] Component displays correctly in dark mode
- [ ] Controls work in Playground story
- [ ] All variants visible in Variants story
- [ ] All sizes visible in Sizes story

## Theming

- [ ] Component works in light mode
- [ ] Component works in dark mode
- [ ] Uses theme color variables
- [ ] Theme colors change correctly on theme switch
- [ ] No hardcoded colors

## Responsiveness

- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] No horizontal scrolling
- [ ] Touch-friendly (if interactive)
- [ ] Text doesn't overflow
- [ ] Layout adapts appropriately

## Accessibility

### ARIA Attributes
- [ ] ARIA label supported and working
- [ ] ARIA disabled attribute (if applicable)
- [ ] ARIA role attribute (if needed)
- [ ] ARIA live regions (if dynamic content)

### Keyboard Navigation (if interactive)
- [ ] Tab to focus
- [ ] Enter/Space to activate
- [ ] Escape to close (if overlay)
- [ ] Arrow keys (if menu/list)

### Focus Management
- [ ] Visible focus states (`:focus-visible`)
- [ ] Focus ring uses theme colors
- [ ] Focus order is logical

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1 for normal text)
- [ ] Interactive elements distinguishable
- [ ] Works in dark mode

### Screen Reader
- [ ] Content is readable
- [ ] Interactions are clear
- [ ] States are announced

## Code Quality

- [ ] No unused imports
- [ ] No unused variables
- [ ] Consistent naming conventions
- [ ] Clear JSDoc comments
- [ ] No console.logs or debug code
- [ ] No commented-out code
- [ ] Code is formatted correctly

## Pattern Compliance

- [ ] Data attribute pattern followed (not class concatenation)
- [ ] CSS variables used properly
- [ ] Pre-defined spacing variables used (not spacing() in CSS vars)
- [ ] Theme colors used (not hardcoded)
- [ ] forwardRef implemented
- [ ] displayName set
- [ ] Boolean data attributes use `|| undefined`

## Final Verification

- [ ] Component matches user requirements
- [ ] All requested variants implemented
- [ ] All requested sizes implemented
- [ ] Interactive behaviors work correctly
- [ ] No errors in console
- [ ] No warnings in console (or acceptable only)
- [ ] Performance is acceptable (no lag)

## Ready to Ship?

If all checkboxes are checked:
- ✅ Component is complete and ready for use!
- ✅ Proceed to [code-review-checklist.md](./code-review-checklist.md) for final review

If any checkboxes are NOT checked:
- ❌ Address the missing items before considering the component complete
- ❌ Re-run quality gates after fixing issues
- ❌ Verify all patterns are followed correctly
