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
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'card', 'flush'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
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
      <p style={{ marginBottom: 16 }}>
        Selected: {selectedKeys.length} item(s)
      </p>
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
