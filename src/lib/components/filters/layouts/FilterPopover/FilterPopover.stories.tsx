import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { FilterProvider, FilterPopover, FilterSection, FilterField } from '../../index';
import { Button } from '../../../buttons/Button';
import type { FilterDefinition } from '../../types';

const meta: Meta<typeof FilterPopover> = {
  title: 'Filters/Layouts/FilterPopover',
  component: FilterPopover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FilterPopover provides a trigger-based dropdown for filter controls. Shows a badge with active filter count on the trigger button.

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
<td><code>--spacing-xs</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>4px</code></a></td>
<td>Margin for trigger badge</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>8px</code></a></td>
<td>Padding and gap spacing</td>
</tr>
<tr>
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>16px</code></a></td>
<td>Content padding</td>
</tr>
<tr>
<td><code>--theme-border-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#e0e0e0</code></a></td>
<td>Border color for separators</td>
</tr>
<tr>
<td><code>--theme-background-tertiary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#f5f5f5</code></a></td>
<td>Footer background color</td>
</tr>
</tbody>
</table>
        `,
      },
    },
  },
  argTypes: {
    triggerLabel: {
      control: 'text',
      description: 'Trigger button label',
    },
    showTriggerBadge: {
      control: 'boolean',
      description: 'Show active count on trigger',
    },
    position: {
      control: 'select',
      options: [
        'bottom-left',
        'bottom-right',
        'bottom',
        'top-left',
        'top-right',
        'top',
        'left',
        'right',
      ],
      description: 'Popover position',
    },
    width: {
      control: 'number',
      description: 'Popover width in pixels',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum popover height in pixels',
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
      description: 'Show clear button',
    },
    showResetButton: {
      control: 'boolean',
      description: 'Show reset button',
    },
    closeOnApply: {
      control: 'boolean',
      description: 'Close popover on apply',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Close popover when clicking outside',
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
    defaultOpen: { table: { disable: true } },
    isOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    children: { table: { disable: true } },
    trigger: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilterPopover>;

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
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'home', label: 'Home & Garden' },
      { value: 'sports', label: 'Sports' },
    ],
    config: { displayMode: 'checkbox-group' },
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
];

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ padding: '2rem' }}>
        <FilterPopover triggerLabel="Filters">
          <FilterSection title="Quick Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
          </FilterSection>
          <FilterSection title="Categories" collapsible={false}>
            <FilterField filterId="category" />
          </FilterSection>
          <FilterSection title="Availability" collapsible={false}>
            <FilterField filterId="inStock" />
            <FilterField filterId="onSale" />
          </FilterSection>
        </FilterPopover>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Default filter popover with trigger button.',
      },
    },
  },
};

export const WithActiveFilters: Story = {
  render: () => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active', category: ['electronics'] }}
      onChange={action('onChange')}
    >
      <div style={{ padding: '2rem' }}>
        <FilterPopover
          triggerLabel="Filters"
          showTriggerBadge
          showActiveFilters
          activeFiltersPosition="top"
        >
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterPopover>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter popover showing active filters with badge count.',
      },
    },
  },
};

export const CustomTrigger: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ padding: '2rem' }}>
        <FilterPopover
          trigger={
            <Button variant="primary" size="md">
              Advanced Filters
            </Button>
          }
        >
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterPopover>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter popover with a custom trigger button.',
      },
    },
  },
};

export const DifferentPositions: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '2rem', padding: '6rem 2rem', justifyContent: 'center' }}>
        <FilterPopover triggerLabel="Bottom Start" position="bottom-left">
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="status" />
          </FilterSection>
        </FilterPopover>
        <FilterPopover triggerLabel="Bottom" position="bottom">
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="status" />
          </FilterSection>
        </FilterPopover>
        <FilterPopover triggerLabel="Bottom End" position="bottom-right">
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="status" />
          </FilterSection>
        </FilterPopover>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter popover with different positions.',
      },
    },
  },
};

export const CustomWidth: Story = {
  render: () => (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
        <FilterPopover triggerLabel="Narrow (240px)" width={240}>
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="status" />
            <FilterField filterId="inStock" />
          </FilterSection>
        </FilterPopover>
        <FilterPopover triggerLabel="Wide (400px)" width={400}>
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterPopover>
      </div>
    </FilterProvider>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Filter popovers with different widths.',
      },
    },
  },
};

const ControlledPopover = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FilterProvider filters={sampleFilters} onChange={action('onChange')}>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
            Toggle Popover (External)
          </Button>
        </div>
        <FilterPopover triggerLabel="Filters" isOpen={isOpen} onOpenChange={setIsOpen}>
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
          </FilterSection>
        </FilterPopover>
      </div>
    </FilterProvider>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPopover />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Controlled filter popover with external state management.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    triggerLabel: 'Filters',
    showTriggerBadge: true,
    position: 'bottom-left',
    width: 320,
    showApplyButton: true,
    showClearButton: true,
    closeOnApply: true,
  },
  render: (args) => (
    <FilterProvider
      filters={sampleFilters}
      defaultValues={{ status: 'active' }}
      onChange={action('onChange')}
    >
      <div style={{ padding: '2rem' }}>
        <FilterPopover {...args}>
          <FilterSection title="Filters" collapsible={false}>
            <FilterField filterId="search" />
            <FilterField filterId="status" />
            <FilterField filterId="category" />
          </FilterSection>
        </FilterPopover>
      </div>
    </FilterProvider>
  ),
};
