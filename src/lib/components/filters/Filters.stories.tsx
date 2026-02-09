import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';
import { FilterProvider, FilterSidebar, FilterSection, FilterField, ActiveFilters } from './index';
import type { FilterDefinition, FilterValue } from './types';

const meta: Meta<typeof FilterProvider> = {
  title: 'Filters/Overview',
  component: FilterProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A powerful filter component system supporting multiple filter types, cascading dependencies,
lazy-loaded options, and various UI layouts.

## Features
- 11 filter types: select, multi-select, checkbox, toggle, text, number, number-range, date, date-range, rating, list-select
- Cascading filter dependencies with show/hide/disable actions
- Controlled and uncontrolled modes
- Active filter tracking and display
- Multiple layout options (sidebar, bar, popover, modal, accordion)
- Extensible filter field architecture

## Core Components
- **FilterProvider**: Context wrapper that manages filter state
- **FilterField**: Unified wrapper that renders the appropriate filter component
- **FilterSection**: Collapsible container for grouping related filters
- **ActiveFilters**: Displays currently applied filters as removable chips
- **FilterSidebar**: Layout container for filter components

## Filter Types
1. **select**: Single-select dropdown
2. **multi-select**: Multiple selection with checkbox or list display
3. **checkbox**: Boolean checkbox
4. **toggle**: Boolean toggle switch
5. **text**: Text input with debounce
6. **number**: Single number input
7. **number-range**: Range slider or input pair
8. **date**: Single date picker
9. **date-range**: Date range picker with presets
10. **rating**: Star rating selector
11. **list-select**: List-based selection
        `,
      },
    },
  },
  argTypes: {
    filters: { table: { disable: true } },
    groups: { table: { disable: true } },
    values: { table: { disable: true } },
    defaultValues: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onApply: { table: { disable: true } },
    onClear: { table: { disable: true } },
    onReset: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterProvider>;

// =============================================================================
// Sample Filter Definitions
// =============================================================================

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' },
];

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
  { value: 'books', label: 'Books' },
];

const brandOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'sony', label: 'Sony' },
  { value: 'lg', label: 'LG' },
  { value: 'microsoft', label: 'Microsoft' },
];

const sampleFilters: FilterDefinition[] = [
  {
    id: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search products...',
    config: {
      showClearButton: true,
      debounceMs: 300,
    },
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select status',
    options: statusOptions,
    config: {
      showClearButton: true,
    },
  },
  {
    id: 'category',
    type: 'multi-select',
    label: 'Category',
    options: categoryOptions,
    group: 'product',
    config: {
      displayMode: 'checkbox-group',
      showSelectAll: true,
    },
  },
  {
    id: 'brand',
    type: 'multi-select',
    label: 'Brand',
    options: brandOptions,
    group: 'product',
    config: {
      displayMode: 'list',
    },
  },
  {
    id: 'priceRange',
    type: 'number-range',
    label: 'Price Range',
    group: 'product',
    config: {
      min: 0,
      max: 1000,
      step: 10,
      displayMode: 'slider',
      prefix: '$',
    },
  },
  {
    id: 'rating',
    type: 'rating',
    label: 'Minimum Rating',
    group: 'product',
    config: {
      max: 5,
      allowClear: true,
    },
  },
  {
    id: 'inStock',
    type: 'toggle',
    label: 'In Stock Only',
  },
  {
    id: 'onSale',
    type: 'checkbox',
    label: 'On Sale',
  },
  {
    id: 'dateAdded',
    type: 'date-range',
    label: 'Date Added',
    config: {
      showPresets: true,
      presets: [
        {
          label: 'Last 7 days',
          getValue: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 7);
            return { startDate: start, endDate: end };
          },
        },
        {
          label: 'Last 30 days',
          getValue: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 30);
            return { startDate: start, endDate: end };
          },
        },
      ],
    },
  },
];

const filterGroups = [{ id: 'product', label: 'Product Filters' }];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      onChange={action('onChange')}
      onApply={action('onApply')}
    >
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <FilterSidebar
          width={280}
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Filters</h3>}
        >
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

          <FilterSection title="Availability">
            <FilterField filterId="inStock" />
            <FilterField filterId="onSale" />
          </FilterSection>

          <FilterSection title="Date">
            <FilterField filterId="dateAdded" />
          </FilterSection>
        </FilterSidebar>

        <main style={{ flex: 1, padding: '1rem' }}>
          <ActiveFilters />
          <p style={{ color: '#666', marginTop: '1rem' }}>
            Select filters from the sidebar to see them appear as chips above.
          </p>
        </main>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Complete filter system with sidebar layout, sections, and active filters display.',
      },
    },
  },
};

const ControlledComponent = () => {
  const [values, setValues] = useState<Record<string, FilterValue>>({
    status: 'active',
    category: ['electronics'],
  });

  return (
    <div>
      <FilterProvider
        filters={sampleFilters}
        values={values}
        onChange={(newValues, changedId) => {
          setValues(newValues);
          action('onChange')(newValues, changedId);
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <FilterSidebar width={280}>
            <FilterSection title="Filters">
              <FilterField filterId="search" />
              <FilterField filterId="status" />
              <FilterField filterId="category" />
            </FilterSection>
          </FilterSidebar>

          <main style={{ flex: 1, padding: '1rem' }}>
            <ActiveFilters />
            <div style={{ marginTop: '1rem' }}>
              <h4>Current Values:</h4>
              <pre
                style={{
                  background: 'var(--theme-surface-secondary)',
                  padding: '1rem',
                  borderRadius: '4px',
                }}
              >
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
          </main>
        </div>
      </FilterProvider>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Controlled mode where filter values are managed externally.',
      },
    },
  },
};

export const WithDependencies: Story = {
  render: () => {
    const filtersWithDeps: FilterDefinition[] = [
      {
        id: 'country',
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'uk', label: 'United Kingdom' },
        ],
      },
      {
        id: 'state',
        type: 'select',
        label: 'State/Province',
        options: [
          { value: 'ca', label: 'California' },
          { value: 'ny', label: 'New York' },
          { value: 'tx', label: 'Texas' },
          { value: 'on', label: 'Ontario' },
          { value: 'bc', label: 'British Columbia' },
        ],
        dependencies: [
          {
            dependsOn: 'country',
            action: 'show',
            condition: (deps) => deps.country === 'us' || deps.country === 'ca',
            resetOnChange: true,
          },
        ],
      },
      {
        id: 'city',
        type: 'text',
        label: 'City',
        dependencies: [
          {
            dependsOn: 'state',
            action: 'show',
          },
        ],
      },
    ];

    return (
      <FilterProvider filters={filtersWithDeps} onChange={action('onChange')}>
        <div style={{ maxWidth: '400px' }}>
          <h4 style={{ marginBottom: '1rem' }}>Cascading Filters</h4>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Select a country to reveal the state filter. Select a state to reveal the city filter.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FilterField filterId="country" />
            <FilterField filterId="state" />
            <FilterField filterId="city" />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <ActiveFilters />
          </div>
        </div>
      </FilterProvider>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filters with dependencies - child filters appear based on parent selections.',
      },
    },
  },
};

export const AllFilterTypes: Story = {
  render: () => {
    const allTypeFilters: FilterDefinition[] = [
      {
        id: 'select',
        type: 'select',
        label: 'Select Filter',
        options: statusOptions,
      },
      {
        id: 'multiSelect',
        type: 'multi-select',
        label: 'Multi-Select Filter',
        options: categoryOptions,
        config: { displayMode: 'checkbox-group' },
      },
      {
        id: 'text',
        type: 'text',
        label: 'Text Filter',
        placeholder: 'Type to search...',
        config: { showClearButton: true },
      },
      {
        id: 'number',
        type: 'number',
        label: 'Number Filter',
        config: { min: 0, max: 100 },
      },
      {
        id: 'numberRange',
        type: 'number-range',
        label: 'Number Range Filter',
        config: { min: 0, max: 500, displayMode: 'both' },
      },
      {
        id: 'checkbox',
        type: 'checkbox',
        label: 'Checkbox Filter',
      },
      {
        id: 'toggle',
        type: 'toggle',
        label: 'Toggle Filter',
      },
      {
        id: 'rating',
        type: 'rating',
        label: 'Rating Filter',
        config: { max: 5 },
      },
      {
        id: 'date',
        type: 'date',
        label: 'Date Filter',
      },
      {
        id: 'dateRange',
        type: 'date-range',
        label: 'Date Range Filter',
      },
    ];

    return (
      <FilterProvider filters={allTypeFilters} onChange={action('onChange')}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginTop: 0 }}>Active Filters:</h4>
            <ActiveFilters />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              maxWidth: '800px',
            }}
          >
            {allTypeFilters.map((filter) => (
              <div
                key={filter.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--theme-border-primary)',
                  borderRadius: '8px',
                }}
              >
                <FilterField filterId={filter.id} />
              </div>
            ))}
          </div>
        </div>
      </FilterProvider>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Showcase of all available filter types.',
      },
    },
  },
};

export const Minimal: Story = {
  render: () => {
    const minimalFilters: FilterDefinition[] = [
      { id: 'search', type: 'text', label: 'Search', placeholder: 'Search...' },
      { id: 'status', type: 'select', label: 'Status', options: statusOptions },
    ];

    return (
      <FilterProvider filters={minimalFilters} onChange={action('onChange')}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ width: '250px' }}>
            <FilterField filterId="search" />
          </div>
          <div style={{ width: '200px' }}>
            <FilterField filterId="status" />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <ActiveFilters />
        </div>
      </FilterProvider>
    );
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Minimal inline filter setup without sidebar layout.',
      },
    },
  },
};
