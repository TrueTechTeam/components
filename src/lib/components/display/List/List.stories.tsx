import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useCallback } from 'react';
import { List } from './List';
import type { BulkAction, ItemAction } from './types';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { Pill } from '../Pill';
import { Button } from '../../buttons/Button';
import styles from './List.module.scss';

const meta: Meta<typeof List> = {
  title: 'Display/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Versatile list component supporting selection, grouping, search, bulk actions, expandable items, and infinite scroll. Fully accessible with keyboard navigation.

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
<td><code>--list-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-border-primary)</code></a>, #e0e0e0</td>
<td>Color of list borders</td>
</tr>
<tr>
<td><code>--list-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-surface-primary)</code></a>, #ffffff</td>
<td>Background color of the list</td>
</tr>
<tr>
<td><code>--list-item-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-surface-primary)</code></a>, #ffffff</td>
<td>Background color of list items</td>
</tr>
<tr>
<td><code>--list-item-hover-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-interactive-hover)</code></a>, rgba(0, 0, 0, 0.04)</td>
<td>Background color on item hover</td>
</tr>
<tr>
<td><code>--list-item-selected-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary-subtle)</code></a>, rgba(37, 99, 235, 0.08)</td>
<td>Background color of selected items</td>
</tr>
<tr>
<td><code>--list-item-focus-ring</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a>, #3b82f6</td>
<td>Color of focus ring for keyboard navigation</td>
</tr>
<tr>
<td><code>--list-text-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-primary)</code></a>, #1a1a1a</td>
<td>Primary text color in list items</td>
</tr>
<tr>
<td><code>--list-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a>, #666666</td>
<td>Secondary text color in list items</td>
</tr>
<tr>
<td><code>--list-group-header-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-surface-secondary)</code></a>, #f5f5f5</td>
<td>Background color of group headers</td>
</tr>
<tr>
<td><code>--list-max-height</code></td>
<td>none</td>
<td>Maximum height of the list container</td>
</tr>
<tr>
<td><code>--list-item-padding-x</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a>, 16px</td>
<td>Horizontal padding of list items</td>
</tr>
<tr>
<td><code>--list-item-padding-y</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a>, 8px</td>
<td>Vertical padding of list items</td>
</tr>
<tr>
<td><code>--list-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a>, 0.875rem</td>
<td>Font size of list item text</td>
</tr>
<tr>
<td><code>--list-avatar-size</code></td>
<td>32px</td>
<td>Size of avatar in list items</td>
</tr>
<tr>
<td><code>--list-spacing</code></td>
<td>0</td>
<td>Gap between list items (varies by spacing prop)</td>
</tr>
<tr>
<td><code>--list-columns</code></td>
<td>1</td>
<td>Number of columns for grid layout</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    data: {
      table: { disable: true },
    },
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Selection mode for items',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'card', 'flush'],
      description: 'Visual variant of the list',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of list items',
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Spacing between items (for card variant)',
    },
    primaryTextField: {
      control: 'text',
      description: 'Key for primary text in items',
    },
    secondaryTextField: {
      control: 'text',
      description: 'Key for secondary text in items',
    },
    avatarField: {
      control: 'text',
      description: 'Key for avatar content in items',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    maxHeight: { table: { disable: true } },
    columns: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    renderExpandedContent: { table: { disable: true } },
    renderGroupHeader: { table: { disable: true } },
    renderEmpty: { table: { disable: true } },
    bulkActions: { table: { disable: true } },
    itemActions: { table: { disable: true } },
    selectedKeys: { table: { disable: true } },
    onSelectionChange: { table: { disable: true } },
    expandedKeys: { table: { disable: true } },
    onExpandChange: { table: { disable: true } },
    collapsedGroups: { table: { disable: true } },
    onCollapsedGroupsChange: { table: { disable: true } },
    onItemClick: { table: { disable: true } },
    onItemAction: { table: { disable: true } },
    onSearchChange: { table: { disable: true } },
    infiniteScroll: { table: { disable: true } },
    itemKey: { table: { disable: true } },
    isItemDisabled: { table: { disable: true } },
    defaultSelectedKeys: { table: { disable: true } },
    defaultExpandedKeys: { table: { disable: true } },
    defaultCollapsedGroups: { table: { disable: true } },
    searchQuery: { table: { disable: true } },
    searchFn: { table: { disable: true } },
    searchFields: { table: { disable: true } },
    searchPlaceholder: { table: { disable: true } },
    searchDebounce: { table: { disable: true } },
    groupBy: { table: { disable: true } },
    collapsibleGroups: { table: { disable: true } },
    expandTrigger: { table: { disable: true } },
    keyboardNavigation: { table: { disable: true } },
    skeleton: { table: { disable: true } },
    loadingContent: { table: { disable: true } },
    emptyContent: { table: { disable: true } },
    bulkActionsPosition: { table: { disable: true } },
    renderBulkActions: { table: { disable: true } },
    itemActionsPosition: { table: { disable: true } },
    itemActionsTrigger: { table: { disable: true } },
    showSelectionControls: { table: { disable: true } },
    selectionControlPosition: { table: { disable: true } },
    role: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    'aria-labelledby': { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof List>;

// ============================================================
// Sample Data
// ============================================================

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
}

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: 'JD',
    status: 'active',
    department: 'Engineering',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    avatar: 'JS',
    status: 'active',
    department: 'Marketing',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Viewer',
    avatar: 'BW',
    status: 'pending',
    department: 'Engineering',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Editor',
    avatar: 'AB',
    status: 'inactive',
    department: 'Design',
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'Admin',
    avatar: 'CD',
    status: 'active',
    department: 'Engineering',
  },
  {
    id: '6',
    name: 'Diana Evans',
    email: 'diana@example.com',
    role: 'Viewer',
    avatar: 'DE',
    status: 'active',
    department: 'Marketing',
  },
  {
    id: '7',
    name: 'Edward Foster',
    email: 'edward@example.com',
    role: 'Editor',
    avatar: 'EF',
    status: 'pending',
    department: 'Design',
  },
  {
    id: '8',
    name: 'Fiona Garcia',
    email: 'fiona@example.com',
    role: 'Admin',
    avatar: 'FG',
    status: 'active',
    department: 'Engineering',
  },
];

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  assignee: string;
}

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    priority: 'high',
    status: 'in_progress',
    assignee: 'John',
  },
  {
    id: '2',
    title: 'Design landing page',
    description: 'Create wireframes and mockups',
    priority: 'medium',
    status: 'todo',
    assignee: 'Alice',
  },
  {
    id: '3',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for deployment',
    priority: 'high',
    status: 'done',
    assignee: 'Bob',
  },
  {
    id: '4',
    title: 'Write unit tests',
    description: 'Increase test coverage to 80%',
    priority: 'medium',
    status: 'in_progress',
    assignee: 'Jane',
  },
  {
    id: '5',
    title: 'Update documentation',
    description: 'Add API reference and examples',
    priority: 'low',
    status: 'todo',
    assignee: 'Charlie',
  },
];

