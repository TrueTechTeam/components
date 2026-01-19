import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Visual variant of the tag',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tag',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tag is disabled',
    },
    removable: {
      control: 'boolean',
      description: 'Whether the tag can be removed',
    },
    onRemove: { table: { disable: true } },
    onClick: { table: { disable: true } },
    children: {
      control: 'text',
      description: 'Content to display inside the tag',
    },
    className: {
      table: { disable: true },
    },
    'data-testid': {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

// 1. Default story
export const Default: Story = {
  args: {
    children: 'Default Tag',
  },
};

// 2. Variants story
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="secondary">Secondary</Tag>
      <Tag variant="tertiary">Tertiary</Tag>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants of the tag.',
      },
    },
  },
};

// 3. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available size options.',
      },
    },
  },
};

// 4. States story
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Tag>Default</Tag>
      <Tag disabled>Disabled</Tag>
      <Tag removable onRemove={() => console.log('removed')}>
        Removable
      </Tag>
      <Tag onClick={() => console.log('clicked')}>Clickable</Tag>
      <Tag removable onRemove={() => console.log('removed')} disabled>
        Disabled Removable
      </Tag>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different tag states including removable and clickable.',
      },
    },
  },
};

// 5. Removable Tags
export const RemovableTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Tag variant="primary" size="sm" removable onRemove={() => console.log('removed')}>
          React
        </Tag>
        <Tag variant="secondary" size="sm" removable onRemove={() => console.log('removed')}>
          TypeScript
        </Tag>
        <Tag variant="tertiary" size="sm" removable onRemove={() => console.log('removed')}>
          SCSS
        </Tag>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Tag variant="primary" removable onRemove={() => console.log('removed')}>
          JavaScript
        </Tag>
        <Tag variant="secondary" removable onRemove={() => console.log('removed')}>
          Node.js
        </Tag>
        <Tag variant="tertiary" removable onRemove={() => console.log('removed')}>
          Express
        </Tag>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Tag variant="primary" size="lg" removable onRemove={() => console.log('removed')}>
          MongoDB
        </Tag>
        <Tag variant="secondary" size="lg" removable onRemove={() => console.log('removed')}>
          PostgreSQL
        </Tag>
        <Tag variant="tertiary" size="lg" removable onRemove={() => console.log('removed')}>
          Redis
        </Tag>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Removable tags with close buttons across all sizes.',
      },
    },
  },
};

// 6. Clickable Tags
export const ClickableTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag variant="primary" onClick={() => console.log('clicked primary')}>
        Frontend
      </Tag>
      <Tag variant="secondary" onClick={() => console.log('clicked secondary')}>
        Backend
      </Tag>
      <Tag variant="tertiary" onClick={() => console.log('clicked tertiary')}>
        DevOps
      </Tag>
      <Tag variant="primary" size="sm" onClick={() => console.log('clicked')}>
        Design
      </Tag>
      <Tag variant="secondary" size="lg" onClick={() => console.log('clicked')}>
        Testing
      </Tag>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Interactive tags that trigger actions when clicked.',
      },
    },
  },
};

// 7. Tag Collections
export const TagCollections: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Skills</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['React', 'TypeScript', 'Node.js', 'GraphQL', 'MongoDB', 'Docker'].map((skill) => (
            <Tag key={skill} variant="primary" removable onRemove={() => console.log(`removed ${skill}`)}>
              {skill}
            </Tag>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Categories</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Technology', 'Design', 'Business', 'Marketing'].map((category) => (
            <Tag key={category} variant="secondary" onClick={() => console.log(`clicked ${category}`)}>
              {category}
            </Tag>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Status</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Active', 'In Progress', 'Completed', 'Archived'].map((status) => (
            <Tag key={status} variant="tertiary" size="sm">
              {status}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Examples of tag collections for different use cases.',
      },
    },
  },
};

// 8. Custom Styling (CSS Variables)
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Tag
        style={{
          '--tag-bg': '#ff6b6b',
          '--tag-color': '#ffffff',
        } as React.CSSProperties}
      >
        Custom Colors
      </Tag>
      <Tag
        style={{
          '--tag-padding': '12px 24px',
          '--tag-border-radius': '20px',
        } as React.CSSProperties}
      >
        Custom Spacing
      </Tag>
      <Tag
        style={{
          '--tag-font-size': '18px',
          '--tag-height': '40px',
        } as React.CSSProperties}
      >
        Custom Size
      </Tag>
      <Tag
        style={{
          '--tag-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '--tag-color': '#ffffff',
        } as React.CSSProperties}
      >
        Gradient Background
      </Tag>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Examples of customizing the tag using CSS variables.',
      },
    },
  },
};

// 9. All Combinations (Grid)
export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <div key={variant}>
          <h4 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{variant}</h4>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Tag variant={variant} size="sm">
              Small
            </Tag>
            <Tag variant={variant} size="md">
              Medium
            </Tag>
            <Tag variant={variant} size="lg">
              Large
            </Tag>
            <Tag variant={variant} removable onRemove={() => console.log('removed')}>
              Removable
            </Tag>
            <Tag variant={variant} onClick={() => console.log('clicked')}>
              Clickable
            </Tag>
            <Tag variant={variant} disabled>
              Disabled
            </Tag>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All variant, size, and state combinations in a comprehensive grid.',
      },
    },
  },
};

// 10. Playground story with interactive controls
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    removable: false,
    children: 'Playground Tag',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all tag props.',
      },
    },
  },
};
