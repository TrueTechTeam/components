import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { FilterProvider, FilterAccordion, FilterField } from '../../index';
import { Accordion } from '../../../display/Accordion';
import { Icon } from '../../../display/Icon';
import { Button } from '../../../buttons/Button';
import type { FilterDefinition, FilterGroup } from '../../types';

const meta: Meta<typeof FilterAccordion> = {
  title: 'Filters/Layouts/FilterAccordion',
  component: FilterAccordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FilterAccordion automatically groups filters by their group property and displays them in an accordion layout. Supports single or multiple expanded panels.

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
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>16px</code></a></td>
<td>Gap between accordion items</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>8px</code></a></td>
<td>Padding and gap spacing</td>
</tr>
<tr>
<td><code>--theme-border-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#e0e0e0</code></a></td>
<td>Border color for separators</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#666666</code></a></td>
<td>Icon color for group titles</td>
</tr>
<tr>
<td><code>--theme-text-tertiary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#666666</code></a></td>
<td>Color for group descriptions</td>
</tr>
<tr>
<td><code>--font-size-sm</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>0.875rem</code></a></td>
<td>Font size for group descriptions</td>
</tr>
</tbody>
</table>
        `,
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Accordion mode - single or multiple expanded panels',
    },
    showGroupCounts: {
      control: 'boolean',
      description: 'Show active filter count badges on groups',
    },
    showActiveFilters: {
      control: 'boolean',
      description: 'Show active filters display',
    },
    activeFiltersPosition: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Position of active filters',
    },
    showApplyButton: {
      control: 'boolean',
      description: 'Show apply button',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear all button',
    },
    showResetButton: {
      control: 'boolean',
      description: 'Show reset button',
    },
    applyButtonLabel: {
      control: 'text',
      description: 'Label for apply button',
    },
    clearButtonLabel: {
      control: 'text',
      description: 'Label for clear button',
    },
    resetButtonLabel: {
      control: 'text',
      description: 'Label for reset button',
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultExpandedGroups: { table: { disable: true } },
    expandedGroups: { table: { disable: true } },
    onExpandedGroupsChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterAccordion>;

// =============================================================================
// Sample Filter Definitions
// =============================================================================

const sampleFilters: FilterDefinition[] = [
  {
    id: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search products...',
    config: { showClearButton: true },
  },
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
    group: 'product',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home & Garden' },
      { value: 'sports', label: 'Sports' },
    ],
    config: { displayMode: 'checkbox-group' },
  },
  {
    id: 'brand',
    type: 'multi-select',
    label: 'Brand',
    group: 'product',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'samsung', label: 'Samsung' },
      { value: 'sony', label: 'Sony' },
      { value: 'lg', label: 'LG' },
    ],
    config: { displayMode: 'list' },
  },
  {
    id: 'priceRange',
    type: 'number-range',
    label: 'Price Range',
    group: 'pricing',
    config: { min: 0, max: 1000, displayMode: 'inputs', prefix: '$' },
  },
  {
    id: 'discount',
    type: 'select',
    label: 'Discount',
    group: 'pricing',
    options: [
      { value: '10', label: '10% or more' },
      { value: '25', label: '25% or more' },
      { value: '50', label: '50% or more' },
    ],
  },
  {
    id: 'inStock',
    type: 'toggle',
    label: 'In Stock Only',
    group: 'availability',
  },
  {
    id: 'onSale',
    type: 'checkbox',
    label: 'On Sale',
    group: 'availability',
  },
  {
    id: 'rating',
    type: 'rating',
    label: 'Minimum Rating',
    group: 'availability',
    config: { max: 5 },
  },
];

const filterGroups: FilterGroup[] = [
  { id: 'product', label: 'Product', icon: <Icon name="shopping-bag" size="1em" /> },
  { id: 'pricing', label: 'Pricing', icon: <Icon name="dollar" size="1em" /> },
  { id: 'availability', label: 'Availability', icon: <Icon name="check" size="1em" /> },
];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div
        style={{
          maxWidth: '400px',
          padding: '1rem',
          background: 'var(--theme-surface-secondary)',
          borderRadius: '8px',
        }}
      >
        <FilterAccordion />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Auto-generated accordion from filter groups. Filters are automatically grouped by their group property.',
      },
    },
  },
};

export const WithDefaultExpanded: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div
        style={{
          maxWidth: '400px',
          padding: '1rem',
          background: 'var(--theme-surface-secondary)',
          borderRadius: '8px',
        }}
      >
        <FilterAccordion defaultExpandedGroups={['product', 'availability']} />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Accordion with specific groups expanded by default.',
      },
    },
  },
};

export const SingleMode: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div
        style={{
          maxWidth: '400px',
          padding: '1rem',
          background: 'var(--theme-surface-secondary)',
          borderRadius: '8px',
        }}
      >
        <FilterAccordion mode="single" defaultExpandedGroups={['product']} />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Single mode accordion where only one panel can be expanded at a time.',
      },
    },
  },
};

export const WithActiveFilters: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ category: ['electronics'], inStock: true }}
      onChange={action('onChange')}
    >
      <div
        style={{
          maxWidth: '400px',
          padding: '1rem',
          background: 'var(--theme-surface-secondary)',
          borderRadius: '8px',
        }}
      >
        <FilterAccordion
          showActiveFilters
          activeFiltersPosition="top"
          showGroupCounts
          defaultExpandedGroups={['product']}
        />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Accordion showing active filter badges on groups and active filters display.',
      },
    },
  },
};

export const WithActionButtons: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ status: 'active' }}
      onChange={action('onChange')}
      onClear={action('onClear')}
      onReset={action('onReset')}
    >
      <div
        style={{
          maxWidth: '400px',
          padding: '1rem',
          background: 'var(--theme-surface-secondary)',
          borderRadius: '8px',
        }}
      >
        <FilterAccordion showClearButton showResetButton defaultExpandedGroups={['product']} />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Accordion with Clear and Reset action buttons.',
      },
    },
  },
};

export const CustomContent: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div
        style={{
          maxWidth: '400px',
          padding: '1rem',
          background: 'var(--theme-surface-secondary)',
          borderRadius: '8px',
        }}
      >
        <FilterAccordion mode="multiple">
          <Accordion id="quick" header="Quick Filters" defaultOpen>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FilterField filterId="search" />
              <FilterField filterId="status" />
            </div>
          </Accordion>
          <Accordion id="categories" header="Categories">
            <FilterField filterId="category" />
          </Accordion>
          <Accordion id="other" header="Other Options">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FilterField filterId="inStock" />
              <FilterField filterId="onSale" />
            </div>
          </Accordion>
        </FilterAccordion>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Custom accordion content with manual Accordion components.',
      },
    },
  },
};

const ControlledAccordion = () => {
  const [expanded, setExpanded] = useState<string[]>(['product']);

  return (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filterGroups.map((group) => (
            <Button
              key={group.id}
              variant={expanded.includes(group.id) ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setExpanded((prev) =>
                  prev.includes(group.id)
                    ? prev.filter((id) => id !== group.id)
                    : [...prev, group.id]
                );
              }}
            >
              {group.label}
            </Button>
          ))}
        </div>
        <div
          style={{
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <FilterAccordion
            expandedGroups={expanded}
            onExpandedGroupsChange={(groups) => {
              setExpanded(groups);
              action('onExpandedGroupsChange')(groups);
            }}
          />
        </div>
      </div>
    </FilterProvider>
  );
};

export const Controlled: Story = {
  render: () => <ControlledAccordion />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Controlled accordion with external state management for expanded groups.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    mode: 'multiple',
    showGroupCounts: true,
    showActiveFilters: false,
    activeFiltersPosition: 'top',
    showClearButton: true,
    showResetButton: false,
  },
  render: (args) => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ category: ['electronics'] }}
      onChange={action('onChange')}
    >
      <div
        style={{
          maxWidth: '400px',
          padding: '1rem',
          background: 'var(--theme-surface-secondary)',
          borderRadius: '8px',
        }}
      >
        <FilterAccordion {...args} defaultExpandedGroups={['product']} />
      </div>
    </FilterProvider>
  ),
};