// ============================================================
// Story Wrapper Components (to avoid hooks-in-render-function ESLint errors)
// ============================================================

const SingleSelectionDemo = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
      </p>
      <List
        data={sampleUsers.slice(0, 5)}
        primaryTextField="name"
        secondaryTextField="email"
        avatarField="avatar"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        variant="bordered"
      />
    </div>
  );
};

const MultipleSelectionDemo = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1', '3']);

  return (
    <div>
      <p style={{ marginBottom: 16 }}>Selected: {selectedKeys.length} item(s)</p>
      <List
        data={sampleUsers.slice(0, 5)}
        primaryTextField="name"
        secondaryTextField="email"
        avatarField="avatar"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        variant="bordered"
      />
    </div>
  );
};

const WithBulkActionsDemo = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [users, setUsers] = useState(sampleUsers);

  const bulkActions: Array<BulkAction<User>> = [
    {
      id: 'activate',
      label: 'Activate',
      icon: <Icon name="check" size="sm" />,
      variant: 'primary',
      onAction: (items) => {
        alert(`Activating ${items.length} user(s)`);
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: <Icon name="close" size="sm" />,
      onAction: (items) => {
        alert(`Deactivating ${items.length} user(s)`);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Icon name="trash" size="sm" />,
      variant: 'danger',
      onAction: (_items, keys) => {
        setUsers((prev) => prev.filter((u) => !keys.includes(u.id)));
        setSelectedKeys([]);
      },
    },
  ];

  return (
    <List
      data={users}
      primaryTextField="name"
      secondaryTextField="email"
      avatarField="avatar"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      bulkActions={bulkActions}
      variant="bordered"
    />
  );
};

const ExpandableItemsDemo = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1']);

  return (
    <List
      data={sampleUsers.slice(0, 5)}
      primaryTextField="name"
      secondaryTextField="email"
      avatarField="avatar"
      expandedKeys={expandedKeys}
      onExpandChange={setExpandedKeys}
      expandTrigger="icon"
      variant="bordered"
      renderExpandedContent={(user) => (
        <div style={{ padding: '8px 0' }}>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Department:</strong> {user.department}
          </p>
          <p>
            <strong>Status:</strong> {user.status}
          </p>
        </div>
      )}
    />
  );
};

