import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
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
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
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
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
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
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
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
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
            Rounded (default)
          </p>
          <Pagination
            totalPages={10}
            currentPage={page1}
            onPageChange={setPage1}
            shape="rounded"
          />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
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
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
            Square
          </p>
          <Pagination
            totalPages={10}
            currentPage={page3}
            onPageChange={setPage3}
            shape="square"
          />
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
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
            Small
          </p>
          <Pagination totalPages={10} currentPage={page1} onPageChange={setPage1} size="sm" />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
            Medium (default)
          </p>
          <Pagination totalPages={10} currentPage={page2} onPageChange={setPage2} size="md" />
        </div>
        <div>
          <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
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
  render: () => (
    <Pagination
      totalPages={10}
      currentPage={5}
      onPageChange={() => {}}
      disabled
    />
  ),
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
