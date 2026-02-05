import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdaptiveGrid } from './AdaptiveGrid';

jest.mock('../../../hooks', () => ({
  useResizeObserver: jest.fn(),
}));

const { useResizeObserver } = require('../../../hooks');

describe('AdaptiveGrid', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders children', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 1000,
      height: 0,
      element: null,
    });
    render(
      <AdaptiveGrid minItemWidth={200} gap={16}>
        <div>Card 1</div>
        <div>Card 2</div>
      </AdaptiveGrid>
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('calculates column count based on width and minItemWidth', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 500,
      height: 0,
      element: null,
    });

    render(
      <AdaptiveGrid minItemWidth={200} gap={16}>
        <div>Item</div>
      </AdaptiveGrid>
    );

    const container = screen.getByText('Item').closest('[data-component="adaptive-grid"]');
    expect(container).toHaveAttribute('data-columns');
    // With width 500, minItemWidth 200 and gap 16 => (500 + 16) / (200 + 16) ≈ 2.4 => floor = 2
    expect(container).toHaveAttribute('data-columns', '2');
  });

  it('respects maxColumns and minColumns', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 2000,
      height: 0,
      element: null,
    });

    render(
      <AdaptiveGrid minItemWidth={200} gap={16} maxColumns={3} minColumns={2}>
        <div>Item</div>
      </AdaptiveGrid>
    );

    const container = screen.getByText('Item').closest('[data-component="adaptive-grid"]');
    expect(container).toHaveAttribute('data-columns', '3');
  });
});
