# Pre-Generation Checklist

Use this checklist BEFORE starting component generation to ensure you have all necessary information.

## Understanding Requirements

- [ ] Read and understand user requirements completely
- [ ] Clarify any ambiguous requirements with user
- [ ] Identify component type (display, button-like, input, overlay)
- [ ] Determine primary purpose and use cases
- [ ] List all required variants (e.g., primary, secondary, success, warning, danger)
- [ ] List all required sizes (e.g., sm, md, lg or xs, sm, md, lg, xl)
- [ ] Determine if component is interactive (onClick, onRemove, keyboard navigation)
- [ ] Determine if component supports icons
- [ ] Identify appropriate HTML element (span, div, button, etc.)

## Reference Component Selection

- [ ] Identify 1-2 reference components most similar to your component
- [ ] Locate reference component files
- [ ] Note specific files/lines to examine (e.g., TagInput.module.scss lines 86-142)
- [ ] Verify reference component follows current patterns

## Category Selection

- [ ] Choose appropriate category:
  - `display/` - Presentational components (Badge, Avatar, Icon)
  - `buttons/` - Action components (Button, IconButton)
  - `inputs/` - Form inputs (Input, Select, Checkbox)
  - `overlays/` - Floating UI (Popover, Tooltip, Menu)
  - `forms/` - Form composition (FormBuilder)
- [ ] Verify chosen category makes sense for component type
- [ ] Check if similar components exist in that category

## Name Validation

- [ ] Component name follows PascalCase convention
- [ ] Component name doesn't conflict with existing components
- [ ] Component name is descriptive and clear
- [ ] File names will follow conventions:
  - ComponentName.tsx
  - ComponentName.module.scss
  - ComponentName.test.tsx
  - ComponentName.stories.tsx

## Documentation Review

- [ ] Read [README.md](../README.md)
- [ ] Read [agent-instructions.md](../agent-instructions.md)
- [ ] Read [patterns/data-attribute-pattern.md](../patterns/data-attribute-pattern.md) ⚠️ CRITICAL
- [ ] Read [patterns/css-variable-pattern.md](../patterns/css-variable-pattern.md) ⚠️ CRITICAL
- [ ] Read [patterns/spacing-system.md](../patterns/spacing-system.md)
- [ ] Review [patterns/reference-components.md](../patterns/reference-components.md)

## Template Preparation

- [ ] Located template files:
  - [templates/display-component.template.tsx](../templates/display-component.template.tsx)
  - [templates/display-component.template.scss](../templates/display-component.template.scss)
  - [templates/display-component.template.test.tsx](../templates/display-component.template.test.tsx)
  - [templates/display-component.template.stories.tsx](../templates/display-component.template.stories.tsx)
  - [templates/index.template.ts](../templates/index.template.ts)
- [ ] Understand placeholder replacement syntax:
  - `{{ComponentName}}` → PascalCase
  - `{{componentName}}` → camelCase
  - `{{element}}` → HTML element (span, div, button)
  - `{{Element}}` → Capitalized element (Span, Div, Button)
  - `{{description}}` → Component description

## Critical Patterns Understanding

- [ ] Understand data attribute pattern (NOT class concatenation)
- [ ] Understand CSS variable pattern with defaults
- [ ] Understand spacing system (4px grid, pre-defined variables)
- [ ] Know that spacing() CANNOT be used in CSS variables
- [ ] Know to use `|| undefined` for boolean data attributes
- [ ] Understand theme color variable naming
- [ ] Know to forward refs with `forwardRef`
- [ ] Know to include `data-component` attribute

## Environment Setup

- [ ] Development environment is ready
- [ ] Can run `npm run build`
- [ ] Can run `npm run test`
- [ ] Can run `npm run lint`
- [ ] Can run `npm run storybook`

## Success Criteria Review

- [ ] Understand that 70%+ test coverage is required
- [ ] Know all 7 test categories must be covered
- [ ] Know minimum 8 Storybook stories are required
- [ ] Understand component must work in light and dark modes
- [ ] Know component must be responsive
- [ ] Understand accessibility requirements (ARIA, keyboard navigation)

## Ready to Proceed?

If all checkboxes are checked, you're ready to start component generation!

Proceed to [agent-instructions.md](../agent-instructions.md) for the 5-phase generation workflow.
