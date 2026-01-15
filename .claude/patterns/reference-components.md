# Reference Components

This document maps component patterns to reference implementations in the library.

## How to Use This Guide

When creating a new component:
1. Identify which pattern type matches your component
2. Find the reference component(s) listed
3. Examine the reference files
4. Follow the same patterns and conventions

## Pattern Types

### Tag-like Components

**Characteristics**:
- Display data or status
- Small, compact size
- Background color with contrasting text
- Optional remove/close functionality
- Hover states

**Reference Component**: [TagInput](../src/lib/components/inputs/TagInput/)

**Key Files**:
- **TagInput.tsx** - Lines 1-200+
  - Props structure
  - Component implementation
  - forwardRef pattern
- **TagInput.module.scss** - **Lines 86-142** ⭐ PRIMARY REFERENCE
  - Tag display styling
  - CSS variables pattern
  - Data attribute selectors
  - Variant styles (primary, secondary, tertiary)
  - Size styles (sm, md, lg)
  - Hover and disabled states

**Specific Lines to Examine**:
```scss
// TagInput.module.scss lines 86-142
.tag {
  --tag-padding: var(--spacing-sm);
  --tag-font-size: var(--font-size-sm);
  --tag-height: 28px;

  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--tag-padding);
  height: var(--tag-height);
  background: var(--theme-primary-100);
  color: var(--theme-primary-700);
  // ... more styles
}
```

**Use For**:
- Badge - Notification counts, status indicators
- Chip - Interactive tags with delete functionality
- Pill - Rounded status tags
- Tag - Keyword tags
- Label - Category labels

**Key Patterns**:
- CSS variables for padding, font-size, height
- Theme color variables (--theme-*-100, --theme-*-700)
- Pre-defined spacing variables
- Data attribute selectors for variants and sizes
- Hover state with CSS variable override

---

### Button-like Components

**Characteristics**:
- Interactive (clickable)
- Multiple variants and sizes
- Icon support
- Loading and disabled states
- Focus and active states

**Reference Component**: [Button](../src/lib/components/buttons/Button/)

**Key Files**:
- **Button.tsx**
  - Comprehensive props interface
  - Icon rendering (startIcon, endIcon)
  - Loading state
  - Disabled state
  - forwardRef implementation
- **Button.module.scss**
  - 7 variants (primary, secondary, outline, ghost, success, warning, danger)
  - 5 sizes (xs, sm, md, lg, xl)
  - Interactive states (hover, active, focus, disabled)
  - Icon positioning
  - Full width option

**Use For**:
- Interactive display components
- Components with multiple variants
- Components with icon support
- Components with loading states

**Key Patterns**:
- Extensive variant system
- Extended size options (xs to xl)
- Icon integration with proper spacing
- State management (hover, active, focus, disabled)
- Full accessibility support

---

### Simple Display Components

**Characteristics**:
- Presentational only (non-interactive)
- Minimal props
- Size and color customization
- Single-purpose, focused

**Reference Component**: [Icon](../src/lib/components/display/Icon/)

**Key Files**:
- **Icon.tsx**
  - Minimal props (name, size, color)
  - Size mapping (sm: 16px, md: 24px, lg: 32px)
  - Color prop or theme integration
  - ARIA label support
  - Simple, clean implementation

**Use For**:
- Simple presentational components
- Display-only components
- Components with minimal configuration

**Key Patterns**:
- Minimal prop interface
- Size mapping to pixel values
- Color customization
- Accessibility (aria-label, title)
- Clean, focused implementation

---

### Form Input Components

**Characteristics**:
- User input/interaction
- Validation and error states
- Labels and helper text
- Required field indicators
- Controlled/uncontrolled patterns

**Reference Components**:
- [Input](../src/lib/components/inputs/Input/)
- [Select](../src/lib/components/inputs/Select/)
- [Checkbox](../src/lib/components/inputs/Checkbox/)

**Key Files**:
- **Input.tsx**
  - Validation patterns (regex, custom validators)
  - Error states and messages
  - Helper text
  - Labels (top/left placement)
  - Required field indicators
  - Prefix/suffix support
  - Format masking
  - Character counter

**Use For**:
- Form input components
- Components requiring validation
- Components with labels and helper text

**Key Patterns**:
- InputBaseProps interface
- Validation timing options (blur, change, submit)
- Error message display
- Helper text positioning
- Label placement options
- Required field handling

---

### Overlay Components

**Characteristics**:
- Float above other content
- Portal rendering (outside DOM hierarchy)
- Positioning logic
- Z-index management
- Click outside handling
- Escape key handling

