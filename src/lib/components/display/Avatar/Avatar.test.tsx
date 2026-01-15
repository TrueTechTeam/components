import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Avatar data-testid="test-avatar" />);
      expect(screen.getByTestId('test-avatar')).toBeInTheDocument();
    });

    it('renders with image src', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="Test User" />);
      const img = screen.getByRole('img', { name: 'Test User' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('renders with initials', () => {
      render(<Avatar initials="JD" data-testid="test-avatar" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders with fallback content', () => {
      render(<Avatar fallback={<span>Fallback</span>} data-testid="test-avatar" />);
      expect(screen.getByText('Fallback')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <Avatar
          src="https://example.com/avatar.jpg"
          alt="Test User"
          size="lg"
          variant="rounded"
          status="online"
          className="custom-class"
          data-testid="test-avatar"
        />
      );

      const element = screen.getByTestId('test-avatar');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders circular variant by default', () => {
      render(<Avatar data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-variant', 'circular');
    });

    it('renders rounded variant', () => {
      render(<Avatar variant="rounded" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-variant', 'rounded');
    });

    it('renders square variant', () => {
      render(<Avatar variant="square" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-variant', 'square');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<Avatar data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders xs size', () => {
      render(<Avatar size="xs" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-size', 'xs');
    });

    it('renders small size', () => {
      render(<Avatar size="sm" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders large size', () => {
      render(<Avatar size="lg" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-size', 'lg');
    });

    it('renders xl size', () => {
      render(<Avatar size="xl" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-size', 'xl');
    });
  });

  // 4. Status tests
  describe('status', () => {
    it('renders without status indicator by default', () => {
      render(<Avatar data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).not.toHaveAttribute('data-has-status');
    });

    it('renders online status', () => {
      render(<Avatar status="online" data-testid="test-avatar" />);
      const statusElement = screen.getByLabelText('Status: online');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveAttribute('data-status', 'online');
    });

    it('renders offline status', () => {
      render(<Avatar status="offline" data-testid="test-avatar" />);
      const statusElement = screen.getByLabelText('Status: offline');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveAttribute('data-status', 'offline');
    });

    it('renders away status', () => {
      render(<Avatar status="away" data-testid="test-avatar" />);
      const statusElement = screen.getByLabelText('Status: away');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveAttribute('data-status', 'away');
    });

    it('renders busy status', () => {
      render(<Avatar status="busy" data-testid="test-avatar" />);
      const statusElement = screen.getByLabelText('Status: busy');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveAttribute('data-status', 'busy');
    });

    it('adds data-has-status attribute when status is present', () => {
      render(<Avatar status="online" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-has-status', 'true');
    });
  });

  // 5. Content priority tests
  describe('content priority', () => {
    it('shows image when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="Test" initials="JD" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.queryByText('JD')).not.toBeInTheDocument();
    });

    it('shows initials when src is not provided', () => {
      render(<Avatar initials="JD" fallback={<span>Fallback</span>} />);
      expect(screen.getByText('JD')).toBeInTheDocument();
      expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
    });

    it('shows fallback when neither src nor initials are provided', () => {
      render(<Avatar fallback={<span>Fallback</span>} />);
      expect(screen.getByText('Fallback')).toBeInTheDocument();
    });

    it('shows initials when image fails to load', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="Test" initials="JD" />);
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows fallback when image fails to load and no initials', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="Test" fallback={<span>FB</span>} />);
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(screen.getByText('FB')).toBeInTheDocument();
    });
  });

  // 6. Accessibility tests
  describe('accessibility', () => {
    it('has correct ARIA label when provided', () => {
      render(<Avatar aria-label="User avatar" />);
      expect(screen.getByLabelText('User avatar')).toBeInTheDocument();
    });

    it('includes data-component attribute', () => {
      render(<Avatar data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveAttribute('data-component', 'avatar');
    });

    it('image has alt text', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="John Doe" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'John Doe');
    });

    it('status indicator has aria-label', () => {
      render(<Avatar status="online" data-testid="test-avatar" />);
      const statusElement = screen.getByLabelText('Status: online');
      expect(statusElement).toBeInTheDocument();
    });
  });

  // 7. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Avatar ref={ref} data-testid="test-avatar" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-testid', 'test-avatar');
    });
  });

  // 8. Image error handling
  describe('image error handling', () => {
    it('handles image load error gracefully', () => {
      render(
        <Avatar
          src="https://example.com/invalid.jpg"
          alt="Test"
          initials="TD"
          data-testid="test-avatar"
        />
      );

      const img = screen.getByRole('img');
      fireEvent.error(img);

      // Image should no longer be visible
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      // Initials should be shown
      expect(screen.getByText('TD')).toBeInTheDocument();
    });
  });

  // 9. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(<Avatar className="custom-avatar" data-testid="test-avatar" />);
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveClass('custom-avatar');
    });

    it('accepts custom style prop', () => {
      render(
        <Avatar
          style={{ '--avatar-bg': '#ff0000' } as React.CSSProperties}
          data-testid="test-avatar"
        />
      );
      const element = screen.getByTestId('test-avatar');
      expect(element).toHaveStyle({ '--avatar-bg': '#ff0000' });
    });
  });
});
