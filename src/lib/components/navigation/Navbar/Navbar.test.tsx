import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { NavbarBrand } from './NavbarBrand';
import { NavbarNav } from './NavbarNav';
import { NavbarActions } from './NavbarActions';
import { NavbarToggle } from './NavbarToggle';
import { NavbarCollapse } from './NavbarCollapse';

describe('Navbar', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(
        <Navbar data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
        </Navbar>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
    });

    it('should render with all compound components', () => {
      render(
        <Navbar>
          <NavbarBrand data-testid="brand">Brand</NavbarBrand>
          <NavbarNav data-testid="nav">
            <a href="/example">Link</a>
          </NavbarNav>
          <NavbarActions data-testid="actions">
            <button>Action</button>
          </NavbarActions>
        </Navbar>
      );

      expect(screen.getByTestId('brand')).toBeInTheDocument();
      expect(screen.getByTestId('nav')).toBeInTheDocument();
      expect(screen.getByTestId('actions')).toBeInTheDocument();
    });

    it('should apply variant data attribute', () => {
      render(
        <Navbar variant="blur" data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
        </Navbar>
      );

      expect(screen.getByTestId('navbar')).toHaveAttribute('data-variant', 'blur');
    });

    it('should apply position data attribute', () => {
      render(
        <Navbar position="fixed" data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
        </Navbar>
      );

      expect(screen.getByTestId('navbar')).toHaveAttribute('data-position', 'fixed');
    });

    it('should apply size data attribute', () => {
      render(
        <Navbar size="lg" data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
        </Navbar>
      );

      expect(screen.getByTestId('navbar')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('NavbarBrand', () => {
    it('should render as a link when href is provided', () => {
      render(
        <Navbar>
          <NavbarBrand href="/">Brand</NavbarBrand>
        </Navbar>
      );

      const brand = screen.getByText('Brand');
      expect(brand.tagName).toBe('A');
      expect(brand).toHaveAttribute('href', '/');
    });

    it('should render as a div when no href is provided', () => {
      render(
        <Navbar>
          <NavbarBrand data-testid="brand">Brand</NavbarBrand>
        </Navbar>
      );

      const brand = screen.getByTestId('brand');
      expect(brand.tagName).toBe('DIV');
    });

    it('should call onClick handler', () => {
      const handleClick = jest.fn();
      render(
        <Navbar>
          <NavbarBrand onClick={handleClick}>Brand</NavbarBrand>
        </Navbar>
      );

      fireEvent.click(screen.getByText('Brand'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('mobile toggle', () => {
    beforeEach(() => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      window.dispatchEvent(new Event('resize'));
    });

    it('should toggle expanded state', () => {
      const handleExpandedChange = jest.fn();
      render(
        <Navbar onExpandedChange={handleExpandedChange} collapseBreakpoint={768}>
          <NavbarBrand>Brand</NavbarBrand>
          <NavbarToggle data-testid="toggle" />
          <NavbarCollapse>Content</NavbarCollapse>
        </Navbar>
      );

      const toggle = screen.getByTestId('toggle');
      fireEvent.click(toggle);

      expect(handleExpandedChange).toHaveBeenCalledWith(true);
    });

    it('should have correct aria attributes on toggle', () => {
      render(
        <Navbar>
          <NavbarBrand>Brand</NavbarBrand>
          <NavbarToggle data-testid="toggle" />
          <NavbarCollapse>Content</NavbarCollapse>
        </Navbar>
      );

      const toggle = screen.getByTestId('toggle');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveAttribute('aria-controls');
    });
  });

  describe('controlled mode', () => {
    it('should use controlled expanded state', () => {
      const { rerender } = render(
        <Navbar expanded={false} data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
          <NavbarToggle />
          <NavbarCollapse data-testid="collapse">Content</NavbarCollapse>
        </Navbar>
      );

      expect(screen.getByTestId('collapse')).not.toHaveAttribute('data-expanded');

      rerender(
        <Navbar expanded data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
          <NavbarToggle />
          <NavbarCollapse data-testid="collapse">Content</NavbarCollapse>
        </Navbar>
      );

      expect(screen.getByTestId('collapse')).toHaveAttribute('data-expanded', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have navigation role', () => {
      render(
        <Navbar data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
        </Navbar>
      );

      expect(screen.getByTestId('navbar')).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should allow custom aria-label', () => {
      render(
        <Navbar aria-label="Site navigation" data-testid="navbar">
          <NavbarBrand>Brand</NavbarBrand>
        </Navbar>
      );

      expect(screen.getByTestId('navbar')).toHaveAttribute('aria-label', 'Site navigation');
    });
  });
});
