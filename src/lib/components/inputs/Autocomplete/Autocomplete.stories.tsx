import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { Autocomplete, type AutocompleteOption } from './Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  title: 'Inputs/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Autocomplete provides a filterable input with dropdown suggestions. Supports async loading, custom filtering, and multi-select.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'],
      description: 'Input variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    label: {
      control: 'text',
      description: 'Input label',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder',
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multi'],
      description: 'Selection mode',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    highlightMatch: {
      control: 'boolean',
      description: 'Highlight matching text',
    },
    noOptionsMessage: {
      control: 'text',
      description: 'No options message',
    },
    debounceDelay: {
      control: 'number',
      description: 'Debounce delay for async loading (ms)',
    },
    // Disable complex props
    options: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onInputChange: { table: { disable: true } },
    onLoadOptions: { table: { disable: true } },
    filterFunction: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    startIcon: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const countries: AutocompleteOption[] = [
  { key: 'us', label: 'United States' },
  { key: 'uk', label: 'United Kingdom' },
  { key: 'ca', label: 'Canada' },
  { key: 'au', label: 'Australia' },
  { key: 'de', label: 'Germany' },
  { key: 'fr', label: 'France' },
  { key: 'jp', label: 'Japan' },
  { key: 'cn', label: 'China' },
  { key: 'in', label: 'India' },
  { key: 'br', label: 'Brazil' },
];

/**
 * Default autocomplete with basic configuration
 */
export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Search countries...',
    options: countries,
    onChange: action('onChange'),
    onInputChange: action('onInputChange'),
  },
};

/**
 * Interactive playground for testing all props
 */
export const Playground: Story = {
  args: {
    label: 'Country',
    placeholder: 'Search countries...',
    options: countries,
    variant: 'primary',
    size: 'md',
    onChange: action('onChange'),
    onInputChange: action('onInputChange'),
  },
};

const WithValueComponent = () => {
  const [value, setValue] = useState('us');

  return (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Country"
        placeholder="Search countries..."
        options={countries}
        value={value}
        onChange={(newValue) => setValue(newValue as string)}
      />
      <p style={{ marginTop: '16px' }}>Selected: {value}</p>
    </div>
  );
};

/**
 * Controlled component with value state
 */
export const WithValue: Story = {
  render: () => <WithValueComponent />,
  parameters: { controls: { disable: true } },
};

/**
 * Highlighting matching text in options
 */
export const HighlightMatch: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Search with highlighting"
        placeholder="Type to search..."
        options={countries}
        highlightMatch
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Custom filter function (starts with)
 */
export const CustomFilter: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Starts with filter"
        placeholder="Type country name..."
        options={countries}
        filterFunction={(option, input) =>
          option.label.toLowerCase().startsWith(input.toLowerCase())
        }
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Async loading with debounce
 */
export const AsyncLoading: Story = {
  render: () => {
    const loadOptions = async (inputValue: string): Promise<AutocompleteOption[]> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return countries.filter((country) =>
        country.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    return (
      <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
        <Autocomplete
          label="Async search"
          placeholder="Type to load options..."
          options={[]}
          onLoadOptions={loadOptions}
          debounceDelay={500}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Autocomplete with start icon
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete label="Search" placeholder="Search..." options={countries} startIcon="search" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete label="Country" placeholder="Cannot edit..." options={countries} disabled />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Error state with helper text
 */
export const WithError: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Country"
        placeholder="Search countries..."
        options={countries}
        error
        helperText="Please select a country"
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Empty options list
 */
export const NoOptions: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Empty list"
        placeholder="No options available..."
        options={[]}
        noOptionsMessage="No results found"
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Options with disabled items
 */
export const DisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled = countries.map((country) => ({
      ...country,
      disabled: country.key === 'uk' || country.key === 'fr',
    }));

    return (
      <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
        <Autocomplete
          label="Country"
          placeholder="Some options are disabled..."
          options={optionsWithDisabled}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Performance test with large dataset
 */
export const LargeDataset: Story = {
  render: () => {
    const largeDataset: AutocompleteOption[] = Array.from({ length: 100 }, (_, i) => ({
      key: `item-${i}`,
      label: `Item ${i + 1}`,
    }));

    return (
      <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
        <Autocomplete
          label="Large dataset (100 items)"
          placeholder="Search..."
          options={largeDataset}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};
