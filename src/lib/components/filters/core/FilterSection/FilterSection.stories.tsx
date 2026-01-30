import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { FilterProvider, FilterSection, FilterField } from '../../index';
import { Icon } from '../../../display/Icon';
import type { FilterDefinition } from '../../types';

const meta: Meta<typeof FilterSection> = {
  title: 'Filters/Core/FilterSection',
  component: FilterSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FilterSection provides a collapsible container for grouping related filters.
Shows an optional badge with the count of active filters in the section.
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Section title displayed in the header',
    },
    description: {
      control: 'text',
      description: 'Optional description below the title',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the section can be collapsed',
    },
    defaultCollapsed: {
      control: 'boolean',
      description: 'Initial collapsed state (uncontrolled)',
    },
    showActiveCount: {
      control: 'boolean',
      description: 'Show badge with count of active filters',
    },
    id: { table: { disable: true } },
    icon: { table: { disable: true } },
    collapsed: { table: { disable: true } },
    onCollapsedChange: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterSection>;

// =============================================================================
// Sample Filter Definitions
// =============================================================================

const productFilters: FilterDefinition[] = [
  {
    id: 'category',
    type: 'select',
    label: 'Category',
    group: 'product',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home' },
    ],
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
    ],
    config: { displayMode: 'checkbox-group' },
  },
  {
    id: 'priceRange',
    type: 'number-range',
    label: 'Price Range',
    group: 'product',
    config: { min: 0, max: 1000, displayMode: 'slider', prefix: '$' },
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
  { id: 'product', label: 'Product Filters' },
  { id: 'availability', label: 'Availability' },
];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterSection title="Product Filters" id="product">
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
          <FilterField filterId="priceRange" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Collapsible filter section with title and active filter count badge.',
      },
    },
  },
};

export const WithActiveCount: Story = {
  render: () => (
    <FilterProvider
      filters={productFilters}
      groups={filterGroups}
      defaultValues={{ category: 'electronics', brand: ['apple', 'samsung'] }}
      onChange={action('onChange')}
    >
      <div style={{ maxWidth: '300px' }}>
        <FilterSection title="Product Filters" id="product" showActiveCount>
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
          <FilterField filterId="priceRange" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Active count badge shows number of active filters in the section.',
      },
    },
  },
};

export const NotCollapsible: Story = {
  render: () => (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterSection title="Product Filters" collapsible={false}>
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Non-collapsible section that is always expanded.',
      },
    },
  },
};

export const DefaultCollapsed: Story = {
  render: () => (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterSection title="Advanced Filters" defaultCollapsed>
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Section that starts in collapsed state.',
      },
    },
  },
};

export const WithDescription: Story = {
  render: () => (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterSection
          title="Product Filters"
          description="Filter products by category, brand, and price range."
        >
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Section with a description below the title.',
      },
    },
  },
};

export const WithIcon: Story = {
  render: () => (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterSection title="Product Filters" icon={<Icon name="filter" size="1em" />}>
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Section with an icon in the header.',
      },
    },
  },
};

const ControlledSection = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? 'Expand' : 'Collapse'} Section
          </button>
        </div>
        <FilterSection
          title="Product Filters"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        >
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
        </FilterSection>
      </div>
    </FilterProvider>
  );
};

export const Controlled: Story = {
  render: () => <ControlledSection />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Controlled collapsed state via external button.',
      },
    },
  },
};

export const MultipleSections: Story = {
  render: () => (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <FilterSection title="Product" id="product">
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
          <FilterField filterId="priceRange" />
        </FilterSection>

        <FilterSection title="Availability" id="availability">
          <FilterField filterId="inStock" />
          <FilterField filterId="onSale" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Multiple filter sections stacked together.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  render: () => (
    <FilterProvider filters={productFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterSection collapsible={false}>
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Section without a title - just groups the filters.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    title: 'Product Filters',
    description: '',
    collapsible: true,
    defaultCollapsed: false,
    showActiveCount: true,
  },
  render: (args) => (
    <FilterProvider
      filters={productFilters}
      groups={filterGroups}
      defaultValues={{ category: 'electronics' }}
      onChange={action('onChange')}
    >
      <div style={{ maxWidth: '300px' }}>
        <FilterSection {...args} id="product">
          <FilterField filterId="category" />
          <FilterField filterId="brand" />
          <FilterField filterId="priceRange" />
        </FilterSection>
      </div>
    </FilterProvider>
  ),
};
