import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Select } from './Select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Label text to display above select',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below select',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when in error state',
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for search input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the select is read-only',
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the select is in an error state',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality for filtering options',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button to reset selection',
    },
    scrollToSelected: {
      control: 'boolean',
      description: 'Whether to scroll to the selected item when menu opens',
    },
    enableTypeAhead: {
      control: 'boolean',
      description: 'Enable keyboard type-ahead navigation',
    },
    // Disable complex props
    options: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    ref: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    startIcon: { table: { disable: true } },
    endIcon: { table: { disable: true } },
    typeAheadDelay: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

export const Default: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};

const ControlledComponent = () => {
  const [value, setValue] = useState('ca');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        label="Country"
        options={countryOptions}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          action('onChange')(newValue);
        }}
      />
      <p>Selected: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const WithGroups: Story = {
  render: () => (
    <Select
      label="Favorite food"
      options={[
        { value: 'pizza', label: 'Pizza', group: 'Italian' },
        { value: 'pasta', label: 'Pasta', group: 'Italian' },
        { value: 'sushi', label: 'Sushi', group: 'Japanese' },
        { value: 'ramen', label: 'Ramen', group: 'Japanese' },
        { value: 'tacos', label: 'Tacos', group: 'Mexican' },
        { value: 'burrito', label: 'Burrito', group: 'Mexican' },
      ]}
      placeholder="Select your favorite"
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithClearButton: Story = {
  render: () => (
    <Select
      label="Size"
      options={[
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ]}
      defaultValue="md"
      showClearButton
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        label="With start icon"
        options={countryOptions}
        startIcon="check"
        placeholder="Select option"
        onChange={action('onChange')}
      />
      <Select
        label="With custom end icon"
        options={countryOptions}
        endIcon="check"
        placeholder="Select option"
        onChange={action('onChange')}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ErrorState: Story = {
  render: () => (
    <Select
      label="Country"
      options={countryOptions}
      error
      errorMessage="Please select a country"
      placeholder="Select a country"
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const DisabledOptions: Story = {
  render: () => (
    <Select
      label="Options"
      options={[
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2 (disabled)', disabled: true },
        { value: '3', label: 'Option 3' },
        { value: '4', label: 'Option 4 (disabled)', disabled: true },
      ]}
      placeholder="Select option"
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const DisabledSelect: Story = {
  render: () => (
    <Select
      label="Country"
      options={countryOptions}
      defaultValue="us"
      disabled
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Searchable: Story = {
  render: () => (
    <Select
      label="Country"
      options={countryOptions}
      placeholder="Select a country"
      searchable
      searchPlaceholder="Search countries..."
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

const SearchableWithManyOptionsComponent = () => {
  const [value, setValue] = useState('');

  const manyOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'it', label: 'Italy' },
    { value: 'es', label: 'Spain' },
    { value: 'pt', label: 'Portugal' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'be', label: 'Belgium' },
    { value: 'ch', label: 'Switzerland' },
    { value: 'at', label: 'Austria' },
    { value: 'se', label: 'Sweden' },
    { value: 'no', label: 'Norway' },
    { value: 'dk', label: 'Denmark' },
    { value: 'fi', label: 'Finland' },
    { value: 'ie', label: 'Ireland' },
    { value: 'pl', label: 'Poland' },
    { value: 'cz', label: 'Czech Republic' },
    { value: 'hu', label: 'Hungary' },
    { value: 'ro', label: 'Romania' },
    { value: 'gr', label: 'Greece' },
    { value: 'jp', label: 'Japan' },
    { value: 'kr', label: 'South Korea' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'au', label: 'Australia' },
    { value: 'nz', label: 'New Zealand' },
    { value: 'br', label: 'Brazil' },
    { value: 'ar', label: 'Argentina' },
    { value: 'cl', label: 'Chile' },
    { value: 'za', label: 'South Africa' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        label="Select a country"
        options={manyOptions}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          action('onChange')(newValue);
        }}
        placeholder="Choose a country"
        searchable
        searchPlaceholder="Type to search..."
        helperText="Try searching for a country name"
      />
      <p>Selected: {value || 'None'}</p>
    </div>
  );
};

export const SearchableWithManyOptions: Story = {
  render: () => <SearchableWithManyOptionsComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const SearchableWithGroupsComponent = () => {
  const [value, setValue] = useState('');

  const groupedOptions = [
    { value: 'pizza', label: 'Pizza', group: 'Italian' },
    { value: 'pasta', label: 'Pasta', group: 'Italian' },
    { value: 'risotto', label: 'Risotto', group: 'Italian' },
    { value: 'lasagna', label: 'Lasagna', group: 'Italian' },
    { value: 'sushi', label: 'Sushi', group: 'Japanese' },
    { value: 'ramen', label: 'Ramen', group: 'Japanese' },
    { value: 'tempura', label: 'Tempura', group: 'Japanese' },
    { value: 'udon', label: 'Udon', group: 'Japanese' },
    { value: 'tacos', label: 'Tacos', group: 'Mexican' },
    { value: 'burrito', label: 'Burrito', group: 'Mexican' },
    { value: 'quesadilla', label: 'Quesadilla', group: 'Mexican' },
    { value: 'enchiladas', label: 'Enchiladas', group: 'Mexican' },
    { value: 'burger', label: 'Burger', group: 'American' },
    { value: 'hotdog', label: 'Hot Dog', group: 'American' },
    { value: 'bbq', label: 'BBQ Ribs', group: 'American' },
    { value: 'steak', label: 'Steak', group: 'American' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        label="Favorite food"
        options={groupedOptions}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          action('onChange')(newValue);
        }}
        placeholder="Select your favorite"
        searchable
        searchPlaceholder="Search for food..."
        helperText="Options are grouped by cuisine type"
      />
      <p>Selected: {value || 'None'}</p>
    </div>
  );
};

export const SearchableWithGroups: Story = {
  render: () => <SearchableWithGroupsComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const SearchableWithClearButtonComponent = () => {
  const [value, setValue] = useState('ca');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        label="Country"
        options={countryOptions}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          action('onChange')(newValue);
        }}
        placeholder="Select a country"
        searchable
        showClearButton
        helperText="Searchable select with clear button"
      />
      <p>Selected: {value || 'None'}</p>
    </div>
  );
};

export const SearchableWithClearButton: Story = {
  render: () => <SearchableWithClearButtonComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    label: 'Select',
    options: countryOptions,
    placeholder: 'Choose an option',
    searchable: false,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};
