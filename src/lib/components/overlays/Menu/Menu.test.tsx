import { render, screen, fireEvent } from '@testing-library/react';
import { Menu, MenuList, MenuItem, MenuDivider, MenuGroup } from './';
import { Button } from '../../buttons/Button';

describe('Menu', () => {
  const TestMenu = ({
    isOpen = true,
    onSelectionChange = jest.fn(),
    selectionMode = 'none' as const,
  }) => (
    <Menu
      trigger={<Button>Menu</Button>}
      isOpen={isOpen}
      selectionMode={selectionMode}
      onSelectionChange={onSelectionChange}
    >
      <MenuList>
        <MenuItem itemKey="item-1">Item 1</MenuItem>
        <MenuItem itemKey="item-2">Item 2</MenuItem>
        <MenuItem itemKey="item-3" disabled>
          Item 3 (Disabled)
        </MenuItem>
      </MenuList>
    </Menu>
  );

  describe('rendering', () => {
    it('should render menu items when open', () => {
      render(<TestMenu />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3 (Disabled)')).toBeInTheDocument();
    });

    it('should not render menu when closed', () => {
      render(<TestMenu isOpen={false} />);

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('should render trigger', () => {
      render(<TestMenu />);

      expect(screen.getByText('Menu')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('should handle single selection', () => {
      const onSelectionChange = jest.fn();
      render(<TestMenu selectionMode="single" onSelectionChange={onSelectionChange} />);

      fireEvent.click(screen.getByText('Item 1'));

      expect(onSelectionChange).toHaveBeenCalledWith(['item-1']);
    });

    it('should handle multi selection', () => {
      const onSelectionChange = jest.fn();
      render(<TestMenu selectionMode="multi" onSelectionChange={onSelectionChange} />);

      fireEvent.click(screen.getByText('Item 1'));
      expect(onSelectionChange).toHaveBeenCalledWith(['item-1']);

      fireEvent.click(screen.getByText('Item 2'));
      expect(onSelectionChange).toHaveBeenCalledWith(['item-1', 'item-2']);
    });

    it('should not select disabled items', () => {
      const onSelectionChange = jest.fn();
      render(<TestMenu selectionMode="single" onSelectionChange={onSelectionChange} />);

      fireEvent.click(screen.getByText('Item 3 (Disabled)'));

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('MenuDivider', () => {
    it('should render divider', () => {
      render(
        <Menu trigger={<Button>Menu</Button>} isOpen>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
            <MenuDivider />
            <MenuItem itemKey="2">Item 2</MenuItem>
          </MenuList>
        </Menu>
      );

      expect(screen.getByTestId('menu-divider')).toBeInTheDocument();
    });
  });

  describe('MenuGroup', () => {
    it('should render group with label', () => {
      render(
        <Menu trigger={<Button>Menu</Button>} isOpen>
          <MenuList>
            <MenuGroup label="Group 1">
              <MenuItem itemKey="1">Item 1</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      );

      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper role attributes', () => {
      render(<TestMenu />);

      // Menu is rendered in a portal, use testid to find it
      const menu = screen.getByTestId('menu-list');
      expect(menu).toHaveAttribute('role', 'menu');

      // Menu items should have menuitem role
      const menuItems = screen.getAllByRole('menuitem', { hidden: true });
      expect(menuItems).toHaveLength(3);
    });

    it('should have disabled attribute on disabled items', () => {
      render(<TestMenu />);

      const disabledItem = screen
        .getByText('Item 3 (Disabled)')
        .closest('[data-component="menu-item"]');
      expect(disabledItem).toHaveAttribute('data-disabled', 'true');
    });
  });
});
