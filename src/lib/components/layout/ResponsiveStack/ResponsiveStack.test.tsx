import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResponsiveStack } from './ResponsiveStack';

// Mock the hook
jest.mock('../../../hooks', () => ({
  useResizeObserver: jest.fn(),
}));

const { useResizeObserver } = require('../../../hooks');

describe('ResponsiveStack', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders children', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 1024,
      height: 0,
      element: null,
    });
    render(
      <ResponsiveStack>
        <div>One</div>
        <div>Two</div>
      </ResponsiveStack>
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('uses collapseDirection when width is below breakpoint', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 320,
      height: 0,
      element: null,
    });

    render(
      <ResponsiveStack breakpoint={600} direction="row" collapseDirection="column">
        <div>Item</div>
      </ResponsiveStack>
    );

    // The component should render and set collapsed direction
    const el = screen.getByText('Item').closest('[data-component="responsive-stack"]');
    expect(el).toBeTruthy();
    expect(el).toHaveAttribute('data-direction', 'column');
    expect(el).toHaveAttribute('data-collapsed', 'true');
  });

  it('uses direction when width is above breakpoint', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 800,
      height: 0,
      element: null,
    });

    render(
      <ResponsiveStack breakpoint={600} direction="row" collapseDirection="column">
        <div>Item</div>
      </ResponsiveStack>
    );

    const el = screen.getByText('Item').closest('[data-component="responsive-stack"]');
    expect(el).toHaveAttribute('data-direction', 'row');
    expect(el).not.toHaveAttribute('data-collapsed');
  });
});
