import type { Meta, StoryObj } from '@storybook/react';
import { AdaptiveGrid } from './AdaptiveGrid';
import { Card } from '../../display/Card';
import { KPI } from '../../display/KPI';

const meta: Meta<typeof AdaptiveGrid> = {
  title: 'Layout/AdaptiveGrid',
  component: AdaptiveGrid,
  tags: ['autodocs'],
  argTypes: {
    minItemWidth: {
      control: { type: 'number', min: 100, max: 500 },
    },
    maxColumns: {
      control: { type: 'number', min: 1, max: 12 },
    },
    minColumns: {
      control: { type: 'number', min: 1, max: 6 },
    },
    gap: {
      control: { type: 'number', min: 0, max: 48 },
    },
    fillMode: {
      control: 'select',
      options: ['auto-fill', 'auto-fit'],
    },
    alignItems: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
    justifyItems: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdaptiveGrid>;

/**
 * Default adaptive grid that fills available space
 */
export const Default: Story = {
  args: {
    minItemWidth: 200,
    gap: 16,
  },
  render: (args) => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 800,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Resize the container to see the grid adapt:
      </p>
      <AdaptiveGrid {...args}>
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} variant="filled" padding="md" fullWidth>
            <div style={{ textAlign: 'center', height: 100 }}>Item {i + 1}</div>
          </Card>
        ))}
      </AdaptiveGrid>
    </div>
  ),
};

/**
 * Different minimum item widths
 */
export const MinItemWidthVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 500 }}>
      {[100, 200, 300].map((minWidth) => (
        <div key={minWidth}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>minItemWidth: {minWidth}px</strong>
          </p>
          <AdaptiveGrid minItemWidth={minWidth} gap={12}>
            {Array.from({ length: 8 }, (_, i) => (
              <Card key={i} variant="filled" padding="md" fullWidth>
                <div style={{ textAlign: 'center', height: 100 }}>Item {i + 1}</div>
              </Card>
            ))}
          </AdaptiveGrid>
        </div>
      ))}
    </div>
  ),
};

/**
 * With column count callback
 */
export const WithColumnCallback: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 800,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Check console for column count changes:
      </p>
      <AdaptiveGrid
        minItemWidth={200}
        gap={16}
        onColumnCountChange={(count) => console.log('Column count:', count)}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i} variant="filled" padding="md" fullWidth>
            <div style={{ textAlign: 'center', height: 100 }}>Item {i + 1}</div>
          </Card>
        ))}
      </AdaptiveGrid>
    </div>
  ),
};

/**
 * Max columns constraint
 */
export const MaxColumns: Story = {
  render: () => (
    <div>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Grid with maxColumns=3 - won't exceed 3 columns regardless of width:
      </p>
      <AdaptiveGrid minItemWidth={150} maxColumns={3} gap={16}>
        {Array.from({ length: 9 }, (_, i) => (
          <Card key={i} variant="filled" padding="md" fullWidth>
            <div style={{ textAlign: 'center', height: 100 }}>Item {i + 1}</div>
          </Card>
        ))}
      </AdaptiveGrid>
    </div>
  ),
};

/**
 * Min columns constraint
 */
export const MinColumns: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 400,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        minColumns=2 - always at least 2 columns:
      </p>
      <AdaptiveGrid minItemWidth={200} minColumns={2} gap={16}>
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} variant="filled" padding="md" fullWidth>
            <div style={{ textAlign: 'center', height: 100 }}>Item {i + 1}</div>
          </Card>
        ))}
      </AdaptiveGrid>
    </div>
  ),
};

/**
 * Auto-fill vs auto-fit comparison
 *
 * The difference is visible when there are fewer items than available columns:
 * - auto-fill: Creates empty columns to fill space, items stay at minItemWidth
 * - auto-fit: Collapses empty columns, items expand to fill available space
 */
export const FillModeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 800 }}>
      <div>
        <p style={{ margin: '0 0 8px' }}>
          <strong>auto-fill</strong> - Items stay at minimum width, empty column tracks are preserved:
        </p>
        <div style={{ border: '1px dashed var(--theme-border-primary)', padding: 16, background: 'var(--theme-background-secondary)' }}>
          <AdaptiveGrid minItemWidth={150} fillMode="auto-fill" gap={16}>
            {Array.from({ length: 2 }, (_, i) => (
              <Card key={i} variant="filled" padding="md" fullWidth>
                <div style={{ textAlign: 'center', height: 60 }}>Item {i + 1}</div>
              </Card>
            ))}
          </AdaptiveGrid>
        </div>
      </div>
      <div>
        <p style={{ margin: '0 0 8px' }}>
          <strong>auto-fit</strong> - Items expand to fill available space when there are fewer items than columns:
        </p>
        <div style={{ border: '1px dashed var(--theme-border-primary)', padding: 16, background: 'var(--theme-background-secondary)' }}>
          <AdaptiveGrid minItemWidth={150} fillMode="auto-fit" gap={16}>
            {Array.from({ length: 2 }, (_, i) => (
              <Card key={i} variant="filled" padding="md" fullWidth>
                <div style={{ textAlign: 'center', height: 60 }}>Item {i + 1}</div>
              </Card>
            ))}
          </AdaptiveGrid>
        </div>
      </div>
    </div>
  ),
};

/**
 * Different gap configurations
 */