const SearchableWithActionsDemo = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const bulkActions: Array<BulkAction<User>> = [
    {
      id: 'export',
      label: 'Export',
      icon: <Icon name="download" size="sm" />,
      onAction: (items) => alert(`Exporting ${items.length} user(s)`),
    },
    {
      id: 'delete',
      label: 'Delete',
      variant: 'danger',
      onAction: () => alert('Delete action'),
    },
  ];

  return (
    <List
      data={sampleUsers}
      primaryTextField="name"
      secondaryTextField="email"
      avatarField="avatar"
      searchable
      searchPlaceholder="Search users..."
      searchFields={['name', 'email']}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      bulkActions={bulkActions}
      variant="bordered"
    />
  );
};

const InfiniteScrollDemo = () => {
  const [items, setItems] = useState(sampleUsers.slice(0, 3));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newItems = sampleUsers.slice(items.length, items.length + 2);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
      }
      setLoading(false);
    }, 1000);
  }, [items.length, loading]);

  return (
    <List
      data={items}
      primaryTextField="name"
      secondaryTextField="email"
      avatarField="avatar"
      variant="bordered"
      maxHeight={350}
      infiniteScroll={{
        onLoadMore: loadMore,
        hasMore,
        loading,
      }}
    />
  );
};

const FullFeaturedDemo = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const bulkActions: Array<BulkAction<User>> = [
    {
      id: 'export',
      label: 'Export',
      icon: <Icon name="download" size="sm" />,
      onAction: (items) => alert(`Exporting ${items.length} user(s)`),
    },
    {
      id: 'delete',
      label: 'Delete',
      variant: 'danger',
      icon: <Icon name="trash" size="sm" />,
      onAction: () => alert('Delete action'),
    },
  ];

  const itemActions: Array<ItemAction<User>> = [
    {
      id: 'view',
      label: 'View Profile',
      icon: <Icon name="eye" size="sm" />,
      onAction: (item) => alert(`Viewing ${item.name}`),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Icon name="edit" size="sm" />,
      onAction: (item) => alert(`Editing ${item.name}`),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Icon name="trash" size="sm" />,
      variant: 'danger',
      divider: true,
      onAction: (item) => alert(`Deleting ${item.name}`),
    },
  ];

  return (
    <List
      data={sampleUsers}
      primaryTextField="name"
      secondaryTextField="email"
      avatarField="avatar"
      variant="bordered"
      // Selection
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      // Bulk actions
      bulkActions={bulkActions}
      // Item actions
      itemActions={itemActions}
      // Grouping
      groupBy="department"
      collapsibleGroups
      // Search
      searchable
      searchPlaceholder="Search users..."
      searchFields={['name', 'email', 'role']}
      // Expandable
      expandedKeys={expandedKeys}
      onExpandChange={setExpandedKeys}
      expandTrigger="icon"
      renderExpandedContent={(user) => (
        <div>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.status}
          </p>
        </div>
      )}
    />
  );
};

// ============================================================
// Basic Stories
// ============================================================

/**
 * Basic list with primary and secondary text fields
 */
export const Default: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
  },
};

/**
 * List with avatar field displayed
 */
export const WithAvatar: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
  },
};

// ============================================================
// Variants
// ============================================================

/**
 * Default variant - minimal styling
 */
export const VariantDefault: Story = {
  args: {
    data: sampleUsers.slice(0, 4),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    variant: 'default',
  },
};

/**
 * Bordered variant - items separated by borders
 */
export const VariantBordered: Story = {
  args: {
    data: sampleUsers.slice(0, 4),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    variant: 'bordered',
  },
};

/**
 * Card variant - each item is a card with border
 */
export const VariantCard: Story = {
  args: {
    data: sampleUsers.slice(0, 4),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    variant: 'card',
    spacing: 'md',
  },
};

/**
 * Flush variant - minimal padding
 */
export const VariantFlush: Story = {
  args: {
    data: sampleUsers.slice(0, 4),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    variant: 'flush',
  },
};

// ============================================================
// Sizes
// ============================================================

/**
 * Small size
 */
export const SizeSmall: Story = {
  args: {
    data: sampleUsers.slice(0, 4),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    size: 'sm',
    variant: 'bordered',
  },
};

/**
 * Medium size (default)
 */
export const SizeMedium: Story = {
  args: {
    data: sampleUsers.slice(0, 4),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    size: 'md',
    variant: 'bordered',
  },
};

/**
 * Large size
 */
