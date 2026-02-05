import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPI } from './KPI';

describe('KPI', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with required props', () => {
      render(<KPI title="Revenue" value="$12,345" />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$12,345')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <KPI
          title="Active Users"
          value="1,428"
          subtitle="Monthly"
          description="Active users this month"
          variant="success"
          size="lg"
          change="+12%"
          changeType="increase"
          icon={<span data-testid="icon">👤</span>}
          footer="Last updated: 2 hours ago"
          className="custom"
          data-testid="test-kpi"
        />
      );

      expect(screen.getByTestId('test-kpi')).toHaveClass('custom');
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('1,428')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Active users this month')).toBeInTheDocument();
      expect(screen.getByText('+12%')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Last updated: 2 hours ago')).toBeInTheDocument();
    });

    it('renders with numeric value', () => {
      render(<KPI title="Count" value={42} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with string value', () => {
      render(<KPI title="Status" value="Active" />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  // 2. Variants tests
  describe('variants', () => {
    it('renders primary variant by default', () => {
      const { container } = render(<KPI title="Test" value="123" />);
      const kpi = container.querySelector('[data-component="kpi"]');
      expect(kpi).toHaveAttribute('data-variant', 'primary');
    });

    it.each(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const)(
      'renders %s variant',
      (variant) => {
        const { container } = render(<KPI title="Test" value="123" variant={variant} />);
        const kpi = container.querySelector('[data-component="kpi"]');
        expect(kpi).toHaveAttribute('data-variant', variant);
      }
    );
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      const { container } = render(<KPI title="Test" value="123" />);
      const kpi = container.querySelector('[data-component="kpi"]');
      expect(kpi).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)('renders %s size', (size) => {
      const { container } = render(<KPI title="Test" value="123" size={size} />);
      const kpi = container.querySelector('[data-component="kpi"]');
      expect(kpi).toHaveAttribute('data-size', size);
    });
  });

  // 4. Optional content tests
  describe('optional content', () => {
    it('renders subtitle when provided', () => {
      render(<KPI title="Revenue" value="$12,345" subtitle="Q4 2024" />);
      expect(screen.getByText('Q4 2024')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      const { container } = render(<KPI title="Revenue" value="$12,345" />);
      const subtitle = container.querySelector('[class*="kpiSubtitle"]');
      expect(subtitle).not.toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(<KPI title="Users" value="1,234" description="Total active users" />);
      expect(screen.getByText('Total active users')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      const { container } = render(<KPI title="Users" value="1,234" />);
      const description = container.querySelector('[class*="kpiDescription"]');
      expect(description).not.toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      render(<KPI title="Users" value="1,234" icon={<span data-testid="custom-icon">📊</span>} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('does not render icon when not provided', () => {
      const { container } = render(<KPI title="Users" value="1,234" />);
      const icon = container.querySelector('[class*="kpiIcon"]');
      expect(icon).not.toBeInTheDocument();
    });

    it('renders trend when provided', () => {
      render(
        <KPI title="Users" value="1,234" trend={<div data-testid="trend-chart">Chart</div>} />
      );
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    });

    it('does not render trend when not provided', () => {
      const { container } = render(<KPI title="Users" value="1,234" />);
      const trend = container.querySelector('[class*="kpiTrend"]');
      expect(trend).not.toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(<KPI title="Users" value="1,234" footer="Last updated: Today" />);
      expect(screen.getByText('Last updated: Today')).toBeInTheDocument();
    });

    it('does not render footer when not provided', () => {
      const { container } = render(<KPI title="Users" value="1,234" />);
      const footer = container.querySelector('[class*="kpiFooter"]');
      expect(footer).not.toBeInTheDocument();
    });
  });

  // 5. Change indicator tests
  describe('change indicator', () => {
    it('renders change when provided', () => {
      render(<KPI title="Revenue" value="$12,345" change="+15%" />);
      expect(screen.getByText('+15%')).toBeInTheDocument();
    });

    it('does not render change when not provided', () => {
      const { container } = render(<KPI title="Revenue" value="$12,345" />);
      const change = container.querySelector('[class*="kpiChange"]');
      expect(change).not.toBeInTheDocument();
    });

    it('renders change with neutral type by default', () => {
      const { container } = render(<KPI title="Revenue" value="$12,345" change="+15%" />);
      const change = container.querySelector('[class*="kpiChange"]');
      expect(change).toHaveAttribute('data-change-type', 'neutral');
    });

    it('renders change with increase type', () => {
      const { container } = render(
        <KPI title="Revenue" value="$12,345" change="+15%" changeType="increase" />
      );
      const change = container.querySelector('[class*="kpiChange"]');
      expect(change).toHaveAttribute('data-change-type', 'increase');
    });

    it('renders change with decrease type', () => {
      const { container } = render(
        <KPI title="Revenue" value="$12,345" change="-5%" changeType="decrease" />
      );
      const change = container.querySelector('[class*="kpiChange"]');
      expect(change).toHaveAttribute('data-change-type', 'decrease');
    });

    it('renders change with neutral type', () => {
      const { container } = render(
        <KPI title="Revenue" value="$12,345" change="0%" changeType="neutral" />
      );
      const change = container.querySelector('[class*="kpiChange"]');
      expect(change).toHaveAttribute('data-change-type', 'neutral');
    });
  });

  // 6. Children vs footer tests
  describe('children vs footer', () => {
    it('renders children when provided without footer', () => {
      render(
        <KPI title="Users" value="1,234">
          <span data-testid="children-content">Custom content</span>
        </KPI>
      );
      expect(screen.getByTestId('children-content')).toBeInTheDocument();
    });

    it('renders footer prop over children when both provided', () => {
      render(
        <KPI title="Users" value="1,234" footer="Footer content">
          <span data-testid="children-content">Children content</span>
        </KPI>
      );
      expect(screen.getByText('Footer content')).toBeInTheDocument();
      expect(screen.queryByTestId('children-content')).not.toBeInTheDocument();
    });

    it('renders footer when only footer is provided', () => {
      render(<KPI title="Users" value="1,234" footer="Footer only" />);
      expect(screen.getByText('Footer only')).toBeInTheDocument();
    });
  });

  // 7. Accessibility tests
  describe('accessibility', () => {
    it('includes data-component attribute', () => {
      const { container } = render(<KPI title="Test" value="123" />);
      const kpi = container.querySelector('[data-component="kpi"]');
      expect(kpi).toBeInTheDocument();
    });

    it('has correct ARIA label when provided', () => {
      render(<KPI title="Test" value="123" aria-label="Test KPI" />);
      expect(screen.getByLabelText('Test KPI')).toBeInTheDocument();
    });

    it('renders title as h3 element', () => {
      render(<KPI title="Revenue" value="$12,345" />);
      const title = screen.getByText('Revenue');
      expect(title.tagName).toBe('H3');
    });

    it('renders description as paragraph element', () => {
      render(<KPI title="Revenue" value="$12,345" description="Total revenue for Q4" />);
      const description = screen.getByText('Total revenue for Q4');
      expect(description.tagName).toBe('P');
    });
  });

  // 8. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<KPI ref={ref} title="Test" value="123" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-component', 'kpi');
    });
  });

  // 9. Complex scenarios
  describe('complex scenarios', () => {
    it('renders complete KPI with all optional elements', () => {
      render(
        <KPI
          title="Monthly Revenue"
          value="$54,239"
          subtitle="E-commerce"
          description="Total revenue for January 2024"
          variant="success"
          size="lg"
          change="+12.5%"
          changeType="increase"
          icon={<span data-testid="icon">💰</span>}
          trend={<div data-testid="trend">Trend chart</div>}
          footer={<span data-testid="footer">Updated 5 minutes ago</span>}
          className="custom-kpi"
          data-testid="complete-kpi"
        />
      );

      const kpi = screen.getByTestId('complete-kpi');
      expect(kpi).toBeInTheDocument();
      expect(kpi).toHaveClass('custom-kpi');
      expect(kpi).toHaveAttribute('data-variant', 'success');
      expect(kpi).toHaveAttribute('data-size', 'lg');

      expect(screen.getByText('E-commerce')).toBeInTheDocument();
      expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
      expect(screen.getByText('$54,239')).toBeInTheDocument();
      expect(screen.getByText('Total revenue for January 2024')).toBeInTheDocument();
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('trend')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('handles edge case with empty string values', () => {
      render(<KPI title="Test" value="" />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('handles edge case with zero as value', () => {
      render(<KPI title="Count" value={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles edge case with negative number value', () => {
      render(<KPI title="Balance" value={-500} />);
      expect(screen.getByText('-500')).toBeInTheDocument();
    });

    it('handles edge case with very large number', () => {
      render(<KPI title="Population" value={1234567890} />);
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });
  });

  // 10. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(<KPI title="Test" value="123" className="my-custom-class" data-testid="kpi" />);
      const element = screen.getByTestId('kpi');
      expect(element).toHaveClass('my-custom-class');
    });

    it('accepts custom style prop', () => {
      render(<KPI title="Test" value="123" style={{ backgroundColor: 'red' }} data-testid="kpi" />);
      const element = screen.getByTestId('kpi');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts additional data attributes', () => {
      render(<KPI title="Test" value="123" data-testid="kpi" data-custom-attr="custom-value" />);
      const element = screen.getByTestId('kpi');
      expect(element).toHaveAttribute('data-custom-attr', 'custom-value');
    });
  });
});
