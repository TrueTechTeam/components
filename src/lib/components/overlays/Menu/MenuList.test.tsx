import React from 'react';
import { render, screen } from '@testing-library/react';
import { MenuList } from './MenuList';

describe('MenuList', () => {
  it('renders children and has role=menu', () => {
    render(
      <MenuList>
        <li>Item</li>
      </MenuList>
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('supports custom className and data-testid', () => {
    render(
      <MenuList className="custom" data-testid="my-list">
        <li>Item</li>
      </MenuList>
    );
    const el = screen.getByTestId('my-list');
    expect(el).toHaveClass('custom');
  });
});
