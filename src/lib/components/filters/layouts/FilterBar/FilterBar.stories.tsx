import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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
FilterBar provides a horizontal inline layout for filter controls.
Supports overflow handling with a "More Filters" dropdown.
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
    showActiveFilters: {
      control: 'boolean',
      description: 'Show active filters display',
    },
    activeFiltersPosition: {
      control: 'select',
      options: ['top', 'bottom', 'inline'],
      description: 'Position of active filters',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear all button',
    },
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
