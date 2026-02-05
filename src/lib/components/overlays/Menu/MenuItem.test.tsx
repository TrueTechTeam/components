import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MenuItem } from './MenuItem';
import { useMenuContext } from './MenuContext';

jest.mock('./MenuContext', () => ({
  useMenuContext: jest.fn(),
}));

const mockedUseMenuContext = useMenuContext as jest.MockedFunction<typeof useMenuContext>;

describe('MenuItem', () => {
  afterEach(() => {
    jest.useRealTimers();
    mockedUseMenuContext.mockReset();
    jest.restoreAllMocks(); // restore any stubbed globals like scrollIntoView
  });

  it('renders children and default attributes', () => {
    mockedUseMenuContext.mockReturnValue({
      selectedKeys: new Set<string>(),
      toggleSelection: jest.fn(),
      selectionMode: 'none',
      focusedIndex: undefined,
      registerItem: jest.fn(() => 0),
      scrollToSelected: false,
      enableTypeAhead: false,
      registerItemLabel: jest.fn(),
    } as any);

    render(<MenuItem itemKey="a">Item A</MenuItem>);
    const el = screen.getByRole('menuitem');
    expect(el).toBeInTheDocument();
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(el).toHaveAttribute('data-testid', 'menu-item-a');
  });

  it('handles click - toggles selection and calls onClick', () => {
    const toggleSelection = jest.fn();
    const onClick = jest.fn();
    mockedUseMenuContext.mockReturnValue({
      selectedKeys: new Set<string>(),
      toggleSelection,
      selectionMode: 'single',
      focusedIndex: undefined,
      registerItem: jest.fn(() => 0),
      scrollToSelected: false,
      enableTypeAhead: false,
      registerItemLabel: jest.fn(),
    } as any);

    render(
      <MenuItem itemKey="sel" onClick={onClick}>
        Select me
      </MenuItem>
    );

    fireEvent.click(screen.getByTestId('menu-item-sel'));
    expect(toggleSelection).toHaveBeenCalledWith('sel');
    expect(onClick).toHaveBeenCalled();
  });

  it('does nothing when disabled', () => {
    const toggleSelection = jest.fn();
    const onClick = jest.fn();
    mockedUseMenuContext.mockReturnValue({
      selectedKeys: new Set<string>(),
      toggleSelection,
      selectionMode: 'single',
      focusedIndex: undefined,
      registerItem: jest.fn(() => 0),
      scrollToSelected: false,
      enableTypeAhead: false,
      registerItemLabel: jest.fn(),
    } as any);

    render(
      <MenuItem itemKey="d" disabled onClick={onClick}>
        Disabled
      </MenuItem>
    );

    const el = screen.getByTestId('menu-item-d');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveAttribute('tabindex', '-1'); // explicitly expect -1 when disabled
    fireEvent.click(el);
    expect(toggleSelection).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders startIcon, endIcon and shortcut', () => {
    mockedUseMenuContext.mockReturnValue({
      selectedKeys: new Set<string>(),
      toggleSelection: jest.fn(),
      selectionMode: 'none',
      focusedIndex: undefined,
      registerItem: jest.fn(() => 0),
      scrollToSelected: false,
      enableTypeAhead: false,
      registerItemLabel: jest.fn(),
    } as any);

    render(
      <MenuItem
        itemKey="icons"
        startIcon="check"
        endIcon={<span data-testid="end">E</span>}
        shortcut="Ctrl+S"
      >
        With Icons
      </MenuItem>
    );

    expect(screen.getByText('With Icons')).toBeInTheDocument();
    expect(screen.getByTestId('end')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
  });

  it('registers label for type-ahead', () => {
    jest.useFakeTimers();
    const registerItem = jest.fn(() => 5);
    const registerItemLabel = jest.fn();
    mockedUseMenuContext.mockReturnValue({
      selectedKeys: new Set<string>(),
      toggleSelection: jest.fn(),
      selectionMode: 'none',
      focusedIndex: undefined,
      registerItem,
      scrollToSelected: false,
      enableTypeAhead: true,
      registerItemLabel,
    } as any);

    render(<MenuItem itemKey="ta">TypeAhead</MenuItem>);
    // run the scheduled setTimeout in useEffect
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(registerItem).toHaveBeenCalled();
    expect(registerItemLabel).toHaveBeenCalledWith(5, 'TypeAhead');
  });

  it('scrolls selected item into view when scrollToSelected=true', () => {
    jest.useFakeTimers();
    const registerItem = jest.fn(() => 2);
    const selectedKeys = new Set(['sel']);
    mockedUseMenuContext.mockReturnValue({
      selectedKeys,
      toggleSelection: jest.fn(),
      selectionMode: 'single',
      focusedIndex: undefined,
      registerItem,
      scrollToSelected: true,
      enableTypeAhead: false,
      registerItemLabel: jest.fn(),
    } as any);

    // Stub scrollIntoView to avoid TypeError in JSDOM
    jest.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {});

    render(<MenuItem itemKey="sel">Scroll Item</MenuItem>);
    const el = screen.getByTestId('menu-item-sel') as HTMLElement;

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(el.scrollIntoView).toHaveBeenCalled();
  });

  it('sets data-focused when focusedIndex matches item index', () => {
    jest.useFakeTimers();
    const registerItem = jest.fn(() => 3);
    // Stub scrollIntoView to avoid TypeError in JSDOM
    jest.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {});
    mockedUseMenuContext.mockReturnValue({
      selectedKeys: new Set<string>(),
      toggleSelection: jest.fn(),
      selectionMode: 'none',
      focusedIndex: 3,
      registerItem,
      scrollToSelected: false,
      enableTypeAhead: false,
      registerItemLabel: jest.fn(),
    } as any);

    render(<MenuItem itemKey="f">Focus me</MenuItem>);
    act(() => {
      jest.runOnlyPendingTimers();
    });

    const el = screen.getByTestId('menu-item-f');
    expect(el).toHaveAttribute('data-focused', 'true');
  });
});
