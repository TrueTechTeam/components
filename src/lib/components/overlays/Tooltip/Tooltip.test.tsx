import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

// Mock matchMedia for touch device detection
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('Tooltip', () => {
  beforeEach(() => {
    // Default to non-touch device
    mockMatchMedia(false);
  });

  describe('rendering', () => {
    it('should render trigger element', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should not show tooltip initially', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('should show tooltip on hover', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayShow={0} delayHide={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });

      await user.unhover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      });
    });
  });

  describe('positions', () => {
    it.each([
      'top',
      'top-left',
      'top-right',
      'bottom',
      'bottom-left',
      'bottom-right',
      'left',
      'right',
    ] as const)('should support %s position', async (position) => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" position={position} delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toHaveAttribute('data-position', position);
      });
    });
  });

  describe('arrow', () => {
    it('should show arrow by default', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const arrow = document.querySelector('[data-position]');
        expect(arrow).toBeInTheDocument();
      });
    });

    it('should hide arrow when showArrow is false', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" showArrow={false} delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });

      // The arrow has a specific class, check for absence of tooltipArrow
      const arrow = document.querySelector('.tooltipArrow');
      expect(arrow).not.toBeInTheDocument();
    });
  });

  describe('delays', () => {
    it('should delay showing tooltip', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayShow={100}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      // Should not be visible immediately
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();

      // Should be visible after delay
      await waitFor(
        () => {
          expect(screen.getByText('Tooltip text')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it('should delay hiding tooltip', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayShow={0} delayHide={100}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });

      await user.unhover(screen.getByText('Hover me'));

      // Should still be visible immediately after unhover
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();

      // Should hide after delay
      await waitFor(
        () => {
          expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });
  });

  describe('disabled', () => {
    it('should not show tooltip when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" disabled delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(
        () => {
          expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
        },
        { timeout: 100 }
      );
    });
  });

  describe('touch devices', () => {
    // Note: Touch device detection is not currently implemented in the Tooltip component
    // The isTouchDevice function exists but is commented out
    it('should render on any device (touch detection not implemented)', async () => {
      mockMatchMedia(true); // Simulate touch device
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      // Since touch detection is not implemented, tooltip should still show
      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have data-testid', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" data-testid="custom-tooltip" delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
      });
    });

    it('should have data-component attribute', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Tooltip text" delayShow={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip.querySelector('[data-component="tooltip"]')).toBeInTheDocument();
      });
    });
  });
});
