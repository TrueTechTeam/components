# Generate Stories Prompt Template

Use this prompt template when asking an agent to generate Storybook stories for a component.

## Prompt Template

```
Generate Storybook stories for the [COMPONENT_NAME] component.

COMPONENT LOCATION:
libs/ui-components/src/lib/components/[category]/[ComponentName]/

STORY FILE TO CREATE:
[ComponentName].stories.tsx

REQUIRED STORIES (minimum 8):

1. Default
   - Basic usage with default props
   - Shows component with minimal configuration

2. Variants
   - All variants displayed in a row
   - Disable controls
   - Add description

3. Sizes
   - All sizes displayed side-by-side
   - Disable controls
   - Show size comparison

4. States
   - Different states (default, disabled, etc.)
   - Disable controls
   - Show state variations

5. With Long Content
   - Test content overflow and wrapping
   - Show different content lengths

6. With Icons (if applicable)
   - Show icon integration
   - startIcon and endIcon examples

7. Custom Styling (CSS Variables)
   - Show CSS variable overrides
   - Custom colors, spacing, sizing
   - Demonstrate customization capabilities

8. All Combinations
   - Comprehensive grid showing all variants × all sizes
   - Include disabled states
   - Disable controls

9. Playground (interactive)
   - Enable all controls
   - Default to primary variant, md size
   - Let users explore all props

STORY CONFIGURATION:

Meta Setup:
```typescript
const meta: Meta<typeof ComponentName> = {
  title: '[Category]/[ComponentName]',  // e.g., 'Display/Badge'
  component: ComponentName,
  tags: ['autodocs'],  // Auto-generates documentation
  argTypes: {
    variant: {
      control: 'select',
      options: [/* list all variants */],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: [/* list all sizes */],
      description: 'Size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    // Hide complex props from controls
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};
```

Story Parameters:
- Disable controls for demo stories (Variants, Sizes, States, etc.)
- Add descriptions to explain each story
- Use consistent spacing (gap: '16px') between elements

TEMPLATE TO USE:
libs/ui-components/.claude/templates/display-component.template.stories.tsx

REFERENCE STORIES:
libs/ui-components/src/lib/components/inputs/TagInput/TagInput.stories.tsx

AFTER CREATING STORIES:
```bash
# Start Storybook
npm run storybook

# Verify:
# 1. All stories render correctly
# 2. Light and dark modes work
# 3. Controls work in Playground story
# 4. Variants display correctly
# 5. Sizes display correctly
```

VALIDATION:
- Minimum 8 stories created
- Meta includes tags: ['autodocs']
- ArgTypes configured with controls
- Demo stories have controls disabled
- All variants visible in Variants story
- All sizes visible in Sizes story
- Playground story has all controls enabled
- Stories render without errors
- Works in light and dark modes
```

## Example Usage

### Example: Badge Component Stories

```
Generate Storybook stories for the Badge component.

COMPONENT LOCATION:
libs/ui-components/src/lib/components/display/Badge/

STORY FILE TO CREATE:
Badge.stories.tsx

VARIANTS TO SHOW:
- primary, secondary, success, warning, danger

SIZES TO SHOW:
- sm, md, lg

STATES TO SHOW:
- default, disabled

INTERACTIVE: No

ICONS: No

STORY TITLE: 'Display/Badge'
```

## Story Examples

### Default Story
```typescript
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};
```

### Variants Story
```typescript
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants.',
      },
    },
  },
};
```

### Sizes Story
```typescript
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
```

### Custom Styling Story
```typescript
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Badge
        style={{
          '--badge-bg': '#ff6b6b',
          '--badge-color': '#ffffff',
        } as React.CSSProperties}
      >
        Custom Colors
      </Badge>
      <Badge
        style={{
          '--badge-padding': '12px 24px',
        } as React.CSSProperties}
      >
        Custom Padding
      </Badge>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Customize using CSS variables.',
      },
    },
  },
};
```

### All Combinations Story
```typescript
export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['primary', 'secondary', 'success', 'warning', 'danger'] as const).map(
        (variant) => (
          <div key={variant}>
            <h4 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>
              {variant}
            </h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Badge variant={variant} size="sm">Small</Badge>
              <Badge variant={variant} size="md">Medium</Badge>
              <Badge variant={variant} size="lg">Large</Badge>
              <Badge variant={variant} disabled>Disabled</Badge>
            </div>
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
```

## Notes

- Always create minimum 8 stories
- Use consistent naming (Default, Variants, Sizes, States, etc.)
- Disable controls for demo stories
- Enable controls for Playground story
- Add descriptions to stories
- Use consistent spacing (gap: '16px')
- Test in light and dark modes
- Verify all stories render correctly
- Include CSS variable customization example