**Reference Components**:
- [Popover](../src/lib/components/overlays/Popover/)
- [Tooltip](../src/lib/components/overlays/Tooltip/)
- [Menu](../src/lib/components/overlays/Menu/)

**Key Files**:
- **Popover.tsx**
  - Portal rendering pattern
  - Positioning (floating UI)
  - Click outside detection
  - Escape key handling
  - Z-index management
- **Portal.tsx**
  - Portal utility for rendering outside DOM

**Use For**:
- Floating UI elements
- Modals and dialogs
- Dropdown menus
- Tooltips
- Popovers

**Key Patterns**:
- Portal rendering
- useClickOutside hook
- useEscapeKey hook
- useFocusTrap hook
- Positioning utilities
- Z-index layering

---

## TypeScript Patterns

**Reference File**: [component.types.ts](../src/lib/types/component.types.ts)

**Key Types**:

### BaseComponentProps
```typescript
interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
  'aria-label'?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
```
**Use**: Extend this in all component prop interfaces

### Size Types
```typescript
// Standard sizes (most components)
ComponentSize = 'sm' | 'md' | 'lg';

// Extended sizes (buttons, inputs)
ExtendedComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

### Variant Types
```typescript
// Standard variants
ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';

// Semantic colors
SemanticColor = 'success' | 'warning' | 'error' | 'info';
```

### Button Base Props
```typescript
interface ButtonBaseProps extends BaseComponentProps {
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}
```

### Input Base Props
```typescript
interface InputBaseProps extends BaseComponentProps {
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

---

## Quick Reference Table

| Component Type | Reference | Primary File | Key Lines | Use For |
|----------------|-----------|--------------|-----------|---------|
| Tag-like | TagInput | TagInput.module.scss | 86-142 | Badge, Chip, Pill, Tag |
| Button-like | Button | Button.tsx | All | Interactive components |
| Simple display | Icon | Icon.tsx | All | Presentational components |
| Form inputs | Input, Select | Input.tsx | All | Form components |
| Overlays | Popover, Tooltip | Popover.tsx | All | Floating UI |
| TypeScript | component.types.ts | component.types.ts | All | Type definitions |

---

## Pattern Selection Guide

### Creating a Badge/Chip/Pill/Tag Component?
→ **Reference**: TagInput.module.scss (lines 86-142)
- Small, compact display
- Background + color
- Variants for different colors
- Sizes for different scales
- Optional hover states

### Creating an Interactive Component?
→ **Reference**: Button.tsx
- Clickable/interactive
- Multiple variants
- Icon support
- States (hover, active, disabled)
- Loading state

### Creating a Simple Display Component?
→ **Reference**: Icon.tsx
- Non-interactive
- Minimal configuration
- Size and color props
- Clean, focused

### Creating a Form Input?
→ **Reference**: Input.tsx, Select.tsx
- User input
- Validation
- Labels and helper text
- Error states

### Creating a Floating Element?
→ **Reference**: Popover.tsx, Tooltip.tsx
- Floats above content
- Portal rendering
- Positioning
- Click outside / Escape key

---

## File Paths

All reference components are in:
```
libs/ui-components/src/lib/components/
├── display/
│   └── Icon/
│       ├── Icon.tsx
│       └── Icon.module.scss
├── buttons/
│   └── Button/
│       ├── Button.tsx
│       └── Button.module.scss
├── inputs/
│   ├── Input/
│   ├── Select/
│   ├── Checkbox/
│   └── TagInput/
│       ├── TagInput.tsx
│       └── TagInput.module.scss  ⭐ Lines 86-142
└── overlays/
    ├── Popover/
    ├── Tooltip/
    └── Menu/
```

---

## Next Steps

After identifying your reference component:

1. **Read the reference files** - Understand the implementation
2. **Follow the patterns** - Use same structure and conventions
3. **Use templates** - Start with [templates/](../templates/)
4. **Review patterns** - Check [data-attribute-pattern.md](./data-attribute-pattern.md), [css-variable-pattern.md](./css-variable-pattern.md)
5. **Validate** - Use [validation checklists](../validation/)

---

For more information:
- [agent-instructions.md](../agent-instructions.md) - Complete generation workflow
- [data-attribute-pattern.md](./data-attribute-pattern.md) - Data attribute usage
- [css-variable-pattern.md](./css-variable-pattern.md) - CSS variable usage
- [spacing-system.md](./spacing-system.md) - Spacing guidelines
