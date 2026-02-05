import React from 'react';
import { render, screen } from '@testing-library/react';
import { MasonryLayout } from './MasonryLayout';

jest.mock('../../../hooks', () => ({
  useResizeObserver: jest.fn(),
}));

const { useResizeObserver } = require('../../../hooks');

describe('MasonryLayout', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders children and sets columns attribute', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 1000,
      height: 0,
      element: null,
    });

    render(
      <MasonryLayout columnWidth={250} gap={16}>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </MasonryLayout>
    );

    const container = screen.getByText('One').closest('[data-component="masonry-layout"]');
    expect(container).toHaveAttribute('data-columns');
    expect(container).toHaveAttribute('data-columns', '3');

    // Each child should be wrapped in the masonry item with a data-index
    const items = container?.querySelectorAll('[data-index]');
    expect(items?.length).toBe(3);

    // Check computed width on the first item
    const first = items?.[0] as HTMLElement;
    expect(first).toBeTruthy();
    const columns = 3;
    const gap = 16;
    const containerWidth = 1000;
    const expectedWidth = (containerWidth - (columns - 1) * gap) / columns;

    // style.width is set as px by React when a number is provided
    expect(parseFloat(first.style.width || '0')).toBeCloseTo(expectedWidth, 1);
  });
});