export const SizeLarge: Story = {
  args: {
    data: sampleUsers.slice(0, 4),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    size: 'lg',
    variant: 'bordered',
  },
};

// ============================================================
// Selection
// ============================================================

/**
 * Single selection mode with radio buttons
 */
export const SingleSelection: Story = {
  render: () => <SingleSelectionDemo />,
};

/**
 * Multiple selection mode with checkboxes
 */
export const MultipleSelection: Story = {
  render: () => <MultipleSelectionDemo />,
};

/**
 * Selection controls on end position
 */
export const SelectionControlsEnd: Story = {
  args: {
    data: sampleUsers.slice(0, 5),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    selectionMode: 'multiple',
    selectionControlPosition: 'end',
    variant: 'bordered',
  },
};

// ============================================================
// Bulk Actions
// ============================================================

/**
 * Multiple selection with bulk actions
 */
export const WithBulkActions: Story = {
  render: () => <WithBulkActionsDemo />,
};

// ============================================================
// Item Actions
// ============================================================

/**
 * Per-item action menu
 */
export const WithItemActions: Story = {
  render: () => {
    const itemActions: Array<ItemAction<User>> = [
      {
        id: 'edit',
        label: 'Edit',
        icon: <Icon name="edit" size="sm" />,
        onAction: (item) => alert(`Editing ${item.name}`),
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: <Icon name="copy" size="sm" />,
        onAction: (item) => alert(`Duplicating ${item.name}`),
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: <Icon name="trash-2" size="sm" />,
        variant: 'danger',
        divider: true,
        onAction: (item) => alert(`Deleting ${item.name}`),
      },
    ];

    return (
      <List
        data={sampleUsers.slice(0, 5)}
        primaryTextField="name"
        secondaryTextField="email"
        avatarField="avatar"
        itemActions={itemActions}
        variant="bordered"
      />
    );
  },
};

/**
 * Item actions always visible
 */
export const ItemActionsAlwaysVisible: Story = {
  render: () => {
    const itemActions: Array<ItemAction<User>> = [
      {
        id: 'edit',
        label: 'Edit',
        icon: <Icon name="edit" size="sm" />,
        onAction: (item) => alert(`Editing ${item.name}`),
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: <Icon name="trash-2" size="sm" />,
        variant: 'danger',
        onAction: (item) => alert(`Deleting ${item.name}`),
      },
    ];

    return (
      <List
        data={sampleUsers.slice(0, 5)}
        primaryTextField="name"
        secondaryTextField="email"
        itemActions={itemActions}
        itemActionsTrigger="always"
        variant="bordered"
      />
    );
  },
};

// ============================================================
// Grouped Lists
// ============================================================

/**
 * Items grouped by a field
 */
export const GroupedByDepartment: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    groupBy: 'department',
    variant: 'bordered',
  },
};

/**
 * Collapsible groups
 */
export const CollapsibleGroups: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    groupBy: 'department',
    collapsibleGroups: true,
    defaultCollapsedGroups: ['Marketing'],
    variant: 'bordered',
  },
};

/**
 * Custom group header
 */
export const CustomGroupHeader: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
    groupBy: 'department',
    collapsibleGroups: true,
    variant: 'bordered',
    renderGroupHeader: (groupKey: string, itemCount: number, isCollapsed: boolean) => (
      <div className={styles.groupHeaderContent}>
        <Icon name={isCollapsed ? 'chevron-right' : 'chevron-down'} size="sm" />
        <span className={styles.itemPrimaryText}>{groupKey}</span>
        <Pill color="neutral" size="sm" variant="subtle">
          {itemCount}
        </Pill>
      </div>
    ),
  },
};

// ============================================================
// Expandable Items
// ============================================================

/**
 * Expandable items with detail content
 */
export const ExpandableItems: Story = {
  render: () => <ExpandableItemsDemo />,
};

/**
 * Expand on row click
 */
export const ExpandOnClick: Story = {
  args: {
    data: sampleUsers.slice(0, 5),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    expandTrigger: 'click',
    variant: 'bordered',
    renderExpandedContent: (user: User) => (
      <div style={{ padding: '8px 0' }}>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Department:</strong> {user.department}
        </p>
      </div>
    ),
  },
};

// ============================================================
// Search / Filter
// ============================================================

/**
 * Searchable list
 */
export const Searchable: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    searchable: true,
    searchPlaceholder: 'Search users...',
    searchFields: ['name', 'email', 'role'],
    variant: 'bordered',
  },
};

/**
 * Searchable with selection and bulk actions
 */
export const SearchableWithActions: Story = {
  render: () => <SearchableWithActionsDemo />,
};

