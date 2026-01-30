import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FilterProvider } from '../index';
import {
  SelectFilter,
  MultiSelectFilter,
  TextFilter,
  CheckboxFilter,
  ToggleFilter,
  NumberFilter,
  NumberRangeFilter,
  DateFilter,
  DateRangeFilter,
  RatingFilter,
} from './index';
import type { FilterDefinition } from '../types';

const meta: Meta = {
  title: 'Filters/Fields',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Individual filter field components. Each wraps a base input component and
integrates with the FilterProvider context.
        `,
      },
    },
  },
};

export default meta;

// =============================================================================
// Filter Definitions for Stories
// =============================================================================

const selectFilterDef: FilterDefinition = {
  id: 'status',
  type: 'select',
  label: 'Status',
  placeholder: 'Select status',
  options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
  ],
  config: { showClearButton: true, searchable: true },
};

const multiSelectFilterDef: FilterDefinition = {
  id: 'categories',
  type: 'multi-select',
  label: 'Categories',
  options: [
    { value: 'electronics', label: 'Electronics', count: 124 },
    { value: 'clothing', label: 'Clothing', count: 89 },
    { value: 'home', label: 'Home & Garden', count: 56 },
    { value: 'sports', label: 'Sports', count: 43 },
    { value: 'books', label: 'Books', count: 201 },
  ],
  config: { displayMode: 'checkbox-group', showSelectAll: true },
};

const textFilterDef: FilterDefinition = {
  id: 'search',
  type: 'text',
  label: 'Search',
  placeholder: 'Search products...',
  helperText: 'Search by name, SKU, or description',
  config: { showClearButton: true, debounceMs: 300 },
};

const checkboxFilterDef: FilterDefinition = {
  id: 'featured',
  type: 'checkbox',
  label: 'Featured Products Only',
};

const toggleFilterDef: FilterDefinition = {
  id: 'inStock',
  type: 'toggle',
  label: 'In Stock Only',
  helperText: 'Show only items that are currently available',
};

const numberFilterDef: FilterDefinition = {
  id: 'quantity',
  type: 'number',
  label: 'Minimum Quantity',
  config: { min: 0, max: 100, step: 1, showButtons: true },
};

const numberRangeFilterDef: FilterDefinition = {
  id: 'priceRange',
  type: 'number-range',
  label: 'Price Range',
  config: { min: 0, max: 1000, step: 10, displayMode: 'both', prefix: '$' },
};

const dateFilterDef: FilterDefinition = {
  id: 'releaseDate',
  type: 'date',
  label: 'Release Date',
};

const dateRangeFilterDef: FilterDefinition = {
  id: 'dateRange',
  type: 'date-range',
  label: 'Date Range',
  config: {
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
};

const ratingFilterDef: FilterDefinition = {
  id: 'rating',
  type: 'rating',
  label: 'Minimum Rating',
  config: { max: 5, allowClear: true },
};

// =============================================================================
// Select Filter Stories
// =============================================================================

export const Select: StoryObj = {
  render: () => (
    <FilterProvider filters={[selectFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <SelectFilter filterId="status" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single select dropdown filter with searchable and clearable options.',
      },
    },
  },
};

// =============================================================================
// Multi-Select Filter Stories
// =============================================================================

export const MultiSelectCheckboxGroup: StoryObj = {
  render: () => (
    <FilterProvider filters={[multiSelectFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <MultiSelectFilter filterId="categories" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multi-select filter rendered as a checkbox group with select all option.',
      },
    },
  },
};

export const MultiSelectList: StoryObj = {
  render: () => {
    const listModeDef: FilterDefinition = {
      ...multiSelectFilterDef,
      config: { displayMode: 'list' },
    };
    return (
      <FilterProvider filters={[listModeDef]} onChange={action('onChange')}>
        <div style={{ maxWidth: '300px' }}>
          <MultiSelectFilter filterId="categories" />
        </div>
      </FilterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select filter rendered as a list with counts.',
      },
    },
  },
};

// =============================================================================
// Text Filter Stories
// =============================================================================

export const Text: StoryObj = {
  render: () => (
    <FilterProvider filters={[textFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <TextFilter filterId="search" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text input filter with debounce and clear button.',
      },
    },
  },
};

// =============================================================================
// Checkbox Filter Stories
// =============================================================================

export const Checkbox: StoryObj = {
  render: () => (
    <FilterProvider filters={[checkboxFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <CheckboxFilter filterId="featured" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Simple boolean checkbox filter.',
      },
    },
  },
};

// =============================================================================
// Toggle Filter Stories
// =============================================================================

export const Toggle: StoryObj = {
  render: () => (
    <FilterProvider filters={[toggleFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <ToggleFilter filterId="inStock" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toggle switch filter with helper text.',
      },
    },
  },
};

// =============================================================================
// Number Filter Stories
// =============================================================================

export const Number: StoryObj = {
  render: () => (
    <FilterProvider filters={[numberFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <NumberFilter filterId="quantity" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Number input filter with increment/decrement buttons.',
      },
    },
  },
};

// =============================================================================
// Number Range Filter Stories
// =============================================================================

export const NumberRangeSlider: StoryObj = {
  render: () => {
    const sliderDef: FilterDefinition = {
      ...numberRangeFilterDef,
      config: { ...numberRangeFilterDef.config, displayMode: 'slider' },
    };
    return (
      <FilterProvider filters={[sliderDef]} onChange={action('onChange')}>
        <div style={{ maxWidth: '300px' }}>
          <NumberRangeFilter filterId="priceRange" />
        </div>
      </FilterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Number range filter with slider only.',
      },
    },
  },
};

export const NumberRangeInputs: StoryObj = {
  render: () => {
    const inputsDef: FilterDefinition = {
      ...numberRangeFilterDef,
      config: { ...numberRangeFilterDef.config, displayMode: 'inputs', showLabels: true },
    };
    return (
      <FilterProvider filters={[inputsDef]} onChange={action('onChange')}>
        <div style={{ maxWidth: '300px' }}>
          <NumberRangeFilter filterId="priceRange" />
        </div>
      </FilterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Number range filter with min/max inputs only.',
      },
    },
  },
};

export const NumberRangeBoth: StoryObj = {
  render: () => (
    <FilterProvider filters={[numberRangeFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <NumberRangeFilter filterId="priceRange" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Number range filter with both slider and inputs.',
      },
    },
  },
};

// =============================================================================
// Date Filter Stories
// =============================================================================

export const Date: StoryObj = {
  render: () => (
    <FilterProvider filters={[dateFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <DateFilter filterId="releaseDate" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single date picker filter.',
      },
    },
  },
};

// =============================================================================
// Date Range Filter Stories
// =============================================================================

export const DateRange: StoryObj = {
  render: () => (
    <FilterProvider filters={[dateRangeFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '400px' }}>
        <DateRangeFilter filterId="dateRange" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Date range picker filter with presets.',
      },
    },
  },
};

// =============================================================================
// Rating Filter Stories
// =============================================================================

export const Rating: StoryObj = {
  render: () => (
    <FilterProvider filters={[ratingFilterDef]} onChange={action('onChange')}>
      <div style={{ maxWidth: '300px' }}>
        <RatingFilter filterId="rating" />
      </div>
    </FilterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Star rating filter.',
      },
    },
  },
};

// =============================================================================
// All Filters Combined
// =============================================================================

export const AllFilters: StoryObj = {
  render: () => {
    const allFilters = [
      selectFilterDef,
      multiSelectFilterDef,
      textFilterDef,
      checkboxFilterDef,
      toggleFilterDef,
      numberFilterDef,
      numberRangeFilterDef,
      ratingFilterDef,
    ];

    return (
      <FilterProvider filters={allFilters} onChange={action('onChange')}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            maxWidth: '700px',
          }}
        >
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Select</h4>
            <SelectFilter filterId="status" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Multi-Select</h4>
            <MultiSelectFilter filterId="categories" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Text</h4>
            <TextFilter filterId="search" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Checkbox</h4>
            <CheckboxFilter filterId="featured" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Toggle</h4>
            <ToggleFilter filterId="inStock" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Number</h4>
            <NumberFilter filterId="quantity" />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Number Range</h4>
            <NumberRangeFilter filterId="priceRange" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Rating</h4>
            <RatingFilter filterId="rating" />
          </div>
        </div>
      </FilterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All filter field types displayed together.',
      },
    },
  },
};
