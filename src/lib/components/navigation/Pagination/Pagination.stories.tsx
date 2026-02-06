import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Pagination control for navigating between pages. Supports multiple variants (default, outlined, minimal), shapes (rounded, circular, square), and customizable sibling/boundary counts.

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
<td><code>--pagination-button-size-sm</code></td>
<td>28px</td>
<td>Button size for small variant</td>
</tr>
<tr>
<td><code>--pagination-button-size-md</code></td>
<td>36px</td>
<td>Button size for medium variant</td>
</tr>
<tr>
<td><code>--pagination-button-size-lg</code></td>
<td>44px</td>
<td>Button size for large variant</td>
</tr>
<tr>
<td><code>--pagination-button-size</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--pagination-button-size-md)</code></a></td>
<td>Current button size</td>
</tr>
<tr>
<td><code>--pagination-button-bg</code></td>
<td>transparent</td>
<td>Button background color</td>
</tr>
<tr>
<td><code>--pagination-button-hover-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-secondary)</code></a></td>
<td>Button background on hover</td>
</tr>
<tr>
<td><code>--pagination-button-active-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Button background when active</td>
</tr>
<tr>
<td><code>--pagination-button-text</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Button text color</td>
</tr>
<tr>
<td><code>--pagination-button-active-text</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-on-primary)</code></a></td>
<td>Button text color when active</td>
</tr>
<tr>
<td><code>--pagination-button-disabled-text</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-tertiary)</code></a></td>
<td>Button text color when disabled</td>
</tr>
<tr>
<td><code>--pagination-button-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary)</code></a></td>
<td>Button border color for outlined variant</td>
</tr>
<tr>
<td><code>--pagination-button-radius</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Button border radius</td>
</tr>
<tr>
<td><code>--pagination-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs)</code></a></td>
<td>Gap between buttons</td>
</tr>
<tr>
<td><code>--pagination-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Font size of pagination text</td>
</tr>
<tr>
<td><code>--pagination-transition</code></td>
<td><a href="?path=/story/theme-css-variables--transitions"><code>var(--transition-fast)</code></a></td>
<td>Transition duration and easing</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'minimal'],
    },
    shape: {
      control: 'select',
      options: ['rounded', 'circular', 'square'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        {...args}
        totalPages={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const WithManySiblings: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState(10);

    return (
      <Pagination
        {...args}
        totalPages={20}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        siblingCount={2}
      />
    );
  },
};

export const MinimalNav: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        {...args}
        totalPages={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        showFirstLast={false}
      />
    );
  },
};

export const Variants: Story = {
  render: function Render() {
    const [page1, setPage1] = useState(3);
    const [page2, setPage2] = useState(3);
    const [page3, setPage3] = useState(3);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Default
          </p>
          <Pagination
            totalPages={10}
            currentPage={page1}
            onPageChange={setPage1}
            variant="default"
          />
        </div>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Outlined
          </p>
          <Pagination
            totalPages={10}
            currentPage={page2}
            onPageChange={setPage2}
            variant="outlined"
          />
        </div>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Minimal
          </p>
          <Pagination
            totalPages={10}
            currentPage={page3}
            onPageChange={setPage3}
            variant="minimal"
          />
        </div>
      </div>
    );
  },
};

export const Shapes: Story = {
  render: function Render() {
    const [page1, setPage1] = useState(3);
    const [page2, setPage2] = useState(3);
    const [page3, setPage3] = useState(3);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Rounded (default)
          </p>
          <Pagination totalPages={10} currentPage={page1} onPageChange={setPage1} shape="rounded" />
        </div>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Circular
          </p>
          <Pagination
            totalPages={10}
            currentPage={page2}
            onPageChange={setPage2}
            shape="circular"
          />
        </div>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Square
          </p>
          <Pagination totalPages={10} currentPage={page3} onPageChange={setPage3} shape="square" />
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: function Render() {
    const [page1, setPage1] = useState(3);
    const [page2, setPage2] = useState(3);
    const [page3, setPage3] = useState(3);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Small
          </p>
          <Pagination totalPages={10} currentPage={page1} onPageChange={setPage1} size="sm" />
        </div>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Medium (default)
          </p>
          <Pagination totalPages={10} currentPage={page2} onPageChange={setPage2} size="md" />
        </div>
        <div>
          <p
            style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}
          >
            Large
          </p>
          <Pagination totalPages={10} currentPage={page3} onPageChange={setPage3} size="lg" />
        </div>
      </div>
    );
  },
};

export const FewPages: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        {...args}
        totalPages={3}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const ManyPages: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState(50);

    return (
      <Pagination
        {...args}
        totalPages={100}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        siblingCount={1}
        boundaryCount={1}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => <Pagination totalPages={10} currentPage={5} onPageChange={() => {}} disabled />,
};

export const CircularOutlined: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState(5);

    return (
      <Pagination
        {...args}
        totalPages={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        variant="outlined"
        shape="circular"
      />
    );
  },
};
