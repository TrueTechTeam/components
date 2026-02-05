import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleSidebar } from './CollapsibleSidebar';

jest.mock('../../../hooks', () => ({ useResizeObserver: jest.fn() }));
const { useResizeObserver } = require('../../../hooks');

describe('CollapsibleSidebar', () => {
  beforeEach(() => jest.resetAllMocks());

  it('toggles collapsed state via button and calls onCollapsedChange', () => {
    const onCollapsedChange = jest.fn();
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 1000,
      height: 0,
      element: null,
    });

    render(
      <CollapsibleSidebar onCollapsedChange={onCollapsedChange}>
        <div>Content</div>
      </CollapsibleSidebar>
    );

    const btn = screen.getByRole('button', { name: /Collapse sidebar|Expand sidebar/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);

    expect(onCollapsedChange).toHaveBeenCalled();
    // collapsed attribute toggled on container
    const el = document.querySelector('[data-component="collapsible-sidebar"]');
    expect(el).toBeTruthy();

    // click again to expand back
    fireEvent.click(btn);
    expect(onCollapsedChange).toHaveBeenCalledTimes(2);
  });

  it('auto-hides when parent width below hideBreakpoint', () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 1000,
      height: 0,
      element: null,
    });

    const { rerender } = render(
      <div>
        <CollapsibleSidebar hideBreakpoint={400}>
          <div>Inside</div>
        </CollapsibleSidebar>
      </div>
    );

    expect(screen.getByText('Inside')).toBeInTheDocument();

    // now simulate small parent width
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 200,
      height: 0,
      element: null,
    });

    rerender(
      <div>
        <CollapsibleSidebar hideBreakpoint={400}>
          <div>Inside</div>
        </CollapsibleSidebar>
      </div>
    );

    expect(document.querySelector('[data-component="collapsible-sidebar"]')).toBeNull();
  });
});
