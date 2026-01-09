import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Forms/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    defaultValue: '(555) 123-4567',
  },
};

export const DifferentCountries: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneInput label="United States" defaultCountry="US" />
      <PhoneInput label="United Kingdom" defaultCountry="GB" />
      <PhoneInput label="Germany" defaultCountry="DE" />
      <PhoneInput label="Japan" defaultCountry="JP" />
      <PhoneInput label="Australia" defaultCountry="AU" />
    </div>
  ),
};

export const WithoutAutoFormat: Story = {
  args: {
    label: 'Phone Number (No Formatting)',
    defaultCountry: 'US',
    autoFormat: false,
  },
};

export const WithoutCountrySearch: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    showCountrySearch: false,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    helperText: 'Enter your phone number including area code',
  },
};

export const WithError: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    error: true,
    errorMessage: 'Invalid phone number format',
  },
};

export const Required: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    defaultValue: '(555) 123-4567',
    disabled: true,
  },
};

export const HorizontalLabel: Story = {
  args: {
    label: 'Phone',
    labelPlacement: 'left',
    defaultCountry: 'US',
  },
};

export const Playground: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    helperText: 'Enter your contact phone number',
    required: true,
    autoFormat: true,
    showCountrySearch: true,
  },
};
