import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
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
        onChange={setValue}
      />
      <p>Selected: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
};

export const WithGroups: Story = {
  args: {
    label: 'Favorite food',
    options: [
      { value: 'pizza', label: 'Pizza', group: 'Italian' },
      { value: 'pasta', label: 'Pasta', group: 'Italian' },
      { value: 'sushi', label: 'Sushi', group: 'Japanese' },
      { value: 'ramen', label: 'Ramen', group: 'Japanese' },
      { value: 'tacos', label: 'Tacos', group: 'Mexican' },
      { value: 'burrito', label: 'Burrito', group: 'Mexican' },
    ],
    placeholder: 'Select your favorite',
  },
};

export const WithClearButton: Story = {
  args: {
    label: 'Size',
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
    ],
    defaultValue: 'md',
    showClearButton: true,
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
      />
      <Select
        label="With custom end icon"
        options={countryOptions}
        endIcon="check"
        placeholder="Select option"
      />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    error: true,
    errorMessage: 'Please select a country',
    placeholder: 'Select a country',
  },
};

export const DisabledOptions: Story = {
  args: {
    label: 'Options',
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2 (disabled)', disabled: true },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4 (disabled)', disabled: true },
    ],
    placeholder: 'Select option',
  },
};

export const DisabledSelect: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'us',
    disabled: true,
  },
};

export const Searchable: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    searchable: true,
    searchPlaceholder: 'Search countries...',
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
        onChange={(newValue) => setValue(newValue)}
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
        onChange={(newValue) => setValue(newValue)}
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
};

const SearchableWithClearButtonComponent = () => {
  const [value, setValue] = useState('ca');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        label="Country"
        options={countryOptions}
        value={value}
        onChange={(newValue) => setValue(newValue)}
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
};

export const Playground: Story = {
  args: {
    label: 'Select',
    options: countryOptions,
    placeholder: 'Choose an option',
    searchable: false,
  },
};
