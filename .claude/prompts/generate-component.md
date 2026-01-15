# Generate Component Prompt Template

Use this prompt template when asking an agent to generate a new component.

## Prompt Template

```
You are generating a new [COMPONENT_NAME] component for the @true-tech-team/ui-components library.

COMPONENT PURPOSE:
[Brief description of what this component does and its use cases]

COMPONENT REQUIREMENTS:
- Variants: [list variants, e.g., primary, secondary, success, warning, danger]
- Sizes: [list sizes, e.g., sm, md, lg]
- Props: [list key props beyond standard ones]
- Interactive: [Yes/No - does it respond to clicks/interactions?]
- Icons: [Yes/No - does it support icons?]
- Element: [HTML element to use, e.g., span, div, button]

REQUIRED READING BEFORE STARTING:
1. libs/ui-components/.claude/README.md
2. libs/ui-components/.claude/patterns/data-attribute-pattern.md
3. libs/ui-components/.claude/patterns/css-variable-pattern.md
4. libs/ui-components/.claude/patterns/reference-components.md

REFERENCE COMPONENTS TO EXAMINE:
[List 1-2 similar existing components to use as reference]
- Primary: libs/ui-components/src/lib/components/[category]/[Component]/
- Key file: [specific file to examine, e.g., TagInput.module.scss lines 86-142]

TEMPLATES TO USE:
- libs/ui-components/.claude/templates/display-component.template.tsx
- libs/ui-components/.claude/templates/display-component.template.scss
- libs/ui-components/.claude/templates/display-component.template.test.tsx
- libs/ui-components/.claude/templates/display-component.template.stories.tsx
- libs/ui-components/.claude/templates/index.template.ts

CRITICAL PATTERNS (MUST FOLLOW):
✅ Use data attributes: data-variant={variant}, data-size={size}
✅ Use CSS variables: --component-bg: var(--theme-primary-100)
✅ Use pre-defined spacing: var(--spacing-sm), NOT spacing() in variables
✅ Boolean data attributes: data-disabled={disabled || undefined}
✅ Forward refs: forwardRef<HTMLElement, Props>
✅ Include data-component="[componentName]" attribute
✅ Extend BaseComponentProps for props interface
✅ Set displayName on component
✅ Use theme color variables (--theme-primary-100, --theme-primary-700)
❌ NEVER use spacing() function in CSS variables
❌ NEVER concatenate className strings with variants
❌ NEVER hardcode colors - use theme variables
❌ NEVER hardcode pixel values - use spacing system

TARGET DIRECTORY:
libs/ui-components/src/lib/components/[category]/[ComponentName]/

CATEGORY OPTIONS:
- display/ - Presentational components (Badge, Avatar, Icon)
- buttons/ - Action components (Button, IconButton)
- inputs/ - Form inputs (Input, Select, Checkbox)
- overlays/ - Floating UI (Popover, Tooltip, Menu)
- forms/ - Form composition (FormBuilder)

FILES TO CREATE:
1. [ComponentName].tsx - Component implementation with forwardRef
2. [ComponentName].module.scss - SCSS styles with CSS variables
3. [ComponentName].test.tsx - Unit tests (70%+ coverage, 7 categories)
4. [ComponentName].stories.tsx - Storybook documentation (minimum 8 stories)
5. index.ts - Barrel exports (component and types)

EXPORTS TO UPDATE:
1. libs/ui-components/src/lib/components/[category]/index.ts
   - Add: export { ComponentName } from './ComponentName';
   - Add: export type { ComponentNameProps } from './ComponentName';

2. libs/ui-components/src/lib/components/index.ts
   - Add to category exports: ComponentName
   - Add to type exports: ComponentNameProps

TEMPLATE PLACEHOLDER REPLACEMENTS:
- {{ComponentName}} → PascalCase name (e.g., Badge, NotificationChip)
- {{componentName}} → camelCase name (e.g., badge, notificationChip)
- {{element}} → HTML element (e.g., span, div, button)
- {{description}} → Brief component description
- {{Element}} → Capitalized element for TypeScript (e.g., Span, Div, Button)

VALIDATION CHECKLIST:
Use libs/ui-components/.claude/validation/post-generation-checklist.md

QUALITY GATES (run these commands):
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
# Verify visual appearance in light and dark modes
```

WORKFLOW:
1. Read reference components
2. Review pattern documentation
3. Use templates as starting point
4. Replace all placeholders
5. Implement all variants and sizes
6. Write comprehensive tests (7 categories)
7. Create Storybook stories (minimum 8)
8. Update exports
9. Run validation checklist
10. Run quality gates

SUCCESS CRITERIA:
✅ All files created
✅ Patterns followed correctly
✅ 70%+ test coverage
✅ Build succeeds
✅ Lint passes
✅ Storybook renders correctly
✅ Works in light and dark modes
✅ Responsive across screen sizes
✅ Accessible (ARIA, keyboard navigation)
```

## Example Usage

### Example 1: Badge Component

```
You are generating a new Badge component for the @true-tech-team/ui-components library.

COMPONENT PURPOSE:
A small status or count indicator that displays numerical information or brief text.

COMPONENT REQUIREMENTS:
- Variants: primary, secondary, success, warning, danger
- Sizes: sm, md, lg
- Props: variant, size, disabled, children
- Interactive: No
- Icons: No
- Element: span

REFERENCE COMPONENTS TO EXAMINE:
- Primary: libs/ui-components/src/lib/components/inputs/TagInput/
- Key file: TagInput.module.scss lines 86-142 (tag styling)

TARGET DIRECTORY:
libs/ui-components/src/lib/components/display/Badge/

CATEGORY: display/
```

### Example 2: Chip Component

```
You are generating a new Chip component for the @true-tech-team/ui-components library.

COMPONENT PURPOSE:
An interactive tag element used for selections, filters, or removable items. Supports click and remove actions.

COMPONENT REQUIREMENTS:
- Variants: filled, outlined, light
- Colors: primary, secondary, success, warning, danger, info, neutral
- Sizes: sm, md, lg
- Props: variant, color, size, disabled, selected, onDelete, onClick, avatar, deleteIcon
- Interactive: Yes (clickable, removable)
- Icons: Yes (avatar on left, delete icon on right)
- Element: button (interactive)

REFERENCE COMPONENTS TO EXAMINE:
- Primary: libs/ui-components/src/lib/components/inputs/TagInput/ (tag styling)
- Secondary: libs/ui-components/src/lib/components/buttons/Button/ (interactive patterns)

TARGET DIRECTORY:
libs/ui-components/src/lib/components/display/Chip/

CATEGORY: display/
```

## Notes

- This is a TEMPLATE - fill in the bracketed sections with actual values
- Provide clear, specific requirements
- List all variants and sizes needed
- Specify whether component is interactive
- Identify the most similar reference component
- Choose the appropriate category
- Specify the HTML element to use
