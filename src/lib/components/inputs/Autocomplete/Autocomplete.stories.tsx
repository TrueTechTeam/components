import type { Meta, StoryObj } from '@storybook/react';
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

export const Default: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Country"
        placeholder="Search countries..."
        options={countries}
      />
    </div>
  ),
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

export const WithValue: Story = {
  render: () => <WithValueComponent />,
};

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
};

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
};

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
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Search"
        placeholder="Search..."
        options={countries}
        startIcon="search"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
      <Autocomplete
        label="Country"
        placeholder="Cannot edit..."
        options={countries}
        disabled
      />
    </div>
  ),
};

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
};

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
};

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
};

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
};
