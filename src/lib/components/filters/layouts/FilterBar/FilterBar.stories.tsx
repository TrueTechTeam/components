import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { FilterProvider, FilterBar, FilterField } from '../../index';
import type { FilterDefinition } from '../../types';

const meta: Meta<typeof FilterBar> = {
  title: 'Filters/Layouts/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FilterBar provides a horizontal inline layout for filter controls. Supports overflow handling with a "More Filters" dropdown.

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
<td><code>--filter-bar-gap-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm, 8px)</code></a></td>
<td>Small gap between filters</td>
</tr>
<tr>
<td><code>--filter-bar-gap-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md, 16px)</code></a></td>
<td>Medium gap between filters</td>
</tr>
<tr>
<td><code>--filter-bar-gap-lg</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-lg, 24px)</code></a></td>
<td>Large gap between filters</td>
</tr>
<tr>
<td><code>--filter-bar-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-surface-primary, #ffffff)</code></a></td>
<td>Background color</td>
</tr>
<tr>
<td><code>--filter-bar-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary, #e0e0e0)</code></a></td>
<td>Bottom border color</td>
</tr>
<tr>
<td><code>--filter-bar-padding</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md, 16px)</code></a></td>
<td>Padding</td>
</tr>
<tr>
<td><code>--spacing-xs</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>4px</code></a></td>
<td>Extra small spacing</td>
</tr>
<tr>
<td><code>--radius-full</code></td>
<td><code>9999px</code></td>
<td>Full border radius for badge</td>
</tr>
<tr>
<td><code>--theme-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#2563eb</code></a></td>
<td>Badge background color</td>
</tr>
<tr>
<td><code>--theme-text-on-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#ffffff</code></a></td>
<td>Badge text color</td>
</tr>
<tr>
<td><code>--font-size-xs</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>0.75rem</code></a></td>
<td>Badge font size</td>
</tr>
<tr>
<td><code>--font-weight-semibold</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>600</code></a></td>
<td>Badge font weight</td>
</tr>
</tbody>
</table>
        `,
      },
    },
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between filters',
    },
    wrap: {
      control: 'boolean',
      description: 'Wrap filters on overflow',
    },
    showMoreFilters: {
      control: 'boolean',
      description: 'Show "More Filters" dropdown for overflow',
    },
    moreFiltersLabel: {
      control: 'text',
      description: 'Label for more filters button',
    },
    showActiveFilters: {
      control: 'boolean',
      description: 'Show active filters display',
    },
    activeFiltersPosition: {
      control: 'select',
      options: ['top', 'bottom', 'inline'],
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
    visibleFilters: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

// =============================================================================
// Sample Filter Definitions
// =============================================================================

const sampleFilters: FilterDefinition[] = [
  {
    id: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search...',
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
    type: 'select',
    label: 'Category',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home & Garden' },
    ],
  },
  {
    id: 'brand',
    type: 'multi-select',
    label: 'Brand',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'samsung', label: 'Samsung' },
      { value: 'sony', label: 'Sony' },
    ],
    config: { displayMode: 'dropdown' },
  },
  {
    id: 'inStock',
    type: 'toggle',
    label: 'In Stock',
  },
];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <FilterBar visibleFilters={['search', 'status', 'category']}>
        <FilterField filterId="search" showLabel={false} />
        <FilterField filterId="status" showLabel={false} />
        <FilterField filterId="category" showLabel={false} />
      </FilterBar>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Default horizontal filter bar with inline filters.',
      },
    },
  },
};

export const WithMoreFilters: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <FilterBar
        visibleFilters={['search', 'status']}
        showMoreFilters
        moreFiltersLabel="More Filters"
      >
        <FilterField filterId="search" showLabel={false} />
        <FilterField filterId="status" showLabel={false} />
      </FilterBar>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter bar with overflow filters in a "More Filters" dropdown.',
      },
    },
  },
};

export const WithActiveFiltersInline: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active', category: 'electronics' }}
      onChange={action('onChange')}
    >
      <FilterBar
        visibleFilters={['search', 'status', 'category']}
        showActiveFilters
        activeFiltersPosition="inline"
      >
        <FilterField filterId="search" showLabel={false} />
        <FilterField filterId="status" showLabel={false} />
        <FilterField filterId="category" showLabel={false} />
      </FilterBar>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter bar with active filters displayed inline.',
      },
    },
  },
};

export const WithActiveFiltersTop: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active', category: 'electronics' }}
      onChange={action('onChange')}
    >
      <FilterBar
        visibleFilters={['search', 'status', 'category']}
        showActiveFilters
        activeFiltersPosition="top"
      >
        <FilterField filterId="search" showLabel={false} />
        <FilterField filterId="status" showLabel={false} />
        <FilterField filterId="category" showLabel={false} />
      </FilterBar>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter bar with active filters displayed above the filters.',
      },
    },
  },
};

export const WithActionButtons: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active' }}
      onChange={action('onChange')}
      onClear={action('onClear')}
      onReset={action('onReset')}
    >
      <FilterBar visibleFilters={['search', 'status', 'category']} showClearButton showResetButton>
        <FilterField filterId="search" showLabel={false} />
        <FilterField filterId="status" showLabel={false} />
        <FilterField filterId="category" showLabel={false} />
      </FilterBar>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter bar with Clear and Reset action buttons.',
      },
    },
  },
};

export const DifferentGaps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Small Gap</h4>
        <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
          <FilterBar visibleFilters={['search', 'status', 'category']} gap="sm">
            <FilterField filterId="search" showLabel={false} />
            <FilterField filterId="status" showLabel={false} />
            <FilterField filterId="category" showLabel={false} />
          </FilterBar>
        </FilterProvider>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Medium Gap (Default)</h4>
        <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
          <FilterBar visibleFilters={['search', 'status', 'category']} gap="md">
            <FilterField filterId="search" showLabel={false} />
            <FilterField filterId="status" showLabel={false} />
            <FilterField filterId="category" showLabel={false} />
          </FilterBar>
        </FilterProvider>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Large Gap</h4>
        <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
          <FilterBar visibleFilters={['search', 'status', 'category']} gap="lg">
            <FilterField filterId="search" showLabel={false} />
            <FilterField filterId="status" showLabel={false} />
            <FilterField filterId="category" showLabel={false} />
          </FilterBar>
        </FilterProvider>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Comparison of different gap sizes.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    gap: 'md',
    wrap: true,
    showMoreFilters: true,
    showActiveFilters: true,
    activeFiltersPosition: 'inline',
    showClearButton: true,
    showResetButton: false,
  },
  render: (args) => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active' }}
      onChange={action('onChange')}
    >
      <FilterBar {...args} visibleFilters={['search', 'status']}>
        <FilterField filterId="search" showLabel={false} />
        <FilterField filterId="status" showLabel={false} />
      </FilterBar>
    </FilterProvider>
  ),
};
