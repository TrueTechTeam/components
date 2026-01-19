import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Menu, MenuList, MenuItem, MenuDivider, MenuGroup } from './';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Menu> = {
  title: 'Overlays/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    onOpenChange: { table: { disable: true } },
    onSelectionChange: { table: { disable: true } },
    isOpen: { table: { disable: true } },
    trigger: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Menu component provides an interactive list of options with keyboard navigation and selection support.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

const DefaultComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close' : 'Open'} Menu
          </Button>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <MenuList>
          <MenuItem itemKey="new">New File</MenuItem>
          <MenuItem itemKey="open">Open...</MenuItem>
          <MenuItem itemKey="save">Save</MenuItem>
          <MenuItem itemKey="save-as">Save As...</MenuItem>
          <MenuDivider />
          <MenuItem itemKey="exit">Exit</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

const WithIconsComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <MenuList>
          <MenuItem itemKey="edit" startIcon="edit">
            Edit
          </MenuItem>
          <MenuItem itemKey="copy" startIcon="copy">
            Copy
          </MenuItem>
          <MenuItem itemKey="delete" startIcon="delete">
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export const WithIcons: Story = {
  render: () => <WithIconsComponent />,
};

const WithShortcutsComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>File</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <MenuList>
          <MenuItem itemKey="new" shortcut="⌘N">
            New
          </MenuItem>
          <MenuItem itemKey="open" shortcut="⌘O">
            Open
          </MenuItem>
          <MenuItem itemKey="save" shortcut="⌘S">
            Save
          </MenuItem>
          <MenuDivider />
          <MenuItem itemKey="print" shortcut="⌘P">
            Print
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export const WithShortcuts: Story = {
  render: () => <WithShortcutsComponent />,
};

const SingleSelectionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['medium']);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>Text Size</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <MenuList>
          <MenuItem itemKey="small">Small</MenuItem>
          <MenuItem itemKey="medium">Medium</MenuItem>
          <MenuItem itemKey="large">Large</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export const SingleSelection: Story = {
  render: () => <SingleSelectionComponent />,
};

const MultiSelectionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['bold']);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>Format</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectionMode="multi"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <MenuList>
          <MenuItem itemKey="bold">Bold</MenuItem>
          <MenuItem itemKey="italic">Italic</MenuItem>
          <MenuItem itemKey="underline">Underline</MenuItem>
          <MenuItem itemKey="strikethrough">Strikethrough</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export const MultiSelection: Story = {
  render: () => <MultiSelectionComponent />,
};

const WithGroupsComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>Edit</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <MenuList>
          <MenuGroup label="Clipboard">
            <MenuItem itemKey="cut" shortcut="⌘X">
              Cut
            </MenuItem>
            <MenuItem itemKey="copy" shortcut="⌘C">
              Copy
            </MenuItem>
            <MenuItem itemKey="paste" shortcut="⌘V">
              Paste
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup label="Transform">
            <MenuItem itemKey="uppercase">UPPERCASE</MenuItem>
            <MenuItem itemKey="lowercase">lowercase</MenuItem>
            <MenuItem itemKey="titlecase">Title Case</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </div>
  );
};

export const WithGroups: Story = {
  render: () => <WithGroupsComponent />,
};

const DisabledItemsComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <MenuList>
          <MenuItem itemKey="new">New</MenuItem>
          <MenuItem itemKey="open">Open</MenuItem>
          <MenuItem itemKey="save" disabled>
            Save (No changes)
          </MenuItem>
          <MenuItem itemKey="export" disabled>
            Export (Premium only)
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export const DisabledItems: Story = {
  render: () => <DisabledItemsComponent />,
};

const LongListComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Menu
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>Countries</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <MenuList>
          {[
            'Argentina',
            'Australia',
            'Brazil',
            'Canada',
            'China',
            'France',
            'Germany',
            'India',
            'Italy',
            'Japan',
            'Mexico',
            'Russia',
            'South Africa',
            'South Korea',
            'Spain',
            'United Kingdom',
            'United States',
          ].map((country) => (
            <MenuItem key={country} itemKey={country}>
              {country}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export const LongList: Story = {
  render: () => <LongListComponent />,
};
