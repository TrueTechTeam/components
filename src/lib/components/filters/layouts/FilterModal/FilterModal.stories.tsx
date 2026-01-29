import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { FilterProvider, FilterModal, FilterSection, FilterField, FilterAccordion } from '../../index';
import { Button } from '../../../buttons/Button';
import { Icon } from '../../../display/Icon';
import { Accordion } from '../../../display/Accordion';
import type { FilterDefinition, FilterGroup } from '../../types';

const meta: Meta<typeof FilterModal> = {
  title: 'Filters/Layouts/FilterModal',
  component: FilterModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FilterModal provides a full modal dialog for complex filter interfaces.
Useful for advanced filters with many options.
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Modal title',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Modal size',
    },
    showFooter: {
      control: 'boolean',
      description: 'Show footer with action buttons',
    },
    showApplyButton: {
      control: 'boolean',
      description: 'Show apply button',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button',
    },
    showResetButton: {
      control: 'boolean',
      description: 'Show reset button',
    },
    closeOnApply: {
      control: 'boolean',
      description: 'Close modal on apply',
    },
    children: { table: { disable: true } },
    renderTrigger: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterModal>;

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
    config: { min: 0, max: 1000, displayMode: 'inputs', prefix: '$' },
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
  {
    id: 'dateAdded',
    type: 'date-range',
    label: 'Date Added',
    group: 'availability',
  },
];

const filterGroups: FilterGroup[] = [
  { id: 'product', label: 'Product Filters' },
  { id: 'availability', label: 'Availability' },
];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ padding: '2rem' }}>
        <FilterModal title="Filter Products">
          <FilterSection title="Quick Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
          </FilterSection>
          <FilterSection title="Product">
            <FilterField filterId="category" />
            <FilterField filterId="brand" />
            <FilterField filterId="priceRange" />
          </FilterSection>
          <FilterSection title="Availability">
            <FilterField filterId="inStock" />
            <FilterField filterId="onSale" />
          </FilterSection>
        </FilterModal>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Default filter modal with sections.',
      },
    },
  },
};

export const WithActiveFilters: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ status: 'active', category: ['electronics', 'clothing'] }}
      onChange={action('onChange')}
    >
      <div style={{ padding: '2rem' }}>
        <FilterModal
          title="Advanced Filters"
          showActiveFilters
          activeFiltersPosition="top"
        >
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterModal>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter modal showing active filters with badge count.',
      },
    },
  },
};

export const CustomTrigger: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ padding: '2rem' }}>
        <FilterModal
          title="Filters"
          renderTrigger={({ onClick, activeCount }) => (
            <Button variant="primary" onClick={onClick} startIcon={<Icon name="filter" size="1em" />}>
              Advanced Filters
              {activeCount > 0 && ` (${activeCount})`}
            </Button>
          )}
        >
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterModal>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter modal with a custom trigger button.',
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '1rem', padding: '2rem', flexWrap: 'wrap' }}>
        <FilterModal
          title="Small Modal"
          size="sm"
          renderTrigger={({ onClick }) => (
            <Button variant="outline" onClick={onClick}>Small</Button>
          )}
        >
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="status" />
          </FilterSection>
        </FilterModal>
        <FilterModal
          title="Medium Modal"
          size="md"
          renderTrigger={({ onClick }) => (
            <Button variant="outline" onClick={onClick}>Medium</Button>
          )}
        >
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterModal>
        <FilterModal
          title="Large Modal"
          size="lg"
          renderTrigger={({ onClick }) => (
            <Button variant="outline" onClick={onClick}>Large</Button>
          )}
        >
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterModal>
        <FilterModal
          title="Extra Large Modal"
          size="xl"
          renderTrigger={({ onClick }) => (
            <Button variant="outline" onClick={onClick}>Extra Large</Button>
          )}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <FilterSection title="Quick Filters" collapsible={false}>
              <FilterField filterId="search" />
              <FilterField filterId="status" />
            </FilterSection>
            <FilterSection title="Categories" collapsible={false}>
              <FilterField filterId="category" />
            </FilterSection>
          </div>
        </FilterModal>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter modals in different sizes.',
      },
    },
  },
};

export const WithAccordion: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} groups={filterGroups} onChange={action('onChange')}>
      <div style={{ padding: '2rem' }}>
        <FilterModal title="Advanced Filters" size="md">
          <FilterAccordion
            mode="multiple"
            defaultExpandedGroups={['product']}
            showGroupCounts
          >
            <Accordion id="product" header="Product Filters" defaultOpen>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FilterField filterId="category" />
                <FilterField filterId="brand" />
                <FilterField filterId="priceRange" />
                <FilterField filterId="rating" />
              </div>
            </Accordion>
            <Accordion id="availability" header="Availability">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FilterField filterId="inStock" />
                <FilterField filterId="onSale" />
                <FilterField filterId="dateAdded" />
              </div>
            </Accordion>
          </FilterAccordion>
        </FilterModal>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter modal with accordion layout for grouped filters.',
      },
    },
  },
};

const ControlledModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
            Toggle Modal (External)
          </Button>
        </div>
        <FilterModal
          title="Filters"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
          </FilterSection>
        </FilterModal>
      </div>
    </FilterProvider>
  );
};

export const Controlled: Story = {
  render: () => <ControlledModal />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Controlled filter modal with external state management.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    title: 'Filters',
    size: 'md',
    showFooter: true,
    showApplyButton: true,
    showClearButton: true,
    showResetButton: false,
    closeOnApply: true,
  },
  render: (args) => (
    <FilterProvider
      filters={sampleFilters}
      groups={filterGroups}
      defaultValues={{ status: 'active' }}
      onChange={action('onChange')}
    >
      <div style={{ padding: '2rem' }}>
        <FilterModal {...args}>
          <FilterSection title="Filters">
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterModal>
      </div>
    </FilterProvider>
  ),
};
