import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FilterProvider, ActiveFilters, FilterField } from '../../index';
import { Chip } from '../../../display/Chip';
import type { FilterDefinition, FilterValue } from '../../types';

const meta: Meta<typeof ActiveFilters> = {
  title: 'Filters/Core/ActiveFilters',
  component: ActiveFilters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
ActiveFilters displays currently applied filters as removable chips.
Provides an easy way for users to see and remove active filters.

## CSS Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--active-filters-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm, 8px)</code></a></td>
<td>Gap between filter chips</td>
</tr>
<tr>
<td><code>--active-filters-show-more-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary, #2563eb)</code></a></td>
<td>Color of "show more" and "show less" buttons</td>
</tr>
</tbody>
</table>
        `,
      },
    },
  },
  argTypes: {
    maxVisible: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of chips to show before collapsing',
    },
    showClearAll: {
      control: 'boolean',
      description: 'Show "Clear All" button when multiple filters are active',
    },
    clearAllLabel: {
      control: 'text',
      description: 'Label for the clear all button',
    },
    chipVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral'],
      description: 'Visual variant for the chips',
    },
    chipSize: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size of the chips',
    },
    emptyContent: { table: { disable: true } },
    renderChip: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ActiveFilters>;

// =============================================================================
// Sample Filter Definitions
// =============================================================================

const sampleFilters: FilterDefinition[] = [
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    id: 'category',
    type: 'multi-select',
    label: 'Category',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home' },
    ],
  },
  {
    id: 'search',
    type: 'text',
    label: 'Search',
  },
  {
    id: 'inStock',
    type: 'toggle',
    label: 'In Stock',
  },
  {
    id: 'rating',
    type: 'rating',
    label: 'Rating',
    config: { max: 5 },
  },
  {
    id: 'priceRange',
    type: 'number-range',
    label: 'Price',
    config: { min: 0, max: 1000, prefix: '$' },
  },
];

const defaultValues: Record<string, FilterValue> = {
  status: 'active',
  category: ['electronics', 'clothing'],
  search: 'laptop',
  inStock: true,
  rating: 4,
  priceRange: { min: 100, max: 500 },
};

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={defaultValues}
      onChange={action('onChange')}
    >
      <ActiveFilters />
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Active filters displayed as removable chips with a Clear All button.',
      },
    },
  },
};

export const WithMaxVisible: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={defaultValues}
      onChange={action('onChange')}
    >
      <ActiveFilters maxVisible={3} />
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Limits the number of visible chips with a "+X more" indicator.',
      },
    },
  },
};

export const WithoutClearAll: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active', category: ['electronics'] }}
      onChange={action('onChange')}
    >
      <ActiveFilters showClearAll={false} />
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Active filters without the Clear All button.',
      },
    },
  },
};

export const ChipVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Primary Chips</h4>
        <FilterProvider
          filters={sampleFilters}
          defaultValues={{ status: 'active', category: ['electronics'] }}
          onChange={action('onChange')}
        >
          <ActiveFilters chipVariant="primary" />
        </FilterProvider>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Secondary Chips (Default)</h4>
        <FilterProvider
          filters={sampleFilters}
          defaultValues={{ status: 'active', category: ['electronics'] }}
          onChange={action('onChange')}
        >
          <ActiveFilters chipVariant="secondary" />
        </FilterProvider>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Neutral Chips</h4>
        <FilterProvider
          filters={sampleFilters}
          defaultValues={{ status: 'active', category: ['electronics'] }}
          onChange={action('onChange')}
        >
          <ActiveFilters chipVariant="neutral" />
        </FilterProvider>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different chip variant styles.',
      },
    },
  },
};

export const ChipSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Small Chips (Default)</h4>
        <FilterProvider
          filters={sampleFilters}
          defaultValues={{ status: 'active', category: ['electronics'] }}
          onChange={action('onChange')}
        >
          <ActiveFilters chipSize="sm" />
        </FilterProvider>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Medium Chips</h4>
        <FilterProvider
          filters={sampleFilters}
          defaultValues={{ status: 'active', category: ['electronics'] }}
          onChange={action('onChange')}
        >
          <ActiveFilters chipSize="md" />
        </FilterProvider>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different chip sizes.',
      },
    },
  },
};

export const WithEmptyContent: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <ActiveFilters
        emptyContent={
          <span style={{ color: '#888', fontStyle: 'italic' }}>
            No filters applied. Select filters to narrow your results.
          </span>
        }
      />
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Custom content shown when no filters are active.',
      },
    },
  },
};

export const WithCustomRenderChip: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active', category: ['electronics', 'clothing'] }}
      onChange={action('onChange')}
    >
      <ActiveFilters
        renderChip={(filter, value, onRemove) => (
          <Chip
            key={filter.id}
            variant="primary"
            size="md"
            onRemove={onRemove}
            style={{ borderRadius: '4px' }}
          >
            <strong>{filter.label}:</strong> {String(value)}
          </Chip>
        )}
      />
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Custom chip rendering with renderChip prop.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <FilterField filterId="status" />
          <FilterField filterId="category" />
          <FilterField filterId="search" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <FilterField filterId="inStock" />
          <FilterField filterId="rating" />
        </div>
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Active Filters:</h4>
          <ActiveFilters />
        </div>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Interactive example - select filters to see them appear as chips.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    maxVisible: 5,
    showClearAll: true,
    clearAllLabel: 'Clear all',
    chipVariant: 'secondary',
    chipSize: 'sm',
  },
  render: (args) => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={defaultValues}
      onChange={action('onChange')}
    >
      <ActiveFilters {...args} />
    </FilterProvider>
  ),
};
