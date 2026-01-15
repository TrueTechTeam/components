import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPI } from './KPI';

describe('KPI', () => {
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
  });

  describe('variants', () => {
    it.each(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const)(
      'renders %s variant',
      (variant) => {
        const { container } = render(<KPI title="Test" value="123" variant={variant} />);
        const kpi = container.querySelector('[data-component="kpi"]');
        expect(kpi).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('renders %s size', (size) => {
      const { container } = render(<KPI title="Test" value="123" size={size} />);
      const kpi = container.querySelector('[data-component="kpi"]');
      expect(kpi).toHaveAttribute('data-size', size);
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<KPI ref={ref} title="Test" value="123" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
