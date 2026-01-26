import { render, screen, renderHook } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from './BreadcrumbItem';
import { useBreadcrumbsFromPath } from './useBreadcrumbsFromPath';

describe('Breadcrumbs', () => {
  describe('rendering', () => {
    it('should render with items prop', () => {
      render(
        <Breadcrumbs
          data-testid="breadcrumbs"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Electronics', current: true },
          ]}
        />
      );

      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('should render with compound API', () => {
      render(
        <Breadcrumbs data-testid="breadcrumbs">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Electronics</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('should apply size data attribute', () => {
      render(
        <Breadcrumbs
          size="lg"
          data-testid="breadcrumbs"
          items={[{ label: 'Home', href: '/' }]}
        />
      );

      expect(screen.getByTestId('breadcrumbs')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('collapse', () => {
    it('should collapse when maxItems is exceeded', () => {
      render(
        <Breadcrumbs
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
          items={[
            { label: 'Home', href: '/' },
            { label: 'Category', href: '/category' },
            { label: 'Subcategory', href: '/category/subcategory' },
            { label: 'Product', href: '/category/subcategory/product' },
            { label: 'Details', current: true },
          ]}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByText('Category')).not.toBeInTheDocument();
      expect(screen.queryByText('Subcategory')).not.toBeInTheDocument();
      expect(screen.queryByText('Product')).not.toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('should not collapse when items are within maxItems', () => {
      render(
        <Breadcrumbs
          maxItems={5}
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Electronics', current: true },
          ]}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
  });

  describe('BreadcrumbItem', () => {
    it('should render as link when href is provided', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      const item = screen.getByText('Home').closest('a');
      expect(item).toHaveAttribute('href', '/home');
    });

    it('should render as span when current', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem current>Current Page</BreadcrumbItem>
        </Breadcrumbs>
      );

      const item = screen.getByText('Current Page').closest('span');
      expect(item).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('accessibility', () => {
    it('should have navigation role with aria-label', () => {
      render(
        <Breadcrumbs data-testid="breadcrumbs" items={[{ label: 'Home', href: '/' }]} />
      );

      expect(screen.getByTestId('breadcrumbs')).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('should support custom aria-label', () => {
      render(
        <Breadcrumbs
          aria-label="Page navigation"
          data-testid="breadcrumbs"
          items={[{ label: 'Home', href: '/' }]}
        />
      );

      expect(screen.getByTestId('breadcrumbs')).toHaveAttribute('aria-label', 'Page navigation');
    });

    it('should hide separators from screen readers', () => {
      const { container } = render(
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', current: true },
          ]}
        />
      );

      const separator = container.querySelector('[data-component="breadcrumb-separator"]');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

describe('useBreadcrumbsFromPath', () => {
  it('should generate breadcrumbs from path', () => {
    const { result } = renderHook(() =>
      useBreadcrumbsFromPath({ path: '/products/electronics/phones' })
    );

    expect(result.current).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products', current: false },
      { label: 'Electronics', href: '/products/electronics', current: false },
      { label: 'Phones', href: '/products/electronics/phones', current: true },
    ]);
  });

  it('should use custom labels', () => {
    const { result } = renderHook(() =>
      useBreadcrumbsFromPath({
        path: '/users/123',
        labels: { users: 'All Users', '123': 'John Doe' },
      })
    );

    expect(result.current[1].label).toBe('All Users');
    expect(result.current[2].label).toBe('John Doe');
  });

  it('should exclude specified segments', () => {
    const { result } = renderHook(() =>
      useBreadcrumbsFromPath({
        path: '/(dashboard)/projects',
        excludeSegments: ['(dashboard)'],
      })
    );

    expect(result.current).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects', current: true },
    ]);
  });

  it('should transform labels by default', () => {
    const { result } = renderHook(() =>
      useBreadcrumbsFromPath({ path: '/user-settings/account-details' })
    );

    expect(result.current[1].label).toBe('User Settings');
    expect(result.current[2].label).toBe('Account Details');
  });

  it('should respect includeHome option', () => {
    const { result } = renderHook(() =>
      useBreadcrumbsFromPath({
        path: '/products',
        includeHome: false,
      })
    );

    expect(result.current[0].label).toBe('Products');
  });
});