export const GapVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ margin: '0 0 8px' }}>
          <strong>Uniform gap (16px):</strong>
        </p>
        <AdaptiveGrid minItemWidth={120} gap={16}>
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} variant="filled" padding="md" fullWidth>
              <div style={{ textAlign: 'center', height: 100 }}>Item {i + 1}</div>
            </Card>
          ))}
        </AdaptiveGrid>
      </div>
      <div>
        <p style={{ margin: '0 0 8px' }}>
          <strong>Different row/column gaps (rowGap: 32px, columnGap: 8px):</strong>
        </p>
        <AdaptiveGrid minItemWidth={120} rowGap={32} columnGap={8}>
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} variant="filled" padding="md" fullWidth>
              <div style={{ textAlign: 'center', height: 100 }}>Item {i + 1}</div>
            </Card>
          ))}
        </AdaptiveGrid>
      </div>
    </div>
  ),
};

/**
 * Item alignment options (alignItems controls vertical alignment within grid rows)
 */
export const AlignmentOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 600 }}>
      {(['start', 'center', 'end', 'stretch'] as const).map((align) => (
        <div key={align}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>alignItems: {align}</strong>
          </p>
          <div style={{ border: '1px dashed var(--theme-border-primary)', padding: 16, background: 'var(--theme-background-secondary)' }}>
            <AdaptiveGrid minItemWidth={150} gap={16} alignItems={align}>
              <Card variant="filled" padding="md" fullWidth>
                <div style={{ height: 40 }}>Short</div>
              </Card>
              <Card variant="filled" padding="md" fullWidth>
                <div style={{ height: 80 }}>Medium height content that takes more space</div>
              </Card>
              <Card variant="filled" padding="md" fullWidth>
                <div style={{ height: 120 }}>Tall content that takes the most vertical space in this row</div>
              </Card>
            </AdaptiveGrid>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Justify items options (justifyItems controls horizontal alignment within grid cells)
 */
export const JustifyOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 800 }}>
      {(['start', 'center', 'end', 'stretch'] as const).map((justify) => (
        <div key={justify}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>justifyItems: {justify}</strong>
          </p>
          <div style={{ border: '1px dashed var(--theme-border-primary)', padding: 16, background: 'var(--theme-background-secondary)' }}>
            <AdaptiveGrid minItemWidth={200} gap={16} justifyItems={justify}>
              <Card variant="filled" padding="md" style={{ width: justify === 'stretch' ? '100%' : '120px' }}>
                <div style={{ textAlign: 'center' }}>Narrow</div>
              </Card>
              <Card variant="filled" padding="md" style={{ width: justify === 'stretch' ? '100%' : '120px' }}>
                <div style={{ textAlign: 'center' }}>Narrow</div>
              </Card>
              <Card variant="filled" padding="md" style={{ width: justify === 'stretch' ? '100%' : '120px' }}>
                <div style={{ textAlign: 'center' }}>Narrow</div>
              </Card>
            </AdaptiveGrid>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * KPI Dashboard grid example
 */
export const KPIDashboard: Story = {
  render: () => {
    const kpis = [
      { title: 'Total Revenue', value: '$54,239', change: '+12%', changeType: 'increase' as const },
      { title: 'Active Users', value: '1,428', change: '+8%', changeType: 'increase' as const },
      { title: 'Conversion Rate', value: '3.24%', change: '-2%', changeType: 'decrease' as const },
      { title: 'Avg. Order Value', value: '$127', change: '+5%', changeType: 'increase' as const },
      { title: 'Bounce Rate', value: '42%', change: '-3%', changeType: 'decrease' as const },
      { title: 'Support Tickets', value: '23', change: '+1', changeType: 'neutral' as const },
    ];

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed var(--theme-border-primary)',
          padding: 16,
          minWidth: 300,
          width: '100%',
        }}
      >
        <AdaptiveGrid minItemWidth={200} maxColumns={4} gap={16}>
          {kpis.map((kpi, index) => (
            <KPI
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              changeType={kpi.changeType}
              size="sm"
            />
          ))}
        </AdaptiveGrid>
      </div>
    );
  },
};

/**
 * Card grid example
 */
export const CardGrid: Story = {
  render: () => {
    const items = [
      { title: 'Dashboard', description: 'View your analytics and metrics' },
      { title: 'Settings', description: 'Configure your preferences' },
      { title: 'Users', description: 'Manage team members' },
      { title: 'Reports', description: 'Generate and download reports' },
      { title: 'Integrations', description: 'Connect third-party services' },
      { title: 'Billing', description: 'Manage subscription and payments' },
    ];

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed var(--theme-border-primary)',
          padding: 16,
          minWidth: 300,
          width: '100%',
        }}
      >
        <AdaptiveGrid minItemWidth={200} maxColumns={3} gap={16}>
          {items.map((item, index) => (
            <Card key={index} variant="filled" padding="md" hoverable fullWidth>
              <h4 style={{ margin: '0 0 8px' }}>{item.title}</h4>
              <p style={{ margin: 0, color: 'var(--theme-text-secondary)', fontSize: 14 }}>
                {item.description}
              </p>
            </Card>
          ))}
        </AdaptiveGrid>
      </div>
    );
  },
};

/**
 * Mixed content grid
 */
export const MixedContent: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: '100%',
      }}
    >
      <AdaptiveGrid minItemWidth={150} gap={16} fillMode="auto-fit">
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i} variant="filled" padding="md" fullWidth>
            <div style={{ textAlign: 'center' }}>{i + 1}</div>
          </Card>
        ))}
      </AdaptiveGrid>
    </div>
  ),
};

