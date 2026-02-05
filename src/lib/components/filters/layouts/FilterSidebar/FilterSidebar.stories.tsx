import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import {
  FilterProvider,
  FilterSidebar,
  FilterSection,
  FilterField,
  ActiveFilters,
} from '../../index';
import type { FilterDefinition } from '../../types';

const meta: Meta<typeof FilterSidebar> = {
  title: 'Filters/Layouts/FilterSidebar',
  component: FilterSidebar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FilterSidebar provides a vertical sidebar layout for filter controls.
Supports collapsible behavior, header/footer slots, and active filters display.
        `,
      },
    },
  },
  argTypes: {
    width: {
      control: { type: 'number', min: 200, max: 400 },
      description: 'Sidebar width in pixels',
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the sidebar',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the sidebar can be collapsed',
    },
    showActiveFilters: {
      control: 'boolean',
      description: 'Show active filters display',
    },
    activeFiltersPosition: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Position of active filters within sidebar',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear all button',
    },
    showResetButton: {
      control: 'boolean',
      description: 'Show reset button',
    },
    header: { table: { disable: true } },
    footer: { table: { disable: true } },
    children: { table: { disable: true } },
    collapsed: { table: { disable: true } },
    onCollapsedChange: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterSidebar>;

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
    group: 'product',
    config: { min: 0, max: 1000, displayMode: 'slider', prefix: '$' },
  },
  {
    id: 'rating',
    type: 'rating',
    label: 'Minimum Rating',
    group: 'product',
    config: { max: 5 },
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
];

const filterGroups = [
  { id: 'product', label: 'Product' },
  { id: 'availability', label: 'Availability' },
];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '500px' }}>
        <FilterSidebar width={280}>
          <FilterSection title="Quick Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
          </FilterSection>

          <FilterSection title="Product" id="product">
            <FilterField filterId="category" />
            <FilterField filterId="brand" />
            <FilterField filterId="priceRange" />
            <FilterField filterId="rating" />
          </FilterSection>

          <FilterSection title="Availability" id="availability">
            <FilterField filterId="inStock" />
            <FilterField filterId="onSale" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <h2>Content Area</h2>
          <p>Main content goes here. The sidebar provides filter controls.</p>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Default filter sidebar with sections and filter fields.',
      },
    },
  },
};

export const WithHeader: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <FilterSidebar
          width={280}
          header={<h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Filter Products</h3>}
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <p>Content area</p>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Sidebar with a custom header.',
      },
    },
  },
};

export const WithFooter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <FilterSidebar
          width={280}
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
          footer={
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Need help? <a href="/support">Contact support</a>
            </div>
          }
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <p>Content area</p>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Sidebar with a custom footer.',
      },
    },
  },
};

const CollapsibleSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <FilterSidebar
          width={280}
          collapsible
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <p>Click the chevron in the sidebar header to collapse it.</p>
        </main>
      </div>
    </FilterProvider>
  );
};

export const Collapsible: Story = {
  render: () => <CollapsibleSidebar />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Collapsible sidebar with toggle button in header.',
      },
    },
  },
};

export const WithActiveFiltersTop: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ status: 'active', category: ['electronics'] }}
      onChange={action('onChange')}
    >
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <FilterSidebar
          width={280}
          showActiveFilters
          activeFiltersPosition="top"
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <p>Active filters are displayed at the top of the sidebar.</p>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Active filters displayed at the top of the sidebar.',
      },
    },
  },
};

export const WithActiveFiltersBottom: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ status: 'active', category: ['electronics'] }}
      onChange={action('onChange')}
    >
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <FilterSidebar
          width={280}
          showActiveFilters
          activeFiltersPosition="bottom"
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <p>Active filters are displayed at the bottom of the sidebar.</p>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Active filters displayed at the bottom of the sidebar.',
      },
    },
  },
};

export const RightPosition: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <h2>Content Area</h2>
          <p>The sidebar is positioned on the right.</p>
        </main>

        <FilterSidebar
          width={280}
          position="right"
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterSidebar>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Sidebar positioned on the right side.',
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
      onApply={action('onApply')}
      onClear={action('onClear')}
      onReset={action('onReset')}
    >
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <FilterSidebar
          width={280}
          showClearButton
          showResetButton
          clearButtonLabel="Clear All"
          resetButtonLabel="Reset"
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <p>The sidebar has Clear and Reset action buttons.</p>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Sidebar with action buttons for clearing and resetting filters.',
      },
    },
  },
};

export const WithExternalActiveFilters: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ status: 'active', category: ['electronics', 'clothing'] }}
      onChange={action('onChange')}
    >
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '500px' }}>
        <FilterSidebar
          width={280}
          showActiveFilters={false}
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
        >
          <FilterSection title="Quick Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
          </FilterSection>

          <FilterSection title="Product" id="product">
            <FilterField filterId="category" />
            <FilterField filterId="brand" />
          </FilterSection>
        </FilterSidebar>

        <main style={{ flex: 1, padding: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Active Filters</h3>
          <ActiveFilters />
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--theme-surface-secondary)',
              borderRadius: '8px',
            }}
          >
            <p>Active filters can be displayed in the main content area instead of the sidebar.</p>
          </div>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Active filters displayed in the main content area instead of the sidebar.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    width: 280,
    position: 'left',
    collapsible: false,
    showActiveFilters: true,
    activeFiltersPosition: 'top',
    showClearButton: true,
    showResetButton: false,
  },
  render: (args) => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ status: 'active' }}
      onChange={action('onChange')}
    >
      <div style={{ display: 'flex', gap: '1.5rem', minHeight: '400px' }}>
        <FilterSidebar {...args} header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}>
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterSidebar>

        <main
          style={{
            flex: 1,
            padding: '1rem',
            background: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <p>Use the controls to customize the sidebar.</p>
        </main>
      </div>
    </FilterProvider>
  ),
};
