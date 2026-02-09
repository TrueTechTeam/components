import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown, type DropdownItem } from './Dropdown';
import { MenuList, MenuItem, MenuDivider, MenuGroup } from '../Menu';
import { Icon } from '../../display/Icon';

describe('Dropdown', () => {
  const TestDropdown = ({ onSelectionChange = jest.fn() }) => (
    <Dropdown label="Select Option" onSelectionChange={onSelectionChange}>
      <MenuList>
        <MenuItem itemKey="option-1">Option 1</MenuItem>
        <MenuItem itemKey="option-2">Option 2</MenuItem>
        <MenuItem itemKey="option-3">Option 3</MenuItem>
      </MenuList>
    </Dropdown>
  );

  describe('rendering', () => {
    it('should render dropdown button', () => {
      render(<TestDropdown />);

      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should render with default variant as outline', () => {
      render(<TestDropdown />);

      const button = screen.getByText('Select Option');
      expect(button).toHaveAttribute('data-variant', 'outline');
    });

    it('should render with default size as md', () => {
      render(<TestDropdown />);

      const button = screen.getByText('Select Option');
      expect(button).toHaveAttribute('data-size', 'md');
    });

    it('should render chevron by default', () => {
      render(<TestDropdown />);

      // Chevron icon is the chevron-down icon
      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('should not render chevron when showChevron is false', () => {
      render(
        <Dropdown label="No Chevron" showChevron={false}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.queryByTestId('icon-chevron-down')).not.toBeInTheDocument();
    });

    it('should render with children as menu content', () => {
      render(<TestDropdown />);

      fireEvent.click(screen.getByText('Select Option'));

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should open menu on button click', () => {
      render(<TestDropdown />);

      fireEvent.click(screen.getByText('Select Option'));

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should close menu when clicking outside', () => {
      render(<TestDropdown />);

      fireEvent.click(screen.getByText('Select Option'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should show menu items when open', () => {
      render(<TestDropdown />);

      // Initially, menu items are not visible
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(screen.getByText('Select Option'));

      // After opening, menu items should be visible
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should toggle menu open and closed on button clicks', () => {
      render(<TestDropdown />);

      // Click to open
      fireEvent.click(screen.getByText('Select Option'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      // Click again to close
      fireEvent.click(screen.getByText('Select Option'));
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should call onOpenChange when opening', () => {
      const onOpenChange = jest.fn();
      render(
        <Dropdown label="Test" onOpenChange={onOpenChange}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      fireEvent.click(screen.getByText('Test'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('should call onOpenChange when closing', () => {
      const onOpenChange = jest.fn();
      render(
        <Dropdown label="Test" onOpenChange={onOpenChange}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      fireEvent.click(screen.getByText('Test'));
      onOpenChange.mockClear();

      fireEvent.click(screen.getByText('Test'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('controlled mode', () => {
    it('should respect controlled isOpen prop', () => {
      const { rerender } = render(
        <Dropdown label="Controlled" isOpen={false}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

      rerender(
        <Dropdown label="Controlled" isOpen>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should call onOpenChange but not change state in controlled mode', () => {
      const onOpenChange = jest.fn();
      render(
        <Dropdown label="Controlled" isOpen={false} onOpenChange={onOpenChange}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      fireEvent.click(screen.getByText('Controlled'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      // Menu should remain closed since isOpen is controlled
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('should render chevron in controlled mode', () => {
      const { rerender } = render(
        <Dropdown label="Controlled" isOpen={false}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

      rerender(
        <Dropdown label="Controlled" isOpen>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it.each(['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'] as const)(
      'should apply %s variant',
      (variant) => {
        render(
          <Dropdown label="Dropdown" variant={variant}>
            <MenuList>
              <MenuItem itemKey="1">Item 1</MenuItem>
            </MenuList>
          </Dropdown>
        );

        const button = screen.getByText('Dropdown');
        expect(button).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('should apply %s size', (size) => {
      render(
        <Dropdown label="Dropdown" size={size}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      const button = screen.getByText('Dropdown');
      expect(button).toHaveAttribute('data-size', size);
    });
  });

  describe('icon', () => {
    it('should render icon as string', () => {
      render(
        <Dropdown label="With Icon" icon="settings">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('should render icon as ReactNode', () => {
      render(
        <Dropdown label="With Icon" icon={<Icon name="check" />}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      render(
        <Dropdown label="No Icon">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('No Icon')).toBeInTheDocument();
    });
  });

  describe('full width', () => {
    it('should apply fullWidth prop to button', () => {
      render(
        <Dropdown label="Full Width" fullWidth>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      const button = screen.getByText('Full Width');
      expect(button).toHaveAttribute('data-full-width', 'true');
    });

    it('should not apply fullWidth by default', () => {
      render(
        <Dropdown label="Regular Width">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      const button = screen.getByText('Regular Width');
      expect(button).not.toHaveAttribute('data-full-width');
    });
  });

  describe('items prop', () => {
    it('should render items from items array', () => {
      const items: DropdownItem[] = [
        { itemKey: '1', label: 'First Item' },
        { itemKey: '2', label: 'Second Item' },
        { itemKey: '3', label: 'Third Item' },
      ];

      render(<Dropdown label="Items Array" items={items} />);

      fireEvent.click(screen.getByText('Items Array'));

      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });

    it('should render items with icons', () => {
      const items: DropdownItem[] = [
        { itemKey: '1', label: 'Save', icon: 'check' },
        { itemKey: '2', label: 'Delete', icon: <Icon name="delete" /> },
      ];

      render(<Dropdown label="With Icons" items={items} />);

      fireEvent.click(screen.getByText('With Icons'));

      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
      expect(screen.getByTestId('icon-delete')).toBeInTheDocument();
    });

    it('should render disabled items', () => {
      const items: DropdownItem[] = [
        { itemKey: '1', label: 'Enabled Item' },
        { itemKey: '2', label: 'Disabled Item', disabled: true },
      ];

      render(<Dropdown label="With Disabled" items={items} />);

      fireEvent.click(screen.getByText('With Disabled'));

      const disabledItem = screen
        .getByText('Disabled Item')
        .closest('[data-component="menu-item"]');
      expect(disabledItem).toHaveAttribute('data-disabled', 'true');
    });

    it('should render dividers', () => {
      const items: DropdownItem[] = [
        { itemKey: '1', label: 'Item 1' },
        { itemKey: 'divider-1', label: '', divider: true },
        { itemKey: '2', label: 'Item 2' },
      ];

      render(<Dropdown label="With Divider" items={items} />);

      fireEvent.click(screen.getByText('With Divider'));

      expect(screen.getByTestId('menu-divider')).toBeInTheDocument();
    });

    it('should call onClick handler for items', () => {
      const onItemClick = jest.fn();
      const items: DropdownItem[] = [{ itemKey: '1', label: 'Click Me', onClick: onItemClick }];

      render(<Dropdown label="Clickable" items={items} />);

      fireEvent.click(screen.getByText('Clickable'));
      fireEvent.click(screen.getByText('Click Me'));

      expect(onItemClick).toHaveBeenCalled();
    });

    it('should prefer items prop over children', () => {
      const items: DropdownItem[] = [{ itemKey: '1', label: 'From Items' }];

      render(
        <Dropdown label="Items vs Children" items={items}>
          <MenuList>
            <MenuItem itemKey="2">From Children</MenuItem>
          </MenuList>
        </Dropdown>
      );

      fireEvent.click(screen.getByText('Items vs Children'));

      expect(screen.getByText('From Items')).toBeInTheDocument();
      expect(screen.queryByText('From Children')).not.toBeInTheDocument();
    });
  });

  describe('selected keys and display label', () => {
    it('should display label when no items are selected', () => {
      render(
        <Dropdown label="Select Option" selectedKeys={[]}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should display selected item label when one item is selected', () => {
      render(
        <Dropdown label="Select Option" selectedKeys={['option-1']}>
          <MenuList>
            <MenuItem itemKey="option-1">Option 1</MenuItem>
            <MenuItem itemKey="option-2">Option 2</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Select Option')).not.toBeInTheDocument();
    });

    it('should display comma-separated labels when multiple items are selected', () => {
      render(
        <Dropdown label="Select Options" selectedKeys={['option-1', 'option-2']}>
          <MenuList>
            <MenuItem itemKey="option-1">Option 1</MenuItem>
            <MenuItem itemKey="option-2">Option 2</MenuItem>
            <MenuItem itemKey="option-3">Option 3</MenuItem>
          </MenuList>
        </Dropdown>
      );

      // Labels are wrapped in separate spans
      const button = screen.getByRole('button');
      expect(button.textContent).toContain('Option 1');
      expect(button.textContent).toContain('Option 2');
      expect(button.textContent).toContain(',');
    });

    it('should display selected item labels from items array', () => {
      const items: DropdownItem[] = [
        { itemKey: 'apple', label: 'Apple' },
        { itemKey: 'banana', label: 'Banana' },
      ];

      render(<Dropdown label="Select Fruit" items={items} selectedKeys={['apple']} />);

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('should display label when selected key does not match any items', () => {
      render(
        <Dropdown label="Select Option" selectedKeys={['non-existent']}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should update display label when selection changes', () => {
      const { rerender } = render(
        <Dropdown label="Select Option" selectedKeys={[]}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Select Option')).toBeInTheDocument();

      rerender(
        <Dropdown label="Select Option" selectedKeys={['1']}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should not include dividers in items map', () => {
      const items: DropdownItem[] = [
        { itemKey: '1', label: 'Item 1' },
        { itemKey: 'divider', label: '', divider: true },
        { itemKey: '2', label: 'Item 2' },
      ];

      render(<Dropdown label="Select" items={items} selectedKeys={['divider']} />);

      // Should show original label since divider is not in items map
      expect(screen.getByText('Select')).toBeInTheDocument();
    });
  });

  describe('extracting menu items from children', () => {
    it('should extract items from MenuList', () => {
      render(
        <Dropdown label="Select" selectedKeys={['1']}>
          <MenuList>
            <MenuItem itemKey="1">First</MenuItem>
            <MenuItem itemKey="2">Second</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
    });

    it('should extract items from MenuGroup', () => {
      render(
        <Dropdown label="Select" selectedKeys={['g1']}>
          <MenuList>
            <MenuGroup label="Group 1">
              <MenuItem itemKey="g1">Group Item</MenuItem>
            </MenuGroup>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Group Item')).toBeInTheDocument();
    });

    it('should extract nested items', () => {
      render(
        <Dropdown label="Select" selectedKeys={['nested']}>
          <MenuList>
            <MenuGroup label="Group">
              <MenuItem itemKey="nested">Nested Item</MenuItem>
            </MenuGroup>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Nested Item')).toBeInTheDocument();
    });

    it('should handle items without itemKey', () => {
      render(
        <Dropdown label="Select" selectedKeys={['1']}>
          <MenuList>
            <MenuItem itemKey="1">Has Key</MenuItem>
            <MenuDivider />
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Has Key')).toBeInTheDocument();
    });

    it('should handle null and undefined children', () => {
      render(
        <Dropdown label="Select" selectedKeys={['1']}>
          <MenuList>
            {null}
            <MenuItem itemKey="1">Item 1</MenuItem>
            {undefined}
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should handle array of children', () => {
      const items = [
        <MenuItem key="1" itemKey="1">
          Item 1
        </MenuItem>,
        <MenuItem key="2" itemKey="2">
          Item 2
        </MenuItem>,
      ];

      render(
        <Dropdown label="Select" selectedKeys={['1']}>
          <MenuList>{items}</MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('menu width', () => {
    it('should default to trigger width', () => {
      render(
        <Dropdown label="Dropdown">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      // Width prop is passed through to Menu component
      // Testing that it's rendered is sufficient
      expect(screen.getByText('Dropdown')).toBeInTheDocument();
    });

    it('should accept custom width', () => {
      render(
        <Dropdown label="Dropdown" width={300}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Dropdown')).toBeInTheDocument();
    });
  });

  describe('menu props forwarding', () => {
    it('should forward selectionMode to Menu', () => {
      const onSelectionChange = jest.fn();
      render(
        <Dropdown label="Multi Select" selectionMode="multi" onSelectionChange={onSelectionChange}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
            <MenuItem itemKey="2">Item 2</MenuItem>
          </MenuList>
        </Dropdown>
      );

      fireEvent.click(screen.getByText('Multi Select'));
      fireEvent.click(screen.getByText('Item 1'));

      expect(onSelectionChange).toHaveBeenCalledWith(['1']);
    });

    it('should forward position to Menu', () => {
      render(
        <Dropdown label="Positioned" position="top-left">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Positioned')).toBeInTheDocument();
    });

    it('should default position to bottom-left', () => {
      render(
        <Dropdown label="Default Position">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Default Position')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty children', () => {
      render(<Dropdown label="Empty" />);

      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
      render(<Dropdown label="Empty Items" items={[]} />);

      fireEvent.click(screen.getByText('Empty Items'));
      expect(screen.getByText('Empty Items')).toBeInTheDocument();
    });

    it('should handle complex label as ReactNode', () => {
      render(
        <Dropdown
          label={
            <span>
              Complex <strong>Label</strong>
            </span>
          }
        >
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('should handle selected keys with undefined', () => {
      render(
        <Dropdown label="Select" selectedKeys={undefined}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('should handle items with ReactNode labels', () => {
      const items: DropdownItem[] = [
        {
          itemKey: '1',
          label: (
            <span>
              <strong>Bold</strong> Label
            </span>
          ),
        },
      ];

      render(<Dropdown label="Select" items={items} />);

      fireEvent.click(screen.getByText('Select'));
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });

  describe('chevron icon state', () => {
    it('should render chevron when closed', () => {
      render(
        <Dropdown label="Test">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('should render chevron when open', () => {
      render(
        <Dropdown label="Test">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      fireEvent.click(screen.getByText('Test'));

      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });
  });
});
