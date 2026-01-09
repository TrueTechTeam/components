import { render, screen } from '@testing-library/react';
import { Portal } from './Portal';

describe('Portal', () => {
  afterEach(() => {
    // Clean up portal containers after each test
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  describe('rendering', () => {
    it('should render children in portal', () => {
      render(
        <Portal>
          <div data-testid="portal-content">Portal Content</div>
        </Portal>
      );

      expect(screen.getByTestId('portal-content')).toBeInTheDocument();
      expect(screen.getByText('Portal Content')).toBeInTheDocument();
    });

    it('should render in portal-root by default', () => {
      render(
        <Portal>
          <div data-testid="portal-content">Portal Content</div>
        </Portal>
      );

      const portalRoot = document.getElementById('portal-root');
      expect(portalRoot).toBeInTheDocument();
      expect(portalRoot).toContainElement(screen.getByTestId('portal-content'));
    });

    it('should render in custom container', () => {
      render(
        <Portal containerId="custom-portal">
          <div data-testid="portal-content">Portal Content</div>
        </Portal>
      );

      const customPortal = document.getElementById('custom-portal');
      expect(customPortal).toBeInTheDocument();
      expect(customPortal).toContainElement(screen.getByTestId('portal-content'));
    });
  });

  describe('multiple portals', () => {
    it('should reuse same container for multiple portals', () => {
      render(
        <>
          <Portal>
            <div data-testid="portal-1">Content 1</div>
          </Portal>
          <Portal>
            <div data-testid="portal-2">Content 2</div>
          </Portal>
        </>
      );

      const portalRoot = document.getElementById('portal-root');
      expect(portalRoot).toBeInTheDocument();
      expect(portalRoot).toContainElement(screen.getByTestId('portal-1'));
      expect(portalRoot).toContainElement(screen.getByTestId('portal-2'));
    });
  });
});
