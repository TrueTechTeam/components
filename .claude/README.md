# UI Components Library - Agent Instructions

This folder contains comprehensive instructions, templates, and patterns for agents to generate components in the `@true-tech-team/ui-components` library.

## Quick Start for Agents

When tasked with creating a new component:

1. **Read** [agent-instructions.md](./agent-instructions.md) - Complete generation workflow
2. **Examine** reference components listed in [patterns/reference-components.md](./patterns/reference-components.md)
3. **Follow** the critical patterns:
   - [Data Attribute Pattern](./patterns/data-attribute-pattern.md) ⚠️ CRITICAL
   - [CSS Variable Pattern](./patterns/css-variable-pattern.md) ⚠️ CRITICAL
   - [Spacing System](./patterns/spacing-system.md)
4. **Use** templates from [templates/](./templates/)
5. **Validate** with checklists from [validation/](./validation/)

## Directory Structure

```
.claude/
├── README.md                          # This file - overview and quick start
├── agent-instructions.md              # Complete component generation guide
├── templates/                         # Component code templates
│   ├── display-component.template.tsx
│   ├── display-component.template.scss
│   ├── display-component.template.test.tsx
│   ├── display-component.template.stories.tsx
│   └── index.template.ts
├── patterns/                          # Critical implementation patterns
│   ├── data-attribute-pattern.md      # ⚠️ CRITICAL - Data attribute usage
│   ├── css-variable-pattern.md        # ⚠️ CRITICAL - CSS variable usage
│   ├── spacing-system.md              # 4px grid system
│   └── reference-components.md        # Component reference map
├── prompts/                           # Pre-written agent prompts
│   ├── generate-component.md
│   ├── generate-tests.md
│   └── generate-stories.md
└── validation/                        # Quality checklists
    ├── pre-generation-checklist.md
    ├── post-generation-checklist.md
    └── code-review-checklist.md
```

## Component Generation Workflow

### Phase 1: Planning
- Understand user requirements
- Identify 1-2 reference components to examine
- Read relevant pattern documentation

### Phase 2: Implementation
- Use templates as starting point
- Follow data attribute pattern
- Follow CSS variable pattern
- Implement all variants and sizes

### Phase 3: Testing
- Write comprehensive tests (7 categories)
- Achieve 70%+ coverage
- Test all variants, sizes, and states

### Phase 4: Documentation
- Create Storybook stories (minimum 5)
- Include variants, sizes, states, and playground stories
- Add JSDoc comments to all props

### Phase 5: Validation
- Run pre-generation checklist
- Run post-generation checklist
- Run quality gates (build, test, lint, storybook)

## Common Use Cases

### Generate a New Display Component
```
User: "Create a badge component for notification counts"

Agent Actions:
1. Read agent-instructions.md
2. Examine TagInput.module.scss (lines 86-142)
3. Use display-component templates
4. Follow data attribute and CSS variable patterns
5. Create all required files
6. Update exports
7. Validate and run quality gates
```

### Generate Tests for Existing Component
```
User: "Add comprehensive tests to the Badge component"

Agent Actions:
1. Read prompts/generate-tests.md
2. Use templates/display-component.template.test.tsx
3. Follow testing guide patterns
4. Achieve 70%+ coverage
5. Validate with post-generation checklist
```

### Generate Storybook Stories
```
User: "Add Storybook documentation to Chip component"

Agent Actions:
1. Read prompts/generate-stories.md
2. Use templates/display-component.template.stories.tsx
3. Create 5-8 stories
4. Validate in Storybook
```

## Critical Patterns (Must Read)

### Data Attribute Pattern
**DON'T** concatenate className strings:
```tsx
❌ className={[styles.badge, styles[`badge--${variant}`]].join(' ')}
```

**DO** use data attributes:
```tsx
✅ data-variant={variant} data-size={size}
```

### CSS Variable Pattern
**DON'T** use `spacing()` in CSS variables:
```scss
❌ --component-padding: spacing(2);
```

**DO** use pre-defined variables:
```scss
✅ --component-padding: var(--spacing-sm);
```

### Spacing System
- Use 4px grid system
- Available: `--spacing-xs` (4px) to `--spacing-xxl` (48px)
- Mixins: `@include px(4)`, `@include py(2)`
- In CSS variables, use pre-defined variables ONLY

## Reference Components by Pattern

| Pattern Type | Reference Component | Key Features |
|--------------|---------------------|--------------|
| Tag-like | [TagInput](../src/lib/components/inputs/TagInput/) | Variants, sizes, hover states, removable |
| Button-like | [Button](../src/lib/components/buttons/Button/) | 7 variants, 5 sizes, interactive states |
| Simple display | [Icon](../src/lib/components/display/Icon/) | Size handling, color customization |
| Form inputs | [Input](../src/lib/components/inputs/Input/) | Validation, error states, labels |
| Overlays | [Popover](../src/lib/components/overlays/Popover/) | Portal rendering, positioning |

## Quality Standards

All components MUST meet these standards:

- ✅ **70%+ test coverage** (branches, functions, lines, statements)
- ✅ **Data attribute pattern** (not class concatenation)
- ✅ **CSS variables** with theme integration
- ✅ **Spacing system** compliance (no hardcoded pixels)
- ✅ **Ref forwarding** with `forwardRef`
- ✅ **TypeScript strict** mode (no `any` types)
- ✅ **Accessibility** compliance (ARIA attributes, keyboard navigation)
- ✅ **Storybook documentation** (minimum 5 stories)
- ✅ **Light and dark mode** support
- ✅ **Responsive design** across all screen sizes

## Quality Gates

Before component is complete, run these commands:

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
# Component must render correctly in light and dark modes
```

## Integration with Root Documentation

This library-specific documentation focuses on component generation patterns. For project-wide information, see:

- [../../../.claude/project-overview.md](../../../.claude/project-overview.md) - Architecture and critical decisions
- [../../../.claude/component-guide.md](../../../.claude/component-guide.md) - Step-by-step creation guide
- [../../../.claude/testing-guide.md](../../../.claude/testing-guide.md) - Testing patterns and best practices
- [../../../.claude/theme-guide.md](../../../.claude/theme-guide.md) - Theme system documentation
- [../../../.claude/commands.md](../../../.claude/commands.md) - Development workflows

## Getting Help

If you encounter issues or need clarification:

1. Check [agent-instructions.md](./agent-instructions.md) for complete workflow
2. Review [patterns/](./patterns/) for specific pattern guidance
3. Examine reference components for working examples
4. Refer to root `.claude` folder for project-wide documentation

## Notes for Agents

- This system provides GENERIC templates and patterns
- You will receive specific component requirements from users
- Templates work for ANY display component
- Pattern documentation applies to ALL components
- System is designed to scale as library grows
- Focus on teaching patterns, not prescribing specific implementations

---

**Version**: 1.0.0
**Last Updated**: 2026-01-13
**Library**: @true-tech-team/ui-components
