import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Panes } from './Panes';
import { Pane } from './Pane';

jest.mock('../../../hooks', () => ({
  useResizeObserver: jest.fn(),
}));

const { useResizeObserver } = require('../../../hooks');

describe('Panes and Pane', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders panes and responds to width changes (visible/hide)', async () => {
    // Start with a wide container so all panes fit
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 1000,
      height: 0,
      element: null,
    });

    const onVisiblePanesChange = jest.fn();
    const onPaneHidden = jest.fn();

    const { rerender } = render(
      <Panes gap={16} onVisiblePanesChange={onVisiblePanesChange} onPaneHidden={onPaneHidden}>
        <Pane id="p1" minWidth={300}>
          Left
        </Pane>
        <Pane id="p2" minWidth={300}>
          Middle
        </Pane>
        <Pane id="p3" minWidth={300}>
          Right
        </Pane>
      </Panes>
    );

    // All panes should be visible initially (order preserved)
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Middle')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();

    // Shrink container so only one pane fits -> simulate by changing mock return
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 320,
      height: 0,
      element: null,
    });

    rerender(
      <Panes gap={16} onVisiblePanesChange={onVisiblePanesChange} onPaneHidden={onPaneHidden}>
        <Pane id="p1" minWidth={300}>
          Left
        </Pane>
        <Pane id="p2" minWidth={300}>
          Middle
        </Pane>
        <Pane id="p3" minWidth={300}>
          Right
        </Pane>
      </Panes>
    );

    // Wait for the visibility changes to take effect
    await waitFor(() => {
      // Only the highest-priority pane (last child) should remain
      expect(screen.queryByText('Left')).toBeNull();
      expect(screen.queryByText('Middle')).toBeNull();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    // onPaneHidden should have been called for panes that were hidden (p1 and p2)
    expect(onPaneHidden).toHaveBeenCalled();
    const hiddenIds = onPaneHidden.mock.calls.map((c: any[]) => c[0]);
    expect(hiddenIds).toEqual(expect.arrayContaining(['p1', 'p2']));

    // onVisiblePanesChange should have been called when visibility changed
    expect(onVisiblePanesChange).toHaveBeenCalled();
  });

  it('hides all panes when container is below minContainerWidth', async () => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 1000,
      height: 0,
      element: null,
    });

    const { rerender } = render(
      <Panes minContainerWidth={200} gap={16}>
        <Pane id="p1" minWidth={200}>
          A
        </Pane>
      </Panes>
    );

    expect(screen.getByText('A')).toBeInTheDocument();

    // set width below minContainerWidth
    (useResizeObserver as jest.Mock).mockReturnValue({
      ref: jest.fn(),
      width: 100,
      height: 0,
      element: null,
    });
    rerender(
      <Panes minContainerWidth={200} gap={16}>
        <Pane id="p1" minWidth={200}>
          A
        </Pane>
      </Panes>
    );

    await waitFor(() => {
      expect(screen.queryByText('A')).toBeNull();
    });
  });
});
