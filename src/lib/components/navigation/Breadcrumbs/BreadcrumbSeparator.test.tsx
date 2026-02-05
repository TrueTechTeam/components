import React from 'react';
import { render, screen } from '@testing-library/react';
import { BreadcrumbSeparator } from './BreadcrumbSeparator';

describe('BreadcrumbSeparator', () => {
  it('renders default separator', () => {
    render(<BreadcrumbSeparator />);
    const sep = screen.getByText('/');
    expect(sep).toBeInTheDocument();
    const el = sep.closest('[data-component="breadcrumb-separator"]');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders custom children', () => {
    render(<BreadcrumbSeparator>›</BreadcrumbSeparator>);
    expect(screen.getByText('›')).toBeInTheDocument();
  });
});
