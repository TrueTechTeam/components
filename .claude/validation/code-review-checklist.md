# Code Review Checklist

Use this checklist for final code review before considering the component production-ready.

## Pattern Compliance

### Data Attribute Pattern
- [ ] Uses `data-variant={variant}` NOT className concatenation
- [ ] Uses `data-size={size}` NOT className concatenation
- [ ] Boolean attributes use `|| undefined` pattern
- [ ] Includes `data-component="componentName"` attribute
- [ ] SCSS uses `&[data-variant='value']` selectors
- [ ] No `styles[`component--${variant}`]` patterns

### CSS Variable Pattern
- [ ] CSS variables defined with defaults
- [ ] Variables use `var(--theme-*)` for colors
- [ ] Variables use `var(--spacing-*)` for spacing
- [ ] NO `spacing()` function in CSS variables
- [ ] Variant overrides use CSS variable reassignment
- [ ] Size overrides use CSS variable reassignment

### Spacing System
- [ ] Uses 4px grid system
- [ ] No hardcoded pixel values
- [ ] Uses `var(--spacing-sm)`, NOT `spacing(2)` in CSS variables
- [ ] Uses spacing mixins for padding/margin (@include px(4))
- [ ] All spacing values are multiples of 4px

### Theme Integration
- [ ] Uses theme color variables (--theme-primary-100, etc.)
- [ ] No hardcoded hex colors
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Colors change correctly on theme switch

### TypeScript Patterns
- [ ] Extends `BaseComponentProps`
- [ ] Uses `forwardRef<HTMLElement, Props>`
- [ ] Sets `displayName`
- [ ] No `any` types
- [ ] Proper type imports

## Accessibility

### ARIA Attributes
- [ ] ARIA labels present where needed
- [ ] `aria-label` prop supported
- [ ] `aria-disabled` reflects disabled state (if applicable)
- [ ] `role` attribute present (if needed)
- [ ] ARIA live regions for dynamic content (if applicable)

### Semantic HTML
- [ ] Uses semantic HTML elements when appropriate
- [ ] `<button>` for clickable elements (not `<div>`)
- [ ] `<span>` for inline content
- [ ] Proper heading hierarchy (if headings used)

### Keyboard Navigation (if interactive)
- [ ] Tab to focus
- [ ] Enter/Space to activate
- [ ] Escape to close/cancel (if overlay)
- [ ] Arrow keys for navigation (if list/menu)
- [ ] Keyboard shortcuts documented

### Focus Management
- [ ] Visible focus states
- [ ] `:focus-visible` used (not just `:focus`)
- [ ] Focus ring contrasts with background
- [ ] Focus order is logical
- [ ] No focus traps (unless intentional)

### Color Contrast
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Interactive elements distinguishable
- [ ] Disabled states visually distinct
- [ ] Works in dark mode with sufficient contrast

### Screen Reader Compatibility
- [ ] Content is meaningful to screen readers
- [ ] Interactive elements have clear labels
- [ ] States are announced (disabled, selected, etc.)
- [ ] No information conveyed by color alone

## Code Quality

### TypeScript
- [ ] No `any` types
- [ ] No type assertions (except necessary)
- [ ] All imports properly typed
- [ ] Props interface complete
- [ ] No missing required props
- [ ] Optional props have defaults

### Code Organization
- [ ] Imports grouped logically (React, types, styles, components)
- [ ] No unused imports
- [ ] No unused variables
- [ ] Consistent naming conventions
- [ ] Clear variable names

### Comments and Documentation
- [ ] JSDoc comments on component
- [ ] JSDoc comments on all props
- [ ] `@default` tags for default values
- [ ] `@example` usage examples
- [ ] Complex logic explained
- [ ] No commented-out code
- [ ] No TODO comments (or tracked elsewhere)

### Error Handling
- [ ] Props validated (if needed)
- [ ] Edge cases handled
- [ ] No unhandled errors
- [ ] Console errors addressed

## Styling

### CSS Quality
- [ ] No magic numbers (use variables)
- [ ] Consistent units
- [ ] Proper selector specificity
- [ ] No `!important` (unless necessary)
- [ ] No overly specific selectors

### Responsive Design
- [ ] Works at 320px width (mobile)
- [ ] Works at 768px width (tablet)
- [ ] Works at 1024px+ width (desktop)
- [ ] No horizontal scroll
- [ ] Touch targets ≥ 44px (if interactive)
- [ ] Text is readable at all sizes

### Cross-browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Uses vendor prefixes if needed

### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient CSS selectors
- [ ] No inline functions causing re-renders
- [ ] Proper use of React.memo (if needed)
- [ ] No performance bottlenecks

## Testing

### Test Coverage
- [ ] 70%+ coverage for branches
- [ ] 70%+ coverage for functions
- [ ] 70%+ coverage for lines
- [ ] 70%+ coverage for statements
- [ ] All critical paths tested

### Test Quality
- [ ] Tests are readable
- [ ] Tests are maintainable
- [ ] No flaky tests
- [ ] Tests run quickly
- [ ] Tests are isolated (no dependencies between tests)

### Test Completeness
- [ ] All variants tested
- [ ] All sizes tested
- [ ] All states tested
- [ ] Interactions tested (if applicable)
- [ ] Edge cases tested
- [ ] Error states tested

## Documentation

### Storybook
- [ ] All stories render correctly
- [ ] Controls work in Playground
- [ ] Stories are well-organized
- [ ] Story descriptions are clear
- [ ] Examples are practical

### Code Comments
- [ ] Component purpose documented
- [ ] Complex logic explained
- [ ] Props documented with JSDoc
- [ ] Usage examples provided

### README (if needed)
- [ ] Installation instructions
- [ ] Basic usage examples
- [ ] Prop documentation
- [ ] Customization examples

## Security

- [ ] No XSS vulnerabilities
- [ ] User input sanitized (if applicable)
- [ ] No eval() or similar dangerous code
- [ ] No security warnings in dependencies

## Bundle Size

- [ ] No unnecessary dependencies imported
- [ ] Tree-shaking works correctly
- [ ] Bundle size is reasonable
- [ ] No duplicated code

## Integration

### With Existing Components
- [ ] Follows existing patterns
- [ ] Consistent with component library
- [ ] No naming conflicts
- [ ] Works with other components

### With Theme System
- [ ] Uses theme variables correctly
- [ ] Responds to theme changes
- [ ] Works in light and dark modes
- [ ] Custom themes supported

## Final Checks

- [ ] Component meets all user requirements
- [ ] No console errors
- [ ] No console warnings (or acceptable only)
- [ ] Build passes
- [ ] Tests pass
- [ ] Lint passes
- [ ] Storybook works
- [ ] Works in target browsers
- [ ] Works on target devices
- [ ] Performance is acceptable
- [ ] Accessibility requirements met
- [ ] Code is clean and maintainable
- [ ] Documentation is complete

## Sign-off

### Reviewer Information
- Reviewer: _____________________
- Date: _____________________
- Component: _____________________
- Version: _____________________

### Approval
- [ ] ✅ Approved - Ready for production
- [ ] ⚠️ Approved with minor changes needed
- [ ] ❌ Not approved - Major changes required

### Notes
```
[Add any additional notes, concerns, or recommendations here]
```

## Post-Review Actions

If approved:
- [ ] Merge to main branch
- [ ] Update changelog
- [ ] Notify team
- [ ] Deploy to production (if applicable)

If changes needed:
- [ ] Create list of required changes
- [ ] Assign to developer
- [ ] Schedule follow-up review
- [ ] Re-run checklist after changes
