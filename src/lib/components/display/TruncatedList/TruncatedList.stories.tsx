import type { Meta, StoryObj } from '@storybook/react';
import { TruncatedList } from './TruncatedList';
import { Pill } from '../Pill';
import { Avatar } from '../Avatar';
import { Card } from '../Card';

const meta: Meta<typeof TruncatedList> = {
  title: 'Display/TruncatedList',
  component: TruncatedList,
  tags: ['autodocs'],
  argTypes: {
    maxVisible: {
      control: { type: 'number', min: 1, max: 10 },
    },
    gap: {
      control: { type: 'number', min: 0, max: 24 },
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TruncatedList>;

const skills = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'AWS', 'Docker'];

/**
 * Default truncated list with pills
 */
export const Default: Story = {
  render: () => (
    <TruncatedList
      items={skills}
      maxVisible={3}
      renderItem={(item: string) => (
        <Pill variant="subtle" color="primary">
          {item}
        </Pill>
      )}
    />
  ),
};

/**
 * Showing all items (no truncation)
 */
export const NoTruncation: Story = {
  render: () => (
    <TruncatedList
      items={skills.slice(0, 3)}
      maxVisible={5}
      renderItem={(item: string) => (
        <Pill variant="subtle" color="primary">
          {item}
        </Pill>
      )}
    />
  ),
};

/**
 * Different max visible counts
 */
export const MaxVisibleVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[1, 2, 3, 4, 5].map((max) => (
        <div key={max}>
          <p style={{ margin: '0 0 8px', color: 'var(--theme-text-secondary)' }}>
            maxVisible: {max}
          </p>
          <TruncatedList
            items={skills}
            maxVisible={max}
            renderItem={(item: string) => (
              <Pill variant="subtle" color="primary">
                {item}
              </Pill>
            )}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * Avatar group with custom more indicator
 */
export const AvatarGroup: Story = {
  render: () => {
    const users = [
      { id: 1, name: 'Alice', initials: 'A' },
      { id: 2, name: 'Bob', initials: 'B' },
      { id: 3, name: 'Charlie', initials: 'C' },
      { id: 4, name: 'Diana', initials: 'D' },
      { id: 5, name: 'Eve', initials: 'E' },
      { id: 6, name: 'Frank', initials: 'F' },
    ];

    return (
      <TruncatedList
        items={users}
        maxVisible={3}
        gap={-8}
        renderItem={(user) => <Avatar initials={user.initials} size="sm" />}
        renderMore={(count) => <Avatar initials={`+${count}`} size="sm" />}
        tooltipContent={(hidden) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {hidden.map((user) => (
              <span key={user.id}>{user.name}</span>
            ))}
          </div>
        )}
        keyExtractor={(user) => user.id}
      />
    );
  },
};

/**
 * Vertical list
 */
export const Vertical: Story = {
  render: () => (
    <TruncatedList
      items={skills}
      maxVisible={3}
      direction="vertical"
      renderItem={(item: string) => (
        <Pill variant="subtle" color="primary">
          {item}
        </Pill>
      )}
    />
  ),
};

/**
 * Different gap sizes
 */
export const GapVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[4, 8, 12, 16].map((gapSize) => (
        <div key={gapSize}>
          <p style={{ margin: '0 0 8px', color: 'var(--theme-text-secondary)' }}>
            gap: {gapSize}px
          </p>
          <TruncatedList
            items={skills}
            maxVisible={4}
            gap={gapSize}
            renderItem={(item: string) => (
              <Pill variant="subtle" color="primary">
                {item}
              </Pill>
            )}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * Without tooltip
 */
export const WithoutTooltip: Story = {
  render: () => (
    <TruncatedList
      items={skills}
      maxVisible={3}
      showTooltip={false}
      renderItem={(item: string) => (
        <Pill variant="subtle" color="primary">
          {item}
        </Pill>
      )}
    />
  ),
};

/**
 * With click handler on "more" indicator
 */
export const WithClickHandler: Story = {
  render: () => (
    <div>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Click the "+N more" indicator to see the alert:
      </p>
      <TruncatedList
        items={skills}
        maxVisible={3}
        renderItem={(item: string) => (
          <Pill variant="subtle" color="primary">
            {item}
          </Pill>
        )}
        onMoreClick={(hidden) => {
          alert(`Hidden items: ${hidden.join(', ')}`);
        }}
      />
    </div>
  ),
};

/**
 * Colored pills with different colors
 */
export const ColoredPills: Story = {
  render: () => {
    const coloredSkills: Array<{
      name: string;
      color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    }> = [
      { name: 'React', color: 'primary' },
      { name: 'TypeScript', color: 'warning' },
      { name: 'Node.js', color: 'success' },
      { name: 'GraphQL', color: 'secondary' },
      { name: 'PostgreSQL', color: 'danger' },
    ];

    return (
      <TruncatedList
        items={coloredSkills}
        maxVisible={3}
        renderItem={(item) => (
          <Pill variant="subtle" color={item.color}>
            {item.name}
          </Pill>
        )}
        keyExtractor={(item) => item.name}
      />
    );
  },
};

/**
 * Custom more indicator
 */
export const CustomMoreIndicator: Story = {
  render: () => (
    <TruncatedList
      items={skills}
      maxVisible={3}
      renderItem={(item: string) => (
        <Pill variant="subtle" color="primary">
          {item}
        </Pill>
      )}
      renderMore={(count) => (
        <Pill variant="filled" color="primary">
          View {count} more
        </Pill>
      )}
    />
  ),
};

/**
 * Custom tooltip content
 */
export const CustomTooltipContent: Story = {
  render: () => (
    <TruncatedList
      items={skills}
      maxVisible={2}
      renderItem={(item: string) => (
        <Pill variant="subtle" color="primary">
          {item}
        </Pill>
      )}
      tooltipContent={(hidden) => (
        <div style={{ padding: 8 }}>
          <strong style={{ display: 'block', marginBottom: 8 }}>
            {hidden.length} more skills:
          </strong>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {hidden.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    />
  ),
};

/**
 * In a card layout
 */
export const InCard: Story = {
  render: () => (
    <Card variant="elevated" padding="md" style={{ maxWidth: 400 }}>
      <h3 style={{ margin: '0 0 8px' }}>John Doe</h3>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Senior Software Engineer
      </p>
      <div style={{ borderTop: '1px solid var(--theme-border-primary)', paddingTop: 12 }}>
        <p style={{ margin: '0 0 8px', fontWeight: 500, fontSize: 14 }}>Skills</p>
        <TruncatedList
          items={skills}
          maxVisible={4}
          gap={6}
          renderItem={(item: string) => (
            <Pill variant="subtle" color="neutral" size="sm">
              {item}
            </Pill>
          )}
        />
      </div>
    </Card>
  ),
};

