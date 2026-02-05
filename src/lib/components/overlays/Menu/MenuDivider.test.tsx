import React from 'react';
import { render, screen } from '@testing-library/react';
import { MenuDivider } from './MenuDivider';

describe('MenuDivider', () => {
  it('renders as separator', () => {
    render(<MenuDivider />);
    const el = screen.getByRole('separator');
    expect(el).toBeInTheDocument();
  });

  it('supports custom data-testid and className', () => {
    render(<MenuDivider data-testid="div" className="c" />);
    const el = screen.getByTestId('div');
    expect(el).toHaveClass('c');
  });
});
