import { render } from '@testing-library/react';
import useBreadcrumbsFromPath from './useBreadcrumbsFromPath';

const TestComp = ({ path, opts = {} }: any) => {
  const crumbs = useBreadcrumbsFromPath({ path, ...opts });
  return <div data-crumbs={JSON.stringify(crumbs)} />;
};

describe('useBreadcrumbsFromPath', () => {
  it('generates breadcrumbs including home by default', () => {
    render(<TestComp path="/products/electronics/phones" />);
    // don't call getByTestId with an empty id — use the data attribute directly
    const node = document.querySelector('[data-crumbs]') as HTMLElement;
    const crumbs = JSON.parse(node.getAttribute('data-crumbs') || '[]');

    expect(crumbs[0].label).toBe('Home');
    expect(crumbs[crumbs.length - 1].current).toBe(true);
  });

  it('applies label mapping and excludes segments', () => {
    render(
      <TestComp
        path="/(auth)/users/123/settings"
        opts={{
          labels: { users: 'All Users', settings: 'Account Settings' },
          excludeSegments: ['(auth)'],
        }}
      />
    );

    const node = document.querySelector('[data-crumbs]') as HTMLElement;
    const crumbs = JSON.parse(node.getAttribute('data-crumbs') || '[]');

    expect(crumbs.some((c: any) => c.label === 'All Users')).toBe(true);
    expect(crumbs.some((c: any) => c.label === 'Account Settings')).toBe(true);
  });
});
