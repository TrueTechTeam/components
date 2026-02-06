import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dropdown, type DropdownItem } from './Dropdown';
import { MenuList, MenuItem, MenuDivider } from '../Menu';

const meta: Meta<typeof Dropdown> = {
  title: 'Overlays/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Button variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    showChevron: {
      control: 'boolean',
      description: 'Show chevron icon',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    // Disable complex props
    children: { table: { disable: true } },
    trigger: { table: { disable: true } },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    items: { table: { disable: true } },
    icon: { table: { disable: true } },
    label: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    onSelectionChange: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Dropdown combines a Menu with a Button trigger for easy selection from a list of options. Use the items prop for simple lists or children for custom menu structures.

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
<td><code>--transition-normal</code></td>
<td><a href="?path=/story/theme-css-variables--transitions"><code>var(--transition-normal)</code></a></td>
<td>Chevron rotation transition</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

/**
 * Default dropdown with basic items
 */
export const Default: Story = {
  render: () => {
    const items: DropdownItem[] = [
      { itemKey: 'option-1', label: 'Option 1', onClick: action('option-1-clicked') },
      { itemKey: 'option-2', label: 'Option 2', onClick: action('option-2-clicked') },
      { itemKey: 'option-3', label: 'Option 3', onClick: action('option-3-clicked') },
    ];

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Dropdown label="Select Option" items={items} onOpenChange={action('openChange')} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * All button variants
 */
export const Variants: Story = {
  render: () => {
    const items: DropdownItem[] = [
      { itemKey: '1', label: 'Item 1' },
      { itemKey: '2', label: 'Item 2' },
    ];

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <Dropdown label="Primary" variant="primary" items={items} />
        <Dropdown label="Secondary" variant="secondary" items={items} />
        <Dropdown label="Outline" variant="outline" items={items} />
        <Dropdown label="Ghost" variant="ghost" items={items} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * All button sizes
 */
export const Sizes: Story = {
  render: () => {
    const items: DropdownItem[] = [
      { itemKey: '1', label: 'Item 1' },
      { itemKey: '2', label: 'Item 2' },
    ];

    return (
      <div
        style={{
          padding: '100px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          alignItems: 'flex-start',
        }}
      >
        <Dropdown label="Small" size="sm" items={items} />
        <Dropdown label="Medium" size="md" items={items} />
        <Dropdown label="Large" size="lg" items={items} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Dropdown with icons on button and menu items
 */
export const WithIcon: Story = {
  render: () => {
    const items: DropdownItem[] = [
      { itemKey: 'profile', label: 'Profile', icon: 'profile' },
      { itemKey: 'preferences', label: 'Preferences', icon: 'preferences' },
      { itemKey: 'account', label: 'Account', icon: 'account' },
      { itemKey: 'divider-1', label: '', divider: true },
      { itemKey: 'logout', label: 'Logout', icon: 'logout' },
    ];

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Dropdown label="Settings" icon="settings" items={items} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Dropdown without chevron icon
 */
export const NoChevron: Story = {
  render: () => {
    const items: DropdownItem[] = [
      { itemKey: 'action-1', label: 'Action 1' },
      { itemKey: 'action-2', label: 'Action 2' },
      { itemKey: 'action-3', label: 'Action 3' },
    ];

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Dropdown label="Actions" showChevron={false} items={items} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Full width dropdown
 */
export const FullWidth: Story = {
  render: () => {
    const items: DropdownItem[] = [
      { itemKey: '1', label: 'Option 1' },
      { itemKey: '2', label: 'Option 2' },
      { itemKey: '3', label: 'Option 3' },
    ];

    return (
      <div style={{ padding: '100px', maxWidth: '400px', margin: '0 auto' }}>
        <Dropdown label="Full Width Dropdown" fullWidth items={items} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Dropdown with selection state
 */
export const WithSelection: Story = {
  render: () => {
    const items: DropdownItem[] = [
      { itemKey: 'sm', label: 'Small' },
      { itemKey: 'md', label: 'Medium' },
      { itemKey: 'lg', label: 'Large' },
    ];

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Dropdown
          label="Choose Size"
          selectionMode="single"
          defaultSelectedKeys={['md']}
          items={items}
          onSelectionChange={action('selectionChange')}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Dropdown with custom children instead of items prop
 */
export const CustomChildren: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Dropdown label="Custom Menu" onOpenChange={action('openChange')}>
        <MenuList>
          <MenuItem itemKey="new" startIcon="edit">
            New File
          </MenuItem>
          <MenuItem itemKey="open" startIcon="copy">
            Open...
          </MenuItem>
          <MenuDivider />
          <MenuItem itemKey="save">Save</MenuItem>
          <MenuItem itemKey="save-as">Save As...</MenuItem>
          <MenuDivider />
          <MenuItem itemKey="exit" startIcon="logout">
            Exit
          </MenuItem>
        </MenuList>
      </Dropdown>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Interactive playground for testing all dropdown props
 */
export const Playground: Story = {
  args: {
    label: 'Playground Dropdown',
    variant: 'outline',
    size: 'md',
    showChevron: true,
    fullWidth: false,
    items: [
      { itemKey: '1', label: 'Option 1' },
      { itemKey: '2', label: 'Option 2' },
      { itemKey: '3', label: 'Option 3' },
    ],
    onOpenChange: action('openChange'),
  },
};
