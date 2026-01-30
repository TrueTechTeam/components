import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FilterProvider, FilterField } from '../../index';
import type { FilterDefinition } from '../../types';

const meta: Meta<typeof FilterField> = {
  title: 'Filters/Core/FilterField',
  component: FilterField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FilterField is a unified wrapper that automatically renders the appropriate filter
component based on the filter definition's type. It reads the filter configuration
from the FilterProvider context.
        `,
      },
    },
  },
  argTypes: {
    filterId: {
      control: 'text',
      description: 'The ID of the filter definition to render',
    },
    label: {
      control: 'text',
      description: 'Override the filter label',
    },
    placeholder: {
      control: 'text',
      description: 'Override the filter placeholder',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the label',
    },
    componentProps: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterField>;

// =============================================================================
// Sample Filter Definitions
// =============================================================================

const sampleFilters: FilterDefinition[] = [
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    id: 'categories',
    type: 'multi-select',
    label: 'Categories',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home' },
    ],
    config: { displayMode: 'checkbox-group' },
  },
  {
    id: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Search...',
    config: { showClearButton: true },
  },
  {
    id: 'inStock',
    type: 'toggle',
    label: 'In Stock Only',
  },
  {
    id: 'featured',
    type: 'checkbox',
    label: 'Featured Products',
  },
  {
    id: 'priceRange',
    type: 'number-range',
    label: 'Price Range',
    config: { min: 0, max: 1000, displayMode: 'slider', prefix: '$' },
  },
  {
    id: 'rating',
    type: 'rating',
    label: 'Rating',
    config: { max: 5 },
  },
];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="status" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const SelectFilter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="status" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField renders a Select component for select type filters.',
      },
    },
  },
};

export const MultiSelectFilter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="categories" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField renders a CheckboxGroup for multi-select type filters.',
      },
    },
  },
};

export const TextFilter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="search" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField renders a text Input for text type filters.',
      },
    },
  },
};

export const ToggleFilter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="inStock" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField renders a Toggle for toggle type filters.',
      },
    },
  },
};

export const CheckboxFilter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="featured" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField renders a Checkbox for checkbox type filters.',
      },
    },
  },
};

export const NumberRangeFilter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="priceRange" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField renders a Slider for number-range type filters.',
      },
    },
  },
};

export const RatingFilter: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="rating" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField renders a Rating component for rating type filters.',
      },
    },
  },
};

export const WithoutLabel: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="status" showLabel={false} placeholder="Select status..." />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'FilterField can hide the label using showLabel={false}.',
      },
    },
  },
};

export const WithOverrides: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <FilterField filterId="status" label="Custom Label" placeholder="Custom placeholder..." />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Labels and placeholders can be overridden via props.',
      },
    },
  },
};

export const AllTypes: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
        <FilterField filterId="status" />
        <FilterField filterId="categories" />
        <FilterField filterId="search" />
        <FilterField filterId="inStock" />
        <FilterField filterId="featured" />
        <FilterField filterId="priceRange" />
        <FilterField filterId="rating" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Multiple FilterField components rendering different filter types.',
      },
    },
  },
};