// ============================================================
// Custom Render
// ============================================================

/**
 * Custom item rendering
 */
export const CustomRenderItem: Story = {
  render: () => {
    const statusColors: Record<string, 'success' | 'danger' | 'warning'> = {
      active: 'success',
      inactive: 'danger',
      pending: 'warning',
    };

    return (
      <List
        data={sampleUsers}
        variant="card"
        spacing="sm"
        renderItem={(user, _index, { isSelected }) => (
          <>
            <Avatar initials={user.avatar} size="md" />
            <div className={styles.itemContent}>
              <span className={styles.itemPrimaryText}>{user.name}</span>
              <span className={styles.itemSecondaryText}>{user.email}</span>
            </div>
            <Pill color={statusColors[user.status]} size="sm">
              {user.status}
            </Pill>
            <Pill color="neutral" variant="outlined" size="sm">
              {user.role}
            </Pill>
            {isSelected && <Icon name="check" size="sm" />}
          </>
        )}
        selectionMode="multiple"
      />
    );
  },
};

/**
 * Task list with custom rendering
 */
export const TaskList: Story = {
  render: () => {
    const priorityColors: Record<string, 'danger' | 'warning' | 'neutral'> = {
      high: 'danger',
      medium: 'warning',
      low: 'neutral',
    };

    const statusIcons: Record<string, 'circle' | 'clock' | 'check-circle'> = {
      todo: 'circle',
      in_progress: 'clock',
      done: 'check-circle',
    };

    return (
      <List
        data={sampleTasks}
        variant="bordered"
        renderItem={(task) => (
          <>
            <Icon name={statusIcons[task.status]} size="md" />
            <div className={styles.itemContent}>
              <span className={styles.itemPrimaryText}>{task.title}</span>
              <span className={styles.itemSecondaryText}>{task.description}</span>
            </div>
            <Pill color={priorityColors[task.priority]} size="sm">
              {task.priority}
            </Pill>
            <span className={styles.itemSecondaryText}>{task.assignee}</span>
          </>
        )}
      />
    );
  },
};

// ============================================================
// Loading States
// ============================================================

/**
 * Skeleton loading state
 */
export const SkeletonLoading: Story = {
  args: {
    data: [],
    skeleton: {
      enabled: true,
      rows: 5,
    },
    variant: 'bordered',
  },
};

/**
 * Loading overlay state
 */
export const LoadingState: Story = {
  args: {
    data: sampleUsers.slice(0, 3),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    loading: true,
    variant: 'bordered',
  },
};

/**
 * Empty state
 */
export const EmptyState: Story = {
  args: {
    data: [],
    emptyContent: 'No users found. Try adding some!',
    variant: 'bordered',
  },
};

/**
 * Custom empty state
 */
export const CustomEmptyState: Story = {
  args: {
    data: [],
    variant: 'bordered',
    renderEmpty: () => (
      <div className={styles.emptyState}>
        <Icon name="inbox" size="xl" />
        <span className={styles.itemPrimaryText}>No items yet</span>
        <span className={styles.itemSecondaryText}>Get started by adding your first item</span>
        <Button variant="primary" size="sm">
          Add Item
        </Button>
      </div>
    ),
  },
};

// ============================================================
// Infinite Scroll
// ============================================================

/**
 * Infinite scroll loading more items
 */
export const InfiniteScroll: Story = {
  render: () => <InfiniteScrollDemo />,
};

// ============================================================
// Responsive Columns
// ============================================================

/**
 * Multi-column grid layout
 */
export const MultiColumnGrid: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    variant: 'card',
    spacing: 'md',
    columns: 2,
  },
};

/**
 * Three column layout
 */
export const ThreeColumnGrid: Story = {
  args: {
    data: sampleUsers,
    primaryTextField: 'name',
    secondaryTextField: 'email',
    avatarField: 'avatar',
    variant: 'card',
    spacing: 'md',
    columns: 3,
  },
};

// ============================================================
// Combined Features
// ============================================================

/**
 * Full-featured list with all options
 */
export const FullFeatured: Story = {
  render: () => <FullFeaturedDemo />,
};

// ============================================================
// Accessibility
// ============================================================

/**
 * Keyboard navigation demo
 */
export const KeyboardNavigation: Story = {
  args: {
    data: sampleUsers.slice(0, 5),
    primaryTextField: 'name',
    secondaryTextField: 'email',
    selectionMode: 'multiple',
    variant: 'bordered',
    'aria-label': 'User list with keyboard navigation',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use Arrow keys to navigate, Space/Enter to select, Home/End to jump to first/last item.',
      },
    },
  },
};
