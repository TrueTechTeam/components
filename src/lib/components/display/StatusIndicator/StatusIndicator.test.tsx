import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusIndicator } from './StatusIndicator';

describe('StatusIndicator', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<StatusIndicator data-testid="indicator" />);
      expect(screen.getByTestId('indicator')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <StatusIndicator
          status="success"
          size="lg"
          pulse
          withText
          className="custom-class"
          data-testid="test-indicator"
        >
          Online
        </StatusIndicator>
      );

      const element = screen.getByTestId('test-indicator');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders without text when withText is false', () => {
      render(<StatusIndicator>Hidden Text</StatusIndicator>);
      expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
    });

    it('renders with text when withText is true', () => {
      render(<StatusIndicator withText>Visible Text</StatusIndicator>);
      expect(screen.getByText('Visible Text')).toBeInTheDocument();
    });

    it('renders children correctly when withText is true', () => {
      render(
        <StatusIndicator withText>
          <span>Status: Active</span>
        </StatusIndicator>
      );

      expect(screen.getByText('Status: Active')).toBeInTheDocument();
    });
  });

  // 2. Status tests
  describe('status variants', () => {
    it('renders neutral status by default', () => {
      render(<StatusIndicator data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'neutral');
    });

    it('renders success status', () => {
      render(<StatusIndicator status="success" data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'success');
    });

    it('renders warning status', () => {
      render(<StatusIndicator status="warning" data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'warning');
    });

    it('renders error status', () => {
      render(<StatusIndicator status="error" data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'error');
    });

    it('renders info status', () => {
      render(<StatusIndicator status="info" data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'info');
    });

    it('renders processing status', () => {
      render(<StatusIndicator status="processing" data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'processing');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<StatusIndicator data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders small size', () => {
      render(<StatusIndicator size="sm" data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      render(<StatusIndicator size="lg" data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. State tests
  describe('states', () => {
    it('does not add pulse attribute by default', () => {
      render(<StatusIndicator data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).not.toHaveAttribute('data-pulse');
    });

    it('adds pulse attribute when pulse is true', () => {
      render(<StatusIndicator pulse data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-pulse', 'true');
    });

    it('does not add with-text attribute by default', () => {
      render(<StatusIndicator data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).not.toHaveAttribute('data-with-text');
    });

    it('adds with-text attribute when withText is true', () => {
      render(
        <StatusIndicator withText data-testid="indicator">
          Text
        </StatusIndicator>
      );
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-with-text', 'true');
    });
  });

  // 5. Combined tests
  describe('combinations', () => {
    it('renders processing status with pulse animation', () => {
      render(<StatusIndicator status="processing" pulse data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'processing');
      expect(element).toHaveAttribute('data-pulse', 'true');
    });

    it('renders error status with text', () => {
      render(
        <StatusIndicator status="error" withText data-testid="indicator">
          Error occurred
        </StatusIndicator>
      );
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'error');
      expect(element).toHaveAttribute('data-with-text', 'true');
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });

    it('renders large success indicator with text', () => {
      render(
        <StatusIndicator status="success" size="lg" withText data-testid="indicator">
          Completed
        </StatusIndicator>
      );
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-status', 'success');
      expect(element).toHaveAttribute('data-size', 'lg');
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  // 6. Accessibility tests
  describe('accessibility', () => {
    it('has correct ARIA label when provided', () => {
      render(<StatusIndicator aria-label="Status indicator" data-testid="indicator" />);
      expect(screen.getByLabelText('Status indicator')).toBeInTheDocument();
    });

    it('includes data-component attribute', () => {
      render(<StatusIndicator data-testid="indicator" />);
      const element = screen.getByTestId('indicator');
      expect(element).toHaveAttribute('data-component', 'statusIndicator');
    });

    it('has aria-hidden on dot element', () => {
      const { container } = render(<StatusIndicator />);
      const dot = container.querySelector('.dot');
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // 7. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<StatusIndicator ref={ref} data-testid="indicator" />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveAttribute('data-testid', 'indicator');
    });
  });
});
